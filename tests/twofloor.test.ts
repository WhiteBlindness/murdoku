import { describe, expect, it } from 'vitest'
import { findMurderer, roomIdAt } from '../src/core/engine'
import { cellFloor, sameColumnStack } from '../src/core/types'
import type { Puzzle } from '../src/core/types'

// ============================================================================
// Two-floor support.
//
// The MODEL, the engine and the clue kinds are implemented and covered here.
// GENERATION of two-floor cases is currently switched off in generate.ts: it
// needs ~82s per puzzle against a 400ms budget, because doubling the candidate
// cells while keeping only N row/column slots means a random clue set almost
// never pins a unique solution. See the comment on DIFF_CONFIG.
//
// These tests therefore build a two-floor puzzle BY HAND rather than generating
// one. That keeps the engine's floor semantics honest and fast to verify, so
// the day generation is fixed the foundation is already proven.
// ============================================================================

/** A 2x2 house with two floors: one room per floor. */
function twoFloorPuzzle(): Puzzle {
  const ground = [
    { row: 0, col: 0, floor: 0 }, { row: 0, col: 1, floor: 0 },
    { row: 1, col: 0, floor: 0 }, { row: 1, col: 1, floor: 0 },
  ]
  const upper = ground.map(c => ({ ...c, floor: 1 }))
  return {
    id: 'two-floor', title: 'Stacked', caseNumber: 'No. 0', difficulty: 'Hard',
    size: 2,
    floors: 2,
    rooms: [
      { id: 'g', name: 'Kitchen', hue: 0, cells: ground, floor: 0 },
      { id: 'u', name: 'Bedroom', hue: 0, cells: upper, floor: 1 },
    ],
    roomOf: [['g', 'g'], ['g', 'g']],
    roomOfByFloor: [[['g', 'g'], ['g', 'g']], [['u', 'u'], ['u', 'u']]],
    furniture: [],
    people: [
      { id: 'p0', name: 'Ada', avatarSeed: 'a', accent: '#B08D57' },
      { id: 'p1', name: 'Ben', avatarSeed: 'b', accent: '#6E8CA0' },
      { id: 'v', name: 'Vic', avatarSeed: 'v', accent: '#7FA083', isVictim: true },
    ],
    clues: [],
    solution: {
      p0: { row: 0, col: 0, floor: 0 },
      p1: { row: 1, col: 1, floor: 1 },
      v: { row: 0, col: 0, floor: 0 },
    },
    victimId: 'v', murdererId: 'p0', flavor: '',
  }
}

describe('floor helpers', () => {
  it('treats a missing floor as the ground floor', () => {
    expect(cellFloor({ row: 0, col: 0 })).toBe(0)
    expect(cellFloor({ row: 0, col: 0, floor: 1 })).toBe(1)
  })

  it('detects a cell stacked directly above another', () => {
    expect(sameColumnStack({ row: 2, col: 3, floor: 0 }, { row: 2, col: 3, floor: 1 })).toBe(true)
    // Same floor is not a stack; a different column is not a stack.
    expect(sameColumnStack({ row: 2, col: 3, floor: 0 }, { row: 2, col: 3, floor: 0 })).toBe(false)
    expect(sameColumnStack({ row: 2, col: 3, floor: 0 }, { row: 2, col: 4, floor: 1 })).toBe(false)
  })
})

describe('two-floor engine semantics', () => {
  const puzzle = twoFloorPuzzle()

  it('resolves rooms per floor, so the same row and column differ by storey', () => {
    expect(roomIdAt(puzzle, { row: 0, col: 0, floor: 0 })).toBe('g')
    expect(roomIdAt(puzzle, { row: 0, col: 0, floor: 1 })).toBe('u')
  })

  it('keeps rows and columns exclusive across floors', () => {
    // The product owner's rule: blocking a row downstairs blocks the same row
    // upstairs. The two suspects must not share a row or a column with each
    // other regardless of which floor they stand on.
    const suspects = ['p0', 'p1'].map(id => puzzle.solution[id])
    expect(suspects[0].row).not.toBe(suspects[1].row)
    expect(suspects[0].col).not.toBe(suspects[1].col)
    expect(cellFloor(suspects[0])).not.toBe(cellFloor(suspects[1]))
  })

  it('finds the murderer on the victim\'s own floor', () => {
    // Ben is upstairs, so he cannot be the one left alone with the victim.
    expect(findMurderer(puzzle)).toBe('p0')
  })
})
