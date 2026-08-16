import type {
  Puzzle, GridSize, Difficulty, Room, Cell, Furniture, FurnitureType,
  Person, Clue, ClueText,
} from './types'
import { furnitureCells } from './types'
import { countSolutions, furnitureAt, roomIdAt, findMurderer, cellsAdjacent } from './engine'
import { cellFloor } from './types'

// ============================================================================
// Procedural puzzle generator.
// Approach: lay down rooms + a random valid placement (the answer) + furniture,
// then pick a set of clues that are all TRUE for that answer and together make
// it the UNIQUE solution. Difficulty tunes how direct the clues are.
// ============================================================================

let seed = Date.now() % 2147483647
function rand() { seed = (seed * 48271) % 2147483647; return (seed - 1) / 2147483646 }
export function reseed(s: number) { seed = (s % 2147483647) || 1 }
function pick<T>(arr: T[]): T { return arr[Math.floor(rand() * arr.length)] }
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1));[a[i], a[j]] = [a[j], a[i]] }
  return a
}

/**
 * Test whether a single unary clue passes for (personId, cell) without reading
 * base.clues. Used in the arithmetic scoring loop to count candidate cells per
 * clue without mutating puzzle state.
 */
function unaryClueOkForCell(p: import('./types').Puzzle, personId: string, cell: Cell, clue: Clue): boolean {
  if (clue.person !== personId) return true // not about this person — never filters
  const fl = cellFloor(cell)
  switch (clue.kind) {
    case 'room': return roomIdAt(p, cell) === clue.roomId
    case 'onFurniture': return furnitureAt(p, cell.row, cell.col, fl).includes(clue.furniture)
    case 'onlyOnFurniture': return furnitureAt(p, cell.row, cell.col, fl).includes(clue.furniture)
    case 'besideFurniture': {
      const ORTHO4 = [[-1,0],[1,0],[0,-1],[0,1]] as const
      return ORTHO4.some(([dr, dc]) => {
        const r = cell.row + dr, c = cell.col + dc
        if (r < 0 || c < 0 || r >= p.size || c >= p.size) return false
        return furnitureAt(p, r, c, fl).includes(clue.furniture)
      })
    }
    case 'besideAny': {
      const ORTHO4 = [[-1,0],[1,0],[0,-1],[0,1]] as const
      return ORTHO4.some(([dr, dc]) => {
        const r = cell.row + dr, c = cell.col + dc
        if (r < 0 || c < 0 || r >= p.size || c >= p.size) return false
        return furnitureAt(p, r, c, fl).some(t => clue.furniture.includes(t))
      })
    }
    case 'row': return cell.row === clue.row
    case 'col': return cell.col === clue.col
    case 'edge': return cell.row === 0 || cell.col === 0 || cell.row === p.size - 1 || cell.col === p.size - 1
    case 'corner': return (cell.row === 0 || cell.row === p.size - 1) && (cell.col === 0 || cell.col === p.size - 1)
    case 'floor': return fl === clue.floorNum
    case 'above':
      if (clue.targetKind === 'room') {
        if (fl === 0) return false
        const lowerCell: Cell = { row: cell.row, col: cell.col, floor: fl - 1 }
        return roomIdAt(p, lowerCell) === clue.target
      }
      return true // person-vs-person is relational — not filtered here
    case 'below':
      if (clue.targetKind === 'room') {
        const upperCell: Cell = { row: cell.row, col: cell.col, floor: fl + 1 }
        const uid = roomIdAt(p, upperCell)
        return !!uid && uid === clue.target
      }
      return true
    case 'notRoom': return roomIdAt(p, cell) !== clue.roomId
    // notSameRoomAs is relational — not filtered here
    default:
      return true // relational — not filtered
  }
}

const NAMES = [
  'Alexander', 'Bella', 'Carol', 'Dalia', 'Evangeline', 'Viraj', 'Marco',
  'Priya', 'Nadia', 'Tomas', 'Greta', 'Idris', 'Lena', 'Oscar', 'Yuki',
]
// Per-suspect identity colours. Two constraints, both load-bearing:
//   1. No red/pink hues — red is reserved for the conflict/danger signal, so an
//      accent must never be confusable with it.
//   2. Muted, low-saturation only. These are the L.A. Noire cast; the previous
//      candy palette (#3CC98A, #C86AC8, #3CA0E8 …) was the loudest surviving
//      trace of the old board-game look, because it tints both the selection
//      ring and the avatar plate.
// Hues stay far apart so eight suspects remain mutually distinguishable at a
// glance — this is an identity function, not decoration.
// NOTE: changing these changes generated puzzle data. Bump the catalog cache
// key in catalog.ts or returning players keep the old palette from localStorage.
const ACCENTS = [
  '#B08D57', // aged brass
  '#6E8CA0', // steel blue
  '#8A7CA8', // dusty violet
  '#7FA083', // sage
  '#6FA0A0', // dusty teal
  '#A89A6A', // olive sand
  '#8E9BB0', // gunmetal slate
  '#9C7F6E', // warm sepia brown
]

const ROOM_NAMES = [
  'Bedroom', 'Kitchen', 'Dining Room', 'Living Room', 'Bathroom',
  'Porch', 'Front Yard', 'Study', 'Hallway', 'Pantry', 'Garden', 'Office',
]
const ROOM_HUES: Record<string, number> = {
  Bedroom: 45, Kitchen: 25, 'Dining Room': 200, 'Living Room': 265,
  Bathroom: 190, Porch: 108, 'Front Yard': 112, Study: 150, Hallway: 210,
  Pantry: 15, Garden: 108, Office: 230,
}

// Furniture that tends to appear in each room — distinct sets so a Kitchen
// never looks like a Study.
const ROOM_FURNITURE: Record<string, FurnitureType[]> = {
  Bedroom: ['bed', 'lamp', 'rug', 'clock'],
  Kitchen: ['stove', 'fridge', 'counter', 'table'],
  'Dining Room': ['table', 'chair', 'rug', 'lamp'],
  'Living Room': ['sofa', 'tv', 'rug', 'clock'],
  Bathroom: ['bathtub', 'toilet', 'shower'],
  Porch: ['chair', 'plant'],
  'Front Yard': ['plant', 'shrub'],
  Study: ['desk', 'bookshelf', 'lamp', 'box'],
  Hallway: ['rug', 'clock', 'plant'],
  Pantry: ['box', 'fridge', 'counter'],
  Garden: ['shrub', 'plant'],
  Office: ['desk', 'bookshelf', 'chair', 'clock'],
}

const FURNITURE_LABEL: Record<FurnitureType, string> = {
  chair: 'a chair', sofa: 'the sofa', bed: 'the bed', table: 'the table',
  box: 'the box', rug: 'a rug', plant: 'a plant', shrub: 'a shrub',
  lamp: 'the lamp', counter: 'the counter', tv: 'the TV', bathtub: 'the bathtub',
  bookshelf: 'the bookshelf', stove: 'the stove', fridge: 'the fridge',
  clock: 'the clock', desk: 'the desk', toilet: 'the toilet', shower: 'the shower',
}

// --- furniture footprints --------------------------------------------------
// Pieces that cover more than one cell. Anything not listed is 1×1.
const FURNITURE_FOOTPRINT: Partial<Record<FurnitureType, { w: number; h: number }>> = {
  bed: { w: 2, h: 2 },
  sofa: { w: 2, h: 1 },
  table: { w: 2, h: 1 },
  rug: { w: 2, h: 2 },
  bookshelf: { w: 2, h: 1 },
  counter: { w: 2, h: 1 },
  bathtub: { w: 2, h: 1 },
}

// --- room layout -----------------------------------------------------------

interface Rect { r0: number; c0: number; r1: number; c1: number } // inclusive

function splitRects(size: number, targetRooms: number): Rect[] {
  let rects: Rect[] = [{ r0: 0, c0: 0, r1: size - 1, c1: size - 1 }]
  let guard = 0
  while (rects.length < targetRooms && guard++ < 50) {
    // split the largest rectangle
    rects.sort((a, b) => area(b) - area(a))
    const rect = rects.shift()!
    const h = rect.r1 - rect.r0 + 1, w = rect.c1 - rect.c0 + 1
    const canV = w >= 4, canH = h >= 4
    if (!canV && !canH) { rects.push(rect); break }
    const vertical = canV && (!canH || rand() < 0.5)
    if (vertical) {
      const cut = rect.c0 + 1 + Math.floor(rand() * (w - 2))
      rects.push({ ...rect, c1: cut }, { ...rect, c0: cut + 1 })
    } else {
      const cut = rect.r0 + 1 + Math.floor(rand() * (h - 2))
      rects.push({ ...rect, r1: cut }, { ...rect, r0: cut + 1 })
    }
  }
  return rects
}
function area(r: Rect) { return (r.r1 - r.r0 + 1) * (r.c1 - r.c0 + 1) }

function buildRooms(size: number): { rooms: Room[]; roomOf: string[][] } {
  // Room count tracks area: an 8x8 split into 4 rooms gives 16-cell rooms, which
  // makes "In the Kitchen" nearly free information.
  // Target room counts tuned to keep typical room size at 6–12 cells.
  // 6×6=36 cells → 4–5 rooms (7–9 cells each)
  // 7×7=49 cells → 5–6 rooms (8–10 cells each)
  // 8×8=64 cells → 6–7 rooms (9–11 cells each)
  // 9×9=81 cells → 7–8 rooms (10–12 cells each)
  // 10×10=100 cells → 8–9 rooms (11–13 cells each)
  const target = size <= 6 ? 4 + Math.floor(rand() * 2)
    : size <= 7 ? 5 + Math.floor(rand() * 2)
    : size <= 8 ? 6 + Math.floor(rand() * 2)
    : size <= 9 ? 7 + Math.floor(rand() * 2)
    : 8 + Math.floor(rand() * 2)
  const rects = splitRects(size, target)
  const names = shuffle(ROOM_NAMES).slice(0, rects.length)
  const roomOf: string[][] = Array.from({ length: size }, () => new Array(size).fill(''))
  const rooms: Room[] = rects.map((rect, i) => {
    const id = `room${i}`
    const cells: Cell[] = []
    for (let r = rect.r0; r <= rect.r1; r++)
      for (let c = rect.c0; c <= rect.c1; c++) { cells.push({ row: r, col: c }); roomOf[r][c] = id }
    return { id, name: names[i], hue: ROOM_HUES[names[i]] ?? Math.floor(rand() * 360), cells }
  })
  return { rooms, roomOf }
}

/**
 * Build rooms for a two-floor house. Both floors share the same NxN footprint.
 * Room ids are globally unique: floor-0 uses room0..roomK-1; floor-1 continues
 * from roomK so that roomIdAt never collides across floors and findMurderer
 * works without modification.
 */
function buildTwoFloorRooms(size: number): {
  rooms: Room[]
  roomOf: string[][]          // floor 0 (also roomOfByFloor[0])
  roomOfByFloor: string[][][] // [floor][row][col]
} {
  const { rooms: rooms0, roomOf: roomOf0 } = buildRooms(size)
  const offset = rooms0.length
  const { rooms: rooms1, roomOf: roomOf1 } = buildRooms(size)

  // Re-id floor-1 rooms to avoid collisions with floor-0 room ids
  const roomOf1remapped: string[][] = Array.from({ length: size }, () => new Array(size).fill(''))
  const rooms1final: Room[] = rooms1.map((r, i) => {
    const newId = `room${offset + i}`
    for (let row = 0; row < size; row++)
      for (let col = 0; col < size; col++)
        if (roomOf1[row][col] === r.id) roomOf1remapped[row][col] = newId
    return { ...r, id: newId, cells: r.cells.map(c => ({ ...c, floor: 1 })), floor: 1 }
  })

  // Floor-0 rooms carry floor:0 on their cells
  const rooms0final: Room[] = rooms0.map(r => ({
    ...r,
    cells: r.cells.map(c => ({ ...c, floor: 0 })),
    floor: 0,
  }))

  return {
    rooms: [...rooms0final, ...rooms1final],
    roomOf: roomOf0,
    roomOfByFloor: [roomOf0, roomOf1remapped],
  }
}

// --- random valid placement ------------------------------------------------

function randomPlacement(size: number, people: Person[]): Record<string, Cell> {
  const rows = shuffle([...Array(size).keys()])
  const cols = shuffle([...Array(size).keys()])
  const place: Record<string, Cell> = {}
  people.forEach((p, i) => { place[p.id] = { row: rows[i], col: cols[i] } })
  return place
}

/**
 * Two-floor placement: unique rows+cols globally, suspects split across both
 * floors so EVERY floor has at least one person.
 */
function randomTwoFloorPlacement(size: number, people: Person[]): Record<string, Cell> {
  const rows = shuffle([...Array(size).keys()])
  const cols = shuffle([...Array(size).keys()])
  const place: Record<string, Cell> = {}

  // Assign floor deliberately: first person goes to floor 1, last goes to floor 0,
  // rest are randomly assigned — guaranteeing both floors occupied.
  const n = people.length
  const floors: number[] = people.map(() => Math.round(rand()))
  // Force at least one on each floor
  floors[0] = 0
  floors[n - 1] = 1

  people.forEach((p, i) => {
    place[p.id] = { row: rows[i], col: cols[i], floor: floors[i] }
  })
  return place
}

// --- furniture -------------------------------------------------------------

function placeFurniture(
  rooms: Room[], roomOf: string[][], place: Record<string, Cell>,
  floorNum = 0,
  occupiedCells?: Set<string>,
): Furniture[] {
  const furniture: Furniture[] = []
  const roomName = (id: string) => rooms.find(r => r.id === id)!.name
  const usedCount: Partial<Record<FurnitureType, number>> = {}
  const pickVaried = (pool: FurnitureType[], avoid?: Set<FurnitureType>): FurnitureType => {
    const options = (avoid ? pool.filter(t => !avoid.has(t)) : pool)
    const src = options.length ? options : pool
    const min = Math.min(...src.map(t => usedCount[t] ?? 0))
    const leastUsed = src.filter(t => (usedCount[t] ?? 0) === min)
    const t = pick(leastUsed)
    usedCount[t] = (usedCount[t] ?? 0) + 1
    return t
  }

  // Track which cells are occupied by furniture (keyed "floor:row,col").
  // A shared set may be passed in for two-floor calls so keys stay globally unique.
  const cellKey = (r: number, c: number) => `${floorNum}:${r},${c}`
  const ownedOccupied = occupiedCells ?? new Set<string>()
  // Track furniture-free cells per room — every room must keep ≥1 for its label.
  const freeCells: Record<string, Set<string>> = {}
  for (const room of rooms) freeCells[room.id] = new Set(room.cells.map(c => cellKey(c.row, c.col)))

  const roomIdAtRC = (row: number, col: number) => roomOf[row]?.[col] ?? ''

  /**
   * Try to place a piece of type `t` anchored at (row, col).
   * Returns true and mutates state on success; returns false on failure.
   * Rules: every cell of the footprint must be (a) in-bounds, (b) inside the
   * SAME room as the anchor, (c) not already occupied by another piece, and
   * (d) after placement the room still has ≥1 free cell.
   */
  const tryPlace = (t: FurnitureType, row: number, col: number, roomId: string): boolean => {
    const fp = FURNITURE_FOOTPRINT[t] ?? { w: 1, h: 1 }
    const piece: Furniture = { type: t, row, col, w: fp.w, h: fp.h, floor: floorNum }
    const cells = furnitureCells(piece)
    // Validate all cells
    for (const { row: r, col: c } of cells) {
      if (r < 0 || c < 0 || r >= roomOf.length || c >= (roomOf[0]?.length ?? 0)) return false
      if (roomIdAtRC(r, c) !== roomId) return false
      if (ownedOccupied.has(cellKey(r, c))) return false
    }
    // Ensure room keeps ≥1 free label cell after this placement
    if (freeCells[roomId].size - cells.length < 1) return false
    // Commit
    for (const { row: r, col: c } of cells) {
      ownedOccupied.add(cellKey(r, c))
      freeCells[roomId].delete(cellKey(r, c))
    }
    furniture.push(piece)
    return true
  }

  // 1) Each room gets a few DISTINCT pieces.
  for (const room of rooms) {
    const pool = ROOM_FURNITURE[room.name] ?? ['box', 'chair', 'plant']
    const maxN = Math.min(pool.length, room.cells.length - 1)
    const n = Math.max(0, Math.min(maxN, 1 + Math.floor(rand() * Math.min(4, room.cells.length))))
    const candidates = shuffle(room.cells)
    const inRoom = new Set<FurnitureType>()
    let placed = 0
    for (const cell of candidates) {
      if (placed >= n) break
      if (ownedOccupied.has(cellKey(cell.row, cell.col))) continue
      const t = pickVaried(pool, inRoom)
      if (tryPlace(t, cell.row, cell.col, room.id)) {
        inRoom.add(t)
        placed++
      } else {
        // Fall back to 1×1 if the multi-cell version didn't fit
        const t1x1 = pickVaried(pool.filter(p => !(FURNITURE_FOOTPRINT[p])), inRoom.size ? inRoom : undefined)
        if (tryPlace(t1x1, cell.row, cell.col, room.id)) {
          inRoom.add(t1x1)
          placed++
        }
      }
    }
  }

  // 2) Give most people a piece to sit on/beside — but never remove the last
  //    free cell from a room.
  for (const key of Object.keys(place)) {
    const cell = place[key]
    // Only place furniture for people on this floor
    if ((cell.floor ?? 0) !== floorNum) continue
    if (ownedOccupied.has(cellKey(cell.row, cell.col))) continue
    if (rand() < 0.7) {
      const rId = roomIdAtRC(cell.row, cell.col)
      const pool = ROOM_FURNITURE[roomName(rId)] ?? ['chair']
      const t = pickVaried(pool)
      // Try preferred (possibly multi-cell), then any 1×1 from the pool
      if (!tryPlace(t, cell.row, cell.col, rId)) {
        const small = pool.filter(p => !FURNITURE_FOOTPRINT[p])
        if (small.length) tryPlace(pickVaried(small), cell.row, cell.col, rId)
      }
    }
  }
  return furniture
}

// --- candidate clues -------------------------------------------------------

function candidateClues(p: Puzzle): Clue[] {
  const out: Clue[] = []
  const size = p.size
  const twoFloor = (p.floors ?? 1) > 1
  for (const person of p.people) {
    // Include the victim in the clue pool so the solver can pin their position.
    // (When people < size the victim is otherwise a free variable after the
    //  suspects are placed, making unique solutions impossible to achieve.)
    // The separate kind:'victim' flavour line is appended in generatePuzzle.
    const cell = p.solution[person.id]
    const fl = cell.floor ?? 0
    // room
    out.push({ kind: 'room', person: person.id, roomId: roomIdAt(p, cell) })
    // row / col
    out.push({ kind: 'row', person: person.id, row: cell.row })
    out.push({ kind: 'col', person: person.id, col: cell.col })
    // edge / corner
    const isEdge = cell.row === 0 || cell.col === 0 || cell.row === size - 1 || cell.col === size - 1
    const isCorner = (cell.row === 0 || cell.row === size - 1) && (cell.col === 0 || cell.col === size - 1)
    if (isCorner) out.push({ kind: 'corner', person: person.id })
    else if (isEdge) out.push({ kind: 'edge', person: person.id })
    // on furniture (floor-aware)
    for (const t of furnitureAt(p, cell.row, cell.col, fl)) {
      out.push({ kind: 'onFurniture', person: person.id, furniture: t })
      // only-on if unique
      const others = p.people.some(o => {
        if (o.id === person.id) return false
        const oc = p.solution[o.id]
        return furnitureAt(p, oc.row, oc.col, oc.floor ?? 0).includes(t)
      })
      if (!others) out.push({ kind: 'onlyOnFurniture', person: person.id, furniture: t })
    }
    // beside furniture (floor-aware, adjacency is same-floor only)
    const besideTypes = new Set<FurnitureType>()
    for (const [dr, dc] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
      const r = cell.row + dr, c = cell.col + dc
      if (r < 0 || c < 0 || r >= size || c >= size) continue
      furnitureAt(p, r, c, fl).forEach(t => besideTypes.add(t))
    }
    besideTypes.forEach(t => out.push({ kind: 'besideFurniture', person: person.id, furniture: t }))
    // two-floor-specific clues
    if (twoFloor) {
      // floor membership
      out.push({ kind: 'floor', person: person.id, floorNum: fl })
      // above/below a room
      if (fl > 0) {
        const lowerCell = { row: cell.row, col: cell.col, floor: fl - 1 }
        const roomBelow = roomIdAt(p, lowerCell)
        if (roomBelow) out.push({ kind: 'above', person: person.id, target: roomBelow, targetKind: 'room' })
      }
      const upperCell = { row: cell.row, col: cell.col, floor: fl + 1 }
      const roomAbove = roomIdAt(p, upperCell)
      if (roomAbove) out.push({ kind: 'below', person: person.id, target: roomAbove, targetKind: 'room' })
    }
    // negation: rooms the person was NOT in (one per foreign room)
    for (const room of p.rooms) {
      if (room.id !== roomIdAt(p, cell)) {
        out.push({ kind: 'notRoom', person: person.id, roomId: room.id })
      }
    }
    // relations to others
    for (const other of p.people) {
      if (other.id === person.id) continue
      const oc = p.solution[other.id]
      if (cellsAdjacent(cell, oc)) out.push({ kind: 'besidePerson', person: person.id, other: other.id })
      if (roomIdAt(p, cell) === roomIdAt(p, oc) && other.id !== p.victimId)
        out.push({ kind: 'sameRoomAs', person: person.id, other: other.id })
      // negation: not in the same room — skip when other is the victim (would leak murderer identity)
      if (roomIdAt(p, cell) !== roomIdAt(p, oc) && other.id !== p.victimId && person.id !== p.victimId)
        out.push({ kind: 'notSameRoomAs', person: person.id, other: other.id })
      // exact-step directions (more informative) — same floor only
      if ((cell.floor ?? 0) === (oc.floor ?? 0)) {
        if (cell.col === oc.col && cell.row === oc.row - 1) out.push({ kind: 'direction', person: person.id, other: other.id, dir: 'N', steps: 1 })
        if (cell.col === oc.col && cell.row === oc.row + 1) out.push({ kind: 'direction', person: person.id, other: other.id, dir: 'S', steps: 1 })
        if (cell.row === oc.row && cell.col === oc.col - 1) out.push({ kind: 'direction', person: person.id, other: other.id, dir: 'W', steps: 1 })
        if (cell.row === oc.row && cell.col === oc.col + 1) out.push({ kind: 'direction', person: person.id, other: other.id, dir: 'E', steps: 1 })
      }
      // above/below a person (two-floor only)
      if (twoFloor && cell.row === oc.row && cell.col === oc.col && fl !== (oc.floor ?? 0)) {
        if (fl > (oc.floor ?? 0)) out.push({ kind: 'above', person: person.id, target: other.id, targetKind: 'person' })
        else out.push({ kind: 'below', person: person.id, target: other.id, targetKind: 'person' })
      }
    }
  }
  return out
}

// how "direct"/easy a clue is — lower = easier/more concrete
function clueDirectness(c: Clue): number {
  switch (c.kind) {
    case 'room': return 0
    case 'onFurniture': return 1
    case 'onlyOnFurniture': return 1
    case 'corner': return 2
    case 'row': case 'col': return 2
    case 'floor': return 2          // "Upstairs." — as direct as a row/col clue
    case 'besideFurniture': return 3
    case 'besideAny': return 3
    case 'edge': return 4
    case 'besidePerson': return 4
    case 'sameRoomAs': return 4
    case 'above': case 'below': return 4  // relational, like besidePerson
    case 'direction': return 5
    case 'notRoom': return 5        // weak: excludes 1 of many rooms
    case 'notSameRoomAs': return 5  // weak: relational exclusion
    default: return 6
  }
}

// --- clue text -------------------------------------------------------------

function rowText(row: number, size: number): string {
  if (row === 0) return 'in the top row'
  if (row === size - 1) return 'in the bottom row'
  return `in row ${row + 1}`
}
function colText(col: number, size: number): string {
  if (col === 0) return 'in the leftmost column'
  if (col === size - 1) return 'in the rightmost column'
  return `in column ${col + 1}`
}
function dirWord(dir: string) { return { N: 'north', S: 'south', E: 'east', W: 'west' }[dir]! }

function clueToText(p: Puzzle, c: Clue): string {
  const nameOf = (id: string) => p.people.find(x => x.id === id)?.name ?? '?'
  switch (c.kind) {
    case 'room': return `In the ${p.rooms.find(r => r.id === c.roomId)?.name}.`
    case 'onFurniture': return `On ${FURNITURE_LABEL[c.furniture]}.`
    case 'onlyOnFurniture': return `The only person on ${FURNITURE_LABEL[c.furniture]}.`
    case 'besideFurniture': return `Beside ${FURNITURE_LABEL[c.furniture]}.`
    case 'besideAny': return `Beside ${c.furniture.map(f => FURNITURE_LABEL[f]).join(' or ')}.`
    case 'row': return `${cap(rowText(c.row, p.size))}.`
    case 'col': return `${cap(colText(c.col, p.size))}.`
    case 'edge': return `Against a wall (on the edge).`
    case 'corner': return `In a corner.`
    case 'besidePerson': return `Right beside ${nameOf(c.other)}.`
    case 'sameRoomAs': return `In the same room as ${nameOf(c.other)}.`
    case 'direction': {
      const s = c.steps ? (c.steps === 1 ? 'one' : `${c.steps}`) : ''
      const unit = c.dir === 'N' || c.dir === 'S' ? 'row' : 'column'
      return c.steps
        ? `Exactly ${s} ${unit}${c.steps > 1 ? 's' : ''} ${dirWord(c.dir)} of ${nameOf(c.other)}.`
        : `Somewhere ${dirWord(c.dir)} of ${nameOf(c.other)}.`
    }
    case 'victim': return `The victim — found alone with the murderer.`
    case 'floor': return c.floorNum === 0 ? `On the ground floor.` : `Upstairs.`
    case 'above': {
      if (c.targetKind === 'room') {
        const room = p.rooms.find(r => r.id === c.target)
        return `Directly above the ${room?.name ?? c.target}.`
      }
      return `Directly above ${nameOf(c.target)}.`
    }
    case 'below': {
      if (c.targetKind === 'room') {
        const room = p.rooms.find(r => r.id === c.target)
        return `Directly below the ${room?.name ?? c.target}.`
      }
      return `Directly below ${nameOf(c.target)}.`
    }
    case 'notRoom': {
      const room = p.rooms.find(r => r.id === c.roomId)
      return `Never set foot in the ${room?.name ?? c.roomId}.`
    }
    case 'notSameRoomAs':
      return `Was not in the same room as ${nameOf(c.other)}.`
  }
}
function cap(s: string) { return s.charAt(0).toUpperCase() + s.slice(1) }

// --- selection -------------------------------------------------------------

/**
 * `maxDirectness` admits progressively vaguer clues as difficulty rises.
 * `minDirectness` is the other half of the dial, and it is what actually makes
 * the top tiers hard: it BANS the most direct clue kinds, so a suspect can no
 * longer be handed "In the Study" (directness 0) and must instead be
 * triangulated from relational statements. Raising the grid size alone only
 * makes a puzzle longer; raising the floor makes it harder.
 */
const DIFF_CONFIG: Record<Difficulty, { size: GridSize; people: number; maxDirectness: number; minDirectness: number; floors?: number }> = {
  'Very Easy': { size: 6, people: 4, maxDirectness: 3, minDirectness: 0 },
  'Easy':      { size: 7, people: 4, maxDirectness: 4, minDirectness: 0 },
  'Medium':    { size: 8, people: 5, maxDirectness: 5, minDirectness: 0 },
  // Two-floor enabled. Hard uses 8×8/5-person, Expert 8×8/6-person (slightly
  // tighter than 9×9 but well within budget), Master is capped at 8×8/6-person
  // with minDirectness=1 — a 10×10 two-floor board would still exceed 400ms
  // even with the optimised selector. The information-driven greedy (Phase A
  // arithmetic + Phase B cap-2 solver) brings Hard to ~5ms/puzzle and keeps
  // Expert and Master within the budget.
  'Hard':      { size: 8, people: 5, maxDirectness: 6, minDirectness: 0, floors: 2 },
  'Expert':    { size: 8, people: 6, maxDirectness: 6, minDirectness: 1, floors: 2 },
  'Master':    { size: 8, people: 6, maxDirectness: 6, minDirectness: 1, floors: 2 },
}

/** Build one full puzzle. Retries internally until a unique one is produced. */
export function generatePuzzle(
  difficulty: Difficulty,
  id: string,
  caseNumber: string,
  /** Internal: forces a single storey after the two-floor attempts are spent. */
  forceSingleFloor = false,
): Puzzle {
  const cfg = DIFF_CONFIG[difficulty]
  const size = cfg.size
  const floors = forceSingleFloor ? 1 : (cfg.floors ?? 1)
  const twoFloor = floors > 1

  const maxAttempts = twoFloor ? 250 : 60
  // The last fifth of the attempts drop the directness FLOOR. That floor is a
  // difficulty dial — it bans the most direct clue kinds so suspects must be
  // triangulated — but it is also the main reason a seed can run out of
  // attempts, because two-floor boards are already hard to pin uniquely.
  // A slightly easier case beats throwing: `makeRandomPuzzle` has no retry,
  // and in the catalog a throw silently drops a case from the list.
  const relaxFrom = Math.floor(maxAttempts * 0.8)
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const relaxed = attempt >= relaxFrom
    const names = shuffle(NAMES).slice(0, cfg.people)
    const accents = shuffle(ACCENTS)
    const people: Person[] = names.map((name, i) => ({
      id: `p${i}`, name, avatarSeed: `${name}-${seed}-${i}`, accent: accents[i % accents.length],
    }))
    const victim = people[Math.floor(rand() * people.length)]
    victim.isVictim = true

    // Build rooms and placement — two-floor for Hard/Expert/Master
    let rooms, roomOf, roomOfByFloor: string[][][] | undefined, place: Record<string, Cell>
    if (twoFloor) {
      const built = buildTwoFloorRooms(size)
      rooms = built.rooms; roomOf = built.roomOf; roomOfByFloor = built.roomOfByFloor
      place = randomTwoFloorPlacement(size, people)

      // For two-floor puzzles the murderer condition (victim alone with exactly
      // one suspect in the same room) is very unlikely to arise organically
      // because people are sparse across two floors. Force it explicitly:
      //
      // 1. Pick one non-victim suspect to be the murderer.
      // 2. Move them into the victim's room (same floor).
      // 3. Move every OTHER suspect OUT of the victim's room if they happen to be
      //    in it, so the victim is alone with exactly the murderer.
      const victimCell = place[victim.id]
      const victimFloor = victimCell.floor ?? 0
      const victimRoomId = (roomOfByFloor![victimFloor])[victimCell.row][victimCell.col]

      // Cells in the victim's room (same floor)
      const victimRoom = rooms.find(r => r.id === victimRoomId)
      if (!victimRoom || victimRoom.cells.length < 2) continue

      // Choose the murderer before computing takenRows so we can exclude them
      const suspects = people.filter(p => !p.isVictim)
      const forcedMurderer = pick(suspects)

      // Rows/cols taken by everyone EXCEPT the forced murderer
      // (the murderer will be moved, so their old slot is freed)
      const othersPlace = Object.entries(place).filter(([id]) => id !== forcedMurderer.id)
      const takenRows = new Set(othersPlace.map(([, c]) => c.row))
      const takenCols = new Set(othersPlace.map(([, c]) => c.col))

      // Candidates: victim's room cells with row AND col not taken by others
      const freeCells = victimRoom.cells.filter(c =>
        !(c.row === victimCell.row && c.col === victimCell.col) &&
        !takenRows.has(c.row) &&
        !takenCols.has(c.col)
      )
      if (freeCells.length === 0) continue
      const murderCell = pick(freeCells)
      place[forcedMurderer.id] = { ...murderCell, floor: victimFloor }

      // Move any other suspects OUT of the victim's room.
      // After moving the murderer, recheck who's in the victim's room.
      const otherSuspectsInRoom = suspects
        .filter(s => s.id !== forcedMurderer.id)
        .filter(s => {
          const sc = place[s.id]
          const sFloor = sc.floor ?? 0
          if (sFloor !== victimFloor) return false
          return (roomOfByFloor![sFloor])[sc.row]?.[sc.col] === victimRoomId
        })

      // For each interloper, find a cell outside the victim's room to move them to
      let placementOk = true
      for (const interloper of otherSuspectsInRoom) {
        const allTakenRows = new Set(Object.entries(place).filter(([id]) => id !== interloper.id).map(([,c]) => c.row))
        const allTakenCols = new Set(Object.entries(place).filter(([id]) => id !== interloper.id).map(([,c]) => c.col))
        // Find a cell on any floor NOT in the victim's room with free row+col
        const candidates: Cell[] = []
        for (const fl of [0, 1]) {
          const floorRoomOf = roomOfByFloor![fl]
          for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
              const rid = floorRoomOf[r]?.[c]
              if (!rid || rid === victimRoomId) continue
              if (allTakenRows.has(r) || allTakenCols.has(c)) continue
              candidates.push({ row: r, col: c, floor: fl })
            }
          }
        }
        if (candidates.length === 0) { placementOk = false; break }
        place[interloper.id] = pick(candidates)
      }
      if (!placementOk) continue
    } else {
      const built = buildRooms(size)
      rooms = built.rooms; roomOf = built.roomOf
      place = randomPlacement(size, people)
    }

    // victim must share their room with exactly one suspect (the murderer)
    const base: Puzzle = {
      id, title: '', caseNumber, difficulty, size, rooms, roomOf,
      ...(roomOfByFloor ? { roomOfByFloor, floors } : {}),
      furniture: [], people, clues: [], solution: place,
      victimId: victim.id, murdererId: '', flavor: '',
    }
    const murderer = findMurderer(base, place)
    if (!murderer) continue
    base.murdererId = murderer

    // Place furniture on each floor separately
    if (twoFloor && roomOfByFloor) {
      const sharedOccupied = new Set<string>()
      const rooms0 = rooms.filter(r => (r.floor ?? 0) === 0)
      const rooms1 = rooms.filter(r => (r.floor ?? 0) === 1)
      const furn0 = placeFurniture(rooms0, roomOfByFloor[0], place, 0, sharedOccupied)
      const furn1 = placeFurniture(rooms1, roomOfByFloor[1], place, 1, sharedOccupied)
      base.furniture = [...furn0, ...furn1]
    } else {
      base.furniture = placeFurniture(rooms, roomOf, place)
    }

    // candidate clues, biased toward the difficulty's directness
    const ceiling = candidateClues(base).filter(c => clueDirectness(c) <= cfg.maxDirectness)
    // The floor is a preference, not a hard gate: a suspect whose only available
    // clues are direct ones still gets a clue rather than failing the whole
    // attempt. Otherwise a Master board with one tiny room could never generate.
    const floorLevel = relaxed ? 0 : cfg.minDirectness
    const pool = ceiling.filter(c => clueDirectness(c) >= floorLevel)
    // Build clue pools for ALL people including the victim, so the victim's
    // position can be pinned when people < size (otherwise the victim is a free
    // variable after the suspects are placed → no unique solution is achievable).
    const byPerson: Record<string, Clue[]> = {}
    for (const person of people) {
      const indirect = pool.filter(c => c.person === person.id)
      const any = ceiling.filter(c => c.person === person.id)
      byPerson[person.id] = (indirect.length ? indirect : any)
        .sort((a, b) => clueDirectness(a) - clueDirectness(b))
    }
    // Every person (including victim) must have at least one available clue.
    if (people.some(p => (byPerson[p.id] ?? []).length === 0)) continue

    // ---- For two-floor puzzles, seed with a floor clue per person (halves
    // each person's unary candidate space immediately).
    const floorSeed: Clue[] = twoFloor
      ? people.map(person => {
          const fl = (base.solution[person.id].floor ?? 0)
          return { kind: 'floor' as const, person: person.id, floorNum: fl }
        })
      : []

    // ---- Information-driven greedy clue selection. ----
    //
    // PHASE A: Arithmetic scoring (no solver calls).
    //   Maintain cands[personId] = set of cells still compatible with all chosen
    //   unary clues for that person. Score a candidate clue by the log2 reduction
    //   it would produce in that person's candidate set (lower total = better).
    //   Loop: always pick the best-scoring unary clue not yet in the set.
    //   Terminate when countSolutions(base, 2) === 1.
    //
    // PHASE B: Solver-tested tail (cap-2, for relational clues).
    //   If Phase A stalls (no candidate improves the score OR we ran out of
    //   unary candidates), switch to per-candidate solver calls at cap 2 until
    //   unique. This is the old greedy but cheap: countSolutions is ~3ms.
    //
    // Fast path: during the search we assign base.clues without calling
    // toClueText (empty text string). The real text is generated once at the end.

    /** Assign clues to base without building text strings — for the hot loop. */
    const setCluesFast = (clues: Clue[]) => {
      base.clues = clues.map(c => ({ clue: c, text: '' }))
    }

    /** Unary kinds that shrink one person's cell set. */
    const isUnaryKind = (c: Clue): boolean => {
      switch (c.kind) {
        case 'room': case 'row': case 'col': case 'edge': case 'corner':
        case 'onFurniture': case 'onlyOnFurniture': case 'besideFurniture':
        case 'besideAny': case 'floor': case 'above': case 'below':
        case 'notRoom':
          // above/below with targetKind==='person' are relational; keep only room-targeted ones
          if (c.kind === 'above' || c.kind === 'below') return c.targetKind === 'room'
          return true
        default:
          return false
      }
    }

    /** Count cells passing a single unary clue for personId — pure, no mutation. */
    const countCellsForClue = (clue: Clue, personId: string): number => {
      const floorCount = twoFloor ? 2 : 1
      const N = base.size
      let count = 0
      for (let fl = 0; fl < floorCount; fl++) {
        for (let r = 0; r < N; r++) {
          for (let c = 0; c < N; c++) {
            const cell: Cell = twoFloor ? { row: r, col: c, floor: fl } : { row: r, col: c }
            if (unaryClueOkForCell(base, personId, cell, clue)) count++
          }
        }
      }
      return count
    }

    // Build initial candidate sets from the floor-seed clues (they're unary).
    // cands[id] = number of cells still compatible with current unary clues.
    // We track counts (not actual sets) since we only need log2 for scoring.
    const candidateCounts: Record<string, number> = {}
    const totalCells = (twoFloor ? 2 : 1) * base.size * base.size
    for (const p of people) {
      if (twoFloor) {
        // Floor seed already halves the space — each person is on one floor
        candidateCounts[p.id] = base.size * base.size
      } else {
        candidateCounts[p.id] = totalCells
      }
    }

    const acc: Clue[] = [...floorSeed]
    // Update counts for floor seeds
    for (const clue of floorSeed) {
      candidateCounts[clue.person] = base.size * base.size // floor halves 2N²→N²
    }

    // Start with the best initial unary clue per person (smallest candidate count)
    for (const p of people) {
      const unary = byPerson[p.id].filter(isUnaryKind)
      if (unary.length === 0) continue
      let bestClue: Clue | null = null
      let bestCount = Infinity
      for (const c of unary) {
        const cnt = countCellsForClue(c, p.id)
        if (cnt < bestCount) { bestCount = cnt; bestClue = c }
      }
      if (bestClue) {
        acc.push(bestClue)
        candidateCounts[bestClue.person] = bestCount
      }
    }

    setCluesFast(acc)

    // Phase A: arithmetic greedy — add unary clues by best log2-shrinkage
    let phaseAGuard = 0
    while (countSolutions(base, 2) > 1 && phaseAGuard++ < 80) {
      const remaining = (pool.length ? pool : ceiling).filter(c => !acc.includes(c) && isUnaryKind(c))
      if (remaining.length === 0) break

      let bestClue: Clue | null = null
      let bestScore = Infinity // lower = better (more shrinkage)
      for (const cand of remaining) {
        const cnt = countCellsForClue(cand, cand.person)
        // Score = log2 of new count (lower means more constrained)
        const score = Math.log2(Math.max(cnt, 1))
        // Only add if it actually shrinks this person's candidates
        if (cnt < (candidateCounts[cand.person] ?? totalCells) && score < bestScore) {
          bestScore = score
          bestClue = cand
        }
      }

      if (!bestClue) break // Phase A stalled — no unary clue helps further
      acc.push(bestClue)
      candidateCounts[bestClue.person] = Math.pow(2, bestScore)
      setCluesFast(acc)
    }

    // Phase B: solver-tested tail — cap-2 per candidate, for relational clues
    // and any remaining ambiguity Phase A couldn't resolve.
    let phaseBGuard = 0
    const maxPhaseBGuard = twoFloor ? 50 : 40
    while (countSolutions(base, 2) > 1 && phaseBGuard++ < maxPhaseBGuard) {
      const preferred = (pool.length ? pool : ceiling).filter(c => !acc.includes(c))
      const remaining = preferred.length ? preferred : ceiling.filter(c => !acc.includes(c))
      if (!remaining.length) break
      // Sample 30 randomly; if none reduce the count, try the full set once.
      const sample = shuffle(remaining).slice(0, 30)
      let bestClue: Clue | null = null, bestCount = Infinity
      for (const cand of sample) {
        setCluesFast([...acc, cand])
        const n = countSolutions(base, 2)
        if (n < bestCount) { bestCount = n; bestClue = cand; if (n === 1) break }
      }
      // If the 30-sample didn't find any improvement, try remaining candidates we missed.
      if (!bestClue && remaining.length > 30) {
        const missed = remaining.filter(c => !sample.includes(c))
        for (const cand of missed) {
          setCluesFast([...acc, cand])
          const n = countSolutions(base, 2)
          if (n < bestCount) { bestCount = n; bestClue = cand; if (n === 1) break }
        }
      }
      setCluesFast(acc) // restore
      if (!bestClue) break
      acc.push(bestClue)
      setCluesFast(acc)
    }

    let chosen: Clue[] | null = acc

    // ---- Prune: drop any clue the solution doesn't need, but keep at least
    // one clue per suspect so every card carries information.
    chosen = pruneClues(base, chosen)

    base.clues = toClueText(base, chosen)
    // A two-floor case where everybody ends up on one storey is a single-floor
    // case with a decorative upstairs: the floor clues carry no information and
    // "directly above" can never fire. randomPlacement tries to force somebody
    // onto each floor, but measured over real seeds that guarantee did not always
    // survive into the final solution, so reject it here where it is provable
    // and let the attempt loop try again.
    // Quality bar, not a hard gate: rejecting outright starved generation and
    // made some seeds throw. Enforced for the first 80% of attempts, then
    // dropped so a puzzle always gets produced.
    if (twoFloor && !relaxed) {
      const storeys = new Set(Object.values(base.solution).map(c => c.floor ?? 0))
      if (storeys.size < 2) continue
    }

    if (countSolutions(base, 2) === 1) {
      // add the victim's flavour clue and finalise
      base.clues = toClueText(base, chosen)
      base.clues.push({
        clue: { kind: 'victim', person: victim.id },
        text: clueToText(base, { kind: 'victim', person: victim.id }),
      })
      base.title = pickTitle(rooms)
      base.flavor = makeFlavor(base)
      base.source = 'generated'
      return base
    }
  }
  // Two floors roughly double the candidate cells while the row/column rule
  // still admits only N placements, so a minority of seeds cannot be pinned to
  // a unique solution however the clues are chosen. Degrade to a single-storey
  // house for that seed rather than throwing: a throw silently drops a case
  // from the catalog (buildOne swallows it) and has no retry at all behind
  // `makeRandomPuzzle`, so the player would simply get no puzzle.
  if (twoFloor) return generatePuzzle(difficulty, id, caseNumber, true)
  throw new Error('Failed to generate a unique puzzle')
}

function toClueText(p: Puzzle, clues: Clue[]): ClueText[] {
  return clues.map(clue => ({ clue, text: clueToText(p, clue) }))
}

/** Remove redundant clues while keeping a unique solution and ≥1 clue/person. */
function pruneClues(p: Puzzle, clues: Clue[]): Clue[] {
  let cur = [...clues]
  for (const c of shuffle([...cur])) {
    const trial = cur.filter(x => x !== c)
    if (!trial.some(x => x.person === c.person)) continue // keep ≥1 per suspect
    p.clues = toClueText(p, trial)
    if (countSolutions(p, 2) === 1) cur = trial
  }
  return cur
}

const TITLES = [
  'The Silent Guest', 'A Cold Reception', 'Death Before Dinner', 'The Locked Study',
  'Midnight Delivery', 'The Last Nightcap', 'No Way Out', 'The Uninvited',
  'A Fatal Rehearsal', 'The Empty Chair', 'Checkmate', 'The Broken Vase',
]
function pickTitle(rooms: Room[]): string {
  void rooms
  return pick(TITLES)
}

function makeFlavor(p: Puzzle): string {
  const victim = p.people.find(x => x.id === p.victimId)!
  const room = p.rooms.find(r => r.id === roomIdAt(p, p.solution[p.victimId]))!
  return `${victim.name} was found dead in the ${room.name}. Everyone has an alibi — but the clues never lie. Place each person, and the one left alone with ${victim.name} is your killer.`
}

export { clueToText }
