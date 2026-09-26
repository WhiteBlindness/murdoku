import { describe, expect, it } from 'vitest'
import { buildAuthoredPuzzle } from '../src/core/authored'
import { cafePilot } from '../src/lab/pilots/cases'
import { resolveScene } from '../src/scene3d/resolve'
import { validateScene } from '../src/scene3d/validate'
import { pilotCafe } from '../src/scene3d/scenes/pilot-cafe'

const puzzle = buildAuthoredPuzzle(cafePilot, 'Dev pilot')
const scene = resolveScene(pilotCafe, puzzle.size)
const issues = validateScene(scene, puzzle)

describe('pilot cafe scene', () => {
  it('resolves and validates its 6x6 fixture without hard errors', () => {
    expect(scene.problems).toEqual([])
    expect(issues.filter(issue => issue.severity === 'error')).toEqual([])
  })

  it('keeps the Food props on measured table and counter surfaces', () => {
    const props = scene.objects.filter(object => object.model.startsWith('food_'))
    expect(props.map(object => object.model).sort()).toEqual([
      'food_cake',
      'food_cupCoffee',
      'food_cupCoffee',
      'food_glassWine',
      'food_plateDinner',
    ])

    for (const prop of props) {
      expect(prop.parentId, prop.id).toBeDefined()
      expect(prop.surface, prop.id).toBe('top')
    }
  })
})
