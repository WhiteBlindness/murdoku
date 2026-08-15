import { describe, expect, it } from 'vitest'
import { findFailingClues } from '../src/core/ux'
import { clueHolds, findMurderer } from '../src/core/engine'
import { getAllPuzzles } from '../src/core/catalog'

const puzzles = getAllPuzzles()

describe('accusation diagnostics', () => {
  it('reports nothing when the real solution is submitted', () => {
    for (const puzzle of puzzles.slice(0, 6)) {
      expect(findFailingClues(puzzle, puzzle.solution, clueHolds), puzzle.caseNumber).toEqual([])
      expect(findMurderer(puzzle)).toBeTruthy()
    }
  })

  it('names a broken rule when two suspects are swapped', () => {
    const puzzle = puzzles.find(p => p.people.length >= 3)!
    const [a, b] = puzzle.people.filter(p => p.id !== puzzle.victimId).slice(0, 2)
    const swapped = { ...puzzle.solution, [a.id]: puzzle.solution[b.id], [b.id]: puzzle.solution[a.id] }
    const failing = findFailingClues(puzzle, swapped, clueHolds)
    expect(failing.length).toBeGreaterThan(0)
    // It must name a RULE, never a cell: the player still has to work out why.
    for (const f of failing) {
      expect(typeof f.text).toBe('string')
      expect(f.text.length).toBeGreaterThan(0)
    }
  })

  it('does not blame a clue whose people are not all placed yet', () => {
    const puzzle = puzzles[0]
    const first = puzzle.people[0]
    const partial = { [first.id]: puzzle.solution[first.id] }
    const failing = findFailingClues(puzzle, partial, clueHolds)
    for (const { clue } of failing) {
      expect(partial[clue.person], 'blamed an unplaced suspect').toBeTruthy()
    }
  })
})
