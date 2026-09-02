// ============================================================================
// SCENE RESOLVER — turns an authored SceneSpec into world-space geometry.
//
// Pure and deterministic: no three.js, no DOM. Everything the renderer draws
// and everything the validator checks comes from the ResolvedScene produced
// here, so a test can prove "the microwave sits on the counter" with numbers
// rather than a screenshot, and the screenshot can only confirm it.
//
// World units are Kenney units (see units.ts). Objects are axis-aligned
// boxes: furniture faces one of four directions, so a rotated model's
// footprint is still a rectangle. A loose prop's small yaw is folded into a
// conservative axis-aligned box.
// ============================================================================

import {
  CELL, WALL_HEIGHT, PARTITION_HEIGHT, HALF_HEIGHT, FRONT_HEIGHT, SHELL_THICKNESS, PARTITION_THICKNESS,
  makeFrame, type SceneFrame, type Vec3,
} from './units'
import { MODEL_BOUNDS, type KenneyModel } from './catalog.generated'
import { metaOf, type ModelMeta } from './catalog'
import type { Facing, FloorMaterial, FurnitureSpec, SceneSpec, OpeningSpec, ShellWall } from './schema'

export interface Box3 { min: Vec3; max: Vec3 }
export interface Rect { minX: number; maxX: number; minZ: number; maxZ: number }

export interface ResolvedOpening {
  kind: OpeningSpec['kind'] | 'window'
  /** Centre on the wall line, world units. */
  centre: [number, number]
  width: number
  /** The clear volume (wall thickness × opening width × wall height). */
  box: Box3
}

export interface ResolvedWall {
  id: string
  kind: 'shell-back' | 'shell-front' | 'partition'
  axis: 'x' | 'z'
  /** World endpoints. */
  from: [number, number]
  to: [number, number]
  height: number
  thickness: number
  /** Solid pieces after openings are subtracted. */
  pieces: Box3[]
  openings: ResolvedOpening[]
  declaredFreeEnds: Array<'from' | 'to'>
}

export type ObjectKind = 'furniture' | 'rug' | 'door' | 'window' | 'entry'

export interface ResolvedObject {
  id: string
  model: KenneyModel
  kind: ObjectKind
  logic?: string
  /** Feet position of the footprint centre. */
  position: Vec3
  rotY: number
  facing: Facing
  /** World-space axis-aligned bounds. */
  box: Box3
  footprint: Rect
  parentId?: string
  surface?: string
  /** Wall this object was anchored to, if placed with `against`. */
  againstWall?: string
  meta: ModelMeta
  /** Kenney size [w, h, d] before rotation. */
  size: Vec3
}

export interface ResolvedScene {
  puzzleId: string
  floor: number
  n: number
  side: number
  frame: SceneFrame
  walls: ResolvedWall[]
  objects: ResolvedObject[]
  /** Floor material of every cell, [row][col]. */
  floorMaterial: FloorMaterial[][]
  entry?: { centre: [number, number]; wall: 'north' | 'west' }
  /** Specs that could not be resolved. Each is a hard validation failure. */
  problems: string[]
}

const FACING_ROT: Record<Facing, number> = { S: 0, E: 90, N: 180, W: 270 }
const FACING_DIR: Record<Facing, [number, number]> = { S: [0, 1], E: [1, 0], N: [0, -1], W: [-1, 0] }
const OPPOSITE: Record<Facing, Facing> = { S: 'N', N: 'S', E: 'W', W: 'E' }

export const DOOR_MODEL: KenneyModel = 'doorwayOpen'
export const WINDOW_MODEL: KenneyModel = 'wallWindow'
export const SHELL_DOOR_MODEL: KenneyModel = 'wallDoorway'
export const ENTRY_DOOR_MODEL: KenneyModel = 'doorway'

/** Clear gap for a door opening: the frame model plus a hair of clearance. */
export const DOOR_GAP = MODEL_BOUNDS.doorwayOpen.size[0] + 0.02
export const SHELL_FEATURE_WIDTH = MODEL_BOUNDS.wallWindow.size[0]

export function parseLogic(logic: string): { type: string; row: number; col: number } | null {
  const m = /^([a-z]+)@(\d+),(\d+)$/.exec(logic)
  return m ? { type: m[1], row: Number(m[2]), col: Number(m[3]) } : null
}

/** Footprint dims (world x extent, z extent) of a model turned to `facing`. */
export function turnedSize(model: KenneyModel, facing: Facing): [number, number] {
  const [w, , d] = MODEL_BOUNDS[model].size
  return facing === 'E' || facing === 'W' ? [d, w] : [w, d]
}

function boxAround(cx: number, y: number, cz: number, w: number, h: number, d: number): Box3 {
  return { min: [cx - w / 2, y, cz - d / 2], max: [cx + w / 2, y + h, cz + d / 2] }
}
function rectOf(box: Box3): Rect {
  return { minX: box.min[0], maxX: box.max[0], minZ: box.min[2], maxZ: box.max[2] }
}

interface WallLine { axis: 'x' | 'z'; at: number; a: number; b: number; thickness: number; height: number }

function subtractOpenings(a: number, b: number, openings: Array<{ from: number; to: number }>): Array<[number, number]> {
  const pieces: Array<[number, number]> = []
  let cursor = a
  for (const o of [...openings].sort((p, q) => p.from - q.from)) {
    if (o.from > cursor + 1e-6) pieces.push([cursor, o.from])
    cursor = Math.max(cursor, o.to)
  }
  if (b > cursor + 1e-6) pieces.push([cursor, b])
  return pieces
}

function wallPieces(line: WallLine, spans: Array<[number, number]>, extendEnds: boolean): Box3[] {
  const half = line.thickness / 2
  return spans.map(([p, q]) => {
    // extend closed ends by half the thickness so corners meet cleanly
    const p2 = extendEnds && Math.abs(p - line.a) < 1e-6 ? p - half : p
    const q2 = extendEnds && Math.abs(q - line.b) < 1e-6 ? q + half : q
    return line.axis === 'x'
      ? { min: [p2, 0, line.at - half], max: [q2, line.height, line.at + half] }
      : { min: [line.at - half, 0, p2], max: [line.at + half, line.height, q2] }
  })
}

export function resolveScene(spec: SceneSpec, n: number): ResolvedScene {
  const side = n * CELL
  const frame = makeFrame(n)
  const problems: string[] = []
  const walls: ResolvedWall[] = []
  const objects: ResolvedObject[] = []

  // ---- shell -----------------------------------------------------------------
  const features = spec.shell?.features ?? []
  const entry = spec.entry
  const shellLine = (wall: ShellWall): WallLine => {
    const back = wall === 'north' || wall === 'west'
    const height = back ? WALL_HEIGHT : FRONT_HEIGHT
    const at = wall === 'north' || wall === 'west' ? 0 : side
    return { axis: wall === 'north' || wall === 'south' ? 'x' : 'z', at, a: 0, b: side, thickness: SHELL_THICKNESS, height }
  }
  for (const wall of ['north', 'west', 'south', 'east'] as ShellWall[]) {
    const line = shellLine(wall)
    const cuts: Array<{ from: number; to: number; kind: 'window' | 'door' | 'entry'; at: number }> = []
    if (wall === 'north' || wall === 'west') {
      for (const f of features.filter(f => f.wall === wall)) {
        const c = f.at * CELL
        cuts.push({ from: c - SHELL_FEATURE_WIDTH / 2, to: c + SHELL_FEATURE_WIDTH / 2, kind: f.kind, at: c })
      }
      if (entry && entry.wall === wall) {
        const c = entry.at * CELL
        cuts.push({ from: c - SHELL_FEATURE_WIDTH / 2, to: c + SHELL_FEATURE_WIDTH / 2, kind: 'entry', at: c })
      }
    }
    for (const cut of cuts) {
      if (cut.from < -1e-6 || cut.to > side + 1e-6) problems.push(`shell feature on ${wall} at ${cut.at / CELL} runs past the wall`)
    }
    const openings: ResolvedOpening[] = cuts.map(cut => ({
      kind: cut.kind === 'window' ? 'window' : 'open',
      centre: line.axis === 'x' ? [cut.at, line.at] : [line.at, cut.at],
      width: cut.to - cut.from,
      box: line.axis === 'x'
        ? { min: [cut.from, 0, line.at - line.thickness / 2], max: [cut.to, line.height, line.at + line.thickness / 2] }
        : { min: [line.at - line.thickness / 2, 0, cut.from], max: [line.at + line.thickness / 2, line.height, cut.to] },
    }))
    walls.push({
      id: `shell-${wall}`,
      kind: line.height === WALL_HEIGHT ? 'shell-back' : 'shell-front',
      axis: line.axis,
      from: line.axis === 'x' ? [0, line.at] : [line.at, 0],
      to: line.axis === 'x' ? [side, line.at] : [line.at, side],
      height: line.height,
      thickness: line.thickness,
      pieces: wallPieces(line, subtractOpenings(0, side, cuts), true),
      openings,
      declaredFreeEnds: [],
    })
    // feature models stand in the gaps
    for (const cut of cuts) {
      const model: KenneyModel = cut.kind === 'window' ? WINDOW_MODEL : SHELL_DOOR_MODEL
      const rotY = line.axis === 'x' ? 0 : 90
      const pos: Vec3 = line.axis === 'x' ? [cut.at, 0, line.at] : [line.at, 0, cut.at]
      objects.push(makeArchObject(`${wall}-${cut.kind}-${cut.at.toFixed(2)}`, model, cut.kind === 'window' ? 'window' : 'entry', pos, rotY))
      if (cut.kind === 'entry' || cut.kind === 'door') {
        // a door leaf in the frame (its own model, same position)
        objects.push(makeArchObject(`${wall}-leaf-${cut.at.toFixed(2)}`, ENTRY_DOOR_MODEL, 'entry', pos, rotY))
      }
    }
  }

  // ---- partitions ----------------------------------------------------------------
  const wallLines = new Map<string, WallLine>()
  for (const w of spec.walls) {
    const [x0, z0] = w.from, [x1, z1] = w.to
    const alongX = Math.abs(z0 - z1) < 1e-9
    const alongZ = Math.abs(x0 - x1) < 1e-9
    if (!alongX && !alongZ) { problems.push(`wall ${w.id} is not axis-aligned`); continue }
    if (alongX && alongZ) { problems.push(`wall ${w.id} has zero length`); continue }
    const axis: 'x' | 'z' = alongX ? 'x' : 'z'
    const at = (alongX ? z0 : x0) * CELL
    const a = Math.min(alongX ? x0 : z0, alongX ? x1 : z1) * CELL
    const b = Math.max(alongX ? x0 : z0, alongX ? x1 : z1) * CELL
    const height = w.height === 'full' ? WALL_HEIGHT : w.height === 'half' ? HALF_HEIGHT : PARTITION_HEIGHT
    const line: WallLine = { axis, at, a, b, thickness: PARTITION_THICKNESS, height }
    wallLines.set(w.id, line)
    const cuts: Array<{ from: number; to: number; kind: OpeningSpec['kind']; at: number; width: number }> = []
    for (const o of w.openings ?? []) {
      const width = o.width !== undefined ? o.width * CELL : o.kind === 'door' ? DOOR_GAP : CELL
      const c = o.at * CELL
      if (c - width / 2 < a - 1e-6 || c + width / 2 > b + 1e-6) problems.push(`opening at ${o.at} on wall ${w.id} lies outside the wall`)
      cuts.push({ from: c - width / 2, to: c + width / 2, kind: o.kind, at: c, width })
    }
    for (let i = 0; i < cuts.length; i++) for (let j = i + 1; j < cuts.length; j++) {
      if (cuts[i].from < cuts[j].to && cuts[j].from < cuts[i].to) problems.push(`openings overlap on wall ${w.id}`)
    }
    const openings: ResolvedOpening[] = cuts.map(cut => ({
      kind: cut.kind,
      centre: axis === 'x' ? [cut.at, at] : [at, cut.at],
      width: cut.width,
      box: axis === 'x'
        ? { min: [cut.from, 0, at - line.thickness / 2], max: [cut.to, height, at + line.thickness / 2] }
        : { min: [at - line.thickness / 2, 0, cut.from], max: [at + line.thickness / 2, height, cut.to] },
    }))
    walls.push({
      id: w.id,
      kind: 'partition',
      axis,
      from: axis === 'x' ? [a, at] : [at, a],
      to: axis === 'x' ? [b, at] : [at, b],
      height,
      thickness: line.thickness,
      pieces: wallPieces(line, subtractOpenings(a, b, cuts), true),
      openings,
      declaredFreeEnds: w.freeEnds ?? [],
    })
    for (const cut of cuts) {
      if (cut.kind !== 'door') continue
      const pos: Vec3 = axis === 'x' ? [cut.at, 0, at] : [at, 0, cut.at]
      objects.push(makeArchObject(`${w.id}-door-${cut.at.toFixed(2)}`, DOOR_MODEL, 'door', pos, axis === 'x' ? 0 : 90))
    }
  }

  // ---- furniture ------------------------------------------------------------------
  const specById = new Map(spec.furniture.map(f => [f.id, f]))
  const resolved = new Map<string, ResolvedObject>()
  const resolving = new Set<string>()

  const placeFurniture = (f: FurnitureSpec): ResolvedObject | null => {
    if (resolved.has(f.id)) return resolved.get(f.id)!
    if (resolving.has(f.id)) { problems.push(`parent cycle at ${f.id}`); return null }
    resolving.add(f.id)
    const modes = [f.at, f.against, f.on].filter(Boolean).length
    if (modes !== 1) { problems.push(`${f.id}: needs exactly one of at / against / on (has ${modes})`); resolving.delete(f.id); return null }
    if (!(f.model in MODEL_BOUNDS)) { problems.push(`${f.id}: unknown model ${f.model}`); resolving.delete(f.id); return null }
    const meta = metaOf(f.model)
    const size = MODEL_BOUNDS[f.model].size as unknown as Vec3

    let facing: Facing = f.facing ?? 'S'
    let x = 0, y = 0, z = 0
    let parentId: string | undefined, surface: string | undefined, againstWall: string | undefined

    if (f.at) {
      x = f.at[0] * CELL; z = f.at[1] * CELL
    } else if (f.against) {
      const ag = f.against
      let line: WallLine | undefined
      let inward: Facing
      if (ag.wall === 'north' || ag.wall === 'west' || ag.wall === 'south' || ag.wall === 'east') {
        line = shellLine(ag.wall)
        inward = ({ north: 'S', west: 'E', south: 'N', east: 'W' } as const)[ag.wall]
      } else {
        line = wallLines.get(ag.wall)
        if (!line) { problems.push(`${f.id}: against unknown wall ${ag.wall}`); resolving.delete(f.id); return null }
        if (!ag.side) { problems.push(`${f.id}: against an interior wall needs a side`); resolving.delete(f.id); return null }
        const validSides: Facing[] = line.axis === 'x' ? ['N', 'S'] : ['E', 'W']
        if (!validSides.includes(ag.side)) { problems.push(`${f.id}: side ${ag.side} is not a side of wall ${ag.wall}`); resolving.delete(f.id); return null }
        inward = ag.side
      }
      facing = inward
      againstWall = ag.wall
      const [fw, fd] = turnedSize(f.model, facing)
      const along = ag.at * CELL
      const alongExtent = line.axis === 'x' ? fw : fd
      if (along - alongExtent / 2 < line.a - 1e-6 || along + alongExtent / 2 > line.b + 1e-6) {
        problems.push(`${f.id}: at ${ag.at} runs past the end of wall ${ag.wall}`)
      }
      const dir = FACING_DIR[inward]
      const offset = line.thickness / 2 + (ag.gap ?? 0) + (meta.rearGap ?? 0) + (line.axis === 'x' ? fd : fw) / 2
      if (line.axis === 'x') { x = along; z = line.at + dir[1] * offset } else { z = along; x = line.at + dir[0] * offset }
    } else if (f.on) {
      const parentSpec = specById.get(f.on.parent)
      if (!parentSpec) { problems.push(`${f.id}: on unknown parent ${f.on.parent}`); resolving.delete(f.id); return null }
      const parent = placeFurniture(parentSpec)
      if (!parent) { resolving.delete(f.id); return null }
      const surfName = f.on.surface ?? 'top'
      const surf = parent.meta.surfaces?.[surfName]
      if (!surf) { problems.push(`${f.id}: parent ${parent.id} has no surface "${surfName}"`); resolving.delete(f.id); return null }
      if (meta.support !== 'surface') problems.push(`${f.id}: ${f.model} is not a surface prop but is placed on ${parent.id}`)
      else if (meta.requires && !meta.requires.includes(surf.role)) problems.push(`${f.id}: ${f.model} needs a ${meta.requires.join('/')} but ${parent.id} offers a ${surf.role}`)
      facing = f.facing ?? parent.facing
      const [ox, oz] = f.on.offset ?? [0, 0]
      // parent's local frame → world (rotate offset by the parent's yaw)
      const r = (parent.rotY * Math.PI) / 180
      x = parent.position[0] + ox * Math.cos(r) + oz * Math.sin(r)
      z = parent.position[2] - ox * Math.sin(r) + oz * Math.cos(r)
      y = parent.position[1] + surf.y
      parentId = parent.id
      surface = surfName
    }
    if (meta.support === 'surface' && !f.on) problems.push(`${f.id}: ${f.model} must be placed on a surface (needs \`on\`)`)
    if (meta.support === 'flat' && (f.against || f.on)) problems.push(`${f.id}: a rug goes in \`rugs\`, not furniture`)

    let rotY = FACING_ROT[facing]
    const yaw = meta.loose ? (f.yaw ?? 0) : 0
    rotY += yaw
    let [fw, fd] = turnedSize(f.model, facing)
    if (yaw) {
      const t = Math.abs((yaw * Math.PI) / 180)
      const w2 = fw * Math.cos(t) + fd * Math.sin(t), d2 = fw * Math.sin(t) + fd * Math.cos(t)
      fw = w2; fd = d2
    }
    const box = boxAround(x, y, z, fw, size[1], fd)
    const obj: ResolvedObject = {
      id: f.id, model: f.model, kind: 'furniture', logic: f.logic,
      position: [x, y, z], rotY, facing, box, footprint: rectOf(box),
      parentId, surface, againstWall, meta, size,
    }
    resolved.set(f.id, obj)
    resolving.delete(f.id)
    return obj
  }

  const seen = new Set<string>()
  for (const f of spec.furniture) {
    if (seen.has(f.id)) { problems.push(`duplicate furniture id ${f.id}`); continue }
    seen.add(f.id)
    const obj = placeFurniture(f)
    if (obj) objects.push(obj)
  }
  for (const rug of spec.rugs ?? []) {
    if (!(rug.model in MODEL_BOUNDS)) { problems.push(`${rug.id}: unknown model ${rug.model}`); continue }
    const facing = rug.facing ?? 'S'
    const [fw, fd] = turnedSize(rug.model, facing)
    const size = MODEL_BOUNDS[rug.model].size as unknown as Vec3
    const x = rug.at[0] * CELL, z = rug.at[1] * CELL
    const box = boxAround(x, 0.002, z, fw, size[1], fd)
    objects.push({
      id: rug.id, model: rug.model, kind: 'rug', position: [x, 0.002, z], rotY: FACING_ROT[facing], facing,
      box, footprint: rectOf(box), meta: metaOf(rug.model), size,
    })
  }

  const floorMaterial: FloorMaterial[][] = Array.from({ length: n }, () => Array<FloorMaterial>(n).fill('wood'))
  for (const zone of spec.floors ?? []) {
    const [c0, r0, c1, r1] = zone.cells
    if (c0 < 0 || r0 < 0 || c1 >= n || r1 >= n || c0 > c1 || r0 > r1) { problems.push(`floor zone ${zone.id} is outside the grid`); continue }
    for (let r = r0; r <= r1; r++) for (let c = c0; c <= c1; c++) floorMaterial[r][c] = zone.material
  }

  return {
    puzzleId: spec.puzzleId,
    floor: spec.floor ?? 0,
    n, side, frame, walls, objects, floorMaterial,
    entry: entry ? { wall: entry.wall, centre: entry.wall === 'north' ? [entry.at * CELL, 0] : [0, entry.at * CELL] } : undefined,
    problems,
  }
}

function makeArchObject(id: string, model: KenneyModel, kind: ObjectKind, position: Vec3, rotY: number): ResolvedObject {
  const size = MODEL_BOUNDS[model].size as unknown as Vec3
  const facing: Facing = rotY === 90 ? 'E' : 'S'
  const [fw, fd] = turnedSize(model, facing)
  const box = boxAround(position[0], position[1], position[2], fw, size[1], fd)
  return { id, model, kind, position, rotY, facing, box, footprint: rectOf(box), meta: metaOf(model), size }
}

export function opposite(f: Facing): Facing { return OPPOSITE[f] }
export function facingDir(f: Facing): [number, number] { return FACING_DIR[f] }
