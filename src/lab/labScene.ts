import * as THREE from 'three'
import { cameraDirection, FLOOR_THICKNESS, TERRAIN_DROP, WALL_HEIGHT } from '../scene3d/units'
import { MODEL_BOUNDS, type KenneyModel } from '../scene3d/catalog.generated'
import { MODEL_META } from '../scene3d/catalog'
import { cloneAsset, cloneModel, markOwnedGeometry, normalizePivot, releaseLabResources } from './threeUtils'
import type { LabAsset, LabPrototype } from './types'

const HEMI_INTENSITY = 1.6
const KEY_INTENSITY = 2.2
const HEMI_SKY = '#fff8ec'
const HEMI_GROUND = '#9c8266'
const KEY_COLOUR = '#ffe2b8'
const KEY_OFFSET: [number, number, number] = [-4, 9, 2.5]
const ELEVATION = 32
const PERSON_HEIGHT = 0.95

export type LabSceneMode = 'comparison' | 'references' | 'prototype'
export type MaterialMode = 'lambert' | 'source'

export interface LabSceneOptions {
  mode: LabSceneMode
  sample: LabAsset | null
  assets: LabAsset[]
  prototype: LabPrototype | null
  showBounds: boolean
  showOccupantMarker: boolean
  materialMode: MaterialMode
  adaptedScale: number
  activePackageId: string | null
}

export interface LabSceneController {
  ready: Promise<void>
  dispose: () => void
}

type RefModel = { label: string; model: KenneyModel }
type Placement = {
  assetId: string
  at: [number, number, number]
  yaw?: number
  supportY?: number
  supportPackageId?: string
}

export const SCALE_REFERENCES: RefModel[] = [
  { label: 'Cadeira', model: 'chairDesk' },
  { label: 'Porta', model: 'doorway' },
  { label: 'Parede', model: 'wall' },
  { label: 'Bancada', model: 'kitchenCabinet' },
  { label: 'Banco', model: 'bench' },
  { label: 'Árvore', model: 'tree_default' },
]

const COMPOSITIONS: Record<string, Placement[]> = {
  suburban: [
    { assetId: 'city-kit-suburban--building-type-a', at: [0, -TERRAIN_DROP, -0.8] },
    { assetId: 'city-kit-suburban--fence-low', at: [-1.0, -TERRAIN_DROP, 1.1] },
    { assetId: 'city-kit-suburban--fence-low', at: [1.0, -TERRAIN_DROP, 1.1] },
    { assetId: 'city-kit-suburban--driveway-long', at: [0, -TERRAIN_DROP, -0.25], yaw: Math.PI / 2 },
    { assetId: 'city-kit-suburban--driveway-long', at: [0, -TERRAIN_DROP, 0.15], yaw: Math.PI / 2 },
    { assetId: 'city-kit-suburban--driveway-long', at: [0, -TERRAIN_DROP, 0.55], yaw: Math.PI / 2 },
    { assetId: 'city-kit-suburban--driveway-long', at: [0, -TERRAIN_DROP, 0.95], yaw: Math.PI / 2 },
    { assetId: 'city-kit-suburban--driveway-long', at: [0, -TERRAIN_DROP, 1.35], yaw: Math.PI / 2 },
    { assetId: 'city-kit-suburban--driveway-long', at: [0, -TERRAIN_DROP, 1.75], yaw: Math.PI / 2 },
    { assetId: 'city-kit-suburban--path-stones-messy', at: [-0.7, -TERRAIN_DROP, 0.35] },
    { assetId: 'city-kit-suburban--tree-large', at: [-1.25, -TERRAIN_DROP, -0.45] },
    { assetId: 'nature-kit--tree-default', at: [1.25, -TERRAIN_DROP, -0.45] },
    { assetId: 'nature-kit--plant-bush', at: [-1.2, -TERRAIN_DROP, 0.48] },
    { assetId: 'nature-kit--plant-bush', at: [1.2, -TERRAIN_DROP, 0.48] },
  ],
  cafe: [
    { assetId: 'furniture-kit--table', at: [-0.7, 0, -0.9] },
    { assetId: 'furniture-kit--chair', at: [-1.3, 0, -0.05] },
    { assetId: 'furniture-kit--table', at: [-0.75, 0, 0.55] },
    { assetId: 'furniture-kit--chair', at: [-1.35, 0, 0.58] },
    { assetId: 'food-kit--plate-dinner', at: [-0.7, 0, -0.9], supportY: 0.32673, supportPackageId: 'furniture-kit' },
    { assetId: 'food-kit--cake', at: [-0.95, 0, -0.64], supportY: 0.32673, supportPackageId: 'furniture-kit' },
    { assetId: 'food-kit--cup-coffee', at: [-0.42, 0, -1.03], supportY: 0.32673, supportPackageId: 'furniture-kit' },
    { assetId: 'food-kit--glass-wine', at: [-0.35, 0, -0.72], supportY: 0.32673, supportPackageId: 'furniture-kit' },
    { assetId: 'city-kit-commercial--detail-awning', at: [1.0, 1.0, -2.1], supportY: 1.0 },
    { assetId: 'city-kit-commercial--detail-parasol-a', at: [1.55, -TERRAIN_DROP, 1.15] },
  ],
  market: [
    { assetId: 'mini-market--wall', at: [-2.0, 0, -2.3] },
    { assetId: 'mini-market--wall-window', at: [-1.0, 0, -2.3] },
    { assetId: 'mini-market--wall', at: [0, 0, -2.3] },
    { assetId: 'mini-market--wall', at: [1.0, 0, -2.3] },
    { assetId: 'mini-market--wall', at: [2.0, 0, -2.3] },
    { assetId: 'mini-market--wall', at: [-2.5, 0, -1.8], yaw: Math.PI / 2 },
    { assetId: 'mini-market--wall', at: [-2.5, 0, -0.8], yaw: Math.PI / 2 },
    { assetId: 'mini-market--wall', at: [2.5, 0, -1.8], yaw: Math.PI / 2 },
    { assetId: 'mini-market--wall', at: [2.5, 0, -0.8], yaw: Math.PI / 2 },
    { assetId: 'mini-market--shelf-boxes', at: [-1.65, 0, -0.75] },
    { assetId: 'mini-market--shelf-bags', at: [-0.45, 0, -0.75] },
    { assetId: 'mini-market--shelf-boxes', at: [0.75, 0, -0.75] },
    { assetId: 'mini-market--display-fruit', at: [-1.75, 0, 0.45] },
    { assetId: 'mini-market--display-bread', at: [-0.6, 0, 0.45] },
    { assetId: 'mini-market--freezer', at: [1.65, 0, -1.72] },
    { assetId: 'mini-market--cash-register', at: [1.65, 0, 0.72] },
    { assetId: 'mini-market--shopping-cart', at: [0.55, 0, 1.05], yaw: -Math.PI / 2 },
    { assetId: 'mini-market--shopping-basket', at: [-1.75, 0, 1.12] },
    { assetId: 'mini-market--character-employee', at: [2.08, 0, 0.95] },
  ],
  graveyard: [
    { assetId: 'graveyard-kit--crypt-small', at: [0, -TERRAIN_DROP, -1.75] },
    { assetId: 'graveyard-kit--grave', at: [-1.55, -TERRAIN_DROP, -0.45] },
    { assetId: 'graveyard-kit--gravestone-cross', at: [1.5, -TERRAIN_DROP, -0.55] },
    { assetId: 'graveyard-kit--grave', at: [-1.55, -TERRAIN_DROP, 0.8] },
    { assetId: 'graveyard-kit--gravestone-cross', at: [1.5, -TERRAIN_DROP, 0.8] },
    { assetId: 'nature-kit--tree-default', at: [-2.1, -TERRAIN_DROP, -2.3] },
    { assetId: 'nature-kit--tree-default', at: [2.1, -TERRAIN_DROP, -2.3] },
    { assetId: 'nature-kit--plant-bush', at: [-2.25, -TERRAIN_DROP, 0.9] },
    { assetId: 'nature-kit--plant-bush', at: [2.25, -TERRAIN_DROP, 0.9] },
    { assetId: 'nature-kit--fence-simple', at: [-1.5, -TERRAIN_DROP, 2.35] },
    { assetId: 'nature-kit--fence-simple', at: [0, -TERRAIN_DROP, 2.35] },
    { assetId: 'nature-kit--fence-simple', at: [1.5, -TERRAIN_DROP, 2.35] },
  ],
  industrial: [
    { assetId: 'city-kit-industrial--building-a', at: [-2.0, 0, -1.55] },
    { assetId: 'factory-kit--conveyor-long', at: [0.25, 0, -0.55] },
    { assetId: 'factory-kit--machine', at: [1.75, 0, -0.95] },
    { assetId: 'factory-kit--crane', at: [-0.45, 0, -1.35] },
    { assetId: 'factory-kit--box-large', at: [-1.6, 0, 0.15] },
    { assetId: 'city-kit-industrial--detail-tank', at: [1.85, 0, -1.8] },
    { assetId: 'city-kit-industrial--shipping-container-a', at: [1.65, 0, 0.4] },
  ],
  commercial: [
    { assetId: 'city-kit-commercial--building-a', at: [0, 0, -1.75] },
    { assetId: 'city-kit-commercial--detail-awning', at: [0, 1.0, -2.0] },
    { assetId: 'city-kit-commercial--detail-parasol-a', at: [1.5, -TERRAIN_DROP, 0.8] },
  ],
  road: [
    { assetId: 'city-kit-roads--road-straight', at: [-1, -TERRAIN_DROP, 1.7] },
    { assetId: 'city-kit-roads--road-crossing', at: [0, -TERRAIN_DROP, 1.7] },
    { assetId: 'city-kit-roads--road-bend-sidewalk', at: [0, -TERRAIN_DROP, 0.65] },
    { assetId: 'retro-urban-kit--road-asphalt-damaged', at: [1, -TERRAIN_DROP, 1.7] },
  ],
  survival: [
    { assetId: 'survival-kit--tent', at: [-0.85, -TERRAIN_DROP, -1.05] },
    { assetId: 'survival-kit--bedroll', at: [-0.1, -TERRAIN_DROP, -0.95] },
    { assetId: 'survival-kit--campfire-pit', at: [1.3, -TERRAIN_DROP, -0.4] },
  ],
  holiday: [
    { assetId: 'holiday-kit--floor-wood-snow', at: [0, -TERRAIN_DROP, -1.25] },
    { assetId: 'holiday-kit--floor-wood-snow', at: [0, -TERRAIN_DROP, -0.25] },
    { assetId: 'holiday-kit--cabin-wall-wreath', at: [0, -TERRAIN_DROP + 0.075, -1.25] },
    { assetId: 'holiday-kit--cabin-wall', at: [-0.5, -TERRAIN_DROP + 0.075, -0.75], yaw: Math.PI / 2 },
    { assetId: 'holiday-kit--cabin-window-large', at: [0.5, -TERRAIN_DROP + 0.075, -0.75], yaw: Math.PI / 2 },
    { assetId: 'holiday-kit--cabin-doorway', at: [0, -TERRAIN_DROP + 0.075, -0.26] },
    { assetId: 'holiday-kit--cabin-roof-snow-chimney', at: [0, 1.075 - TERRAIN_DROP, -0.95], supportY: 1.075 - TERRAIN_DROP, supportPackageId: 'holiday-kit' },
    { assetId: 'holiday-kit--cabin-fence', at: [-1.9, -TERRAIN_DROP, 1.5] },
    { assetId: 'holiday-kit--cabin-fence', at: [-0.8, -TERRAIN_DROP, 1.5] },
    { assetId: 'holiday-kit--tree-decorated-snow', at: [1.8, -TERRAIN_DROP, -1.05] },
    { assetId: 'holiday-kit--present-a-cube', at: [0.9, -TERRAIN_DROP, 0.65] },
    { assetId: 'holiday-kit--lantern', at: [-1.85, -TERRAIN_DROP, 0.45] },
    { assetId: 'holiday-kit--snowman', at: [1.15, -TERRAIN_DROP, 1.05] },
  ],
  minigolf: [
    { assetId: 'minigolf-kit--start', at: [-1.5, -TERRAIN_DROP, 1.25] },
    { assetId: 'minigolf-kit--straight', at: [-0.5, -TERRAIN_DROP, 1.25] },
    { assetId: 'minigolf-kit--corner', at: [0.5, -TERRAIN_DROP, 1.25] },
    { assetId: 'minigolf-kit--straight', at: [0.5, -TERRAIN_DROP, 0.25], yaw: Math.PI / 2 },
    { assetId: 'minigolf-kit--windmill', at: [0.5, -TERRAIN_DROP, 0.25] },
    { assetId: 'minigolf-kit--corner', at: [0.5, -TERRAIN_DROP, -0.75], yaw: Math.PI },
    { assetId: 'minigolf-kit--straight', at: [-0.5, -TERRAIN_DROP, -0.75] },
    { assetId: 'minigolf-kit--hole-round', at: [-1.5, -TERRAIN_DROP, -0.75] },
    { assetId: 'minigolf-kit--straight', at: [-1.5, -TERRAIN_DROP, 0.25], yaw: Math.PI / 2 },
    { assetId: 'minigolf-kit--hole-square', at: [-1.5, -TERRAIN_DROP, 0.25] },
    { assetId: 'minigolf-kit--ball-red', at: [-1.5, -TERRAIN_DROP + 0.16, 1.2] },
    { assetId: 'minigolf-kit--flag-red', at: [-1.5, -TERRAIN_DROP, -0.75] },
    { assetId: 'minigolf-kit--obstacle-diamond', at: [-0.5, -TERRAIN_DROP, -0.75] },
    { assetId: 'minigolf-kit--ramp', at: [1.55, -TERRAIN_DROP, 0.1] },
    { assetId: 'minigolf-kit--tunnel-wide', at: [1.55, -TERRAIN_DROP, 1.25] },
    { assetId: 'minigolf-kit--castle', at: [-2.35, -TERRAIN_DROP, -1.35] },
  ],
  'building-modular': [
    { assetId: 'building-kit--wall-doorway-square', at: [-0.65, 0, -1.3] },
    { assetId: 'building-kit--wall-window-square', at: [0.35, 0, -1.3] },
    { assetId: 'building-kit--roof-flat-square', at: [-0.15, 2.4, -1.3], supportY: 2.4, supportPackageId: 'building-kit' },
    { assetId: 'modular-buildings--building-sample-house-a', at: [1.75, 0, -1.15] },
    { assetId: 'modular-buildings--building-window-balcony', at: [1.75, 1.14, -1.15], supportY: 1.14, supportPackageId: 'modular-buildings' },
    { assetId: 'modular-buildings--roof-gable', at: [1.75, 1.76, -1.15], supportY: 1.76, supportPackageId: 'modular-buildings' },
  ],
}

const MARKER_POSITIONS: Record<string, [number, number, number]> = {
  suburban: [0, -TERRAIN_DROP, 1.1],
  cafe: [0.9, -TERRAIN_DROP, 1.3],
  market: [0.55, 0, 1.05],
  graveyard: [0, -TERRAIN_DROP, 1.55],
  industrial: [0, 0, 2.1],
  commercial: [1.8, -TERRAIN_DROP, 1.65],
  road: [0, -TERRAIN_DROP, 2.75],
  survival: [0, -TERRAIN_DROP, 1.55],
  holiday: [1.15, -TERRAIN_DROP, 1.55],
  minigolf: [-1.5, -TERRAIN_DROP, 1.25],
  'building-modular': [0.1, 0, 1.65],
}

const HUMAN_REFERENCE_POSITIONS: Record<string, [number, number]> = {
  suburban: [1.72, 0.95],
  market: [-0.7, 1.02],
}

function ownedLambert(colour: string, options: Partial<THREE.MeshLambertMaterialParameters> = {}): THREE.MeshLambertMaterial {
  const material = new THREE.MeshLambertMaterial({ color: colour, ...options })
  material.userData.labOwned = true
  return material
}

function addBox(scene: THREE.Scene, size: [number, number, number], position: [number, number, number], colour: string): void {
  const geometry = markOwnedGeometry(new THREE.BoxGeometry(...size))
  const mesh = new THREE.Mesh(geometry, ownedLambert(colour))
  mesh.position.set(...position)
  mesh.castShadow = true
  mesh.receiveShadow = true
  scene.add(mesh)
}

function addLine(scene: THREE.Scene, points: THREE.Vector3[], colour: string): void {
  const geometry = markOwnedGeometry(new THREE.BufferGeometry().setFromPoints(points))
  const material = new THREE.LineBasicMaterial({ color: colour, depthWrite: false })
  material.userData.labOwned = true
  const line = new THREE.LineSegments(geometry, material)
  line.renderOrder = 5
  scene.add(line)
}

function addWireBox(scene: THREE.Scene, model: THREE.Object3D, colour: string): void {
  model.updateMatrixWorld(true)
  const bounds = new THREE.Box3().setFromObject(model)
  if (bounds.isEmpty()) return
  const helper = new THREE.Box3Helper(bounds, new THREE.Color(colour))
  markOwnedGeometry(helper.geometry)
  const helperMaterial = Array.isArray(helper.material) ? helper.material[0] : helper.material
  helperMaterial.userData.labOwned = true
  helper.renderOrder = 6
  scene.add(helper)
}

function addHeightGauge(scene: THREE.Scene, x: number, z: number, y: number, height: number): void {
  addLine(scene, [new THREE.Vector3(x, y, z), new THREE.Vector3(x, y + height, z)], '#c99b4d')
  for (const fraction of [0, 0.5, 1]) {
    const level = y + height * fraction
    const half = fraction === 0.5 ? 0.07 : 0.11
    addLine(scene, [new THREE.Vector3(x - half, level, z), new THREE.Vector3(x + half, level, z)], '#c99b4d')
  }
}

function addHumanReference(scene: THREE.Scene, x: number, z: number, groundY = 0): void {
  const figure = new THREE.Group()
  const body = ownedLambert('#d3c29f')
  const darker = ownedLambert('#80735e')
  const cylinder = (radiusTop: number, radiusBottom: number, height: number, position: [number, number, number], material: THREE.Material) => {
    const geometry = markOwnedGeometry(new THREE.CylinderGeometry(radiusTop, radiusBottom, height, 8))
    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.set(...position)
    mesh.castShadow = true
    figure.add(mesh)
    return mesh
  }
  const legHeight = 0.39
  const headRadius = 0.075
  cylinder(0.075, 0.105, 0.34, [0, 0.57, 0], body)
  cylinder(0.029, 0.035, legHeight, [-0.045, 0.195, 0], darker)
  cylinder(0.029, 0.035, legHeight, [0.045, 0.195, 0], darker)
  const leftArm = cylinder(0.022, 0.028, 0.33, [-0.13, 0.57, 0], darker)
  leftArm.rotation.z = -0.24
  const rightArm = cylinder(0.022, 0.028, 0.33, [0.13, 0.57, 0], darker)
  rightArm.rotation.z = 0.24
  const head = new THREE.Mesh(markOwnedGeometry(new THREE.SphereGeometry(headRadius, 10, 8)), body)
  head.position.set(0, PERSON_HEIGHT - headRadius, 0)
  head.castShadow = true
  figure.add(head)
  figure.position.set(x, groundY, z)
  scene.add(figure)
  addHeightGauge(scene, x + 0.2, z, groundY, PERSON_HEIGHT)
}

function addOccupantMarker(scene: THREE.Scene, x: number, groundY: number, z: number): void {
  const ring = new THREE.Mesh(
    markOwnedGeometry(new THREE.RingGeometry(0.09, 0.125, 24)),
    ownedLambert('#b98745', { transparent: true, opacity: 0.86, depthWrite: false }),
  )
  ring.rotation.x = -Math.PI / 2
  ring.position.set(x, groundY + 0.008, z)
  ring.renderOrder = 7
  scene.add(ring)
  const post = new THREE.Mesh(markOwnedGeometry(new THREE.CylinderGeometry(0.025, 0.025, 0.15, 10)), ownedLambert('#b98745'))
  post.position.set(x, groundY + 0.075, z)
  post.castShadow = true
  scene.add(post)
}

function addCommonLighting(scene: THREE.Scene): void {
  scene.add(new THREE.HemisphereLight(HEMI_SKY, HEMI_GROUND, HEMI_INTENSITY))
  const light = new THREE.DirectionalLight(KEY_COLOUR, KEY_INTENSITY)
  light.position.set(...KEY_OFFSET)
  light.target.position.set(0, 0, 0)
  light.castShadow = true
  light.shadow.mapSize.set(1536, 1536)
  light.shadow.camera.left = -8
  light.shadow.camera.right = 8
  light.shadow.camera.top = 8
  light.shadow.camera.bottom = -8
  light.shadow.camera.near = 1
  light.shadow.camera.far = 30
  light.shadow.bias = -0.0005
  light.shadow.normalBias = 0.02
  light.shadow.radius = 2
  scene.add(light, light.target)
}

function addScaleStage(scene: THREE.Scene, width: number, depth = 2.6): void {
  addBox(scene, [width, FLOOR_THICKNESS, depth], [0, -FLOOR_THICKNESS / 2, 0], '#c7b596')
}

function addWorldRuler(scene: THREE.Scene, at: [number, number, number], length = 1): void {
  const [x, y, z] = at
  addLine(scene, [new THREE.Vector3(x, y, z), new THREE.Vector3(x + length, y, z)], '#c99b4d')
  for (let index = 0; index <= 10; index++) {
    const tickX = x + length * index / 10
    const tick = index % 5 === 0 ? 0.15 : index % 2 === 0 ? 0.095 : 0.06
    addLine(scene, [new THREE.Vector3(tickX, y, z - tick / 2), new THREE.Vector3(tickX, y, z + tick / 2)], '#c99b4d')
  }
}

function materialAdapter(options: LabSceneOptions): boolean {
  return options.materialMode === 'lambert'
}

function scaleFor(options: LabSceneOptions, packageId: string): number {
  return options.activePackageId === packageId ? options.adaptedScale : 1
}

async function addSamplePair(scene: THREE.Scene, options: LabSceneOptions): Promise<void> {
  const sample = options.sample
  if (!sample) return
  const factor = scaleFor(options, sample.packageId)
  const sampleWidth = sample.bounds.size[0] * factor
  const sampleDepth = sample.bounds.size[2] * factor
  const plinthWidth = Math.max(1.0, sampleWidth + 0.42)
  const plinthDepth = Math.max(1.0, sampleDepth + 0.42)
  const gap = Math.max(1.75, plinthWidth + 0.3)
  addBox(scene, [plinthWidth, FLOOR_THICKNESS, plinthDepth], [-gap / 2, -FLOOR_THICKNESS / 2, 0.2], '#c7b596')
  addBox(scene, [plinthWidth, FLOOR_THICKNESS, plinthDepth], [gap / 2, -FLOOR_THICKNESS / 2, 0.2], '#c7b596')
  const [native, adapted] = await Promise.all([
    cloneAsset(sample, materialAdapter(options)),
    cloneAsset(sample, materialAdapter(options)),
  ])
  const nativePlaced = new THREE.Group()
  nativePlaced.position.set(-gap / 2, 0, 0.2)
  nativePlaced.add(native)
  const adaptedPlaced = new THREE.Group()
  adaptedPlaced.position.set(gap / 2, 0, 0.2)
  normalizePivot(adapted)
  adapted.scale.setScalar(factor)
  adaptedPlaced.add(adapted)
  scene.add(nativePlaced, adaptedPlaced)
  if (options.showBounds) {
    addWireBox(scene, nativePlaced, '#c26750')
    addWireBox(scene, adaptedPlaced, '#719267')
  }
  addWorldRuler(scene, [-0.5, 0.012, 1.2], 1)
  addHumanReference(scene, -0.95, -1.15)
}

async function addReferenceLine(scene: THREE.Scene, options: LabSceneOptions): Promise<void> {
  const sample = options.sample
  const refSlots = [-2.25, -0.85, 0.55, 1.95, 3.35, 4.75]
  const references = SCALE_REFERENCES.map(async (reference, index) => {
    const model = await cloneModel(`/kenney3d/${reference.model}.glb`, materialAdapter(options))
    normalizePivot(model)
    const wrapper = new THREE.Group()
    wrapper.position.set(refSlots[index], 0, -0.35)
    wrapper.add(model)
    scene.add(wrapper)
    if (options.showBounds) addWireBox(scene, wrapper, '#c99b4d')
  })
  const jobs: Promise<void>[] = [...references]
  if (sample) {
    const model = await cloneAsset(sample, materialAdapter(options))
    normalizePivot(model)
    model.scale.setScalar(scaleFor(options, sample.packageId))
    const wrapper = new THREE.Group()
    wrapper.position.set(-4.2, 0, 0.75)
    wrapper.add(model)
    scene.add(wrapper)
    if (options.showBounds) addWireBox(scene, wrapper, '#719267')
  }
  await Promise.all(jobs)
  addWorldRuler(scene, [-0.35, 0.012, 1.0], 1)
  addHumanReference(scene, 6.2, -0.35)
  if (options.showOccupantMarker) addOccupantMarker(scene, 0, 0, 1.25)
}

function addZone(scene: THREE.Scene, size: [number, number, number], at: [number, number, number], colour: string): void {
  addBox(scene, size, at, colour)
}

function addPrototypeGround(scene: THREE.Scene, id: string): void {
  const interior = (colour: string) => addZone(scene, [5.2, FLOOR_THICKNESS, 3.4], [0, -FLOOR_THICKNESS / 2, -0.8], colour)
  const exterior = (colour: string) => addZone(scene, [5.2, FLOOR_THICKNESS / 2, 2.7], [0, -TERRAIN_DROP - FLOOR_THICKNESS / 4, 2.25], colour)
  const threshold = (colour: string) => addZone(scene, [5.2, FLOOR_THICKNESS / 2, 0.34], [0, -FLOOR_THICKNESS / 4, 1.25], colour)
  const continuousExterior = (colour: string, width = 5.4, depth = 5.8) => addZone(scene, [width, FLOOR_THICKNESS, depth], [0, -TERRAIN_DROP - FLOOR_THICKNESS / 2, 0], colour)

  switch (id) {
    case 'suburban':
      continuousExterior('#88a86f', 4.0, 4.4)
      addZone(scene, [1.5, 0.012, 0.24], [0, -TERRAIN_DROP + 0.01, 2.02], '#9e8f77')
      break
    case 'cafe':
      interior('#b58a62')
      threshold('#c7b596')
      exterior('#8f9187')
      addZone(scene, [5.2, 0.08, 0.8], [0, -TERRAIN_DROP - 0.04, 3.65], '#686d69')
      break
    case 'market':
      interior('#b6ad99')
      addZone(scene, [3.4, FLOOR_THICKNESS / 2, 0.34], [0, -FLOOR_THICKNESS / 4, 1.05], '#c7b596')
      addZone(scene, [3.4, FLOOR_THICKNESS / 2, 0.84], [0, -TERRAIN_DROP - FLOOR_THICKNESS / 4, 1.64], '#898d87')
      break
    case 'graveyard':
      continuousExterior('#759267')
      addZone(scene, [1.1, 0.012, 3.6], [0, -TERRAIN_DROP + 0.006, 0.75], '#aaa28e')
      break
    case 'industrial':
      continuousExterior('#7a7d77')
      interior('#89877d')
      addZone(scene, [5.2, 0.08, 0.9], [0, -0.04, -2.3], '#777a74')
      addZone(scene, [5.2, FLOOR_THICKNESS, 1.3], [0, -TERRAIN_DROP - FLOOR_THICKNESS / 2, 2.15], '#7a7d77')
      break
    case 'commercial':
      continuousExterior('#aaa390')
      addZone(scene, [3.6, FLOOR_THICKNESS, 1.5], [0, -FLOOR_THICKNESS / 2, -1.65], '#918a7e')
      addZone(scene, [5.2, 0.08, 1.0], [0, -0.04, 3.45], '#686d69')
      break
    case 'road':
      continuousExterior('#686d69')
      addZone(scene, [5.2, 0.08, 1.0], [0, -0.04, -1.65], '#aaa390')
      break
    case 'survival':
      continuousExterior('#947c5b')
      addZone(scene, [4.4, 0.012, 0.7], [0, -TERRAIN_DROP + 0.01, 0.4], '#b59b6d')
      break
    case 'holiday':
      continuousExterior('#e7e3d9')
      addZone(scene, [1.0, 0.012, 1.0], [-0.5, -TERRAIN_DROP + 0.01, -1.25], '#c9c5bb')
      break
    case 'minigolf':
      continuousExterior('#83a46b')
      addZone(scene, [5.0, 0.08, 0.1], [0, -TERRAIN_DROP + 0.04, -2.5], '#b39773')
      addZone(scene, [5.0, 0.08, 0.1], [0, -TERRAIN_DROP + 0.04, 2.5], '#b39773')
      addZone(scene, [0.1, 0.08, 5.0], [-2.5, -TERRAIN_DROP + 0.04, 0], '#b39773')
      addZone(scene, [0.1, 0.08, 5.0], [2.5, -TERRAIN_DROP + 0.04, 0], '#b39773')
      break
    case 'building-modular':
      interior('#b7ad99')
      exterior('#888d85')
      threshold('#c7b596')
      break
  }
}

async function addCafeCutaway(scene: THREE.Scene, options: LabSceneOptions): Promise<void> {
  const wallPositions: Array<{ model: KenneyModel; at: [number, number, number]; yaw: number }> = [
    { model: 'wall', at: [-1.5, 0, -2.2], yaw: 0 },
    { model: 'wallDoorway', at: [-0.5, 0, -2.2], yaw: 0 },
    { model: 'wall', at: [0.5, 0, -2.2], yaw: 0 },
    { model: 'wall', at: [1.5, 0, -2.2], yaw: 0 },
    { model: 'wall', at: [-2.1, 0, -1.2], yaw: Math.PI / 2 },
  ]
  const wallJobs = wallPositions.map(async (piece) => {
    const model = await cloneModel(`/kenney3d/${piece.model}.glb`, materialAdapter(options))
    normalizePivot(model)
    const group = new THREE.Group()
    group.position.set(...piece.at)
    group.rotation.y = piece.yaw
    group.add(model)
    scene.add(group)
    if (options.showBounds) addWireBox(scene, group, '#b98745')
  })
  const counterJobs = [1.12, 1.57].map(async (x) => {
    const model = await cloneModel('/kenney3d/kitchenCabinet.glb', materialAdapter(options))
    normalizePivot(model)
    const group = new THREE.Group()
    group.position.set(x, 0, -1.05)
    group.add(model)
    scene.add(group)
    if (options.showBounds) addWireBox(scene, group, '#b98745')
  })
  await Promise.all([...wallJobs, ...counterJobs])
}

function getPrototypeAssets(options: LabSceneOptions): Map<string, LabAsset> {
  const source = new Map(options.assets.map((asset) => [asset.id, asset]))
  const selected = new Map<string, LabAsset>()
  for (const id of options.prototype?.assetIds ?? []) {
    const asset = source.get(id)
    if (asset) selected.set(id, asset)
  }
  return selected
}

async function placeAsset(scene: THREE.Scene, asset: LabAsset, spec: Placement, options: LabSceneOptions): Promise<void> {
  const model = await cloneAsset(asset, materialAdapter(options))
  normalizePivot(model)
  const factor = scaleFor(options, asset.packageId)
  model.scale.setScalar(factor)
  const group = new THREE.Group()
  const supportY = spec.supportY ?? spec.at[1]
  const supportScale = spec.supportPackageId ? scaleFor(options, spec.supportPackageId) : 1
  group.position.set(spec.at[0], supportY * supportScale, spec.at[2])
  group.rotation.y = spec.yaw ?? 0
  group.add(model)
  scene.add(group)
  if (options.showBounds) addWireBox(scene, group, '#9b6d38')
}

async function buildPrototype(scene: THREE.Scene, options: LabSceneOptions): Promise<void> {
  const prototype = options.prototype
  if (!prototype) {
    addPrototypeGround(scene, 'market')
    return
  }
  addPrototypeGround(scene, prototype.id)
  if (prototype.id === 'cafe') await addCafeCutaway(scene, options)
  const byId = getPrototypeAssets(options)
  const placements = COMPOSITIONS[prototype.id] ?? []
  const jobs = placements.flatMap((spec) => {
    const asset = byId.get(spec.assetId)
    return asset ? [placeAsset(scene, asset, spec, options)] : []
  })
  await Promise.all(jobs)

  const markerPosition = MARKER_POSITIONS[prototype.id] ?? [0, -TERRAIN_DROP, 1.5]
  const humanPosition = HUMAN_REFERENCE_POSITIONS[prototype.id] ?? [2.2, 1.75]
  addHumanReference(scene, humanPosition[0], humanPosition[1], markerPosition[1])
  if (options.showOccupantMarker) addOccupantMarker(scene, ...markerPosition)
}

function sceneBounds(options: LabSceneOptions): { width: number; height: number } {
  if (options.mode === 'comparison') {
    const sample = options.sample
    const factor = sample ? scaleFor(options, sample.packageId) : 1
    const width = sample
      ? Math.max(4.8, ((sample.bounds.size[0] * factor + 0.72) * 2 + sample.bounds.size[2] * factor + 0.72) * Math.SQRT1_2 + 1)
      : 4.8
    const height = sample ? Math.max(4.8, sample.bounds.size[1] * factor + 1.5) : 4.8
    return { width, height }
  }
  if (options.mode === 'references') {
    const sampleHeight = (options.sample?.bounds.size[1] ?? 0) * (options.sample ? scaleFor(options, options.sample.packageId) : 1)
    return { width: 12.8, height: Math.max(5, sampleHeight + 1.4, 1.70789 + 1.4) }
  }
  const selected = getPrototypeAssets(options)
  const tallest = Math.max(1.70789, ...Array.from(selected.values(), (asset) => asset.bounds.size[1] * scaleFor(options, asset.packageId)))
  const structureHeight = options.prototype?.id === 'building-modular' ? 2.8 : 0
  return { width: 8.1, height: Math.max(6.1, tallest + 1.4, structureHeight + 1.4) }
}

function configureCamera(camera: THREE.OrthographicCamera, aspect: number, options: LabSceneOptions): void {
  const bounds = sceneBounds(options)
  const height = Math.max(bounds.height, bounds.width / Math.max(aspect, 0.7))
  const width = height * Math.max(aspect, 0.7)
  camera.left = -width / 2
  camera.right = width / 2
  camera.top = height / 2
  camera.bottom = -height / 2
  camera.updateProjectionMatrix()
}

function fitCameraToScene(scene: THREE.Scene, camera: THREE.OrthographicCamera, aspect: number, options: LabSceneOptions): void {
  scene.updateMatrixWorld(true)
  const bounds = new THREE.Box3().setFromObject(scene)
  if (bounds.isEmpty()) {
    configureCamera(camera, aspect, options)
    return
  }

  const right = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion).normalize()
  const up = new THREE.Vector3(0, 1, 0).applyQuaternion(camera.quaternion).normalize()
  const corners: THREE.Vector3[] = []
  for (const x of [bounds.min.x, bounds.max.x]) {
    for (const y of [bounds.min.y, bounds.max.y]) {
      for (const z of [bounds.min.z, bounds.max.z]) corners.push(new THREE.Vector3(x, y, z))
    }
  }
  const screenX = corners.map((point) => point.dot(right))
  const screenY = corners.map((point) => point.dot(up))
  const minX = Math.min(...screenX), maxX = Math.max(...screenX)
  const minY = Math.min(...screenY), maxY = Math.max(...screenY)
  const centre = bounds.getCenter(new THREE.Vector3())
  centre.addScaledVector(right, (minX + maxX) / 2 - centre.dot(right))
  centre.addScaledVector(up, (minY + maxY) / 2 - centre.dot(up))

  const direction = cameraDirection(ELEVATION)
  camera.position.set(
    centre.x + direction[0] * 20,
    centre.y + direction[1] * 20,
    centre.z + direction[2] * 20,
  )
  camera.lookAt(centre)
  const viewAspect = Math.max(aspect, 0.7)
  const height = Math.max(2.6, (maxY - minY) * 1.22, ((maxX - minX) / viewAspect) * 1.22)
  const width = height * viewAspect
  camera.left = -width / 2
  camera.right = width / 2
  camera.top = height / 2
  camera.bottom = -height / 2
  camera.updateProjectionMatrix()
}

export function createLabScene(canvas: HTMLCanvasElement, options: LabSceneOptions): LabSceneController | null {
  let renderer: THREE.WebGLRenderer
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
  } catch {
    return null
  }
  renderer.setPixelRatio(Math.min(2, typeof devicePixelRatio === 'number' ? devicePixelRatio : 1))
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFShadowMap
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.NoToneMapping
  renderer.setClearColor(0x000000, 0)

  const scene = new THREE.Scene()
  const camera = new THREE.OrthographicCamera(-8, 8, 4.5, -4.5, 0.1, 60)
  const target = new THREE.Vector3(0, 0, 0)
  const direction = cameraDirection(ELEVATION)
  camera.position.set(target.x + direction[0] * 20, target.y + direction[1] * 20, target.z + direction[2] * 20)
  camera.lookAt(target)
  camera.updateProjectionMatrix()
  addCommonLighting(scene)

  let disposed = false
  let pending = false
  let sceneReady = false
  const requestRender = () => {
    if (pending || disposed) return
    pending = true
    requestAnimationFrame(() => {
      pending = false
      if (!disposed) renderer.render(scene, camera)
    })
  }
  const resize = () => {
    const bounds = canvas.getBoundingClientRect()
    const width = Math.max(1, Math.round(bounds.width))
    const height = Math.max(1, Math.round(bounds.height))
    renderer.setSize(width, height, false)
    if (sceneReady) fitCameraToScene(scene, camera, width / height, options)
    else configureCamera(camera, width / height, options)
    requestRender()
  }
  const observer = new ResizeObserver(resize)
  observer.observe(canvas)
  resize()

  const ready = (async () => {
    if (options.mode === 'comparison') {
      await addSamplePair(scene, options)
      return
    }
    if (options.mode === 'references') {
      addScaleStage(scene, 13.6, 2.9)
      await addReferenceLine(scene, options)
      return
    }
    await buildPrototype(scene, options)
  })()
  const rendered = ready.then(() => {
    sceneReady = true
    resize()
    requestRender()
  }).catch((error: unknown) => {
    console.error('Falha ao carregar modelos Kenney do laboratório.', error)
    throw error
  })

  return {
    ready: rendered,
    dispose: () => {
      disposed = true
      observer.disconnect()
      releaseLabResources(scene)
      renderer.dispose()
    },
  }
}

export function referenceDimensions(model: KenneyModel): readonly number[] {
  return MODEL_BOUNDS[model].size
}

export function referenceWallThickness(): number {
  return MODEL_BOUNDS.wall.size[2]
}

export function surfaceHeight(model: KenneyModel): number | undefined {
  const surfaces = MODEL_META[model]?.surfaces
  return surfaces ? Object.values(surfaces)[0]?.y : undefined
}

export const LAB_WALL_HEIGHT = WALL_HEIGHT
