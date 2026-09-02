import type { Puzzle } from '../../core/types'
import type { SceneSpec } from '../schema'
import { fallbackScene } from './fallback'
import { midnightDelivery } from './midnight-delivery'
import { theEmptyChair } from './the-empty-chair'
import { theLastNightcap } from './the-last-nightcap'

/** Authored scenes, keyed by `${puzzleId}#${floor}`. */
export const AUTHORED_SCENES: Record<string, SceneSpec> = Object.fromEntries(
  [midnightDelivery, theEmptyChair, theLastNightcap].map(s => [`${s.puzzleId}#${s.floor ?? 0}`, s]),
)

export function hasAuthoredScene(puzzleId: string, floor = 0): boolean {
  return `${puzzleId}#${floor}` in AUTHORED_SCENES
}

/** The scene to draw for a puzzle storey: authored if it exists, else the
 *  procedural fallback built from the puzzle's own furniture list. */
export function sceneFor(puzzle: Puzzle, floor = 0): SceneSpec {
  return AUTHORED_SCENES[`${puzzle.id}#${floor}`] ?? fallbackScene(puzzle, floor)
}
