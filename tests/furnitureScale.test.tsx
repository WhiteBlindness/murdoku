import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import MapGrid from '../src/components/MapGrid'
import { FURNITURE_ICON, FURNITURE_SCALE } from '../src/core/furniture'
import type { FurnitureType, Puzzle, CellMark } from '../src/core/types'

/**
 * FILL-FACTOR RULE (2026 revision):
 *
 * Every piece nearly fills its footprint. Size differences are carried by HOW
 * MANY SQUARES a piece occupies (footprint), not by shrinking its glyph inside
 * a fixed square. A bed is big because it covers 2×2; a lamp is small because
 * it covers 1×1 — not because its glyph is drawn at one-third scale.
 *
 * REJECTED MODEL (do not reintroduce): the old code used FURNITURE_SCALE as a
 * "real-world size" signal — lamp 0.33, plant 0.50, tv 0.60 — so every icon was
 * intentionally shrunk to look like a smaller object. The user explicitly
 * rejected this: "objects should be centered in the square and should occupy
 * almost all of the square; the perspective part is that the rooms should have
 * more squares, not the squares stay the same but objects are smaller."
 */
describe('furniture fill-factor (uniform high-fill model)', () => {
  it('covers every furniture type exactly once', () => {
    const types = Object.keys(FURNITURE_ICON) as FurnitureType[]
    for (const type of types) {
      expect(FURNITURE_SCALE[type], `${type} has no scale`).toBeGreaterThan(0)
      expect(FURNITURE_SCALE[type], `${type} scale must fit its cell`).toBeLessThanOrEqual(1)
    }
    expect(Object.keys(FURNITURE_SCALE).sort()).toEqual([...types].sort())
  })

  it('every type has a high fill factor (>= 0.90) — nothing reads as a toy', () => {
    for (const [type, scale] of Object.entries(FURNITURE_SCALE)) {
      expect(
        scale,
        `${type} has fill factor ${scale.toFixed(2)} — too low; the user rejected the shrink-to-signify model. ` +
        'All pieces must nearly fill their footprint (>= 0.90).',
      ).toBeGreaterThanOrEqual(0.90)
    }
  })

  it('fill factors are uniform within a tight tolerance (max spread <= 0.10)', () => {
    const values = Object.values(FURNITURE_SCALE)
    const min = Math.min(...values)
    const max = Math.max(...values)
    expect(
      max - min,
      `Fill factor spread ${(max - min).toFixed(3)} is too wide. ` +
      'Size differences must come from footprint (cells occupied), not from icon scale.',
    ).toBeLessThanOrEqual(0.10)
  })
})

/**
 * GEOMETRY: a furniture icon must fill its footprint and never spill out of it.
 *
 * HONEST LIMITS OF THIS TEST. jsdom does no layout — every element measures
 * 0×0 — so this CANNOT assert real geometry. It asserts the CSS contract that
 * produces the geometry, and the geometry itself was verified by measuring
 * bounding boxes in a real browser. Do not read a pass here as proof the board
 * looks right; it only proves the mechanism is still wired the intended way.
 *
 * The contract is an inset box: the icon wrapper is absolutely positioned and
 * inset from the footprint on both axes. Inset percentages resolve per-axis,
 * so the box matches the footprint minus a thin margin for ANY footprint shape.
 *
 * Two earlier mechanisms failed, both caught by measuring the live board:
 *   1. `height: N%` did not resolve against the grid row, so plant and toilet
 *      fell back to their SVG's intrinsic ratio at 112% of a cell tall.
 *   2. `aspectRatio: 1/1` fixed those two but broke every 2×1 piece — 94% of a
 *      2-cell width at a 1:1 ratio is 1.88 cells tall inside a 1-cell row, so
 *      sofa, table, bathtub, bookshelf and counter all spilled downward.
 * A test that only checked "is aspectRatio set" would have passed for case 2.
 */
describe('furniture icon geometry — fills its footprint, never spills', () => {
  function makePuzzle(type: FurnitureType): Puzzle {
    const cells = [0, 1, 2, 3].flatMap(row => [0, 1, 2, 3].map(col => ({ row, col })))
    return {
      id: 'geom-test',
      title: 'Geometry test',
      caseNumber: '00',
      difficulty: 'Easy',
      size: 4,
      rooms: [{ id: 'r', name: 'Study', hue: 0, cells }],
      roomOf: Array.from({ length: 4 }, () => Array.from({ length: 4 }, () => 'r')),
      furniture: [{ type, row: 1, col: 1 }],
      people: [],
      clues: [],
      solution: {},
      victimId: '',
      murdererId: '',
      flavor: '',
    }
  }

  const emptyMarks: CellMark[][] = Array.from({ length: 4 }, () =>
    Array.from({ length: 4 }, () => ({ kind: 'empty' as const })),
  )

  it('insets the icon box from its footprint on both axes, for every furniture type', () => {
    const types = Object.keys(FURNITURE_ICON) as FurnitureType[]

    for (const type of types) {
      const { container, unmount } = render(
        <MapGrid
          puzzle={makePuzzle(type)}
          marks={emptyMarks}
          conflicts={new Set()}
          onCellClick={() => undefined}
        />,
      )

      // Overlay structure: outer span (spans the footprint) > inner span (icon
      // box) > <Icon/> (SVG at width/height 100%). The inner span's positioning
      // is what decides the rendered geometry.
      const overlaySpans = container.querySelectorAll<HTMLElement>('[aria-hidden] > span[data-furniture-icon]')
      expect(overlaySpans.length, `${type}: furniture overlay span not found`).toBeGreaterThan(0)

      const outerSpan = overlaySpans[0]
      const innerSpan = outerSpan.querySelector<HTMLElement>('span')
      expect(innerSpan, `${type}: inner icon wrapper span not found`).not.toBeNull()

      // The footprint span must establish the containing block the inset resolves against.
      expect(
        outerSpan.style.position,
        `${type}: the footprint span must be position:relative, or the icon box's inset ` +
        'resolves against an ancestor and the piece lands in the wrong place.',
      ).toBe('relative')

      expect(
        innerSpan!.style.position,
        `${type}: the icon box must be absolutely positioned so its inset applies per-axis.`,
      ).toBe('absolute')

      // A single inset value constrains BOTH axes independently, which is what
      // makes this correct for 1×1, 2×1, 1×2 and 2×2 alike. Width-only sizing
      // (height:N%, or aspectRatio with a % width) has shipped broken twice.
      const inset = innerSpan!.style.inset
      expect(
        inset,
        `${type}: the icon box needs a percentage inset on all four sides. ` +
        'Sizing by width alone overflows non-square footprints.',
      ).toMatch(/^\d+(\.\d+)?%$/)

      const margin = Number.parseFloat(inset)
      expect(
        margin,
        `${type}: inset ${inset} leaves the piece too small. The user rejected ` +
        'objects that do not nearly fill their square.',
      ).toBeLessThanOrEqual(5)

      expect(innerSpan!.style.width, `${type}: must not re-introduce width-based sizing`).toBe('')
      expect(innerSpan!.style.aspectRatio, `${type}: must not re-introduce ratio-based sizing`).toBe('')

      unmount()
    }
  })
})
