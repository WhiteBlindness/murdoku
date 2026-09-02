// ============================================================================
// SCENE VALIDATION — the machine-checkable half of the recipe.
//
// Every rule here is stated in docs/ISOMETRIC_SCENE_SYSTEM.md. Errors are
// physical impossibilities or contract breaches (a bed inside a wall, a
// microwave on the floor, a room nobody can reach); warnings are things a
// human should look at. Beauty is not checked here and never will be.
// ============================================================================

import { CELL, STOREY_HEIGHT, cameraDirection, type Vec3 } from './units'
import { parseLogic, type Box3, type Rect, type ResolvedObject, type ResolvedScene, type ResolvedWall } from './resolve'
import { furnitureCells, type Puzzle } from '../core/types'

export type Severity = 'error' | 'warning'

export interface Violation {
  code:
    | 'unresolved'
    | 'wall-thickness-inconsistent' | 'insert-off-wall'
    | 'zone-boundary-unwalled' | 'envelope-undefined' | 'zone-object-mismatch'
    | 'wall-penetration' | 'furniture-overlap' | 'outside-floor'
    | 'unsupported-prop' | 'prop-overhang'
    | 'door-blocked' | 'wall-free-end'
    | 'room-unreachable' | 'no-entry'
    | 'storey-mismatch' | 'stair-missing' | 'stair-rise-mismatch'
    | 'stairwell-missing' | 'stairwell-size-mismatch' | 'stair-floor-mismatch'
    | 'stair-slab-blocked' | 'stair-landing-blocked' | 'upper-floor-inaccessible'
    | 'object-hidden' | 'cell-hidden' | 'tall-back-exposed'
    | 'logic-missing' | 'logic-unknown' | 'logic-displaced' | 'logic-type'
  severity: Severity
  subject: string
  message: string
}

const EPS = 1e-4

function overlaps(a: Box3, b: Box3, shrink = 0): boolean {
  return a.min[0] + shrink < b.max[0] - shrink && b.min[0] + shrink < a.max[0] - shrink
    && a.min[1] + shrink < b.max[1] - shrink && b.min[1] + shrink < a.max[1] - shrink
    && a.min[2] + shrink < b.max[2] - shrink && b.min[2] + shrink < a.max[2] - shrink
}
function rectOverlap(a: Rect, b: Rect, shrink = 0): boolean {
  return a.minX + shrink < b.maxX - shrink && b.minX + shrink < a.maxX - shrink
    && a.minZ + shrink < b.maxZ - shrink && b.minZ + shrink < a.maxZ - shrink
}
function rectContains(outer: Rect, inner: Rect, slack = 0): boolean {
  return inner.minX >= outer.minX - slack && inner.maxX <= outer.maxX + slack
    && inner.minZ >= outer.minZ - slack && inner.maxZ <= outer.maxZ + slack
}

/** Ray/AABB slab test. Returns the entry distance or null. */
function rayHitsBox(origin: Vec3, dir: Vec3, box: Box3): number | null {
  let tmin = 0, tmax = Infinity
  for (let i = 0; i < 3; i++) {
    if (Math.abs(dir[i]) < 1e-9) {
      if (origin[i] < box.min[i] || origin[i] > box.max[i]) return null
    } else {
      let t1 = (box.min[i] - origin[i]) / dir[i], t2 = (box.max[i] - origin[i]) / dir[i]
      if (t1 > t2) [t1, t2] = [t2, t1]
      tmin = Math.max(tmin, t1); tmax = Math.min(tmax, t2)
      if (tmin > tmax) return null
    }
  }
  return tmin > 1e-6 ? tmin : null
}

const solidObject = (o: ResolvedObject) => (o.kind === 'furniture' || o.kind === 'stairs') && o.meta.support !== 'flat' && o.meta.support !== 'wall'

function floodFill(blocked: Uint8Array, m: number, seed: [number, number]): Uint8Array {
  const reach = new Uint8Array(m * m)
  const stack: Array<[number, number]> = [seed]
  while (stack.length) {
    const [i, j] = stack.pop()!
    if (i < 0 || j < 0 || i >= m || j >= m || reach[i * m + j] || blocked[i * m + j]) continue
    reach[i * m + j] = 1
    stack.push([i + 1, j], [i - 1, j], [i, j + 1], [i, j - 1])
  }
  return reach
}

export function validateScene(scene: ResolvedScene, puzzle?: Puzzle): Violation[] {
  const out: Violation[] = []
  const err = (code: Violation['code'], subject: string, message: string) => out.push({ code, severity: 'error', subject, message })
  const warn = (code: Violation['code'], subject: string, message: string) => out.push({ code, severity: 'warning', subject, message })

  for (const p of scene.problems) err('unresolved', 'scene', p)

  // ---- structural walls: one thickness per run, inserts on the wall line ----------
  for (const w of scene.walls) {
    if (w.kind === 'foundation') continue
    for (const piece of w.pieces) {
      const depth = w.axis === 'x' ? piece.max[2] - piece.min[2] : piece.max[0] - piece.min[0]
      if (Math.abs(depth - w.thickness) > 1e-6) err('wall-thickness-inconsistent', w.id, `${w.id} has a piece ${depth.toFixed(3)} thick; the wall is ${w.thickness}`)
    }
    const lineAt = w.axis === 'x' ? w.from[1] : w.from[0]
    for (const op of w.openings) {
      if (op.kind === 'open') continue
      const insert = scene.objects.find(o => (o.kind === 'window' || o.kind === 'door' || o.kind === 'entry')
        && Math.abs(o.position[0] - op.centre[0]) < 1e-6 && Math.abs(o.position[2] - op.centre[1]) < 1e-6)
      if (!insert) { err('insert-off-wall', w.id, `${op.kind} opening in ${w.id} has no inserted frame`); continue }
      const depth = w.axis === 'x' ? insert.box.max[2] - insert.box.min[2] : insert.box.max[0] - insert.box.min[0]
      const centre = w.axis === 'x' ? (insert.box.min[2] + insert.box.max[2]) / 2 : (insert.box.min[0] + insert.box.max[0]) / 2
      // a frame or a slightly open leaf may stand proud of the wall by a couple
      // of centimetres per side; a Kenney wall slab (0.09) plus offset would not pass
      if (depth > w.thickness + 0.04 + 1e-6) err('insert-off-wall', insert.id, `${insert.id} is ${depth.toFixed(3)} deep in a ${w.thickness} wall`)
      if (Math.abs(centre - lineAt) > 0.02) err('insert-off-wall', insert.id, `${insert.id} sits ${(centre - lineAt).toFixed(3)} off the wall line`)
    }
  }
  // ---- building envelope -----------------------------------------------------------
  {
    const n = scene.n
    const interiorCells = scene.zoneKind.flat().filter(k => k === 'interior').length
    if (interiorCells === 0) err('envelope-undefined', 'scene', 'no interior cells: the building envelope is undefined')
    const wallOnEdge = (axis: 'x' | 'z', at: number, from: number, to: number) => scene.walls.some(w =>
      w.kind !== 'foundation' && w.axis === axis && Math.abs((axis === 'x' ? w.from[1] : w.from[0]) - at) < 1e-6
      && (axis === 'x' ? w.from[0] : w.from[1]) <= from + 1e-6 && (axis === 'x' ? w.to[0] : w.to[1]) >= to - 1e-6)
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
      const k = scene.zoneKind[r][c]
      if (c + 1 < n && (scene.zoneKind[r][c + 1] === 'interior') !== (k === 'interior')) {
        if (!wallOnEdge('z', (c + 1) * CELL, r * CELL, (r + 1) * CELL)) err('zone-boundary-unwalled', `${r},${c}`, `interior meets outside between (${r},${c}) and (${r},${c + 1}) with no facade wall`)
      }
      if (r + 1 < n && (scene.zoneKind[r + 1][c] === 'interior') !== (k === 'interior')) {
        if (!wallOnEdge('x', (r + 1) * CELL, c * CELL, (c + 1) * CELL)) err('zone-boundary-unwalled', `${r},${c}`, `interior meets outside between (${r},${c}) and (${r + 1},${c}) with no facade wall`)
      }
    }
    for (const o of scene.objects) {
      if (o.kind !== 'furniture' || o.parentId) continue
      const r = Math.min(n - 1, Math.floor(o.position[2] / CELL)), c = Math.min(n - 1, Math.floor(o.position[0] / CELL))
      const expected = scene.floorY[r][c]
      if (Math.abs(o.position[1] - expected) > 1e-6) err('zone-object-mismatch', o.id, `${o.id} stands at y=${o.position[1]} on a cell whose ground is ${expected}`)
    }
  }

  const wallPieces = scene.walls.filter(w => w.kind !== 'foundation').flatMap(w => w.pieces.map(box => ({ wall: w, box })))
  const furniture = scene.objects.filter(o => o.kind === 'furniture' || o.kind === 'stairs')
  const solids = furniture.filter(solidObject)
  const byId = new Map(scene.objects.map(o => [o.id, o]))

  // ---- physical envelope vs walls and floor -----------------------------------
  for (const o of solids) {
    for (const { wall, box } of wallPieces) {
      if (overlaps(o.box, box, 0.004)) err('wall-penetration', o.id, `${o.id} (${o.model}) penetrates wall ${wall.id}`)
    }
    if (o.footprint.minX < -EPS || o.footprint.minZ < -EPS
      || o.footprint.maxX > scene.side + EPS || o.footprint.maxZ > scene.side + EPS) {
      err('outside-floor', o.id, `${o.id} extends past the floor slab`)
    }
  }
  // ---- furniture vs furniture ------------------------------------------------
  for (let i = 0; i < solids.length; i++) for (let j = i + 1; j < solids.length; j++) {
    const a = solids[i], b = solids[j]
    if (a.parentId === b.id || b.parentId === a.id) continue
    if (overlaps(a.box, b.box, 0.004)) err('furniture-overlap', a.id, `${a.id} (${a.model}) intersects ${b.id} (${b.model})`)
  }
  // ---- surface props ------------------------------------------------------------
  for (const o of furniture) {
    if (o.meta.support !== 'surface') continue
    if (!o.parentId) { err('unsupported-prop', o.id, `${o.id} (${o.model}) needs a supporting surface`); continue }
    const parent = byId.get(o.parentId)!
    if (!rectContains(parent.footprint, o.footprint, 0.03)) err('prop-overhang', o.id, `${o.id} overhangs ${parent.id}`)
  }
  // ---- doors: keep the swing clear on both sides -------------------------------------
  for (const w of scene.walls) for (const op of w.openings) {
    if (w.kind === 'shell-front' || op.kind === 'window') continue
    const clearance = 0.45
    const half = op.width / 2
    const zone: Rect = w.axis === 'x'
      ? { minX: op.centre[0] - half, maxX: op.centre[0] + half, minZ: op.centre[1] - clearance, maxZ: op.centre[1] + clearance }
      : { minX: op.centre[0] - clearance, maxX: op.centre[0] + clearance, minZ: op.centre[1] - half, maxZ: op.centre[1] + half }
    for (const o of solids) {
      if (rectOverlap(o.footprint, zone, 0.01)) err('door-blocked', w.id, `${o.id} blocks the opening in ${w.id}`)
    }
  }
  // ---- wall endpoints must land on something -----------------------------------------
  const onSomeWall = (p: [number, number], self: ResolvedWall) => {
    if (p[0] < EPS || p[1] < EPS || p[0] > scene.side - EPS || p[1] > scene.side - EPS) return true // meets the shell
    return scene.walls.some(w => {
      if (w === self) return false
      const tol = w.thickness / 2 + EPS
      if (w.axis === 'x') return Math.abs(p[1] - w.from[1]) <= tol && p[0] >= w.from[0] - tol && p[0] <= w.to[0] + tol
      return Math.abs(p[0] - w.from[0]) <= tol && p[1] >= w.from[1] - tol && p[1] <= w.to[1] + tol
    })
  }
  for (const w of scene.walls) {
    if (w.kind !== 'partition') continue
    for (const end of ['from', 'to'] as const) {
      if (w.declaredFreeEnds.includes(end)) continue
      const p = w[end]
      if (!onSomeWall(p, w)) err('wall-free-end', w.id, `${w.id} ends in open floor at (${(p[0] / CELL).toFixed(2)}, ${(p[1] / CELL).toFixed(2)}) — join it to a wall or declare freeEnds`)
    }
  }
  // ---- reachability: every room walkable from the entry ---------------------------
  if (puzzle) {
    const res = 4
    const m = scene.n * res
    const step = CELL / res
    const blocked = new Uint8Array(m * m)
    // A sample is a step×step square, not a point: walls are thinner than the
    // sampling step, so a point test would let the flood fill leak through them.
    const half = step / 2
    const walkable = (px: number, pz: number) => {
      for (const { box } of wallPieces) {
        if (px + half > box.min[0] && px - half < box.max[0] && pz + half > box.min[2] && pz - half < box.max[2]) return false
      }
      for (const o of solids) if (!o.parentId && px > o.footprint.minX && px < o.footprint.maxX && pz > o.footprint.minZ && pz < o.footprint.maxZ) return false
      return true
    }
    for (let i = 0; i < m; i++) for (let j = 0; j < m; j++) blocked[i * m + j] = walkable((j + 0.5) * step, (i + 0.5) * step) ? 0 : 1
    let seed: [number, number]
    if (scene.entry) {
      const [ex, ez] = scene.entry.centre
      seed = [Math.min(m - 1, Math.floor(ez / step + (scene.entry.wall === 'north' ? 0.5 : 0))),
              Math.min(m - 1, Math.floor(ex / step + (scene.entry.wall === 'west' ? 0.5 : 0)))]
    } else {
      warn('no-entry', 'scene', 'no entry declared — circulation is checked from the front-most free sample')
      seed = [m - 1, Math.floor(m / 2)]
    }
    let reach = floodFill(blocked, m, seed)
    if (!reach.some(v => v)) {
      // the seed sits in the wall line itself; step inward until free
      for (let d = 1; d < res * 2 && !reach.some(v => v); d++) {
        for (const cand of [[seed[0] + d, seed[1]], [seed[0], seed[1] + d]] as Array<[number, number]>) {
          if (cand[0] < m && cand[1] < m && !blocked[cand[0] * m + cand[1]]) { reach = floodFill(blocked, m, cand); break }
        }
      }
    }
    const roomOf = puzzle.roomOfByFloor?.[scene.floor] ?? puzzle.roomOf
    for (const room of puzzle.rooms) {
      if ((room.floor ?? 0) !== scene.floor) continue
      const reachable = room.cells.some(cell => {
        if (roomOf[cell.row]?.[cell.col] !== room.id) return false
        for (let di = 0; di < res; di++) for (let dj = 0; dj < res; dj++) {
          if (reach[(cell.row * res + di) * m + cell.col * res + dj]) return true
        }
        return false
      })
      if (!reachable) err('room-unreachable', room.id, `${room.name} cannot be walked into from the entry`)
    }
  }
  // ---- visibility from the camera ---------------------------------------------------
  const dir = cameraDirection()
  const wallBoxes = wallPieces.map(p => p.box)
  for (const o of solids) {
    if (o.parentId) continue
    const top: Vec3 = [(o.box.min[0] + o.box.max[0]) / 2, o.box.max[1] * 0.9, (o.box.min[2] + o.box.max[2]) / 2]
    const hit = wallBoxes.find(b => rayHitsBox(top, dir, b) !== null)
    if (hit) {
      const wall = wallPieces.find(p => p.box === hit)!.wall
      err('object-hidden', o.id, `${o.id} (${o.model}) is hidden behind wall ${wall.id} from the camera`)
    }
  }
  for (let r = 0; r < scene.n; r++) for (let c = 0; c < scene.n; c++) {
    const p = scene.frame.cellCentre(r, c, scene.floorY[r][c])
    const occupant = solids.find(o => !o.parentId && p[0] > o.footprint.minX && p[0] < o.footprint.maxX && p[2] > o.footprint.minZ && p[2] < o.footprint.maxZ)
    const blockers = [...wallBoxes, ...solids.filter(o => o !== occupant && !o.parentId).map(o => o.box)]
    // A suspect standee carries its portrait badge at chest height (~0.45).
    // If the badge centre is hidden at the cell centre, the player cannot see
    // who stands there without help. Feet behind a low object are fine.
    if (blockers.some(b => rayHitsBox([p[0], p[1] + 0.45, p[2]], dir, b) !== null)) {
      warn('cell-hidden', `${r},${c}`, `cell (${r},${c}) is hidden from the camera at standee height`)
    }
  }
  // ---- tall objects keep their backs to the back walls ----------------------------------
  for (const o of solids) {
    if (!o.meta.tall || o.parentId || o.meta.symmetric || o.kind === 'stairs') continue
    if (o.facing !== 'N' && o.facing !== 'W') continue
    if (o.againstWall === 'south' || o.againstWall === 'east') {
      warn('tall-back-exposed', o.id, `${o.id} (${o.model}) backs onto the cut-away ${o.againstWall} shell; its back faces the camera — check it reads`)
    } else {
      err('tall-back-exposed', o.id, `${o.id} (${o.model}) is tall and shows its back to the camera — face it S or E`)
    }
  }
  // ---- logic contract ---------------------------------------------------------------
  if (puzzle) {
    const logical = puzzle.furniture.filter(f => (f.floor ?? 0) === scene.floor)
    const ids = new Set(logical.map(f => `${f.type}@${f.row},${f.col}`))
    const represented = new Set<string>()
    for (const o of furniture) {
      if (!o.logic) continue
      const parsed = parseLogic(o.logic)
      if (!parsed || !ids.has(o.logic)) { err('logic-unknown', o.id, `${o.id} claims logic "${o.logic}" which is not in the puzzle`); continue }
      represented.add(o.logic)
      const allowed = o.meta.represents ?? []
      if (!allowed.includes(parsed.type as never)) err('logic-type', o.id, `${o.model} cannot represent a ${parsed.type}`)
      const lf = logical.find(f => `${f.type}@${f.row},${f.col}` === o.logic)!
      const cells = furnitureCells(lf)
      const area: Rect = {
        minX: Math.min(...cells.map(c => c.col)) * CELL, maxX: (Math.max(...cells.map(c => c.col)) + 1) * CELL,
        minZ: Math.min(...cells.map(c => c.row)) * CELL, maxZ: (Math.max(...cells.map(c => c.row)) + 1) * CELL,
      }
      if (!rectOverlap(o.footprint, area, -0.02)) err('logic-displaced', o.id, `${o.id} does not touch the cells of ${o.logic}`)
    }
    for (const id of ids) if (!represented.has(id)) err('logic-missing', id, `logical furniture ${id} has no visual object`)
  }
  return out
}

/**
 * Validate the physical contract between two separately rendered storeys.
 * Each scene remains local to y=0 for active-floor rendering; this check joins
 * them conceptually at STOREY_HEIGHT and proves that the real Kenney flight,
 * the slab opening and both circulation landings agree.
 */
export function validateStoreyPair(lower: ResolvedScene, upper: ResolvedScene): Violation[] {
  const out: Violation[] = []
  const err = (code: Violation['code'], subject: string, message: string) => out.push({ code, severity: 'error' as const, subject, message })

  if (lower.puzzleId !== upper.puzzleId || lower.n !== upper.n || upper.floor !== lower.floor + 1) {
    err('storey-mismatch', 'storeys', `expected consecutive storeys of one ${lower.n}×${lower.n} case; got ${lower.puzzleId}#${lower.floor} and ${upper.puzzleId}#${upper.floor}`)
    return out
  }

  const stair = lower.objects.find(object => object.kind === 'stairs')
  if (!stair) {
    err('stair-missing', 'stairs', 'the lower storey has no physical staircase')
    err('upper-floor-inaccessible', 'upper-storey', 'the upper storey cannot be reached without a staircase')
    return out
  }

  if (Math.abs(stair.size[1] - STOREY_HEIGHT) > 0.08) {
    err('stair-rise-mismatch', stair.id, `${stair.model} rises ${stair.size[1].toFixed(3)}; the storey pitch is ${STOREY_HEIGHT.toFixed(3)}`)
  }

  const stairwell = upper.stairwell
  if (!stairwell) {
    err('stairwell-missing', 'stairwell', 'the upper slab has no opening above the staircase')
    err('upper-floor-inaccessible', 'upper-storey', 'the staircase terminates below an unbroken upper slab')
    return out
  }
  if (stairwell[0] < 0 || stairwell[1] < 0 || stairwell[2] >= upper.n || stairwell[3] >= upper.n
    || stairwell[0] > stairwell[2] || stairwell[1] > stairwell[3]) {
    err('stairwell-size-mismatch', 'stairwell', `stairwell [${stairwell.join(',')}] lies outside the ${upper.n}×${upper.n} upper slab`)
    err('upper-floor-inaccessible', 'upper-storey', 'the upper stairwell is malformed')
    return out
  }

  const stairwellCells = new Set<string>()
  for (let row = stairwell[1]; row <= stairwell[3]; row++) {
    for (let col = stairwell[0]; col <= stairwell[2]; col++) stairwellCells.add(`${row},${col}`)
  }
  const flightCells = new Set<string>()
  for (let row = 0; row < lower.n; row++) for (let col = 0; col < lower.n; col++) {
    const cell: Rect = { minX: col * CELL, maxX: (col + 1) * CELL, minZ: row * CELL, maxZ: (row + 1) * CELL }
    if (rectOverlap(stair.footprint, cell, 1e-5)) flightCells.add(`${row},${col}`)
  }
  const uncovered = [...flightCells].filter(cell => !stairwellCells.has(cell))
  if (uncovered.length) {
    err('stairwell-size-mismatch', 'stairwell', `the slab opening misses staircase cell(s): ${uncovered.join(', ')}`)
  }

  const dir = stair.facing === 'E' ? [1, 0] : stair.facing === 'W' ? [-1, 0]
    : stair.facing === 'S' ? [0, 1] : [0, -1]
  const runHalf = (stair.facing === 'E' || stair.facing === 'W')
    ? (stair.box.max[0] - stair.box.min[0]) / 2
    : (stair.box.max[2] - stair.box.min[2]) / 2
  const pointAt = (distance: number): [number, number] => [
    stair.position[0] + dir[0] * distance,
    stair.position[2] + dir[1] * distance,
  ]
  const cellAt = ([x, z]: [number, number]): [number, number] => [Math.floor(z / CELL), Math.floor(x / CELL)]
  const topFlightCell = cellAt(pointAt(runHalf - 0.02))
  if (!stairwellCells.has(`${topFlightCell[0]},${topFlightCell[1]}`)) {
    err('stair-slab-blocked', 'stairwell', `the stair head at (${topFlightCell.join(',')}) is covered by the upper slab`)
  }

  const landing = (scene: ResolvedScene, which: 'lower' | 'upper', distance: number) => {
    const [row, col] = cellAt(pointAt(distance))
    if (row < 0 || col < 0 || row >= scene.n || col >= scene.n) {
      err('stair-floor-mismatch', `${which}-landing`, `${which} landing falls outside the floor at (${row},${col})`)
      return
    }
    if (which === 'upper' && stairwellCells.has(`${row},${col}`)) {
      err('stair-floor-mismatch', 'upper-landing', `upper landing (${row},${col}) is still inside the stairwell instead of on a slab`)
    }
    const inset = 0.08
    const area: Rect = {
      minX: col * CELL + inset, maxX: (col + 1) * CELL - inset,
      minZ: row * CELL + inset, maxZ: (row + 1) * CELL - inset,
    }
    const obstacle = scene.objects.find(object => object.kind === 'furniture' && !object.parentId && rectOverlap(object.footprint, area, 0.01))
    const wall = scene.walls.find(candidate => candidate.kind !== 'foundation' && candidate.pieces.some(piece => rectOverlap({
      minX: piece.min[0], maxX: piece.max[0], minZ: piece.min[2], maxZ: piece.max[2],
    }, area, 0.01)))
    if (obstacle || wall) {
      const blocker = obstacle ? `${obstacle.id} (${obstacle.model})` : `wall ${wall!.id}`
      err('stair-landing-blocked', `${which}-landing`, `${blocker} blocks the ${which} landing at (${row},${col})`)
    }
  }

  landing(lower, 'lower', -runHalf - CELL / 2)
  landing(upper, 'upper', runHalf + CELL / 2)
  if (out.some(issue => issue.code.startsWith('stair') && issue.severity === 'error')) {
    err('upper-floor-inaccessible', 'upper-storey', 'the stair connection is not physically usable')
  }
  return out
}

export function formatViolations(v: Violation[]): string {
  return v.map(x => `${x.severity === 'error' ? 'ERROR' : 'warn '} [${x.code}] ${x.message}`).join('\n')
}
