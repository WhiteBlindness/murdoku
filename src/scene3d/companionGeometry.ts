import type { Box3, ResolvedScene } from './resolve'
import { CELL, FLOOR_THICKNESS } from './units'

type CompanionFloor = Pick<ResolvedScene, 'n' | 'floorY' | 'stairwell'>

/**
 * Merge adjacent cells into continuous floor slabs for the companion storey.
 * Internal cell edges must not expose the hidden Murdoku grid; genuine height
 * changes and the stairwell remain physical boundaries.
 */
export function companionFloorBoxes(scene: CompanionFloor): Box3[] {
  const visited = Array.from({ length: scene.n }, () => Array(scene.n).fill(false))
  const boxes: Box3[] = []
  const excluded = (row: number, col: number) => {
    const stairwell = scene.stairwell
    return !!stairwell && col >= stairwell[0] && row >= stairwell[1] && col <= stairwell[2] && row <= stairwell[3]
  }

  for (let row = 0; row < scene.n; row++) {
    for (let col = 0; col < scene.n; col++) {
      if (visited[row][col] || excluded(row, col)) continue

      const y = scene.floorY[row][col]
      let colEnd = col
      while (
        colEnd + 1 < scene.n &&
        !visited[row][colEnd + 1] &&
        !excluded(row, colEnd + 1) &&
        scene.floorY[row][colEnd + 1] === y
      ) colEnd++

      let rowEnd = row
      while (rowEnd + 1 < scene.n) {
        const nextRow = rowEnd + 1
        const matches = Array.from({ length: colEnd - col + 1 }, (_, index) => col + index)
          .every(candidateCol => (
            !visited[nextRow][candidateCol] &&
            !excluded(nextRow, candidateCol) &&
            scene.floorY[nextRow][candidateCol] === y
          ))
        if (!matches) break
        rowEnd = nextRow
      }

      for (let markRow = row; markRow <= rowEnd; markRow++) {
        for (let markCol = col; markCol <= colEnd; markCol++) visited[markRow][markCol] = true
      }

      boxes.push({
        min: [col * CELL, y - FLOOR_THICKNESS, row * CELL],
        max: [(colEnd + 1) * CELL, y, (rowEnd + 1) * CELL],
      })
    }
  }

  return boxes
}
