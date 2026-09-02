import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { getAllPuzzles, getPuzzleById, initCatalog } from '../src/core/catalog'
import { validatePuzzleForProduction } from '../src/core/puzzleValidate'
import { MODEL_BOUNDS } from '../src/scene3d/catalog.generated'
import { resolveScene } from '../src/scene3d/resolve'
import { AUTHORED_SCENES } from '../src/scene3d/scenes'
import { validateScene } from '../src/scene3d/validate'

// Fast production gate. This deliberately checks hard invariants only:
// aesthetic warnings still require the browser and screenshot QA described in
// the production manual, and must never be disguised as machine certainty.
describe('production preflight', () => {
  initCatalog()
  const puzzles = getAllPuzzles()

  it('loads the complete 60-case catalogue', () => {
    expect(puzzles).toHaveLength(60)
  })

  it('accepts every puzzle with no hard production error', () => {
    const failures = puzzles.flatMap(puzzle => validatePuzzleForProduction(puzzle).issues
      .filter(issue => issue.severity === 'error')
      .map(issue => `${puzzle.id}: ${issue.code} — ${issue.message}`))

    expect(failures, failures.join('\n')).toEqual([])
  })

  it('accepts every authored 3D scene with no hard physical error', () => {
    const failures: string[] = []
    for (const [key, spec] of Object.entries(AUTHORED_SCENES)) {
      const puzzle = getPuzzleById(spec.puzzleId)
      if (!puzzle) {
        failures.push(`${key}: puzzle is missing from the catalogue`)
        continue
      }
      const scene = resolveScene(spec, puzzle.size)
      for (const issue of validateScene(scene, puzzle).filter(issue => issue.severity === 'error')) {
        failures.push(`${key}: ${issue.code} — ${issue.message}`)
      }
    }

    expect(failures, failures.join('\n')).toEqual([])
  })

  it('finds every catalogued Kenney model in the public asset bundle', () => {
    const missing = Object.keys(MODEL_BOUNDS)
      .filter(model => !existsSync(join(process.cwd(), 'public', 'kenney3d', `${model}.glb`)))

    expect(missing, `missing GLB files: ${missing.join(', ')}`).toEqual([])
  })
})
