import { beforeEach, describe, expect, it } from 'vitest'
import { buildAuthoredPuzzle } from '../src/core/authored'
import { countSolutions } from '../src/core/engine'
import { getAllPuzzles, getPuzzleById } from '../src/core/catalog'
import { DEV_PILOT_CASES } from '../src/lab/pilots/cases'

describe('development pilot fixtures', () => {
  it.each(Object.entries(DEV_PILOT_CASES))('builds a unique playable %s case', (key, spec) => {
    const puzzle = buildAuthoredPuzzle(spec, 'Dev pilot')

    expect(puzzle.id).toBe(`pilot-${key}`)
    expect(puzzle.size).toBe(6)
    expect(puzzle.rooms).toHaveLength(4)
    expect(puzzle.people).toHaveLength(4)
    expect(puzzle.murdererId).toBe('p1')
    expect(countSolutions(puzzle, 2)).toBe(1)
    expect(puzzle.clues.every(({ clue }) => clue.kind !== 'victim' || clue.person === puzzle.victimId)).toBe(true)
    expect(puzzle.rooms.find(room => room.id === 'room0')?.cells).toHaveLength(9)
    expect(puzzle.rooms.find(room => room.id === 'room1')?.cells).toHaveLength(9)
    expect(puzzle.rooms.find(room => room.id === 'room2')?.cells).toHaveLength(9)
    expect(puzzle.rooms.find(room => room.id === 'room3')?.cells).toHaveLength(9)
  })
})

describe('development pilot catalog registration', () => {
  beforeEach(() => {
    localStorage.clear()
    window.history.replaceState({}, '', '/')
  })

  it('adds only the URL-selected pilot to the returned list, without caching it', () => {
    window.history.replaceState({}, '', '/?pilot=cafe')

    const puzzles = getAllPuzzles()
    expect(puzzles).toHaveLength(61)
    expect(puzzles.at(-1)?.id).toBe('pilot-cafe')
    expect(getPuzzleById('pilot-cafe')?.id).toBe('pilot-cafe')

    const cached = JSON.parse(localStorage.getItem('murdoku_catalog_v25') ?? '[]') as { id: string }[]
    expect(cached).toHaveLength(60)
    expect(cached.some(puzzle => puzzle.id.startsWith('pilot-'))).toBe(false)

    window.history.replaceState({}, '', '/')
    expect(getAllPuzzles()).toHaveLength(60)
    expect(getPuzzleById('pilot-cafe')).toBeUndefined()
  })

  it('ignores unsupported pilot query values', () => {
    window.history.replaceState({}, '', '/?pilot=unknown')
    expect(getAllPuzzles()).toHaveLength(60)
  })
})
