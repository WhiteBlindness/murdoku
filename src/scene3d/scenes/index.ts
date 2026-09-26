import type { Puzzle } from '../../core/types'
import type { SceneSpec } from '../schema'
import { fallbackScene } from './fallback'
import { midnightDelivery } from './midnight-delivery'
import { theEmptyChair } from './the-empty-chair'
import { theLastNightcap } from './the-last-nightcap'
import { twoStoreyReferenceGround } from './two-storey-reference-ground'
import { twoStoreyReferenceUpper } from './two-storey-reference-upper'
import { pilotCafe } from './pilot-cafe'
import { pilotShop } from './pilot-shop'
import { pilotCemetery } from './pilot-cemetery'

/** Authored scenes, keyed by `${puzzleId}#${floor}`. */
export const AUTHORED_SCENES: Record<string, SceneSpec> = Object.fromEntries(
  [midnightDelivery, theEmptyChair, theLastNightcap, twoStoreyReferenceGround, twoStoreyReferenceUpper]
    .map(s => [`${s.puzzleId}#${s.floor ?? 0}`, s]),
)

/** These scenes are only reachable through the development pilot catalogue. */
const DEV_PILOT_SCENES: Record<string, SceneSpec> = {
  'pilot-cafe#0': pilotCafe,
  'pilot-shop#0': pilotShop,
  'pilot-cemetery#0': pilotCemetery,
}

export function hasAuthoredScene(puzzleId: string, floor = 0): boolean {
  return `${puzzleId}#${floor}` in AUTHORED_SCENES
}

/** The scene to draw for a puzzle storey: authored if it exists, else the
 *  procedural fallback built from the puzzle's own furniture list. */
export function sceneFor(puzzle: Puzzle, floor = 0): SceneSpec {
  if (import.meta.env.DEV && puzzle.id.startsWith('pilot-')) {
    return DEV_PILOT_SCENES[`${puzzle.id}#${floor}`] ?? fallbackScene(puzzle, floor)
  }
  return AUTHORED_SCENES[`${puzzle.id}#${floor}`] ?? fallbackScene(puzzle, floor)
}
