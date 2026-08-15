import type {
  Puzzle, GridSize, Difficulty, Room, Cell, Furniture, FurnitureType,
  Person, Clue, ClueText,
} from './types'
import { furnitureCells } from './types'
import { countSolutions, furnitureAt, roomIdAt, findMurderer, cellsAdjacent } from './engine'

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
    // relations to others
    for (const other of p.people) {
      if (other.id === person.id) continue
      const oc = p.solution[other.id]
      if (cellsAdjacent(cell, oc)) out.push({ kind: 'besidePerson', person: person.id, other: other.id })
      if (roomIdAt(p, cell) === roomIdAt(p, oc) && other.id !== p.victimId)
        out.push({ kind: 'sameRoomAs', person: person.id, other: other.id })
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
  // TWO-FLOOR GENERATION IS DISABLED PENDING A GENERATOR FIX.
  //
  // The model, engine, clue kinds (floor / above / below) and type support are
  // all in place and tested — only generation is switched off. Measured: with
  // two floors the generator needs ~82s PER PUZZLE against a 400ms budget, and
  // shrinking the per-floor board to 6x6 did not rescue it.
  //
  // The cause is not the solver (countSolutions is 3.1ms on a two-floor board).
  // It is uniqueness: two floors double the candidate cells while the row and
  // column rule still admits only N placements, so a random clue set almost
  // never pins a single solution and the search thrashes. Fixing it needs
  // floor-aware clue SELECTION (bias toward floor/above/below clues, and pick
  // clues that measurably cut the solution count) rather than the current
  // random-combination search. Re-enable by restoring `floors: 2` here.
  'Hard':      { size: 8, people: 5, maxDirectness: 6, minDirectness: 0 },
  'Expert':    { size: 9, people: 6, maxDirectness: 6, minDirectness: 1 },
  'Master':    { size: 10, people: 6, maxDirectness: 6, minDirectness: 1 },
}

/** Build one full puzzle. Retries internally until a unique one is produced. */
export function generatePuzzle(difficulty: Difficulty, id: string, caseNumber: string): Puzzle {
  const cfg = DIFF_CONFIG[difficulty]
  const size = cfg.size
  const floors = cfg.floors ?? 1
  const twoFloor = floors > 1

  const maxAttempts = twoFloor ? 100 : 60
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
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
    const pool = ceiling.filter(c => clueDirectness(c) >= cfg.minDirectness)
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

    // ---- For two-floor puzzles, seed every combo attempt with a floor clue per
    // person. This halves each person's search space from the first solver call
    // (unaryClueOk rejects cells on the wrong floor immediately), keeping
    // generation within budget even though the cell list doubled.
    const floorSeed: Clue[] = twoFloor
      ? people.map(person => {
          const fl = (base.solution[person.id].floor ?? 0)
          return { kind: 'floor' as const, person: person.id, floorNum: fl }
        })
      : []

    // ---- Preferred: find ONE clue per person that already yields a unique
    // solution. Try many random combos, biased toward concrete clues for easy modes.
    // Two-floor boards already have floor seeds constraining half the space, so
    // fewer combo attempts are needed before hitting the greedy fallback.
    let chosen: Clue[] | null = null
    const topK = cfg.maxDirectness <= 3 ? 3 : 5
    for (let t = 0; t < 700 && !chosen; t++) {
      const extra = people.map(p => pick(byPerson[p.id].slice(0, Math.min(topK, byPerson[p.id].length))))
      const combo = [...floorSeed, ...extra]
      base.clues = toClueText(base, combo)
      if (countSolutions(base, 2) === 1) chosen = combo
    }

    // ---- Fallback: one strong clue each, then greedily add the minimum extra
    // clues needed for uniqueness. (Every clue is still shown to the player.)
    if (!chosen) {
      const seed2 = [...floorSeed, ...people.map(p => byPerson[p.id][0])]
      const acc: Clue[] = [...seed2]
      base.clues = toClueText(base, acc)
      let guard = 0
      const maxGuard = twoFloor ? 20 : 40
      while (countSolutions(base, 2) > 1 && guard++ < maxGuard) {
        // Prefer indirect patch clues; fall back to the full ceiling rather than
        // abandoning uniqueness, which is non-negotiable.
        const preferred = pool.filter(c => !acc.includes(c))
        const remaining = preferred.length ? preferred : ceiling.filter(c => !acc.includes(c))
        if (!remaining.length) break
        let bestClue: Clue | null = null, bestCount = Infinity
        for (const cand of shuffle(remaining).slice(0, 30)) {
          base.clues = toClueText(base, [...acc, cand])
          const n = countSolutions(base, 12)
          if (n < bestCount) { bestCount = n; bestClue = cand; if (n === 1) break }
        }
        if (!bestClue) break
        acc.push(bestClue)
        base.clues = toClueText(base, acc)
      }
      chosen = acc
    }

    // ---- Prune: drop any clue the solution doesn't need, but keep at least
    // one clue per suspect so every card carries information.
    chosen = pruneClues(base, chosen)

    base.clues = toClueText(base, chosen)
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
