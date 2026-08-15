import { describe, expect, it } from 'vitest'
import { FURNITURE_ICON, FURNITURE_SCALE } from '../src/core/furniture'
import type { FurnitureType } from '../src/core/types'

/**
 * Relative size is a design requirement, not a detail: "even now the tv is
 * bigger than shower or even sofa, this is really important."
 *
 * Every icon used to fill its own 100x100 viewBox, so a lamp rendered as large
 * as a bed and the board read as a sheet of icons rather than a furnished room.
 * These assertions pin the ORDERING, not exact numbers, so the artwork can keep
 * being tuned without silently losing the property that motivated it.
 */
describe('furniture proportions', () => {
  it('covers every furniture type exactly once', () => {
    const types = Object.keys(FURNITURE_ICON) as FurnitureType[]
    for (const type of types) {
      expect(FURNITURE_SCALE[type], `${type} has no scale`).toBeGreaterThan(0)
      expect(FURNITURE_SCALE[type], `${type} scale must fit its cell`).toBeLessThanOrEqual(1)
    }
    expect(Object.keys(FURNITURE_SCALE).sort()).toEqual([...types].sort())
  })

  const bigger = (a: FurnitureType, b: FurnitureType) => {
    it(`${a} is drawn larger than ${b}`, () => {
      expect(FURNITURE_SCALE[a]).toBeGreaterThan(FURNITURE_SCALE[b])
    })
  }

  // The reported defect, stated directly.
  bigger('sofa', 'tv')
  bigger('bathtub', 'tv')
  bigger('bed', 'tv')

  // A lamp is a tabletop object; it must never rival the furniture.
  bigger('sofa', 'lamp')
  bigger('bed', 'lamp')
  bigger('table', 'lamp')
  bigger('chair', 'lamp')

  // Seating hierarchy: a sofa seats three, an armchair seats one.
  bigger('sofa', 'chair')

  // Room-sized pieces outrank fixtures and small props.
  bigger('bed', 'toilet')
  bigger('bookshelf', 'clock')
  bigger('counter', 'plant')

  it('makes the lamp the smallest piece on the board', () => {
    const smallest = Object.entries(FURNITURE_SCALE)
      .sort(([, a], [, b]) => a - b)[0][0]
    expect(smallest).toBe('lamp')
  })

  it('keeps every piece visible: nothing shrinks into a speck', () => {
    for (const [type, scale] of Object.entries(FURNITURE_SCALE)) {
      expect(scale, `${type} would be unreadable at a 45px cell`).toBeGreaterThanOrEqual(0.3)
    }
  })
})
