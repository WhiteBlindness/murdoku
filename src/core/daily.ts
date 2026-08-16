import type { Puzzle } from './types'

// ============================================================================
// The daily case, the solve streak, and the badge set.
//
// All three are derived from data the game already keeps (the seeded catalog,
// `completedIds`, and `records`), so nothing here needs authoring per case and
// nothing goes stale when the catalog grows.
// ============================================================================

export const STREAK_KEY = 'murdoku_streak_v1'

/**
 * A local YYYY-MM-DD stamp. Deliberately local rather than UTC: the daily case
 * must turn over at the player's midnight, not at 01:00 for anyone east of GMT.
 */
export function todayStamp(date: Date = new Date()): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function hashStamp(stamp: string): number {
  let h = 2166136261
  for (let i = 0; i < stamp.length; i++) { h ^= stamp.charCodeAt(i); h = Math.imul(h, 16777619) }
  return Math.abs(h)
}

/**
 * The case everyone gets today.
 *
 * Hard/Expert/Master cases are two-storey (floors >= 2) and the daily is
 * always drawn from that pool — it is the most complete expression of the
 * puzzle. The three load-bearing guarantees are preserved:
 *
 *   1. Everyone gets the same case on the same date — the stamp is hashed
 *      deterministically and the same stamp always yields the same index.
 *   2. The pool is sorted by id (STABLE ORDER) before hashing so adding new
 *      cases to the catalog cannot silently reshuffle past dates.
 *   3. The stamp is local, not UTC — `todayStamp` uses the player's clock so
 *      the case rolls over at their midnight, not at 01:00 for GMT+1 players.
 *
 * Fallback: if the catalog contains no two-storey puzzles at all (possible in
 * tests and in a degraded catalog), the full ordered list is used so a daily
 * case always exists. This is distinct from an empty catalog, which returns null.
 */
export function dailyPuzzle(puzzles: Puzzle[], stamp: string = todayStamp()): Puzzle | null {
  if (!puzzles.length) return null
  const ordered = [...puzzles].sort((a, b) => a.id.localeCompare(b.id))
  const twoStorey = ordered.filter(p => (p.floors ?? 1) >= 2)
  const pool = twoStorey.length ? twoStorey : ordered
  return pool[hashStamp(stamp) % pool.length]
}

export interface StreakState {
  /** Last date the daily case was solved, as YYYY-MM-DD. */
  lastSolved: string | null
  current: number
  best: number
}

const EMPTY_STREAK: StreakState = { lastSolved: null, current: 0, best: 0 }

function isStreakState(value: unknown): value is StreakState {
  if (typeof value !== 'object' || value === null) return false
  const candidate = value as Record<string, unknown>
  return (candidate.lastSolved === null || typeof candidate.lastSolved === 'string')
    && typeof candidate.current === 'number'
    && typeof candidate.best === 'number'
}

export function loadStreak(): StreakState {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STREAK_KEY) ?? 'null')
    return isStreakState(parsed) ? parsed : EMPTY_STREAK
  } catch { return EMPTY_STREAK }
}

function daysBetween(from: string, to: string): number {
  const a = Date.parse(`${from}T00:00:00`)
  const b = Date.parse(`${to}T00:00:00`)
  if (Number.isNaN(a) || Number.isNaN(b)) return Number.NaN
  return Math.round((b - a) / 86_400_000)
}

/**
 * Fold today's daily solve into a streak.
 *
 * Pure, so it is testable without a clock or storage. Solving the same day
 * twice is a no-op rather than a double count, and a gap of two or more days
 * restarts at 1 rather than 0 — the player did just solve one.
 */
export function advanceStreak(previous: StreakState, stamp: string): StreakState {
  if (previous.lastSolved === stamp) return previous
  const gap = previous.lastSolved ? daysBetween(previous.lastSolved, stamp) : Number.NaN
  const current = gap === 1 ? previous.current + 1 : 1
  return { lastSolved: stamp, current, best: Math.max(previous.best, current) }
}

export function saveStreak(state: StreakState): void {
  try { localStorage.setItem(STREAK_KEY, JSON.stringify(state)) } catch { /* ignore */ }
}

/** A streak is only live if the last solve was today or yesterday. */
export function streakIsLive(state: StreakState, stamp: string = todayStamp()): boolean {
  if (!state.lastSolved) return false
  const gap = daysBetween(state.lastSolved, stamp)
  return gap === 0 || gap === 1
}

// --- badges -----------------------------------------------------------------

export interface Badge {
  id: string
  name: string
  description: string
  earned: boolean
}

export interface BadgeInput {
  puzzles: Puzzle[]
  completedIds: string[]
  records: Record<string, { bestSeconds: number; hints: number }>
  streak: StreakState
}

/** Hints a case starts with; a record still holding all three means an unaided solve. */
const HINTS_START = 3

/**
 * Badges are computed, never stored. Each one is a question answered from
 * `completedIds` + `records`, so there is no separate badge state to corrupt,
 * migrate, or disagree with the player's actual solve history.
 */
export function computeBadges({ puzzles, completedIds, records, streak }: BadgeInput): Badge[] {
  const solved = new Set(completedIds)
  const solvedPuzzles = puzzles.filter(p => solved.has(p.id))
  const clearedTier = (difficulty: string) => solvedPuzzles.some(p => p.difficulty === difficulty)
  const bestTimes = Object.entries(records)
    .filter(([id]) => solved.has(id))
    .map(([, record]) => record.bestSeconds)
  const unaided = solvedPuzzles.some(p => records[p.id]?.hints === HINTS_START)

  const badge = (id: string, name: string, description: string, earned: boolean): Badge =>
    ({ id, name, description, earned })

  return [
    badge('first-case', 'Case Opened', 'Solve your first case.', solvedPuzzles.length >= 1),
    badge('ten-cases', 'Ten Closed', 'Solve ten cases.', solvedPuzzles.length >= 10),
    badge('expert', 'Expert Witness', 'Solve an Expert case.', clearedTier('Expert')),
    badge('master', 'Master Detective', 'Solve a Master case.', clearedTier('Master')),
    badge('unaided', 'No Assistance', 'Solve a case without spending a hint.', unaided),
    badge('quick', 'Open and Shut', 'Solve a case in under two minutes.', bestTimes.some(s => s < 120)),
    badge('streak', 'Regular Caller', 'Hold a seven-day daily streak.', streak.best >= 7),
    badge('complete', 'Full Ledger', 'Solve every case in the index.',
      puzzles.length > 0 && solvedPuzzles.length >= puzzles.length),
  ]
}
