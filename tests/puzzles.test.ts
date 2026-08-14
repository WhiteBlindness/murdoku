import { describe, expect, it } from 'vitest'
import { getAllPuzzles } from '../src/core/catalog'
import { countSolutions, findMurderer } from '../src/core/engine'
import { furnitureCells } from '../src/core/types'

const puzzles = getAllPuzzles()

describe('generated puzzle catalog', () => {
  it('contains the complete 60-case catalog', () => {
    expect(puzzles).toHaveLength(60)
  })

  it('gives every case a distinct title and case number', () => {
    expect(new Set(puzzles.map(p => p.title)).size).toBe(puzzles.length)
    expect(new Set(puzzles.map(p => p.caseNumber)).size).toBe(puzzles.length)
  })

  it('escalates board size across the difficulty ladder', () => {
    const sizesFor = (difficulty: string) =>
      new Set(puzzles.filter(p => p.difficulty === difficulty).map(p => p.size))
    expect(sizesFor('Very Easy')).toEqual(new Set([6]))
    expect(sizesFor('Expert')).toEqual(new Set([9]))
    expect(sizesFor('Master')).toEqual(new Set([10]))
  })

  it('never hands a Master suspect a bare room clue', () => {
    // Master's whole identity is that "In the Study" is off the table, so every
    // suspect must be triangulated rather than read off a single card.
    const master = puzzles.filter(p => p.difficulty === 'Master')
    expect(master.length).toBeGreaterThan(0)
    for (const puzzle of master) {
      expect(puzzle.clues.every(({ clue }) => clue.kind !== 'room'), puzzle.title).toBe(true)
    }
  })

  for (const puzzle of puzzles) {
    it(`${puzzle.caseNumber} ${puzzle.title} has one clue-derived solution, a murderer, and a free label cell in every room`, () => {
      expect(countSolutions(puzzle, 5)).toBe(1)
      expect(findMurderer(puzzle)).toBeTruthy()

      // Build the set of ALL cells covered by any furniture piece (including multi-cell footprints).
      const furnished = new Set(puzzle.furniture.flatMap(item => furnitureCells(item).map(c => `${c.row},${c.col}`)))
      const fullyFurnishedRooms = puzzle.rooms.filter(room =>
        room.cells.every(cell => furnished.has(`${cell.row},${cell.col}`)),
      )
      expect(fullyFurnishedRooms, 'room labels require at least one furniture-free cell').toEqual([])
    })
  }
})
