import { generatePuzzle, reseed } from './generate'
import type { Puzzle, Difficulty } from './types'

// ============================================================================
// The catalog: a stable, seeded set of puzzles. Because generation is
// deterministic per seed, the same catalog is produced every run; we also cache
// it in localStorage so reloads are instant and ids stay stable for progress.
// ============================================================================

const SPEC: { difficulty: Difficulty; count: number }[] = [
  { difficulty: 'Very Easy', count: 6 },
  { difficulty: 'Easy', count: 6 },
  { difficulty: 'Medium', count: 6 },
  { difficulty: 'Hard', count: 5 },
  { difficulty: 'Expert', count: 4 },
]

const KEY = 'murdoku_catalog_v11'
let puzzles: Puzzle[] = []

function slug(s: string) { return s.toLowerCase().replace(/\s+/g, '-') }
function hash(s: string) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) } return Math.abs(h) }
function roman(n: number): string {
  const map: [number, string][] = [[10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']]
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
]

function build(): Puzzle[] {
  const list: Puzzle[] = []
  let n = 1
  for (const { difficulty, count } of SPEC) {
    for (let i = 0; i < count; i++) {
      reseed(hash(difficulty) + i * 7919 + 13)
      try {
        const p = generatePuzzle(difficulty, `${slug(difficulty)}-${i + 1}`, `Case No. ${roman(n)}`)
        p.title = UNIQUE_TITLES[(n - 1) % UNIQUE_TITLES.length]  // guarantee distinct titles
        list.push(p)
        n++
      } catch { /* skip a rare failed seed */ }
    }
  }
  return list
}

export function initCatalog(): void {
  if (puzzles.length) return
  try {
    const cached = localStorage.getItem(KEY)
    if (cached) { puzzles = JSON.parse(cached); if (puzzles.length) return }
  } catch { /* ignore */ }
  puzzles = build()
  try { localStorage.setItem(KEY, JSON.stringify(puzzles)) } catch { /* ignore */ }
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
