import { fireEvent, render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import IsoBoard from '../src/components/IsoBoard'
import type { Furniture } from '../src/core/types'
import { getSceneDecor, getSceneWalls } from '../src/core/handScenes'
import { TILE_H, TILE_W } from '../src/core/kenneySprites'
import { emptyMarks, makePuzzle } from './fixtures'

function renderBoard({
  armedPerson = null,
  marks = emptyMarks(6),
  furniture = [{ type: 'bed', row: 0, col: 0, w: 2, h: 1 } as Furniture],
} = {}) {
  const roomOf = Array.from({ length: 6 }, () => Array(6).fill('house'))
  const puzzle = makePuzzle({
    id: 'very-easy-1',
    size: 6,
    rooms: [{ id: 'house', name: 'House', hue: 20, cells: [] }],
    roomOf,
    furniture,
  })
  return render(<IsoBoard puzzle={puzzle} marks={marks} conflicts={new Set()} onCellClick={vi.fn()} armedPerson={armedPerson} />)
}

describe('Midnight Delivery scene architecture', () => {
  it('maps each board wall axis to the proven interior-facing sprite family', () => {
    const walls = getSceneWalls('very-easy-1')
    expect(walls.filter(w => w.kind === 'edge' && w.edge === 'A').every(w => /_NW$/.test(w.file))).toBe(true)
    expect(walls.filter(w => w.kind === 'edge' && w.edge === 'B').every(w => /_NE$/.test(w.file))).toBe(true)
    expect(walls.find(w => w.kind === 'corner')?.file).toBe('wallCorner_NW')
  })

  it('separates the living room and kitchen with an intentional doorway', () => {
    const seam = getSceneWalls('very-easy-1').filter(w => w.kind === 'edge' && w.edge === 'B' && w.col === 3 && w.row >= 3)
    expect(seam.map(w => w.row)).toEqual([3, 4, 5])
    expect(seam.filter(w => w.file === 'wallDoorway_NE')).toHaveLength(1)
  })

  it('keeps every raised prop on a supporting surface and removes overlapping floor clutter', () => {
    const decor = getSceneDecor('very-easy-1')
    expect(decor).toEqual(expect.arrayContaining([
      expect.objectContaining({ file: 'kitchenMicrowave', row: 3, col: 3.5, lift: expect.any(Number) }),
      expect.objectContaining({ file: 'laptop', row: 0, col: 3, lift: expect.any(Number) }),
      expect.objectContaining({ file: 'books', row: 1, col: 5, lift: expect.any(Number) }),
    ]))
    expect(decor.some(d => ['loungeChair', 'trashcan', 'cardboardBoxClosed'].includes(d.file))).toBe(false)
  })
})

describe('IsoBoard geometry and interaction states', () => {
  it('renders one exact continuous six-by-six floor polygon without per-cell slabs', () => {
    const { container } = renderBoard()
    const floor = container.querySelector('[data-floor-surface]')
    expect(floor).toHaveAttribute('points', `${3 * TILE_W},150 ${6 * TILE_W},${150 + 3 * TILE_H} ${3 * TILE_W},${150 + 6 * TILE_H} 0,${150 + 3 * TILE_H}`)
    expect(container.querySelectorAll('[data-floor-cell]')).toHaveLength(0)
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
    expect(Number(cues[0].getAttribute('r'))).toBeLessThanOrEqual(4)
  })

  it('keeps the active row and column overlay above every environment object', () => {
    const { container } = renderBoard({ armedPerson: 'p0' })
    fireEvent.mouseEnter(container.querySelector('[role="gridcell"]') as HTMLElement)
    const lane = container.querySelector('[data-active-lanes]') as HTMLElement
    const depths = [...container.querySelectorAll('[data-scene-object]')].map(node => Number((node as HTMLElement).style.zIndex))
    expect(Number(lane.style.zIndex)).toBeGreaterThan(Math.max(...depths))
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
