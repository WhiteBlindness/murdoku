import type { Box3, ResolvedScene } from './resolve'
import type { FloorMaterial } from './schema'
import { mergedFloorBoxes } from './floorGeometry'

type CompanionFloor = Pick<ResolvedScene, 'n' | 'floorY'> & Partial<Pick<ResolvedScene,
  'floorMaterial' | 'floorPresent' | 'stairwell' | 'stairwellBounds'>>

/**
 * Merge adjacent cells into continuous floor slabs for the companion storey.
 * Internal cell edges must not expose the hidden Murdoku grid; genuine height
 * changes and the stairwell remain physical boundaries.
 */
export function companionFloorBoxes(scene: CompanionFloor): Box3[] {
  const floorMaterial = scene.floorMaterial
    ?? Array.from({ length: scene.n }, () => Array<FloorMaterial>(scene.n).fill('wood'))
  const floorPresent = scene.floorPresent
    ?? Array.from({ length: scene.n }, () => Array<boolean>(scene.n).fill(true))
  const stairwellBounds = scene.stairwellBounds ?? (scene.stairwell
    ? [scene.stairwell[0], scene.stairwell[1], scene.stairwell[2] + 1, scene.stairwell[3] + 1] as const
    : undefined)
  return mergedFloorBoxes({ ...scene, floorMaterial, floorPresent, stairwellBounds })
}
