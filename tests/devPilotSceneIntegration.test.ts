import { describe, expect, it } from 'vitest'
import { buildAuthoredPuzzle } from '../src/core/authored'
import { DEV_PILOT_CASES } from '../src/lab/pilots/cases'
import { PACK_ADAPTERS } from '../src/scene3d/packAdapters'
import { AUTHORED_SCENES, hasAuthoredScene, sceneFor } from '../src/scene3d/scenes'
import { pilotCafe } from '../src/scene3d/scenes/pilot-cafe'
import { pilotCemetery } from '../src/scene3d/scenes/pilot-cemetery'
import { pilotShop } from '../src/scene3d/scenes/pilot-shop'

const scenes = [pilotCemetery, pilotShop, pilotCafe]

describe('integração das cenas piloto de desenvolvimento', () => {
  it.each([
    ['cemetery', pilotCemetery],
    ['shop', pilotShop],
    ['cafe', pilotCafe],
  ] as const)('seleciona a cena física de %s sem a promover ao catálogo oficial', (key, expected) => {
    const puzzle = buildAuthoredPuzzle(DEV_PILOT_CASES[key], 'Dev pilot')
    expect(sceneFor(puzzle)).toBe(expected)
    expect(hasAuthoredScene(puzzle.id)).toBe(false)
    expect(AUTHORED_SCENES[`${puzzle.id}#0`]).toBeUndefined()
  })

  it('usa todos os modelos adaptados em pelo menos uma cena implementada', () => {
    const used = new Set(scenes.flatMap(scene => scene.furniture.map(object => object.model)))
    expect(Object.keys(PACK_ADAPTERS).filter(model => !used.has(model))).toEqual([])
  })
})
