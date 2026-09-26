import { existsSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import * as THREE from 'three'
import { describe, expect, it } from 'vitest'
import { metaOf } from '../src/scene3d/catalog'
import { MODEL_BOUNDS, type KenneyModel } from '../src/scene3d/catalog.generated'
import { adaptPackMaterial, PACK_ADAPTERS, packAdapterFor } from '../src/scene3d/packAdapters'

const EXPECTED_ASSETS = {
  graveyard_cryptSmall: { source: 'graveyard-kit--crypt-small', scale: 1, size: [1.35, 1, 1.4] },
  graveyard_grave: { source: 'graveyard-kit--grave', scale: 1, size: [0.724, 0.114, 1.241] },
  graveyard_gravestoneCross: { source: 'graveyard-kit--gravestone-cross', scale: 1, size: [0.45, 0.915, 0.33] },
  miniMarket_shelfBoxes: { source: 'mini-market--shelf-boxes', scale: 1, size: [0.8, 0.85, 0.7] },
  miniMarket_freezer: { source: 'mini-market--freezer', scale: 1, size: [0.8, 0.35, 0.6] },
  miniMarket_cashRegister: { source: 'mini-market--cash-register', scale: 0.5, size: [0.425, 0.297, 0.425] },
  food_cake: { source: 'food-kit--cake', scale: 0.3, size: [0.192, 0.082, 0.192] },
  food_plateDinner: { source: 'food-kit--plate-dinner', scale: 0.3, size: [0.268, 0.066, 0.268] },
  food_cupCoffee: { source: 'food-kit--cup-coffee', scale: 0.3, size: [0.065, 0.042, 0.086] },
  food_glassWine: { source: 'food-kit--glass-wine', scale: 0.3, size: [0.068, 0.15, 0.059] },
} satisfies Record<string, { source: string; scale: number; size: number[] }>

function readGlb(file: string): Record<string, any> {
  const bytes = readFileSync(file)
  expect(bytes.toString('ascii', 0, 4)).toBe('glTF')
  const jsonLength = bytes.readUInt32LE(12)
  return JSON.parse(bytes.subarray(20, 20 + jsonLength).toString('utf8'))
}

function baseColorTextures(gltf: Record<string, any>) {
  return (gltf.materials ?? []).map((material: any) => {
    const info = material.pbrMetallicRoughness?.baseColorTexture
    return info?.extensions?.KHR_texture_transform ?? null
  })
}

describe('Kenney production pack adapters', () => {
  it('uses only the selected measured assets and their pack scales', () => {
    expect(Object.keys(PACK_ADAPTERS).sort()).toEqual(Object.keys(EXPECTED_ASSETS).sort())

    for (const [modelName, expected] of Object.entries(EXPECTED_ASSETS)) {
      const model = modelName as KenneyModel
      const adapter = packAdapterFor(model)
      expect(adapter?.sourceAssetId).toBe(expected.source)
      expect(adapter?.packScale).toBe(expected.scale)
      expect(MODEL_BOUNDS[model].size).toEqual(expected.size)
      expect(MODEL_BOUNDS[model].min[1]).toBe(0)
      expect(existsSync(resolve('public', 'kenney3d', `${model}.glb`))).toBe(true)
    }
    expect(packAdapterFor('bedDouble')).toBeUndefined()
    expect(packAdapterFor('tree_oak')).toBeUndefined()
  })

  it('copies referenced textures and preserves source UV transforms and alpha settings', () => {
    for (const [modelName, expected] of Object.entries(EXPECTED_ASSETS)) {
      const model = modelName as KenneyModel
      const source = readGlb(resolve('public', 'kenney-lab', `${expected.source}.glb`))
      const production = readGlb(resolve('public', 'kenney3d', `${model}.glb`))

      expect(production.extensionsUsed).toEqual(source.extensionsUsed)
      expect(baseColorTextures(production)).toEqual(baseColorTextures(source))
      expect((production.materials ?? []).map((material: any) => [
        material.alphaMode ?? 'OPAQUE',
        material.alphaCutoff ?? 0.5,
        material.doubleSided ?? false,
        material.pbrMetallicRoughness?.baseColorFactor ?? [1, 1, 1, 1],
      ])).toEqual((source.materials ?? []).map((material: any) => [
        material.alphaMode ?? 'OPAQUE',
        material.alphaCutoff ?? 0.5,
        material.doubleSided ?? false,
        material.pbrMetallicRoughness?.baseColorFactor ?? [1, 1, 1, 1],
      ]))

      for (const image of production.images ?? []) {
        if (image.uri?.startsWith('data:')) continue
        expect(existsSync(join('public', 'kenney3d', image.uri))).toBe(true)
      }

      const sceneIndex = production.scene ?? 0
      const rootNode = production.nodes[production.scenes[sceneIndex].nodes[0]]
      expect(rootNode.scale ?? [1, 1, 1]).toEqual([expected.scale, expected.scale, expected.scale])
    }
  })

  it('retains loaded textures, UV transforms, color, and transparency in the pack material conversion', () => {
    const map = new THREE.Texture()
    map.offset.set(0.25, 0.4)
    map.repeat.set(2, 3)
    map.center.set(0.5, 0.25)
    map.rotation = Math.PI / 4
    const alphaMap = new THREE.Texture()
    const source = new THREE.MeshStandardMaterial({
      color: 0x78a24c,
      map,
      alphaMap,
      transparent: true,
      opacity: 0.64,
      alphaTest: 0.25,
      side: THREE.DoubleSide,
      depthWrite: false,
    })

    const adapted = adaptPackMaterial(source)
    expect(adapted).toBeInstanceOf(THREE.MeshLambertMaterial)
    expect(adapted.map).toBe(map)
    expect(adapted.map?.offset.toArray()).toEqual([0.25, 0.4])
    expect(adapted.map?.repeat.toArray()).toEqual([2, 3])
    expect(adapted.map?.center.toArray()).toEqual([0.5, 0.25])
    expect(adapted.map?.rotation).toBe(Math.PI / 4)
    expect(adapted.alphaMap).toBe(alphaMap)
    expect(adapted.color.getHex()).toBe(source.color.getHex())
    expect(adapted.transparent).toBe(true)
    expect(adapted.opacity).toBe(0.64)
    expect(adapted.alphaTest).toBe(0.25)
    expect(adapted.side).toBe(THREE.DoubleSide)
    expect(adapted.depthWrite).toBe(false)
  })

  it('keeps new models on ordinary scene placement semantics without inventing logic types', () => {
    const food = metaOf('food_cake')
    expect(food.support).toBe('surface')
    expect(food.requires).toEqual(['table', 'counter'])
    expect(food.represents).toBeUndefined()

    const register = metaOf('miniMarket_cashRegister')
    expect(register.support).toBe('surface')
    expect(register.requires).toEqual(['counter'])
    expect(register.represents).toBeUndefined()

    for (const model of ['miniMarket_shelfBoxes', 'miniMarket_freezer', 'graveyard_grave', 'graveyard_gravestoneCross'] as const) {
      const meta = metaOf(model)
      expect(meta.support).toBe('floor')
      expect(meta.represents).toEqual([])
      expect(meta.surfaces).toBeUndefined()
    }
  })
})
