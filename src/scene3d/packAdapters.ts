import * as THREE from 'three'
import type { KenneyModel } from './catalog.generated'

export interface PackAssetAdapter {
  sourceAssetId: string
  /** Uniform scale baked into the GLB by scripts/kenney-pack-adapt.mjs. */
  packScale: number
  material: 'textured-lambert'
}

/** Production adapters for the measured V2 lab subset. */
export const PACK_ADAPTERS = {
  graveyard_cryptSmall: { sourceAssetId: 'graveyard-kit--crypt-small', packScale: 1, material: 'textured-lambert' },
  graveyard_grave: { sourceAssetId: 'graveyard-kit--grave', packScale: 1, material: 'textured-lambert' },
  graveyard_gravestoneCross: { sourceAssetId: 'graveyard-kit--gravestone-cross', packScale: 1, material: 'textured-lambert' },
  miniMarket_shelfBoxes: { sourceAssetId: 'mini-market--shelf-boxes', packScale: 1, material: 'textured-lambert' },
  miniMarket_freezer: { sourceAssetId: 'mini-market--freezer', packScale: 1, material: 'textured-lambert' },
  miniMarket_cashRegister: { sourceAssetId: 'mini-market--cash-register', packScale: 0.5, material: 'textured-lambert' },
  food_cake: { sourceAssetId: 'food-kit--cake', packScale: 0.3, material: 'textured-lambert' },
  food_plateDinner: { sourceAssetId: 'food-kit--plate-dinner', packScale: 0.3, material: 'textured-lambert' },
  food_cupCoffee: { sourceAssetId: 'food-kit--cup-coffee', packScale: 0.3, material: 'textured-lambert' },
  food_glassWine: { sourceAssetId: 'food-kit--glass-wine', packScale: 0.3, material: 'textured-lambert' },
} as const satisfies Readonly<Partial<Record<KenneyModel, PackAssetAdapter>>>

export function packAdapterFor(model: KenneyModel | string): PackAssetAdapter | undefined {
  return Object.hasOwn(PACK_ADAPTERS, model)
    ? PACK_ADAPTERS[model as keyof typeof PACK_ADAPTERS]
    : undefined
}

/** Convert only adapted pack materials, retaining their texture and alpha state. */
export function adaptPackMaterial(source: THREE.Material): THREE.MeshLambertMaterial {
  const sourceMaps = source as THREE.MeshStandardMaterial
  const sourceColor = (source as THREE.MeshBasicMaterial).color
  const adapted = new THREE.MeshLambertMaterial({
    name: source.name,
    color: sourceColor?.clone() ?? new THREE.Color(0xffffff),
    map: sourceMaps.map ?? null,
    alphaMap: sourceMaps.alphaMap ?? null,
    emissive: sourceMaps.emissive?.clone() ?? new THREE.Color(0x000000),
    emissiveMap: sourceMaps.emissiveMap ?? null,
    emissiveIntensity: sourceMaps.emissiveIntensity ?? 1,
    aoMap: sourceMaps.aoMap ?? null,
    aoMapIntensity: sourceMaps.aoMapIntensity ?? 1,
    lightMap: sourceMaps.lightMap ?? null,
    lightMapIntensity: sourceMaps.lightMapIntensity ?? 1,
    bumpMap: sourceMaps.bumpMap ?? null,
    bumpScale: sourceMaps.bumpScale ?? 1,
    normalMap: sourceMaps.normalMap ?? null,
    normalScale: sourceMaps.normalScale?.clone(),
    displacementMap: sourceMaps.displacementMap ?? null,
    displacementScale: sourceMaps.displacementScale ?? 1,
    displacementBias: sourceMaps.displacementBias ?? 0,
    vertexColors: sourceMaps.vertexColors ?? false,
    flatShading: sourceMaps.flatShading ?? false,
    side: source.side,
    transparent: source.transparent,
    opacity: source.opacity,
    alphaTest: source.alphaTest,
    depthWrite: source.depthWrite,
    depthTest: source.depthTest,
    blending: source.blending,
    toneMapped: source.toneMapped,
    fog: (source as THREE.MeshBasicMaterial).fog,
  })
  adapted.name = source.name
  return adapted
}
