// ============================================================================
// SCENE UNITS AND PROJECTION — the single source of truth for how a Murdoku
// cell becomes a place in the 3D dollhouse and how that place lands on screen.
//
// World space is the Kenney Furniture Kit's own space: one floorFull tile is
// 1 × 1, a wall is 1.29 tall, and every model stands with its feet at y = 0.
// The Murdoku grid is laid on that space with CELL Kenney units per cell:
//
//     world x = col * CELL          (col grows toward screen-right)
//     world z = row * CELL          (row grows toward screen-left)
//     world y = up
//
// The camera is orthographic and never moves. Because it is orthographic, the
// projection is an affine map, which means DOM overlays (hit polygons, suspect
// standees, lane traces) can be positioned with the closed-form `project`
// below and need no access to the WebGL renderer at all. The renderer builds
// its camera from these same constants, so the two agree to the pixel.
// ============================================================================

/** Kenney units per Murdoku cell. Calibrated so a double bed spans ~2 cells
 *  and a kitchen cabinet ~0.55 of one, matching Kenney's own sample diorama. */
export const CELL = 0.8

/** Kenney `wall` model height — the exterior shell is built to it. */
export const WALL_HEIGHT = 1.29
/** Dev-only tuning: `?elev=36&pw=0.5` overrides the constants below so the
 *  visual QA loop can compare camera/wall settings without editing code.
 *  Production builds see no query string and use the declared values. */
const tune = (key: string, fallback: number): number => {
  const env = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env?.['SCENE_' + key.toUpperCase()]
  if (env !== undefined && !Number.isNaN(Number(env))) return Number(env)
  if (typeof window === 'undefined') return fallback
  const v = new URLSearchParams(window.location.search).get(key)
  return v !== null && !Number.isNaN(Number(v)) ? Number(v) : fallback
}

/** Interior partitions are cut down dollhouse-style so no cell hides behind them. */
export const PARTITION_HEIGHT = tune('pw', 0.6)
/** A pony wall: waist height. Furniture may back onto it from either side. */
export const HALF_HEIGHT = 0.35
/** Camera-facing shell walls are cut to this plinth height (0 removes them). */
export const FRONT_HEIGHT = 0.12
export const SHELL_THICKNESS = 0.08
export const PARTITION_THICKNESS = 0.08
/** Kenney floorFull slab thickness; the slab edge is the visible plinth. */
export const FLOOR_THICKNESS = 0.05

/** Fixed camera: 45° azimuth puts the grid's diagonal on screen-x; the
 *  elevation trades floor visibility (higher) for a dollhouse feel (lower). */
export const CAMERA_ELEVATION_DEG = tune('elev', 32)
export const CAMERA_AZIMUTH_DEG = 45

/** Screen pixels per Kenney unit on the virtual (unscaled) canvas. */
export const PX_PER_UNIT = 180

export type Vec3 = [number, number, number]

const SQ2 = Math.SQRT1_2

/**
 * Screen-space frame for an N×N board. `width`/`height` is the virtual canvas
 * in pixels; `project` maps a world point to virtual-canvas pixels (y down).
 * Both the renderer's camera and every DOM overlay derive from this.
 */
export interface SceneFrame {
  n: number
  width: number
  height: number
  /** World extent of the ortho frustum, matching width/height at PX_PER_UNIT. */
  viewWidthUnits: number
  viewHeightUnits: number
  /** World point that lands at the canvas centre. */
  centre: Vec3
  project: (p: Vec3) => [number, number]
  /** Inverse on the floor plane y = 0: screen px -> world (x, z). */
  unprojectFloor: (sx: number, sy: number) => [number, number]
  cellCentre: (row: number, col: number) => Vec3
  /** Corners of a cell's floor diamond in screen px: N, E, S, W order. */
  cellPolygon: (row: number, col: number) => Array<[number, number]>
}

export function makeFrame(n: number): SceneFrame {
  const el = (CAMERA_ELEVATION_DEG * Math.PI) / 180
  const s = Math.sin(el), c = Math.cos(el)
  const side = n * CELL
  // camera basis for azimuth 45°: screen-x = (x - z)/√2, screen-up = -(x+z)·s/√2 + y·c
  const sxOf = (p: Vec3) => (p[0] - p[2]) * SQ2
  const upOf = (p: Vec3) => -(p[0] + p[2]) * SQ2 * s + p[1] * c
  // extents: floor diamond (y=0) plus headroom for the back walls and the slab below
  const margin = 0.18
  const halfW = side * SQ2 + margin
  const top = upOf([0, WALL_HEIGHT, 0]) + margin            // back corner wall top
  const bottom = upOf([side, -FLOOR_THICKNESS, side]) - margin // front corner slab bottom
  const viewWidthUnits = halfW * 2
  const viewHeightUnits = top - bottom
  const width = Math.round(viewWidthUnits * PX_PER_UNIT)
  const height = Math.round(viewHeightUnits * PX_PER_UNIT)
  const centreUp = (top + bottom) / 2
  // world point on the floor diagonal that projects to the frame centre
  const centre: Vec3 = [side / 2, 0, side / 2]
  centre[1] = (centreUp + side * SQ2 * s) / c
  const project = (p: Vec3): [number, number] => [
    (sxOf(p) + halfW) * PX_PER_UNIT,
    (top - upOf(p)) * PX_PER_UNIT,
  ]
  const unprojectFloor = (sx: number, sy: number): [number, number] => {
    const a = sx / PX_PER_UNIT - halfW          // (x - z)/√2
    const b = top - sy / PX_PER_UNIT            // -(x + z)·s/√2
    const sum = -b / (SQ2 * s), diff = a / SQ2
    return [(sum + diff) / 2, (sum - diff) / 2]
  }
  const cellCentre = (row: number, col: number): Vec3 => [(col + 0.5) * CELL, 0, (row + 0.5) * CELL]
  const cellPolygon = (row: number, col: number) => [
    project([col * CELL, 0, row * CELL]),
    project([(col + 1) * CELL, 0, row * CELL]),
    project([(col + 1) * CELL, 0, (row + 1) * CELL]),
    project([col * CELL, 0, (row + 1) * CELL]),
  ]
  return { n, width, height, viewWidthUnits, viewHeightUnits, centre, project, unprojectFloor, cellCentre, cellPolygon }
}

/** Unit vector pointing from the scene toward the camera. */
export function cameraDirection(): Vec3 {
  const el = (CAMERA_ELEVATION_DEG * Math.PI) / 180
  const az = (CAMERA_AZIMUTH_DEG * Math.PI) / 180
  return [Math.sin(az) * Math.cos(el), Math.sin(el), Math.cos(az) * Math.cos(el)]
}
