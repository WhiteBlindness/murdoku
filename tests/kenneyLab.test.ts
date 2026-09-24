import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { isLabAssetPath, manifest, parseManifest } from '../src/lab/manifest'

describe('Kenney environment lab manifest', () => {
  it('covers the expected package and prototype families with local model copies', () => {
    expect(manifest.packages).toHaveLength(15)
    expect(manifest.prototypes).toHaveLength(10)

    const packageIds = new Set(manifest.packages.map((pack) => pack.id))
    const assetIds = new Set(manifest.assets.map((asset) => asset.id))
    for (const prototype of manifest.prototypes) {
      expect(prototype.packIds.every((id) => packageIds.has(id))).toBe(true)
      expect(prototype.assetIds.length).toBeGreaterThan(0)
      expect(prototype.assetIds.every((id) => assetIds.has(id))).toBe(true)
    }
    for (const asset of manifest.assets) {
      expect(isLabAssetPath(asset.publicPath)).toBe(true)
      expect(existsSync(resolve(process.cwd(), 'public', asset.publicPath.slice(1)))).toBe(true)
    }
  })

  it('retains canonical scale references in Kenney units', () => {
    const heightOf = (id: string) => manifest.assets.find((asset) => asset.id === id)?.bounds.size[1]
    const thicknessOf = (id: string) => manifest.assets.find((asset) => asset.id === id)?.bounds.size[2]

    expect(heightOf('furniture-kit--chair')).toBeCloseTo(0.47, 5)
    expect(heightOf('furniture-kit--doorway')).toBeCloseTo(1.00953, 5)
    expect(heightOf('furniture-kit--wall')).toBeCloseTo(1.28953, 5)
    expect(thicknessOf('furniture-kit--wall')).toBeCloseTo(0.05, 5)
    expect(heightOf('nature-kit--tree-default')).toBeCloseTo(1.70789, 5)
  })

  it('rejects model paths outside the dedicated public asset root', () => {
    const invalid = structuredClone(manifest)
    invalid.assets[0].publicPath = '/kenney3d/model.glb'
    expect(() => parseManifest(invalid)).toThrow(/\/kenney-lab\//)
  })
})
