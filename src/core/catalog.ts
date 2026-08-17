import { generatePuzzle, reseed } from './generate'
import { buildAuthoredPuzzle } from './authored'
import { AUTHORED_CASES } from '../data/cases'
import type { Puzzle, Difficulty } from './types'

// ============================================================================
// The catalog: a stable, seeded set of puzzles. Because generation is
// deterministic per seed, the same catalog is produced every run; we also cache
// it in localStorage so reloads are instant and ids stay stable for progress.
// ============================================================================

// The curve is deliberately fattest in the middle: Very Easy exists to teach
// the rules once, while Medium/Hard is where a player who likes the game
// actually lives. Master (8x8, no direct room clues) is the long tail.
const SPEC: { difficulty: Difficulty; count: number }[] = [
  { difficulty: 'Very Easy', count: 8 },
  { difficulty: 'Easy', count: 10 },
  { difficulty: 'Medium', count: 12 },
  { difficulty: 'Hard', count: 12 },
  { difficulty: 'Expert', count: 10 },
  { difficulty: 'Master', count: 8 },
]

// v12: the L.A. Noire redesign muted the per-suspect ACCENTS palette in
// generate.ts. Cached catalogs embed the generated colours, so without this
// bump every returning player would keep the old candy palette from cache.
// v13: the catalog grew from 27 to 60 cases and gained the Master tier, and the
// generator's directness floor changed which clues Expert boards draw from. A
// cached v12 list would pin returning players to the old, smaller catalog.
// v14: boards grew (6x6 through 10x10), the suspect count is no longer tied to
// the board size, and furniture now carries a w/h footprint. A cached v13 list
// would pin returning players to small boards full of 1x1 furniture.
// v15: Hard/Expert/Master cases are now two-floor. Global row/col exclusivity
// means upstairs suspects block the same rows/cols as downstairs ones. New clue
// kinds (floor, above, below) added. Cached v14 puzzles lack floor data.
// v16: Two-floor generation enabled. Information-driven greedy clue selection
// (Phase A arithmetic scoring + Phase B cap-2 solver). Expert and Master
// board sizes normalised to 8×8 (two floors × 8×8 ≈ single-floor 10×10 area).
// v17: Added notRoom and notSameRoomAs negation clue kinds.
// v18: Rooms are now far larger — an explicit per-tier room count replaces the
// size-derived ladder, taking two-floor tiers from ~9.8 to 16.0 cells per room
// so a board reads as a floor plan rather than a grid of cubicles. Cached v17
// puzzles have the old cramped room layouts.
// v19: Room names are now assigned by fit (outdoor-on-edge rule, size bands,
// floor preferences). splitRects is balanced (MIN_ROOM_DIM=2, centred cuts).
// Furniture gets wall-based rotation: wall-huggers face inward, seating faces
// the room centroid with anti-adjacency guard. 2×1 wall-huggers may swap to
// 1×2 footprint when placed on a vertical wall. Cached v18 boards have old
// random names, no rotation, and occasional 1-cell slivers.
// v20: very-easy-2 ("The Empty Chair") is now hand-authored instead of
// procedurally generated — the pilot for src/data/cases/. Cached v19 lists
// still hold the old generated version.
const KEY = 'murdoku_catalog_v20'
let puzzles: Puzzle[] = []

function slug(s: string) { return s.toLowerCase().replace(/\s+/g, '-') }
function hash(s: string) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) } return Math.abs(h) }
function roman(n: number): string {
  const map: [number, string][] = [
    [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
    [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I'],
  ]
  let out = ''
  for (const [v, r] of map) while (n >= v) { out += r; n -= v }
  return out
}

const UNIQUE_TITLES = [
  'Midnight Delivery', 'The Empty Chair', 'A Fatal Rehearsal', 'Checkmate',
  'The Broken Vase', 'The Locked Study', 'The Uninvited', 'A Cold Reception',
  'The Last Nightcap', 'Death Before Dinner', 'The Silent Guest', 'No Way Out',
  'The Final Curtain', 'A Grave Mistake', 'The Vanishing Act',
  'The Missing Key', 'Ashes in the Study', 'The Seventh Guest',
  'A Toast to Murder', 'The Torn Letter', 'Shadows in the Hall',
  'The Poisoned Pen', 'One Last Waltz', 'The Butler’s Secret',
  'Whispers Upstairs', 'The Cracked Mirror', 'A Debt Repaid',
  // Added with the 60-case catalog. One title per case, so this list must stay
  // at least as long as the sum of SPEC counts or titles begin to repeat.
  'The Second Shot', 'Nobody Left', 'A Quiet Alibi', 'The Wrong Coat',
  'Ashes at Midnight', 'The Last Train', 'Room Without a Door', 'The Cold Kettle',
  'A Name in Pencil', 'The Unlit Lamp', 'Three Empty Glasses', 'The Late Arrival',
  'A Story Rehearsed', 'The Missing Hour', 'Nothing Was Taken', 'The Open Window',
  'A Witness Recants', 'The Locked Pantry', 'Dust on the Sill', 'The Borrowed Knife',
  'A Clock Stopped', 'The Second Study', 'No One Heard', 'The Spare Key',
  'A Quiet Confession', 'The Torn Ledger', 'Shadows at the Door', 'The Last Guest',
  'A Debt Unsettled', 'The Silent Kitchen', 'Two Sets of Prints', 'The Final Alibi',
  'Nobody Was Home',
]

/** Every case the catalog will contain, in order, before any is generated. */
function plan(): { difficulty: Difficulty; index: number; caseNumber: number }[] {
  const specs: { difficulty: Difficulty; index: number; caseNumber: number }[] = []
  let n = 1
  for (const { difficulty, count } of SPEC) {
    for (let i = 0; i < count; i++) specs.push({ difficulty, index: i, caseNumber: n++ })
  }
  return specs
}

function buildOne(spec: { difficulty: Difficulty; index: number; caseNumber: number }): Puzzle | null {
  const caseSlug = `${slug(spec.difficulty)}-${spec.index + 1}`
  const caseNo = `Case No. ${roman(spec.caseNumber)}`
  try {
    const authored = AUTHORED_CASES[caseSlug]
    const p = authored ? buildAuthoredPuzzle(authored, caseNo) : (() => {
      reseed(hash(spec.difficulty) + spec.index * 7919 + 13)
      return generatePuzzle(spec.difficulty, caseSlug, caseNo)
    })()
    // Guarantee distinct titles. Case numbers come from the plan, so a rare
    // failed seed leaves a gap rather than renumbering everything after it.
    p.title = UNIQUE_TITLES[(spec.caseNumber - 1) % UNIQUE_TITLES.length]
    return p
  } catch { return null }
}

function build(): Puzzle[] {
  return plan().map(buildOne).filter((p): p is Puzzle => p !== null)
}

function readCache(): Puzzle[] | null {
  try {
    const cached = localStorage.getItem(KEY)
    if (!cached) return null
    const parsed: Puzzle[] = JSON.parse(cached)
    return parsed.length ? parsed : null
  } catch { return null }
}

function writeCache(list: Puzzle[]): void {
  try { localStorage.setItem(KEY, JSON.stringify(list)) } catch { /* ignore */ }
}

/** Synchronous build. Kept for tests and for any caller that cannot await. */
export function initCatalog(): void {
  if (puzzles.length) return
  const cached = readCache()
  if (cached) { puzzles = cached; return }
  puzzles = build()
  writeCache(puzzles)
}

/**
 * Build the catalog without freezing the tab.
 *
 * A cold 60-case build costs a few seconds of solid CPU, and doing it inside
 * render meant the player stared at a blank page until it finished. Generating
 * one case per macrotask hands control back to the browser between cases, so
 * the shell paints immediately and progress can be shown. A warm cache still
 * resolves on the first tick.
 */
export async function initCatalogAsync(
  onProgress?: (done: number, total: number) => void,
): Promise<Puzzle[]> {
  if (puzzles.length) return puzzles
  const cached = readCache()
  if (cached) { puzzles = cached; return puzzles }

  const specs = plan()
  const list: Puzzle[] = []
  for (const spec of specs) {
    const built = buildOne(spec)
    if (built) list.push(built)
    onProgress?.(list.length, specs.length)
    // Yield to the event loop so input and paint are not starved.
    await new Promise(resolve => setTimeout(resolve, 0))
  }
  puzzles = list
  writeCache(puzzles)
  return puzzles
}

export function getAllPuzzles(): Puzzle[] {
  if (!puzzles.length) initCatalog()
  return puzzles
}

export function getPuzzleById(id: string): Puzzle | undefined {
  return getAllPuzzles().find(p => p.id === id)
}

/** Generate a fresh one-off puzzle (for a "Random case" button). */
export function makeRandomPuzzle(difficulty: Difficulty): Puzzle {
  reseed(Date.now() ^ Math.floor(Math.random() * 1e9))
  return generatePuzzle(difficulty, `rnd-${Date.now()}`, 'Random Case')
}
