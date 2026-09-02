// ============================================================================
// SCENE RENDERER — draws a ResolvedScene with three.js.
//
// The renderer owns nothing about the puzzle. It receives world-space boxes
// and model placements from resolve.ts and a highlight state from the board
// component, and paints. It renders on demand (a static diorama has no
// animation loop), builds its orthographic camera from units.ts so it agrees
// with the DOM overlay's projection, and degrades to "no canvas" when WebGL is
// unavailable (jsdom, very old webviews) so the DOM board still works.
// ============================================================================

import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { CELL, FLOOR_THICKNESS, cameraDirection, type Vec3 } from './units'
import type { ResolvedScene, ResolvedObject, Box3 } from './resolve'
import type { KenneyModel } from './catalog.generated'

// ---- look: one light, one palette rule -------------------------------------
/** Kenney's palette is authored for a bright render; a mild saturation lift
 *  under our lambert lighting lands it back on their own sample sheet. */
const SATURATION = 1.15
const HEMI_INTENSITY = 1.6, KEY_INTENSITY = 2.2
const HEMI_SKY = '#fff8ec', HEMI_GROUND = '#9c8266', KEY_COLOUR = '#ffe2b8'
/** Key light offset from the scene centre: upper-left-front, so cast shadows
 *  fall right and back, under and behind every object's camera-facing side. */
const KEY_OFFSET: Vec3 = [-4, 9, 2.5]
const NIGHT_GLASS = '#22303f', NIGHT_GLASS_GLOW = '#101a26'
const WALL_FACE = '#f1ebe0', WALL_CAP = '#d9cfbf', PARTITION_FACE = '#ece3d3', PARTITION_CAP = '#cdbfa8', PLINTH = '#d6c19f'
/** Non-wood floors are flat slabs the size of a Kenney tile in a material colour. */
const FLOOR_SLAB: Record<string, { top: string; edge: string }> = {
  tile: { top: '#ded8c8', edge: '#b9ab8f' },
  grass: { top: '#8cbf6c', edge: '#a37b52' },
  stone: { top: '#b8b2a6', edge: '#8d857a' },
  dirt: { top: '#b8946a', edge: '#8a6a48' },
}
/** Kenney `wood` material (229,153,100) — window frames and thresholds. */
const FRAME_WOOD = '#e59964'
const FOUNDATION = '#c9b493'
/** Neutral placeholder the renderer starts from; every visible colour is set
 *  from the DESIGN.md scene tokens before a frame is shown. */
const NEUTRAL_MATERIAL = '#ffffff'

export interface HighlightState {
  activeRow?: number | null
  activeCol?: number | null
  lockedRows?: ReadonlySet<number>
  lockedCols?: ReadonlySet<number>
  conflictRows?: ReadonlySet<number>
  conflictCols?: ReadonlySet<number>
  blockedRows?: ReadonlySet<number>
  blockedCols?: ReadonlySet<number>
  clueCells?: ReadonlySet<string>
  hoverTarget?: { row: number; col: number; valid: boolean } | null
  /** Environment-only: draw nothing but the house. */
  envOnly?: boolean
  /** Dev diagnostics: draw the physical model (boxes, wall pieces). */
  diag?: boolean
}

export interface SceneRenderer {
  setHighlights: (h: HighlightState) => void
  setSize: (w: number, h: number) => void
  /** Resolves once every model in the scene has loaded and been drawn. */
  ready: Promise<void>
  dispose: () => void
}

const modelCache = new Map<string, Promise<THREE.Group>>()
const loader = new GLTFLoader()

function boostColour(c: THREE.Color): THREE.Color {
  const hsl = { h: 0, s: 0, l: 0 }
  c.getHSL(hsl)
  return new THREE.Color().setHSL(hsl.h, Math.min(1, hsl.s * SATURATION), hsl.l)
}

function loadModel(name: KenneyModel): Promise<THREE.Group> {
  if (!modelCache.has(name)) {
    modelCache.set(name, loader.loadAsync(`/kenney3d/${name}.glb`).then(g => {
      const root = g.scene
      root.traverse(o => {
        const m = o as THREE.Mesh
        if (!m.isMesh) return
        m.castShadow = true
        m.receiveShadow = true
        // Kenney exports KHR_materials_unlit; GLTFLoader gives MeshBasicMaterial,
        // which ignores lights and shadows. Rebuild as lit flat colour.
        const rebuild = (src: THREE.Material) => {
          const b = src as THREE.MeshBasicMaterial
          // Window glass is translucent in the kit, which would show the page
          // behind the house. The case plays at night: opaque midnight glass.
          if (b.name === 'glass') return new THREE.MeshLambertMaterial({ color: NIGHT_GLASS, emissive: NIGHT_GLASS_GLOW })
          return new THREE.MeshLambertMaterial({
            color: boostColour(b.color ?? new THREE.Color(NEUTRAL_MATERIAL)),
            transparent: b.transparent, opacity: b.opacity, side: b.side,
          })
        }
        m.material = Array.isArray(m.material) ? m.material.map(rebuild) : rebuild(m.material)
      })
      // canonical pivot: footprint centre at the origin, feet at y = 0
      const box = new THREE.Box3().setFromObject(root)
      const size = box.getSize(new THREE.Vector3())
      root.position.set(-(box.min.x + size.x / 2), -box.min.y, -(box.min.z + size.z / 2))
      const pivot = new THREE.Group()
      pivot.add(root)
      return pivot
    }))
  }
  return modelCache.get(name)!.then(g => g.clone(true))
}

function boxMesh(box: Box3, face: string, cap: string): THREE.Mesh {
  const w = box.max[0] - box.min[0], h = box.max[1] - box.min[1], d = box.max[2] - box.min[2]
  const geo = new THREE.BoxGeometry(w, h, d)
  const faceMat = new THREE.MeshLambertMaterial({ color: face })
  const capMat = new THREE.MeshLambertMaterial({ color: cap })
  // BoxGeometry face order: +x, -x, +y, -y, +z, -z
  const m = new THREE.Mesh(geo, [faceMat, faceMat, capMat, faceMat, faceMat, faceMat])
  m.position.set(box.min[0] + w / 2, box.min[1] + h / 2, box.min[2] + d / 2)
  m.castShadow = true
  m.receiveShadow = true
  return m
}

function isDescendantOf(node: THREE.Object3D, ancestor: THREE.Object3D): boolean {
  let p: THREE.Object3D | null = node
  while (p) { if (p === ancestor) return true; p = p.parent }
  return false
}

function helperFor(box: Box3, colour: string): THREE.Box3Helper {
  return new THREE.Box3Helper(new THREE.Box3(new THREE.Vector3(...box.min), new THREE.Vector3(...box.max)), new THREE.Color(colour))
}

export function createSceneRenderer(canvas: HTMLCanvasElement, scene: ResolvedScene): SceneRenderer | null {
  let renderer: THREE.WebGLRenderer
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
  } catch {
    return null
  }
  renderer.setPixelRatio(Math.min(2, typeof devicePixelRatio === 'number' ? devicePixelRatio : 1))
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.NoToneMapping
  renderer.setClearColor(0x000000, 0)

  const world = new THREE.Scene()
  const { frame, side } = scene

  // ---- camera from units.ts ------------------------------------------------
  const cam = new THREE.OrthographicCamera(
    -frame.viewWidthUnits / 2, frame.viewWidthUnits / 2,
    frame.viewHeightUnits / 2, -frame.viewHeightUnits / 2, -50, 50,
  )
  const dir = cameraDirection()
  const centre = new THREE.Vector3(...frame.centre)
  cam.position.set(centre.x + dir[0] * 20, centre.y + dir[1] * 20, centre.z + dir[2] * 20)
  cam.lookAt(centre)
  cam.updateProjectionMatrix()

  // ---- light -----------------------------------------------------------------
  world.add(new THREE.HemisphereLight(HEMI_SKY, HEMI_GROUND, HEMI_INTENSITY))
  const key = new THREE.DirectionalLight(KEY_COLOUR, KEY_INTENSITY)
  key.position.set(side / 2 + KEY_OFFSET[0], KEY_OFFSET[1], side / 2 + KEY_OFFSET[2])
  key.target.position.set(side / 2, 0, side / 2)
  key.castShadow = true
  key.shadow.mapSize.set(2048, 2048)
  const sc = key.shadow.camera
  const reach = side * 0.8 + 1
  sc.left = -reach; sc.right = reach; sc.top = reach; sc.bottom = -reach; sc.near = 1; sc.far = 30
  key.shadow.bias = -0.0005
  key.shadow.normalBias = 0.02
  key.shadow.radius = 2
  world.add(key, key.target)

  // ---- highlight decals: one quad per cell, painted on the floor ----
  const cellQuads: THREE.Mesh[][] = []
  const quadGeo = new THREE.PlaneGeometry(CELL, CELL)
  quadGeo.rotateX(-Math.PI / 2)
  for (let r = 0; r < scene.n; r++) {
    cellQuads.push([])
    for (let c = 0; c < scene.n; c++) {
      // Decals sit a hair above the floor and are occluded by walls and
      // furniture like paint on the floor would be; the DOM lane traces carry
      // the full lane extent on top, so nothing about the topology is lost.
      const mat = new THREE.MeshBasicMaterial({ color: NEUTRAL_MATERIAL, transparent: true, opacity: 0, depthWrite: false })
      const q = new THREE.Mesh(quadGeo, mat)
      q.position.set((c + 0.5) * CELL, scene.floorY[r][c] + 0.008, (r + 0.5) * CELL)
      q.renderOrder = 10
      q.visible = false
      world.add(q)
      cellQuads[r].push(q)
    }
  }
  const diagGroup = new THREE.Group()
  diagGroup.visible = false
  world.add(diagGroup)

  // ---- render on demand -------------------------------------------------------------
  let pending = false
  let disposed = false
  const requestRender = () => {
    if (pending || disposed) return
    pending = true
    requestAnimationFrame(() => { pending = false; if (!disposed) renderer.render(world, cam) })
  }

  // ---- build ----------------------------------------------------------------------------
  const jobs: Promise<unknown>[] = []
  // floor: Kenney tiles scaled to the cell, feet at -thickness so the top is y = 0
  const inStairwell = (r: number, c: number) => {
    const sw = scene.stairwell
    return !!sw && c >= sw[0] && r >= sw[1] && c <= sw[2] && r <= sw[3]
  }
  for (let r = 0; r < scene.n; r++) for (let c = 0; c < scene.n; c++) {
    if (inStairwell(r, c)) continue
    const material = scene.floorMaterial[r][c]
    const y = scene.floorY[r][c]
    if (material !== 'wood') {
      const slab = FLOOR_SLAB[material]
      const m = boxMesh({ min: [c * CELL, y - FLOOR_THICKNESS, r * CELL], max: [(c + 1) * CELL, y, (r + 1) * CELL] }, slab.edge, slab.top)
      m.castShadow = false
      world.add(m)
      continue
    }
    jobs.push(loadModel('floorFull').then(g => {
      g.scale.set(CELL, 1, CELL)
      g.position.set((c + 0.5) * CELL, y - FLOOR_THICKNESS, (r + 0.5) * CELL)
      world.add(g)
      requestRender()
    }))
  }
  // thresholds: a half-height step on the low side of every opening to lower ground
  for (const t of scene.thresholds) world.add(boxMesh(t, FOUNDATION, FOUNDATION))
  // walls
  for (const w of scene.walls) {
    const shell = w.kind === 'shell-back' || w.kind === 'shell-front'
    const face = w.kind === 'foundation' ? FOUNDATION : w.kind === 'shell-front' ? PLINTH : shell ? WALL_FACE : PARTITION_FACE
    const cap = w.kind === 'foundation' ? FOUNDATION : w.kind === 'shell-front' ? PLINTH : shell ? WALL_CAP : PARTITION_CAP
    for (const piece of w.pieces) {
      world.add(boxMesh(piece, face, cap))
      diagGroup.add(helperFor(piece, '#2f7dff'))
    }
    for (const f of w.frames) world.add(boxMesh(f, FRAME_WOOD, FRAME_WOOD))
    for (const op of w.openings) diagGroup.add(helperFor(op.box, '#ff9f1c'))
  }
  // objects
  const placeObject = (o: ResolvedObject) => loadModel(o.model).then(g => {
    if (o.part) {
      // keep only the named child (the window pane inside wallWindow) and
      // re-pivot on it: footprint centre at the origin, feet at y = 0
      const root = g.children[0]
      const keep = root.getObjectByName(o.part)
      if (keep) {
        root.traverse(n => { if ((n as THREE.Mesh).isMesh && !isDescendantOf(n, keep)) n.visible = false })
        const bb = new THREE.Box3().setFromObject(keep)
        const sz = bb.getSize(new THREE.Vector3())
        root.position.set(root.position.x - (bb.min.x + sz.x / 2), root.position.y - bb.min.y, root.position.z - (bb.min.z + sz.z / 2))
      }
    }
    g.position.set(o.position[0], o.position[1], o.position[2])
    g.rotation.y = (o.rotY * Math.PI) / 180
    g.userData = { id: o.id, model: o.model, logic: o.logic }
    world.add(g)
    const colour = o.kind === 'furniture' ? (o.parentId ? '#ff4fd8' : '#3ddc84') : '#9aa0a6'
    diagGroup.add(helperFor(o.box, colour))
    requestRender()
  })
  for (const o of scene.objects) jobs.push(placeObject(o))
  const ready = Promise.all(jobs).then(() => { requestRender() })

  // ---- highlights ------------------------------------------------------------------------
  const key2 = (r: number, c: number) => `${r},${c}`
  const setHighlights = (h: HighlightState) => {
    diagGroup.visible = !!h.diag
    for (let r = 0; r < scene.n; r++) for (let c = 0; c < scene.n; c++) {
      const q = cellQuads[r][c]
      const mat = q.material as THREE.MeshBasicMaterial
      let colour: string | null = null, opacity = 0
      if (!h.envOnly) {
        const inRow = h.activeRow === r, inCol = h.activeCol === c
        const active = h.activeRow != null || h.activeCol != null
        const locked = h.lockedRows?.has(r) || h.lockedCols?.has(c)
        const conflict = h.conflictRows?.has(r) || h.conflictCols?.has(c)
        const blocked = h.blockedRows?.has(r) || h.blockedCols?.has(c)
        const clue = h.clueCells?.has(key2(r, c))
        if (locked) { colour = '#4caf72'; opacity = 0.14 }
        if (blocked) { colour = '#8a6cff'; opacity = 0.16 }
        if (conflict) { colour = '#ff3b3b'; opacity = 0.30 }
        if (clue) { colour = '#fff2c8'; opacity = 0.42 }
        if (active) {
          if (inRow && inCol) { colour = '#ffd27a'; opacity = 0.55 }
          else if (inRow) { colour = '#ffb547'; opacity = 0.30 }
          else if (inCol) { colour = '#5ac8ff'; opacity = 0.30 }
          else if (!colour) { colour = '#1a120a'; opacity = 0.10 }
        }
        if (h.hoverTarget && h.hoverTarget.row === r && h.hoverTarget.col === c) {
          colour = h.hoverTarget.valid ? '#3fae5c' : '#c94444'; opacity = 0.5
        }
      }
      q.visible = opacity > 0
      if (colour) mat.color.set(colour)
      mat.opacity = opacity
    }
    requestRender()
  }

  const setSize = (w: number, h: number) => {
    renderer.setSize(w, h, false)
    requestRender()
  }

  const dispose = () => {
    disposed = true
    renderer.dispose()
  }

  requestRender()
  return { setHighlights, setSize, ready, dispose }
}
