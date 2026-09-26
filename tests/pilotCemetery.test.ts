import { describe, expect, it } from 'vitest'
import { buildAuthoredPuzzle } from '../src/core/authored'
import { cemeteryPilot } from '../src/lab/pilots/cases'
import { resolveScene } from '../src/scene3d/resolve'
import { pilotCemetery } from '../src/scene3d/scenes/pilot-cemetery'
import { validateScene } from '../src/scene3d/validate'

describe('pilot cemetery scene', () => {
  it('resolves every logical furnishing and has no hard scene errors', () => {
    const puzzle = buildAuthoredPuzzle(cemeteryPilot, 'Dev pilot')
    const report = validateScene(resolveScene(pilotCemetery, puzzle.size), puzzle)
    expect(report.filter(issue => issue.severity === 'warning')).toEqual([])

    expect(report.filter(issue => issue.severity === 'error')).toEqual([])
    expect(report.filter(issue => issue.code === 'logic-missing')).toEqual([])
  })
})
