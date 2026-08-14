import { describe, expect, it } from 'vitest'
import { getAllPuzzles } from '../src/core/catalog'
import { deriveEliminations } from '../src/core/engine'
import { advanceStreak, computeBadges, dailyPuzzle, todayStamp } from '../src/core/daily'
import type { StreakState } from '../src/core/daily'
import { buildShareText } from '../src/core/share'

const puzzles = getAllPuzzles()

describe('daily case', () => {
  it('gives everyone the same case on the same day, and varies across the week', () => {
    expect(dailyPuzzle(puzzles, '2026-08-14')?.id).toBe(dailyPuzzle(puzzles, '2026-08-14')?.id)
    const week = new Set(
      ['2026-08-14', '2026-08-15', '2026-08-16', '2026-08-17', '2026-08-18']
        .map(stamp => dailyPuzzle(puzzles, stamp)?.id),
    )
    expect(week.size).toBeGreaterThan(1)
  })

  it('selects over a stable order rather than delivery order', () => {
    // Selection sorts by case id, so the same date resolves to the same case
    // no matter what order the catalog hands the puzzles over in.
    const shuffled = [...puzzles].reverse()
    expect(dailyPuzzle(shuffled, '2026-08-14')?.id).toBe(dailyPuzzle(puzzles, '2026-08-14')?.id)
  })

  it('returns null rather than throwing on an empty catalog', () => {
    expect(dailyPuzzle([], todayStamp())).toBeNull()
  })
})

describe('streaks', () => {
  const empty: StreakState = { lastSolved: null, current: 0, best: 0 }

  it('starts at one and counts consecutive days', () => {
    const day1 = advanceStreak(empty, '2026-08-14')
    expect(day1).toEqual({ lastSolved: '2026-08-14', current: 1, best: 1 })
    expect(advanceStreak(day1, '2026-08-15')).toEqual({ lastSolved: '2026-08-15', current: 2, best: 2 })
  })

  it('does not double-count a second solve on the same day', () => {
    const day1 = advanceStreak(empty, '2026-08-14')
    expect(advanceStreak(day1, '2026-08-14')).toBe(day1)
  })

  it('restarts at one after a missed day but keeps the best', () => {
    const run = advanceStreak(advanceStreak(advanceStreak(empty, '2026-08-01'), '2026-08-02'), '2026-08-03')
    expect(run.current).toBe(3)
    const afterGap = advanceStreak(run, '2026-08-09')
    expect(afterGap.current).toBe(1)
    expect(afterGap.best).toBe(3)
  })
})

describe('badges', () => {
  const streak: StreakState = { lastSolved: null, current: 0, best: 0 }

  it('earns nothing on a fresh profile but still describes every goal', () => {
    const badges = computeBadges({ puzzles, completedIds: [], records: {}, streak })
    expect(badges.every(b => !b.earned)).toBe(true)
    expect(badges.every(b => b.name.length > 0 && b.description.length > 0)).toBe(true)
  })

  it('derives badges from one clean, fast solve', () => {
    const first = puzzles[0]
    const badges = computeBadges({
      puzzles,
      completedIds: [first.id],
      records: { [first.id]: { bestSeconds: 95, hints: 3 } },
      streak,
    })
    const earned = new Set(badges.filter(b => b.earned).map(b => b.id))
    expect(earned.has('first-case')).toBe(true)
    expect(earned.has('unaided')).toBe(true)
    expect(earned.has('quick')).toBe(true)      // 95s is under two minutes
    expect(earned.has('complete')).toBe(false)
  })
})

describe('share card', () => {
  const puzzle = puzzles.find(p => p.difficulty === 'Master')!

  it('carries the result without leaking any of the answer', () => {
    const text = buildShareText({
      caseNumber: puzzle.caseNumber,
      difficulty: puzzle.difficulty,
      size: puzzle.size,
      seconds: 754,
      hintsLeft: 2,
      hintsTotal: 3,
      streak: 4,
    })

    expect(text).toContain(puzzle.caseNumber)
    expect(text).toContain('12:34')
    expect(text).toContain('Streak 4 days')

    // Nothing that shortens the puzzle for whoever reads the card.
    expect(text).not.toContain(puzzle.title)
    for (const person of puzzle.people) expect(text).not.toContain(person.name)
    for (const room of puzzle.rooms) expect(text).not.toContain(room.name)
    for (const { text: clueText } of puzzle.clues) expect(text).not.toContain(clueText)
  })

  it('omits a streak that is not worth stating', () => {
    const text = buildShareText({
      caseNumber: 'Case No. I', difficulty: 'Easy', size: 5,
      seconds: 30, hintsLeft: 3, hintsTotal: 3, streak: 1,
    })
    expect(text).not.toMatch(/Streak/)
  })
})

describe('logic assistant eliminations', () => {
  // The assistant crosses cells off as impossible. If it were ever wrong it
  // would make a solvable case unsolvable, so soundness matters most.
  it('never crosses off a cell the real solution uses', () => {
    for (const puzzle of puzzles.slice(0, 12)) {
      const people = puzzle.people
      const placed: Record<string, { row: number; col: number }> = {}
      for (const person of people.slice(0, Math.floor(people.length / 2))) {
        placed[person.id] = puzzle.solution[person.id]
      }

      const eliminated = new Set(
        deriveEliminations(puzzle, placed).map(cell => `${cell.row},${cell.col}`),
      )
      for (const person of people) {
        if (placed[person.id]) continue
        const truth = puzzle.solution[person.id]
        expect(
          eliminated.has(`${truth.row},${truth.col}`),
          `${puzzle.caseNumber}: eliminated ${person.name}'s real cell`,
        ).toBe(false)
      }
    }
  })

  it('crosses off the row and column of a placed suspect', () => {
    const puzzle = puzzles[0]
    const first = puzzle.people[0]
    const seat = puzzle.solution[first.id]
    const keys = new Set(
      deriveEliminations(puzzle, { [first.id]: seat }).map(cell => `${cell.row},${cell.col}`),
    )

    for (let i = 0; i < puzzle.size; i++) {
      if (i !== seat.col) expect(keys.has(`${seat.row},${i}`)).toBe(true)
      if (i !== seat.row) expect(keys.has(`${i},${seat.col}`)).toBe(true)
    }
    // The occupied cell itself is not an elimination — somebody is standing there.
    expect(keys.has(`${seat.row},${seat.col}`)).toBe(false)
  })
})
