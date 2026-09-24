import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { assetUrl } from './manifest'
import type { LabAsset } from './types'

const SATURATION = 1.15
const loader = new GLTFLoader()
const modelCache = new Map<string, Promise<THREE.Group>>()

function sourceModel(url: string): Promise<THREE.Group> {
  if (!modelCache.has(url)) {
    modelCache.set(url, loader.loadAsync(url).then((gltf) => gltf.scene))
  }
  return modelCache.get(url)!
}

function boostColour(source: THREE.Color | undefined): THREE.Color {
  const colour = source?.clone() ?? new THREE.Color('#ffffff')
  const hsl = { h: 0, s: 0, l: 0 }
  colour.getHSL(hsl)
  return new THREE.Color().setHSL(hsl.h, Math.min(1, hsl.s * SATURATION), hsl.l)
}

function copyTexture(source: THREE.Texture | null | undefined, colourMap = false): THREE.Texture | null {
  if (!source) return null
  const texture = source.clone()
  if (colourMap) texture.colorSpace = THREE.SRGBColorSpace
  texture.userData.labOwned = true
  return texture
}

function asLambert(source: THREE.Material): THREE.MeshLambertMaterial {
  const material = source as THREE.Material & {
    color?: THREE.Color
    emissive?: THREE.Color
    map?: THREE.Texture | null
    alphaMap?: THREE.Texture | null
    emissiveMap?: THREE.Texture | null
    normalMap?: THREE.Texture | null
    aoMap?: THREE.Texture | null
    lightMap?: THREE.Texture | null
    bumpMap?: THREE.Texture | null
    transparent?: boolean
    opacity?: number
    alphaTest?: number
    depthWrite?: boolean
    vertexColors?: boolean
    flatShading?: boolean
    emissiveIntensity?: number
  }
  const lambert = new THREE.MeshLambertMaterial({
    name: source.name,
    color: boostColour(material.color),
    emissive: material.emissive?.clone(),
    emissiveIntensity: material.emissiveIntensity,
    map: copyTexture(material.map, true),
    alphaMap: copyTexture(material.alphaMap),
    emissiveMap: copyTexture(material.emissiveMap, true),
    normalMap: copyTexture(material.normalMap),
    aoMap: copyTexture(material.aoMap),
    lightMap: copyTexture(material.lightMap, true),
    bumpMap: copyTexture(material.bumpMap),
    transparent: material.transparent,
    opacity: material.opacity,
    alphaTest: material.alphaTest,
    depthWrite: material.depthWrite,
    side: source.side,
    vertexColors: material.vertexColors,
    flatShading: material.flatShading,
  })
  lambert.userData.labOwned = true
  return lambert
}

export function normalizePivot(model: THREE.Object3D): THREE.Object3D {
  model.updateMatrixWorld(true)
  const bounds = new THREE.Box3().setFromObject(model)
  const size = bounds.getSize(new THREE.Vector3())
  model.position.set(
    -(bounds.min.x + size.x / 2),
    -bounds.min.y,
    -(bounds.min.z + size.z / 2),
  )
  model.updateMatrixWorld(true)
  return model
}

export async function cloneModel(url: string, adaptMaterials: boolean): Promise<THREE.Group> {
  const source = await sourceModel(url)
  const group = source.clone(true)
  group.traverse((node) => {
    const mesh = node as THREE.Mesh
    if (!mesh.isMesh) return
    const sourceMaterials = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
    const hasTransparency = sourceMaterials.some((material) => material.transparent || material.opacity < 1 || material.alphaTest > 0)
    mesh.castShadow = !hasTransparency
    mesh.receiveShadow = true
    if (adaptMaterials) {
      const converted = sourceMaterials.map(asLambert)
      mesh.material = Array.isArray(mesh.material) ? converted : converted[0]
    }
  })
  return group
}

export async function cloneAsset(asset: LabAsset, adaptMaterials: boolean): Promise<THREE.Group> {
  return cloneModel(assetUrl(asset), adaptMaterials)
}

export function markOwnedGeometry<T extends THREE.BufferGeometry>(geometry: T): T {
  geometry.userData.labOwned = true
  return geometry
}

export function releaseLabResources(root: THREE.Object3D): void {
  root.traverse((node) => {
    const resourceNode = node as THREE.Object3D & { geometry?: THREE.BufferGeometry; material?: THREE.Material | THREE.Material[] }
    if (resourceNode.geometry?.userData.labOwned) resourceNode.geometry.dispose()
    if (!resourceNode.material) return
    const materials = Array.isArray(resourceNode.material) ? resourceNode.material : [resourceNode.material]
    for (const material of materials) {
      if (!material.userData.labOwned) continue
      for (const value of Object.values(material)) {
        if (value instanceof THREE.Texture && value.userData.labOwned) value.dispose()
      }
      material.dispose()
    }
  })
}
