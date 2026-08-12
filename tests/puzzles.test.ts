import { describe, expect, it } from 'vitest'
import { getAllPuzzles } from '../src/core/catalog'
import { countSolutions, findMurderer } from '../src/core/engine'

const puzzles = getAllPuzzles()

describe('generated puzzle catalog', () => {
  it('contains the complete 27-case catalog', () => {
    expect(puzzles).toHaveLength(27)
  })

  for (const puzzle of puzzles) {
    it(`${puzzle.caseNumber} ${puzzle.title} has one clue-derived solution, a murderer, and a free label cell in every room`, () => {
      expect(countSolutions(puzzle, 5)).toBe(1)
      expect(findMurderer(puzzle)).toBeTruthy()

      const furnished = new Set(puzzle.furniture.map(item => `${item.row},${item.col}`))
      const fullyFurnishedRooms = puzzle.rooms.filter(room =>
        room.cells.every(cell => furnished.has(`${cell.row},${cell.col}`)),
      )
      expect(fullyFurnishedRooms, 'room labels require at least one furniture-free cell').toEqual([])
    })
  }
})
