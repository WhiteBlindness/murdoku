import type {
  Puzzle, Clue, Cell, FurnitureType, Person, Room, GridSize,
} from './types'

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
  return p.furniture.filter(f => f.row === row && f.col === col).map(f => f.type)
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

  function recurse(i: number) {
    if (count >= cap) return
    if (i === people.length) {
      if (isSolution(p, place)) count++
      return
    }
    const person = people[i]
    for (let r = 0; r < N; r++) {
      if (usedRow[r]) continue
      for (let c = 0; c < N; c++) {
        if (usedCol[c]) continue
        const cell = { row: r, col: c }
        if (!unaryClueOk(p, person.id, cell)) continue
        usedRow[r] = usedCol[c] = true
        place[person.id] = cell
        recurse(i + 1)
        delete place[person.id]
        usedRow[r] = usedCol[c] = false
        if (count >= cap) return
      }
    }
  }
  recurse(0)
  return count
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
