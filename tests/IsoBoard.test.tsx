import { fireEvent, render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import IsoBoard from '../src/components/IsoBoard'
import type { Furniture } from '../src/core/types'
import {
  getSceneDecor,
  getSceneFloorAccents,
  getSceneFloorFinishes,
  getSceneFurnitureVisual,
  getSceneWalls,
} from '../src/core/handScenes'
import { TILE_H, TILE_W } from '../src/core/kenneySprites'
import { buildAuthoredPuzzle } from '../src/core/authored'
import { AUTHORED_CASES } from '../src/data/cases'
import { emptyMarks, makePuzzle } from './fixtures'

function renderBoard({
  id = 'very-easy-1',
  armedPerson = null,
  marks = emptyMarks(6),
  furniture = [{ type: 'bed', row: 0, col: 0, w: 2, h: 1 } as Furniture],
}: {
  id?: string
  armedPerson?: string | null
  marks?: ReturnType<typeof emptyMarks>
  furniture?: Furniture[]
} = {}) {
  const roomOf = Array.from({ length: 6 }, () => Array(6).fill('house'))
  const puzzle = makePuzzle({
    id,
    size: 6,
    rooms: [{ id: 'house', name: 'House', hue: 20, cells: [] }],
    roomOf,
    furniture,
  })
  return render(<IsoBoard puzzle={puzzle} marks={marks} conflicts={new Set()} onCellClick={vi.fn()} armedPerson={armedPerson} />)
}

function renderMidnightDelivery() {
  const puzzle = buildAuthoredPuzzle(AUTHORED_CASES['very-easy-1'], 'Case No. I')
  return render(
    <IsoBoard
      puzzle={puzzle}
      marks={emptyMarks(puzzle.size)}
      conflicts={new Set()}
      onCellClick={vi.fn()}
    />,
  )
}

describe('Midnight Delivery scene architecture', () => {
  it('maps each board wall axis to the proven interior-facing sprite family', () => {
    const walls = getSceneWalls('very-easy-1')
    expect(walls.filter(w => w.kind === 'edge' && w.edge === 'A').every(w => /_NW$/.test(w.file))).toBe(true)
    expect(walls.filter(w => w.kind === 'edge' && w.edge === 'B').every(w => /_NE$/.test(w.file))).toBe(true)
    expect(walls.find(w => w.kind === 'corner')?.file).toBe('wallCorner_NW')
  })

  it('keeps native exterior sprites but merges interior partitions into continuous cutaway runs', () => {
    const walls = getSceneWalls('very-easy-1')
    expect(walls.filter(w => w.render === 'native')).toHaveLength(13)
    expect(walls.filter(w => w.render === 'cutaway')).toHaveLength(6)
    expect(walls.filter(w => w.render === 'cutaway').every(w => (w.span ?? 1) > 1)).toBe(true)
    expect(walls.filter(w => w.kind === 'corner').every(w => w.render === 'native')).toBe(true)
    expect(walls.some(w => w.kind === 'corner' && w.row === 2 && w.col === 3)).toBe(false)
    expect(walls.some(w => w.kind === 'corner' && w.row === 3 && w.col === 3)).toBe(false)
  })

  it('keeps Midnight Delivery scene data isolated from every other case', () => {
    const otherFurniture: Furniture = { type: 'lamp', row: 0, col: 0, w: 1, h: 1 }
    expect(getSceneWalls('very-easy-2')).toEqual([])
    expect(getSceneDecor('very-easy-2')).toEqual([])
    expect(getSceneFloorAccents('very-easy-2')).toEqual([])
    expect(getSceneFurnitureVisual('very-easy-2', otherFurniture)).toBeUndefined()
  })

  it('completes the rear west shell at the shared back corner', () => {
    expect(getSceneWalls('very-easy-1')).toContainEqual(expect.objectContaining({
      kind: 'edge', edge: 'B', row: 0, col: 0, file: 'wall_NE', render: 'native',
    }))
  })
  it('separates the living room and kitchen with an intentional doorway', () => {
    const seam = getSceneWalls('very-easy-1').find(
      w => w.kind === 'edge' && w.edge === 'B' && w.col === 3 && w.row === 3,
    )
    expect(seam).toEqual(expect.objectContaining({
      file: 'wallDoorway_NE', span: 3, doorwayIndex: 1, doorwayWidth: 0.66,
    }))
  })

  it('keeps every raised prop on a supporting surface and removes overlapping floor clutter', () => {
    const decor = getSceneDecor('very-easy-1')
    expect(decor).toEqual(expect.arrayContaining([
      expect.objectContaining({ file: 'kitchenMicrowave', row: 3, col: 4, lift: expect.any(Number) }),
      expect.objectContaining({ file: 'laptop', row: 0, col: 3, lift: expect.any(Number) }),
      expect.objectContaining({ file: 'books', row: 1, col: 5, lift: expect.any(Number) }),
    ]))
    expect(decor.some(d => ['sideTable', 'pottedPlant', 'loungeChair', 'trashcan', 'cardboardBoxClosed'].includes(d.file))).toBe(false)
    expect(decor.every(d => d.scale === undefined || d.scale >= 1)).toBe(true)
  })

  it('defines five room-scale finishes and one purposeful living-room accent', () => {
    expect(getSceneFloorFinishes('very-easy-1').map(f => f.room)).toEqual([
      'Bedroom', 'Office', 'Hallway', 'Living Room', 'Kitchen',
    ])
    expect(new Set(getSceneFloorFinishes('very-easy-1').map(f => f.material)).size).toBe(5)
    expect(getSceneFloorAccents('very-easy-1').map(a => a.id)).toEqual(['living-rug'])
    expect(getSceneFloorFinishes('very-easy-2')).toEqual([])
  })

  it('turns the fixed two-cell counter into a sink-and-cabinet visual run', () => {
    expect(getSceneFurnitureVisual('very-easy-1', {
      type: 'counter', row: 3, col: 3, w: 2, h: 1, rotation: 0,
    })).toEqual(expect.objectContaining({
      modules: [
        expect.objectContaining({ file: 'kitchenSink', row: 3, col: 3 }),
        expect.objectContaining({ file: 'kitchenCabinet', row: 3, col: 4 }),
      ],
    }))
  })
  it('uses scene-only grounding and scale overrides for the remaining weak props', () => {
    expect(getSceneFurnitureVisual('very-easy-1', {
      type: 'bed', row: 0, col: 0, w: 2, h: 1,
    })).toEqual(expect.objectContaining({
      groundOffsetY: 5, shadowScale: 0.5, shadowOpacity: 0.5, shadowBlur: 1.6,
    }))
    expect(getSceneFurnitureVisual('very-easy-1', {
      type: 'sofa', row: 3, col: 0, w: 1, h: 2,
    })).toEqual(expect.objectContaining({
      groundOffsetY: 4, shadowScale: 0.48, shadowOpacity: 0.52, shadowBlur: 1.6,
    }))
    expect(getSceneFurnitureVisual('very-easy-1', {
      type: 'lamp', row: 0, col: 2, w: 1, h: 1,
    })).toEqual(expect.objectContaining({
      modules: [
        expect.objectContaining({ file: 'sideTable', row: 0, col: 2, scale: 0.65 }),
        expect.objectContaining({ file: 'lampRoundTable', row: 0, col: 2, lift: 54 }),
      ],
    }))
    expect(getSceneFurnitureVisual('very-easy-1', {
      type: 'plant', row: 3, col: 2, w: 1, h: 1,
    })).toEqual(expect.objectContaining({ scale: 1.6 }))
  })
})

describe('IsoBoard geometry and interaction states', () => {
  it('renders one exact continuous six-by-six floor polygon without per-cell slabs', () => {
    const { container } = renderBoard()
    const floor = container.querySelector('[data-floor-surface]')
    expect(floor).toHaveAttribute('points', `${3 * TILE_W},150 ${6 * TILE_W},${150 + 3 * TILE_H} ${3 * TILE_W},${150 + 6 * TILE_H} 0,${150 + 3 * TILE_H}`)
    expect(container.querySelectorAll('[data-floor-cell]')).toHaveLength(0)
  })

  it('renders the five room finishes as room-scale polygons without permanent labels', () => {
    const { container } = renderMidnightDelivery()
    expect(container.querySelectorAll('[data-room-floor]')).toHaveLength(5)
    expect(container.querySelectorAll('[data-floor-accent]')).toHaveLength(1)
    expect(container.querySelectorAll('[data-room-label]')).toHaveLength(0)
  })

  it('renders interior partitions as cutaway vectors with visible doorway openings', () => {
    const { container } = renderMidnightDelivery()
    expect(container.querySelectorAll('[data-wall-render="native"]')).toHaveLength(13)
    expect(container.querySelectorAll('[data-wall-render="cutaway"]')).toHaveLength(6)
    expect(container.querySelectorAll('[data-doorway-opening]')).toHaveLength(5)
    expect(container.querySelectorAll('[data-wall-height="98"]')).toHaveLength(6)
    expect(container.querySelectorAll('[data-wall-thickness="14"]')).toHaveLength(6)
    expect(container.querySelectorAll('[data-cutaway-cap]')).toHaveLength(11)
    expect(container.querySelectorAll('[data-doorway-reveal]')).toHaveLength(10)
    expect(container.querySelectorAll('[data-doorway-header]')).toHaveLength(5)
    expect(container.querySelectorAll('[data-doorway-header-face]')).toHaveLength(5)
    expect(container.querySelectorAll('[data-doorway-header-cap]')).toHaveLength(5)
    expect(container.querySelectorAll('[data-doorway-threshold]')).toHaveLength(5)
    expect(container.querySelectorAll('[data-doorway-frame]')).toHaveLength(5)
    expect(container.querySelectorAll('[data-doorway-jamb]')).toHaveLength(10)
    expect(container.querySelectorAll('[data-doorway-lintel]')).toHaveLength(5)
    for (const framePart of container.querySelectorAll('[data-doorway-jamb], [data-doorway-lintel]')) {
      expect(framePart).toHaveAttribute('stroke', '#6F472C')
      expect(framePart).toHaveAttribute('stroke-width', '6')
    }
    for (const opening of container.querySelectorAll('[data-doorway-opening]')) {
      expect(opening.childElementCount).toBe(4)
    }
    expect(container.querySelectorAll('[data-wall-height-scale]')).toHaveLength(0)
  })

  it('keeps every wall image inside the native board canvas', () => {
    const { container } = renderBoard()
    for (const wall of container.querySelectorAll('[data-scene-object="wall"]')) {
      const element = wall as HTMLElement
      expect(Number.parseFloat(element.style.left)).toBeGreaterThanOrEqual(0)
      expect(Number.parseFloat(element.style.left) + Number.parseFloat(element.style.width))
        .toBeLessThanOrEqual(6 * TILE_W)
    }
  })

  it('centres and sorts multi-cell furniture from its full footprint front edge', () => {
    const furniture: Furniture[] = [
      { type: 'bed', row: 0, col: 0, w: 2, h: 1 },
      { type: 'sofa', row: 3, col: 0, w: 1, h: 2 },
      { type: 'counter', row: 3, col: 3, w: 2, h: 1 },
    ]
    const { container } = renderBoard({ furniture })
    const bed = container.querySelector('[data-furniture="bed"]')
    expect(bed).toHaveAttribute('data-footprint-center', '0,0.5')
    expect(bed).toHaveAttribute('data-footprint-front', '0,1')
    expect(container.querySelector('[data-furniture-shadow="bed"]')).toHaveAttribute('data-shadow-footprint', '1x2')
    expect(container.querySelector('[data-furniture="sofa"]')).toHaveAttribute('data-footprint-front', '4,0')
    expect(container.querySelector('[data-furniture-shadow="sofa"]')).toHaveAttribute('data-shadow-footprint', '2x1')
    expect(container.querySelector('[data-furniture="counter"]')).toHaveAttribute('data-footprint-front', '3,4')
  })

  it('applies tight contact shadows and explicit ground corrections to the bed and sofa', () => {
    const { container } = renderMidnightDelivery()
    expect(container.querySelector('[data-furniture="bed"]')).toHaveAttribute('data-ground-offset-y', '5')
    expect(container.querySelector('[data-furniture-shadow="bed"]')).toHaveAttribute('data-shadow-scale', '0.5')
    expect(container.querySelector('[data-furniture="sofa"]')).toHaveAttribute('data-ground-offset-y', '4')
    expect(container.querySelector('[data-furniture-shadow="sofa"]')).toHaveAttribute('data-shadow-scale', '0.48')
  })
  it('uses every occupied footprint cell for fading and lane interaction', () => {
    const marks = emptyMarks(6)
    marks[0][1] = { kind: 'person', person: 'p0' }
    const { container } = renderBoard({ marks })
    expect(container.querySelector('[data-furniture="bed"]')).toHaveStyle({ opacity: '0.26' })
  })

  it('shows no idle markers, then small floor-integrated cues only in place mode', () => {
    const idle = renderBoard()
    expect(idle.container.querySelectorAll('[data-placement-cue]')).toHaveLength(0)
    idle.unmount()
    const armed = renderBoard({ armedPerson: 'p0' })
    const cues = armed.container.querySelectorAll('[data-placement-cue]')
    expect(cues).toHaveLength(36)
    expect(Number(cues[0].getAttribute('r'))).toBeGreaterThanOrEqual(7)
    expect(Number(cues[0].getAttribute('r'))).toBeLessThanOrEqual(9)
  })

  it('renders two visual modules for the fixed counter while preserving one two-cell contact shadow', () => {
    const { container } = renderMidnightDelivery()
    expect(container.querySelectorAll('[data-furniture-module="counter"]')).toHaveLength(2)
    expect(container.querySelector('[data-furniture-module-file="kitchenSink"]')).toBeInTheDocument()
    expect(container.querySelector('[data-furniture-module-file="kitchenCabinet"]')).toBeInTheDocument()
    expect(container.querySelector('[data-furniture-shadow="counter"]')).toHaveAttribute('data-shadow-footprint', '1x2')
  })

  it('renders each clue-bearing lamp as a supported table lamp rather than a pillar-like floor sprite', () => {
    const { container } = renderMidnightDelivery()
    expect(container.querySelectorAll('[data-furniture-module="lamp"]')).toHaveLength(6)
    expect(container.querySelectorAll('[data-furniture-module-file="sideTable"]')).toHaveLength(3)
    expect(container.querySelectorAll('[data-furniture-module-file="lampRoundTable"][data-furniture-module-lift="54"]')).toHaveLength(3)
    expect(container.querySelector('img[src*="lampSquareFloor"]')).not.toBeInTheDocument()
  })

  it('keeps the active row and column overlay above every environment object', () => {
    const { container } = renderBoard({ armedPerson: 'p0' })
    fireEvent.mouseEnter(container.querySelector('[role="gridcell"]') as HTMLElement)
    const lane = container.querySelector('[data-active-lanes]') as HTMLElement
    const depths = [...container.querySelectorAll('[data-scene-object]')].map(node => Number((node as HTMLElement).style.zIndex))
    expect(Number(lane.style.zIndex)).toBeGreaterThan(Math.max(...depths))
  })

  it('keeps the selected intersection warm and restrained instead of opaque white', () => {
    const { container } = renderBoard({ armedPerson: 'p0' })
    fireEvent.mouseEnter(container.querySelector('[role="gridcell"]') as HTMLElement)
    const intersection = container.querySelector('[data-active-intersection]')
    expect(intersection).toHaveAttribute('fill', 'rgba(238,219,170,0.58)')
    expect(intersection).toHaveAttribute('stroke', 'rgba(82,57,26,0.84)')
    expect(intersection).toHaveAttribute('stroke-width', '2.5')
  })
  it('preserves the legacy selection and placement-cue treatment in other cases', () => {
    const { container } = renderBoard({ id: 'very-easy-2', armedPerson: 'p0' })
    fireEvent.mouseEnter(container.querySelector('[role="gridcell"]') as HTMLElement)
    const intersection = container.querySelector('[data-active-intersection]')
    expect(intersection).toHaveAttribute('fill', 'rgba(255,255,255,0.92)')
    expect(intersection).toHaveAttribute('stroke', '#1B1206')
    expect(intersection).toHaveAttribute('stroke-width', '4')
    expect(container.querySelector('[data-placement-cue]')).toHaveAttribute('r', '3.5')
  })

  it('grounds suspect standees on the same contact plane as furniture', () => {
    const marks = emptyMarks(6)
    marks[2][2] = { kind: 'person', person: 'p0' }
    const { container } = renderBoard({ marks })
    expect(container.querySelector('[data-scene-object="suspect"]'))
      .toHaveAttribute('data-ground-offset', String(TILE_H / 4))
    expect(container.querySelector('[data-scene-object="suspect"]'))
      .toHaveAttribute('data-standee-height', '92')
  })

  it('keeps gameplay standees above a faded multi-cell object that occupies their cell', () => {
    const marks = emptyMarks(6)
    marks[0][0] = { kind: 'person', person: 'p0' }
    const { container } = renderBoard({ marks })
    const suspect = container.querySelector('[data-scene-object="suspect"]') as HTMLElement
    const bed = container.querySelector('[data-furniture="bed"]') as HTMLElement
    expect(Number(suspect.style.zIndex)).toBeGreaterThan(Number(bed.style.zIndex))
  })

  it('sorts a lifted prop at the front edge of its supporting multi-cell surface', () => {
    const { container } = renderBoard({
      furniture: [{ type: 'counter', row: 3, col: 3, w: 2, h: 1 }],
    })
    const microwave = container.querySelector('[data-decor="kitchenMicrowave"]') as HTMLElement
    const counter = container.querySelector('[data-furniture="counter"]') as HTMLElement
    expect(Number(microwave.style.zIndex)).toBeGreaterThan(Number(counter.style.zIndex))
  })
})
