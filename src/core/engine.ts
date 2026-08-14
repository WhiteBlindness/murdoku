import type {
  Puzzle, Clue, Cell, FurnitureType, Person, Room, GridSize,
} from './types'
import { furnitureFootprint } from './types'

// ============================================================================
// Murdoku engine: clue evaluation + solver.
// A "placement" maps every person id -> Cell, with all rows distinct and all
// columns distinct. A placement is a SOLUTION iff it satisfies every clue.
// ============================================================================

export type Placement = Record<string, Cell>

const ORTHO = [[-1, 0], [1, 0], [0, -1], [0, 1]]

export function cellsAdjacent(a: Cell, b: Cell): boolean {
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col) === 1
}

export function furnitureAt(p: Puzzle, row: number, col: number): FurnitureType[] {
  return p.furniture.filter(f => {
    const { w, h } = furnitureFootprint(f)
    return row >= f.row && row < f.row + h && col >= f.col && col < f.col + w
  }).map(f => f.type)
}

function anyFurnitureAdjacent(p: Puzzle, cell: Cell, types: FurnitureType[]): boolean {
  return ORTHO.some(([dr, dc]) => {
    const r = cell.row + dr, c = cell.col + dc
    if (r < 0 || c < 0 || r >= p.size || c >= p.size) return false
    return furnitureAt(p, r, c).some(t => types.includes(t))
  })
}

export function roomIdAt(p: Puzzle, cell: Cell): string {
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
  for (const { clue } of p.clues) {
    if (clue.person !== personId) continue
    switch (clue.kind) {
      case 'room': if (roomIdAt(p, cell) !== clue.roomId) return false; break
      case 'onFurniture': if (!furnitureAt(p, cell.row, cell.col).includes(clue.furniture)) return false; break
      case 'besideFurniture': if (!anyFurnitureAdjacent(p, cell, [clue.furniture])) return false; break
      case 'besideAny': if (!anyFurnitureAdjacent(p, cell, clue.furniture)) return false; break
      case 'onlyOnFurniture': if (!furnitureAt(p, cell.row, cell.col).includes(clue.furniture)) return false; break
      case 'row': if (cell.row !== clue.row) return false; break
      case 'col': if (cell.col !== clue.col) return false; break
      case 'edge': if (!(cell.row === 0 || cell.col === 0 || cell.row === p.size - 1 || cell.col === p.size - 1)) return false; break
      case 'corner': if (!((cell.row === 0 || cell.row === p.size - 1) && (cell.col === 0 || cell.col === p.size - 1))) return false; break
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
  const order = people
    .map(person => {
      const cells: Cell[] = []
      for (let r = 0; r < N; r++) {
        for (let c = 0; c < N; c++) {
          const cell = { row: r, col: c }
          if (unaryClueOk(p, person.id, cell)) cells.push(cell)
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
