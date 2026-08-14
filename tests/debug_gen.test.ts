import { describe, it, expect } from 'vitest'
import { reseed } from '../src/core/generate'
import { findMurderer, countSolutions, roomIdAt } from '../src/core/engine'
import { buildRoomsTest, randomPlacementTest } from '../src/core/generate'
// We can't import internals, so let's just check if generatePuzzle itself fails with a try/catch
import { generatePuzzle } from '../src/core/generate'
import type { Difficulty } from '../src/core/types'

describe('debug gen', () => {
  it('generates one Very Easy puzzle with verbose error', () => {
    reseed(42)
    try {
      const p = generatePuzzle('Very Easy', 'test-1', 'Case No. I')
      console.log('SUCCESS: people:', p.people.length, 'size:', p.size, 'rooms:', p.rooms.length)
      expect(p.people.length).toBe(4)
    } catch (e) {
      console.error('FAILED:', e)
      throw e
    }
  })

  it('generates one Master puzzle', () => {
    reseed(999)
    try {
      const p = generatePuzzle('Master', 'test-m', 'Case No. M')
      console.log('SUCCESS: people:', p.people.length, 'size:', p.size, 'rooms:', p.rooms.length)
    } catch (e) {
      console.error('FAILED:', e)
      throw e
    }
  })
})
