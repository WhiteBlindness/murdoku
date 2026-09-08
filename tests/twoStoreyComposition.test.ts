import { describe, expect, it } from 'vitest'
import { buildAuthoredPuzzle } from '../src/core/authored'
import { hard1 } from '../src/data/cases/hard-1'
import { resolveScene } from '../src/scene3d/resolve'
import { CELL } from '../src/scene3d/units'
import { twoStoreyReferenceGround as ground } from '../src/scene3d/scenes/two-storey-reference-ground'
import { twoStoreyReferenceUpper as upper } from '../src/scene3d/scenes/two-storey-reference-upper'

const puzzle = buildAuthoredPuzzle(hard1, 'reference')
const lower = resolveScene(ground, 8)
const higher = resolveScene(upper, 8)

describe('two-storey reference composition', () => {
  it('arrives on the study gallery slab, with its head meeting the opening edge', () => {
    const stair = lower.objects.find(object => object.kind === 'stairs')!
    const well = higher.stairwell!
    expect(stair.facing).toBe('E')
    expect(stair.box.max[0]).toBeCloseTo((well[2] + 1) * CELL, 3)
    const row = Math.floor(stair.position[2] / CELL), col = well[2] + 1
    const room = puzzle.rooms.find(room => room.id === puzzle.roomOfByFloor![1][row][col])!
    expect(room.name).toBe('Study')
  })

  it('keeps bedroom furnishings and solution off the open void', () => {
    const [c0, r0, c1, r1] = higher.stairwell!
    for (let row = r0; row <= r1; row++) for (let col = c0; col <= c1; col++) {
      expect(Object.values(puzzle.solution).some(cell => cell.floor === 1 && cell.row === row && cell.col === col)).toBe(false)
    }
    for (const object of higher.objects.filter(object => object.kind === 'rug' || object.logic)) {
      const overlap = object.box.min[0] < (c1 + 1) * CELL && object.box.max[0] > c0 * CELL
        && object.box.min[2] < (r1 + 1) * CELL && object.box.max[2] > r0 * CELL
      expect(overlap, object.id).toBe(false)
    }
  })

  it('anchors the bed and work desk to real walls and gives the bathroom a distinct finish', () => {
    for (const id of ['bed', 'study-desk']) expect(higher.objects.find(object => object.id === id)?.againstWall).toBeTruthy()
    expect(higher.floorMaterial[6][1]).toBe('tile')
  })
})
