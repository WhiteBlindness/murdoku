import { describe, expect, it } from 'vitest'
import { buildAuthoredPuzzle } from '../src/core/authored'
import { shopPilot } from '../src/lab/pilots/cases'
import { metaOf } from '../src/scene3d/catalog'
import { resolveScene } from '../src/scene3d/resolve'
import { validateScene } from '../src/scene3d/validate'
import { pilotShop } from '../src/scene3d/scenes/pilot-shop'

const puzzle = buildAuthoredPuzzle(shopPilot, 'Dev pilot')
const resolved = resolveScene(pilotShop, puzzle.size)
const report = validateScene(resolved, puzzle)

describe('pilot-shop scene', () => {
  it('resolves with accessible rooms and visible placement cells', () => {
    expect(resolved.problems).toEqual([])
    expect(report.filter(issue => issue.severity === 'error')).toEqual([])
    expect(report.filter(issue => issue.code === 'cell-hidden')).toEqual([])
  })

  it('places the 0.50 pack-transform register on the measured checkout surface', () => {
    const register = resolved.objects.find(object => object.id === 'cash-register')!
    const counter = resolved.objects.find(object => object.id === 'checkout-centre')!
    const top = metaOf(counter.model).surfaces?.top

    expect(register.parentId).toBe(counter.id)
    expect(top).toEqual({ y: 0.45, role: 'counter' })
    expect(register.position[1]).toBeCloseTo(counter.position[1] + top!.y, 6)
    expect(register.size[0]).toBeCloseTo(0.425, 6)
    expect(register.size[2]).toBeCloseTo(0.425, 6)
    expect(report.map(issue => issue.code)).not.toContain('prop-overhang')
  })
})
