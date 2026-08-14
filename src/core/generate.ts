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

// --- random valid placement ------------------------------------------------

function randomPlacement(size: number, people: Person[]): Record<string, Cell> {
  const rows = shuffle([...Array(size).keys()])
  const cols = shuffle([...Array(size).keys()])
  const place: Record<string, Cell> = {}
  people.forEach((p, i) => { place[p.id] = { row: rows[i], col: cols[i] } })
  return place
}

// --- furniture -------------------------------------------------------------

function placeFurniture(
  rooms: Room[], roomOf: string[][], place: Record<string, Cell>,
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

  // Track which cells are occupied by furniture (keyed "row,col").
  const occupiedCells = new Set<string>()
  // Track furniture-free cells per room — every room must keep ≥1 for its label.
  const freeCells: Record<string, Set<string>> = {}
  for (const room of rooms) freeCells[room.id] = new Set(room.cells.map(c => `${c.row},${c.col}`))

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
    const piece: Furniture = { type: t, row, col, w: fp.w, h: fp.h }
    const cells = furnitureCells(piece)
    // Validate all cells
    for (const { row: r, col: c } of cells) {
      if (r < 0 || c < 0 || r >= roomOf.length || c >= (roomOf[0]?.length ?? 0)) return false
      if (roomIdAtRC(r, c) !== roomId) return false
      if (occupiedCells.has(`${r},${c}`)) return false
    }
    // Ensure room keeps ≥1 free label cell after this placement
    if (freeCells[roomId].size - cells.length < 1) return false
    // Commit
    for (const { row: r, col: c } of cells) {
      occupiedCells.add(`${r},${c}`)
      freeCells[roomId].delete(`${r},${c}`)
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
      if (occupiedCells.has(`${cell.row},${cell.col}`)) continue
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
    if (occupiedCells.has(`${cell.row},${cell.col}`)) continue
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
  for (const person of p.people) {
    // Include the victim in the clue pool so the solver can pin their position.
    // (When people < size the victim is otherwise a free variable after the
    //  suspects are placed, making unique solutions impossible to achieve.)
    // The separate kind:'victim' flavour line is appended in generatePuzzle.
    const cell = p.solution[person.id]
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
    // on furniture
    for (const t of furnitureAt(p, cell.row, cell.col)) {
      out.push({ kind: 'onFurniture', person: person.id, furniture: t })
      // only-on if unique
      const others = p.people.some(o => o.id !== person.id && furnitureAt(p, p.solution[o.id].row, p.solution[o.id].col).includes(t))
      if (!others) out.push({ kind: 'onlyOnFurniture', person: person.id, furniture: t })
    }
    // beside furniture
    const besideTypes = new Set<FurnitureType>()
    for (const [dr, dc] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
      const r = cell.row + dr, c = cell.col + dc
      if (r < 0 || c < 0 || r >= size || c >= size) continue
      furnitureAt(p, r, c).forEach(t => besideTypes.add(t))
    }
    besideTypes.forEach(t => out.push({ kind: 'besideFurniture', person: person.id, furniture: t }))
    // relations to others
    for (const other of p.people) {
      if (other.id === person.id) continue
      const oc = p.solution[other.id]
      if (cellsAdjacent(cell, oc)) out.push({ kind: 'besidePerson', person: person.id, other: other.id })
      if (roomIdAt(p, cell) === roomIdAt(p, oc) && other.id !== p.victimId)
        out.push({ kind: 'sameRoomAs', person: person.id, other: other.id })
      // exact-step directions (more informative)
      if (cell.col === oc.col && cell.row === oc.row - 1) out.push({ kind: 'direction', person: person.id, other: other.id, dir: 'N', steps: 1 })
      if (cell.col === oc.col && cell.row === oc.row + 1) out.push({ kind: 'direction', person: person.id, other: other.id, dir: 'S', steps: 1 })
      if (cell.row === oc.row && cell.col === oc.col - 1) out.push({ kind: 'direction', person: person.id, other: other.id, dir: 'W', steps: 1 })
      if (cell.row === oc.row && cell.col === oc.col + 1) out.push({ kind: 'direction', person: person.id, other: other.id, dir: 'E', steps: 1 })
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
    case 'besideFurniture': return 3
    case 'besideAny': return 3
    case 'edge': return 4
    case 'besidePerson': return 4
    case 'sameRoomAs': return 4
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
const DIFF_CONFIG: Record<Difficulty, { size: GridSize; people: number; maxDirectness: number; minDirectness: number }> = {
  'Very Easy': { size: 6, people: 4, maxDirectness: 3, minDirectness: 0 },
  'Easy':      { size: 7, people: 4, maxDirectness: 4, minDirectness: 0 },
  'Medium':    { size: 8, people: 5, maxDirectness: 5, minDirectness: 0 },
  'Hard':      { size: 8, people: 5, maxDirectness: 6, minDirectness: 0 },
  'Expert':    { size: 9, people: 6, maxDirectness: 6, minDirectness: 1 },
  'Master':    { size: 10, people: 6, maxDirectness: 6, minDirectness: 1 },
}

/** Build one full puzzle. Retries internally until a unique one is produced. */
export function generatePuzzle(difficulty: Difficulty, id: string, caseNumber: string): Puzzle {
  const cfg = DIFF_CONFIG[difficulty]
  const size = cfg.size

  for (let attempt = 0; attempt < 60; attempt++) {
    const names = shuffle(NAMES).slice(0, cfg.people)
    const accents = shuffle(ACCENTS)
    const people: Person[] = names.map((name, i) => ({
      id: `p${i}`, name, avatarSeed: `${name}-${seed}-${i}`, accent: accents[i % accents.length],
    }))
    const victim = people[Math.floor(rand() * people.length)]
    victim.isVictim = true

    const { rooms, roomOf } = buildRooms(size)
    const place = randomPlacement(size, people)

    // victim must share their room with exactly one suspect (the murderer)
    const base: Puzzle = {
      id, title: '', caseNumber, difficulty, size, rooms, roomOf,
      furniture: [], people, clues: [], solution: place,
      victimId: victim.id, murdererId: '', flavor: '',
    }
    const murderer = findMurderer(base, place)
    if (!murderer) continue
    base.murdererId = murderer

    base.furniture = placeFurniture(rooms, roomOf, place)

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

    // ---- Preferred: find ONE clue per person that already yields a unique
    // solution. Try many random combos, biased toward concrete clues for easy modes.
    let chosen: Clue[] | null = null
    const topK = cfg.maxDirectness <= 3 ? 3 : 5
    for (let t = 0; t < 700 && !chosen; t++) {
      const combo = people.map(p => pick(byPerson[p.id].slice(0, Math.min(topK, byPerson[p.id].length))))
      base.clues = toClueText(base, combo)
      if (countSolutions(base, 2) === 1) chosen = combo
    }

    // ---- Fallback: one strong clue each, then greedily add the minimum extra
    // clues needed for uniqueness. (Every clue is still shown to the player.)
    if (!chosen) {
      const seed2 = people.map(p => byPerson[p.id][0])
      const acc: Clue[] = [...seed2]
      base.clues = toClueText(base, acc)
      let guard = 0
      while (countSolutions(base, 2) > 1 && guard++ < 40) {
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
