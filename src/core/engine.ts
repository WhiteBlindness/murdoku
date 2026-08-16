import type {
  Puzzle, Clue, Cell, FurnitureType, Person, Room, GridSize,
} from './types'
import { furnitureFootprint, cellFloor, sameColumnStack } from './types'

// ============================================================================
// Murdoku engine: clue evaluation + solver.
// A "placement" maps every person id -> Cell, with all rows distinct and all
// columns distinct. A placement is a SOLUTION iff it satisfies every clue.
// ============================================================================

export type Placement = Record<string, Cell>

const ORTHO = [[-1, 0], [1, 0], [0, -1], [0, 1]]

/**
 * Two cells are adjacent iff they are on the SAME floor and share an orthogonal
 * edge. Cells on different floors are never adjacent (no staircase mechanics).
 */
export function cellsAdjacent(a: Cell, b: Cell): boolean {
  if (cellFloor(a) !== cellFloor(b)) return false
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col) === 1
}

/**
 * Furniture types at (floor, row, col). The `floor` parameter defaults to 0
 * so all existing single-floor call sites are unaffected.
 */
export function furnitureAt(p: Puzzle, row: number, col: number, floor = 0): FurnitureType[] {
  return p.furniture.filter(f => {
    if ((f.floor ?? 0) !== floor) return false
    const { w, h } = furnitureFootprint(f)
    return row >= f.row && row < f.row + h && col >= f.col && col < f.col + w
  }).map(f => f.type)
}

function anyFurnitureAdjacent(p: Puzzle, cell: Cell, types: FurnitureType[]): boolean {
  const fl = cellFloor(cell)
  return ORTHO.some(([dr, dc]) => {
    const r = cell.row + dr, c = cell.col + dc
    if (r < 0 || c < 0 || r >= p.size || c >= p.size) return false
    return furnitureAt(p, r, c, fl).some(t => types.includes(t))
  })
}

/**
 * Room id at a cell. Uses per-floor map when available (two-floor puzzles),
 * otherwise falls back to the flat roomOf (single-floor and floor-0 cells).
 */
export function roomIdAt(p: Puzzle, cell: Cell): string {
  const fl = cellFloor(cell)
  if (p.roomOfByFloor && fl < p.roomOfByFloor.length) {
    return p.roomOfByFloor[fl][cell.row]?.[cell.col] ?? ''
  }
  // single-floor fallback (fl===0 always correct here)
  return p.roomOf[cell.row]?.[cell.col] ?? ''
}

/** Is a single clue satisfied by a (complete) placement? */
export function clueHolds(p: Puzzle, clue: Clue, place: Placement): boolean {
  const self = place[clue.person]
  switch (clue.kind) {
    case 'victim':
      return true // flavour only; the win rule is handled separately
    case 'room':
      return !!self && roomIdAt(p, self) === clue.roomId
    case 'onFurniture':
      return !!self && furnitureAt(p, self.row, self.col).includes(clue.furniture)
    case 'besideFurniture':
      return !!self && anyFurnitureAdjacent(p, self, [clue.furniture])
    case 'besideAny':
      return !!self && anyFurnitureAdjacent(p, self, clue.furniture)
    case 'onlyOnFurniture': {
      if (!self || !furnitureAt(p, self.row, self.col).includes(clue.furniture)) return false
      // no other person sits on the same furniture type
      return p.people.every(person => {
        if (person.id === clue.person) return true
        const c = place[person.id]
        return !c || !furnitureAt(p, c.row, c.col).includes(clue.furniture)
      })
    }
    case 'row':
      return !!self && self.row === clue.row
    case 'col':
      return !!self && self.col === clue.col
    case 'edge':
      return !!self && (self.row === 0 || self.col === 0 || self.row === p.size - 1 || self.col === p.size - 1)
    case 'corner':
      return !!self && (self.row === 0 || self.row === p.size - 1) && (self.col === 0 || self.col === p.size - 1)
    case 'besidePerson': {
      const o = place[clue.other]
      return !!self && !!o && cellsAdjacent(self, o)
    }
    case 'sameRoomAs': {
      const o = place[clue.other]
      return !!self && !!o && roomIdAt(p, self) === roomIdAt(p, o)
    }
    case 'direction': {
      const o = place[clue.other]
      if (!self || !o) return false
      const steps = clue.steps
      switch (clue.dir) {
        case 'N': return steps ? self.row === o.row - steps : self.row < o.row
        case 'S': return steps ? self.row === o.row + steps : self.row > o.row
        case 'W': return steps ? self.col === o.col - steps : self.col < o.col
        case 'E': return steps ? self.col === o.col + steps : self.col > o.col
      }
      break
    }
    case 'floor':
      return !!self && cellFloor(self) === clue.floorNum
    case 'above': {
      if (!self) return false
      if (clue.targetKind === 'person') {
        const o = place[clue.target]
        return !!o && sameColumnStack(self, o) && cellFloor(self) > cellFloor(o)
      }
      // targetKind === 'room': self is directly above a cell that belongs to target room on the floor below
      const myFloor = cellFloor(self)
      if (myFloor === 0) return false
      const lowerCell: Cell = { row: self.row, col: self.col, floor: myFloor - 1 }
      return roomIdAt(p, lowerCell) === clue.target
    }
    case 'below': {
      if (!self) return false
      if (clue.targetKind === 'person') {
        const o = place[clue.target]
        return !!o && sameColumnStack(self, o) && cellFloor(self) < cellFloor(o)
      }
      // targetKind === 'room': self is directly below a cell that belongs to target room on the floor above
      const myFloor = cellFloor(self)
      const upperCell: Cell = { row: self.row, col: self.col, floor: myFloor + 1 }
      return roomIdAt(p, upperCell) === clue.target
    }
    case 'notRoom':
      return !!self && roomIdAt(p, self) !== clue.roomId
    case 'notSameRoomAs': {
      const o = place[clue.other]
      return !!self && !!o && roomIdAt(p, self) !== roomIdAt(p, o)
    }
  }
}

/** Does a placement satisfy every clue? */
export function isSolution(p: Puzzle, place: Placement): boolean {
  return p.clues.every(ct => clueHolds(p, ct.clue, place))
}

// --- Unary pruning ---------------------------------------------------------
// Clues that constrain a single person's own cell can be checked the moment we
// place them, massively pruning the search.

function unaryClueOk(p: Puzzle, personId: string, cell: Cell): boolean {
  const fl = cellFloor(cell)
  for (const { clue } of p.clues) {
    if (clue.person !== personId) continue
    switch (clue.kind) {
      case 'room': if (roomIdAt(p, cell) !== clue.roomId) return false; break
      case 'onFurniture': if (!furnitureAt(p, cell.row, cell.col, fl).includes(clue.furniture)) return false; break
      case 'besideFurniture': if (!anyFurnitureAdjacent(p, cell, [clue.furniture])) return false; break
      case 'besideAny': if (!anyFurnitureAdjacent(p, cell, clue.furniture)) return false; break
      case 'onlyOnFurniture': if (!furnitureAt(p, cell.row, cell.col, fl).includes(clue.furniture)) return false; break
      case 'row': if (cell.row !== clue.row) return false; break
      case 'col': if (cell.col !== clue.col) return false; break
      case 'edge': if (!(cell.row === 0 || cell.col === 0 || cell.row === p.size - 1 || cell.col === p.size - 1)) return false; break
      case 'corner': if (!((cell.row === 0 || cell.row === p.size - 1) && (cell.col === 0 || cell.col === p.size - 1))) return false; break
      // Two-floor unary clues
      case 'floor': if (fl !== clue.floorNum) return false; break
      case 'above': {
        if (clue.targetKind === 'room') {
          // must be on floor ≥1, and the cell directly below must be in the target room
          if (fl === 0) return false
          const lowerCell: Cell = { row: cell.row, col: cell.col, floor: fl - 1 }
          if (roomIdAt(p, lowerCell) !== clue.target) return false
        }
        // person-vs-person 'above' is relational — skip in unary check
        break
      }
      case 'below': {
        if (clue.targetKind === 'room') {
          // must have a floor above, and the cell directly above must be in the target room
          const upperCell: Cell = { row: cell.row, col: cell.col, floor: fl + 1 }
          const uid = roomIdAt(p, upperCell)
          if (!uid || uid !== clue.target) return false
        }
        break
      }
      case 'notRoom': if (roomIdAt(p, cell) === clue.roomId) return false; break
      // notSameRoomAs is relational — cannot be pruned without knowing the other person's cell
    }
  }
  return true
}

/**
 * Count solutions (capped at `cap`, default 2 so callers can test uniqueness).
 * Backtracks over people, assigning each a cell with a fresh row & column.
 */
export function countSolutions(p: Puzzle, cap = 2): number {
  const N = p.size
  const floors = p.floors ?? 1
  const people = p.people
  const usedRow = new Array(N).fill(false)
  const usedCol = new Array(N).fill(false)
  const place: Placement = {}
  let count = 0

  // Two optimisations, both of which change only the ORDER of the search and
  // never its result:
  //
  //  1. Each person's unary-legal cells are computed once up front, instead of
  //     re-testing every clue at every node of the tree.
  //  2. Most-constrained-first. Searching a suspect with 3 legal cells before
  //     one with 60 prunes whole subtrees near the root. On an 8x8 board whose
  //     clues are all indirect this is the difference between validating a
  //     puzzle in ~90 seconds and doing it in milliseconds: in people-array
  //     order the search pays most of the 8! permutation cost before the first
  //     contradiction surfaces.
  //
  // For two-floor puzzles the cell list enumerates (floor, row, col). Row and
  // column constraints remain GLOBAL: usedRow/usedCol are shared across floors,
  // so a person on floor 1 row 3 col 5 consumes row 3 and col 5 for everyone.
  const order = people
    .map(person => {
      const cells: Cell[] = []
      for (let fl = 0; fl < floors; fl++) {
        for (let r = 0; r < N; r++) {
          for (let c = 0; c < N; c++) {
            const cell: Cell = floors > 1 ? { row: r, col: c, floor: fl } : { row: r, col: c }
            if (unaryClueOk(p, person.id, cell)) cells.push(cell)
          }
        }
      }
      return { id: person.id, cells }
    })
    .sort((a, b) => a.cells.length - b.cells.length)

  // A person with no legal cell at all makes the board unsatisfiable outright.
  if (order.some(entry => entry.cells.length === 0)) return 0

  function recurse(i: number) {
    if (count >= cap) return
    if (i === order.length) {
      if (isSolution(p, place)) count++
      return
    }
    const { id, cells } = order[i]
    for (const cell of cells) {
      if (usedRow[cell.row] || usedCol[cell.col]) continue
      usedRow[cell.row] = usedCol[cell.col] = true
      place[id] = cell
      recurse(i + 1)
      delete place[id]
      usedRow[cell.row] = usedCol[cell.col] = false
      if (count >= cap) return
    }
  }
  recurse(0)
  return count
}

/**
 * Cells that provably cannot hold anybody, given what is already placed.
 *
 * This is the Logic Assistant's entire reasoning, and it is deliberately the
 * narrow, sound half of the deduction rather than a solver:
 *
 *   1. A cell whose row or column already holds a placed person is out, because
 *      everybody occupies a distinct row and column.
 *   2. A cell no remaining person could legally stand on — every one of them
 *      fails their own unary clue there — is out.
 *
 * Both are things the player could derive with certainty from the rules alone,
 * so marking them never spoils a deduction the player was entitled to make.
 * Anything requiring a relational clue or a search is left to the player.
 */
export function deriveEliminations(p: Puzzle, placed: Placement): Cell[] {
  const N = p.size
  const usedRow = new Set<number>()
  const usedCol = new Set<number>()
  const taken = new Set<string>()
  for (const cell of Object.values(placed)) {
    if (!cell) continue
    usedRow.add(cell.row)
    usedCol.add(cell.col)
    taken.add(`${cell.row},${cell.col}`)
  }

  const remaining = p.people.filter(person => !placed[person.id])
  const out: Cell[] = []
  for (let row = 0; row < N; row++) {
    for (let col = 0; col < N; col++) {
      if (taken.has(`${row},${col}`)) continue
      if (usedRow.has(row) || usedCol.has(col)) { out.push({ row, col }); continue }
      const cell = { row, col }
      if (!remaining.some(person => unaryClueOk(p, person.id, cell))) out.push(cell)
    }
  }
  return out
}

export function hasUniqueSolution(p: Puzzle): boolean {
  return countSolutions(p, 2) === 1
}

/** The murderer = the one suspect sharing the victim's room. */
export function findMurderer(p: Puzzle, place: Placement = p.solution): string | null {
  const victimCell = place[p.victimId]
  if (!victimCell) return null
  const victimRoom = roomIdAt(p, victimCell)
  const inRoom = p.people.filter(pr =>
    pr.id !== p.victimId && place[pr.id] && roomIdAt(p, place[pr.id]) === victimRoom)
  return inRoom.length === 1 ? inRoom[0].id : null
}

// --- helpers reused by generator & UI --------------------------------------

export function getBoxDims(_size: GridSize): [number, number] {
  return [1, 1] // rooms handle grouping now; kept for API compatibility
}

export function personById(p: Puzzle, id: string): Person | undefined {
  return p.people.find(x => x.id === id)
}

export function roomById(p: Puzzle, id: string): Room | undefined {
  return p.rooms.find(r => r.id === id)
}
