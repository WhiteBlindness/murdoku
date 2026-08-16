import { describe, expect, it } from 'vitest'
import { satisfiedClueFlags } from '../src/core/ux'
import { clueHolds } from '../src/core/engine'
import { getAllPuzzles } from '../src/core/catalog'

const puzzles = getAllPuzzles()

describe('satisfied clue flags', () => {
  it('marks every clue satisfied when the real solution is on the board', () => {
    const puzzle = puzzles[0]
    for (const person of puzzle.people) {
      if (person.id === puzzle.victimId) continue
      const flags = satisfiedClueFlags(puzzle, person.id, puzzle.solution, clueHolds)
      expect(flags.every(Boolean), `${person.name} should be fully satisfied`).toBe(true)
    }
  })

  it('never marks a clue satisfied while its people are unplaced', () => {
    const puzzle = puzzles[0]
    const person = puzzle.people.find(p => p.id !== puzzle.victimId)!
    // Nobody on the board at all: no clue can be progress yet.
    const flags = satisfiedClueFlags(puzzle, person.id, {}, clueHolds)
    expect(flags.some(Boolean)).toBe(false)
  })

  it('is derived, not sticky: undoing a placement clears the flag', () => {
    const puzzle = puzzles[0]
    const person = puzzle.people.find(p => p.id !== puzzle.victimId)!
    const placed = satisfiedClueFlags(puzzle, person.id, puzzle.solution, clueHolds)
    const lifted = satisfiedClueFlags(puzzle, person.id, {}, clueHolds)
    expect(placed.some(Boolean)).toBe(true)
    expect(lifted.some(Boolean)).toBe(false)
  })
})
