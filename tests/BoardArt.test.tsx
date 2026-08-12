import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { FURNITURE_ICON } from '../src/core/furniture'
import type { FurnitureType } from '../src/core/types'
import { ROOM_MATERIALS, floorStyle, isDarkFloor, roomMaterial } from '../src/core/roomMaterials'

const furnitureTypes = Object.keys(FURNITURE_ICON) as FurnitureType[]
const roomNames = [
  'Kitchen', 'Bathroom', 'Pantry', 'Living Room', 'Dining Room', 'Study',
  'Office', 'Bedroom', 'Hallway', 'Front Yard', 'Garden', 'Porch',
]

describe('premium board furniture art', () => {
  it('keeps the complete 19-icon library mapped and authored as layered SVG', () => {
    expect(furnitureTypes).toHaveLength(19)

    for (const type of furnitureTypes) {
      const Icon = FURNITURE_ICON[type]
      const { container, unmount } = render(<Icon size={112} />)
      const svg = container.querySelector('svg')
      expect(svg, `${type} should render an SVG`).not.toBeNull()
      expect(svg?.querySelector('linearGradient, radialGradient'), `${type} should use tonal depth`).not.toBeNull()
      expect(svg?.querySelector('filter'), `${type} should use a soft shadow`).not.toBeNull()

      const markup = svg?.outerHTML ?? ''
      expect(markup).not.toMatch(/stroke\s*=\s*["'](?:black|#000(?:000)?)\b/i)
      expect(markup).not.toMatch(/stroke-width\s*=\s*["'](?:[3-9]|[1-9]\d+(?:\.\d+)?)\b/i)
      unmount()
    }
  })
})

describe('premium room materials', () => {
  it('maps every mansion room to a distinct layered material without data URI tiles', () => {
    const materials = roomNames.map(roomMaterial)
    expect(new Set(materials).size).toBe(12)
    expect(Object.keys(ROOM_MATERIALS)).toHaveLength(12)

    for (const material of materials) {
      const style = floorStyle(material)
      expect(style.backgroundImage).toMatch(/(?:linear|radial)-gradient/)
      expect(style.backgroundImage).not.toMatch(/data:image/i)
      expect(style.backgroundImage).not.toMatch(/#000(?:000)?/i)
    }
    expect(isDarkFloor(roomMaterial('Study'))).toBe(true)
    expect(isDarkFloor(roomMaterial('Bathroom'))).toBe(false)
  })
})
