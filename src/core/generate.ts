import type {
  Puzzle, GridSize, Difficulty, Room, Cell, Furniture, FurnitureType,
  Person, Clue, ClueText,
} from './types'
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
  const target = size <= 4 ? 3 : size <= 5 ? 4 : 4 + Math.floor(rand() * 2)
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
  // How many of each type are already on the board — used to spread variety so
  // one case never ends up with e.g. four clocks and three boxes.
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

  // Track furniture-free cells per room so we NEVER fill a whole room — every
  // room must keep at least one empty cell for its label to sit on.
  const freeCells: Record<string, Set<string>> = {}
  for (const room of rooms) freeCells[room.id] = new Set(room.cells.map(c => `${c.row},${c.col}`))
  const roomIdAtRC = (row: number, col: number) => roomOf[row][col]
  const canFurnish = (row: number, col: number) => freeCells[roomIdAtRC(row, col)].size > 1
  const occupy = (row: number, col: number) => freeCells[roomIdAtRC(row, col)].delete(`${row},${col}`)

  // 1) Each room gets a few DISTINCT pieces (never more than cells - 1).
  for (const room of rooms) {
    const pool = ROOM_FURNITURE[room.name] ?? ['box', 'chair', 'plant']
    const maxN = Math.min(pool.length, room.cells.length - 1) // always leave ≥1 free
    const n = Math.max(0, Math.min(maxN, 1 + Math.floor(rand() * Math.min(3, room.cells.length))))
    const cells = shuffle(room.cells).slice(0, n)
    const inRoom = new Set<FurnitureType>()
    for (const cell of cells) {
      const t = pickVaried(pool, inRoom)
      inRoom.add(t)
      furniture.push({ type: t, row: cell.row, col: cell.col })
      occupy(cell.row, cell.col)
    }
  }

  // 2) Give most people a piece to sit on/beside (for furniture clues) — but
  //    never at the cost of a room's last free cell.
  for (const key of Object.keys(place)) {
    const cell = place[key]
    const here = furnitureAt({ furniture } as Puzzle, cell.row, cell.col)
    if (here.length === 0 && canFurnish(cell.row, cell.col) && rand() < 0.7) {
      const pool = ROOM_FURNITURE[roomName(roomOf[cell.row][cell.col])] ?? ['chair']
      furniture.push({ type: pickVaried(pool), row: cell.row, col: cell.col })
      occupy(cell.row, cell.col)
    }
  }
  return furniture
}

// --- candidate clues -------------------------------------------------------

function candidateClues(p: Puzzle): Clue[] {
  const out: Clue[] = []
  const size = p.size
  for (const person of p.people) {
    if (person.id === p.victimId) continue
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

const DIFF_CONFIG: Record<Difficulty, { size: GridSize; maxDirectness: number }> = {
  'Very Easy': { size: 4, maxDirectness: 3 },
  'Easy': { size: 5, maxDirectness: 4 },
  'Medium': { size: 6, maxDirectness: 5 },
  'Hard': { size: 6, maxDirectness: 6 },
  'Expert': { size: 7, maxDirectness: 6 },
}

/** Build one full puzzle. Retries internally until a unique one is produced. */
export function generatePuzzle(difficulty: Difficulty, id: string, caseNumber: string): Puzzle {
  const cfg = DIFF_CONFIG[difficulty]
  const size = cfg.size

  for (let attempt = 0; attempt < 60; attempt++) {
    const names = shuffle(NAMES).slice(0, size)
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
    const pool = candidateClues(base).filter(c => clueDirectness(c) <= cfg.maxDirectness)
    const byPerson: Record<string, Clue[]> = {}
    for (const person of people) {
      if (person.id === victim.id) continue
      byPerson[person.id] = pool.filter(c => c.person === person.id)
        .sort((a, b) => clueDirectness(a) - clueDirectness(b))
    }
    const suspects = people.filter(p => p.id !== victim.id)
    if (suspects.some(s => (byPerson[s.id] ?? []).length === 0)) continue

    // ---- Preferred: find ONE clue per suspect that already yields a unique
    // solution. This matches real Murdoku (one clue per card) and keeps cards
    // clean. Try many random combos, biased toward concrete clues for easy modes.
    let chosen: Clue[] | null = null
    const topK = cfg.maxDirectness <= 3 ? 3 : 5
    for (let t = 0; t < 700 && !chosen; t++) {
      const combo = suspects.map(s => pick(byPerson[s.id].slice(0, Math.min(topK, byPerson[s.id].length))))
      base.clues = toClueText(base, combo)
      if (countSolutions(base, 2) === 1) chosen = combo
    }

    // ---- Fallback: one strong clue each, then greedily add the minimum extra
    // clues needed for uniqueness. (Every clue is still shown to the player.)
    if (!chosen) {
      const seed2 = suspects.map(s => byPerson[s.id][0])
      const acc: Clue[] = [...seed2]
      base.clues = toClueText(base, acc)
      let guard = 0
      while (countSolutions(base, 2) > 1 && guard++ < 40) {
        const remaining = pool.filter(c => !acc.includes(c))
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

/** Remove redundant clues while keeping a unique solution and ≥1 clue/suspect. */
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
