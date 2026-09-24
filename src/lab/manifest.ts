import rawManifest from './data.json'
import type { KenneyLabManifest, LabAsset } from './types'

const ASSET_ROOT = '/kenney-lab/'

export const manifest = parseManifest(rawManifest as unknown as KenneyLabManifest)

export function isLabAssetPath(path: string): boolean {
  return path.startsWith(ASSET_ROOT) && !path.includes('..') && !path.includes('\\')
}

export function assetUrl(asset: LabAsset): string {
  if (!isLabAssetPath(asset.publicPath)) {
    throw new Error(`Caminho de modelo fora de /kenney-lab: ${asset.publicPath}`)
  }
  return asset.publicPath
}

export function parseManifest(value: KenneyLabManifest): KenneyLabManifest {
  if (!value || !Array.isArray(value.packages) || !Array.isArray(value.assets) || !Array.isArray(value.prototypes)) {
    throw new Error('O manifesto do laboratório não contém os pacotes, modelos e protótipos esperados.')
  }

  const packageIds = new Set(value.packages.map((pack) => pack.id))
  const assetIds = new Set(value.assets.map((asset) => asset.id))
  if (packageIds.size !== value.packages.length || assetIds.size !== value.assets.length) {
    throw new Error('O manifesto contém identificadores repetidos.')
  }

  for (const asset of value.assets) {
    if (!packageIds.has(asset.packageId)) {
      throw new Error(`O modelo ${asset.id} refere um pacote que não existe.`)
    }
    if (!isLabAssetPath(asset.publicPath)) {
      throw new Error(`O modelo ${asset.id} não aponta para /kenney-lab/.`)
    }
    if (asset.bounds.size.some((dimension) => !Number.isFinite(dimension) || dimension < 0)) {
      throw new Error(`O modelo ${asset.id} tem dimensões inválidas.`)
    }
  }

  for (const prototype of value.prototypes) {
    if (prototype.assetIds.some((id) => !assetIds.has(id))) {
      throw new Error(`O protótipo ${prototype.id} refere um modelo que não existe.`)
    }
  }

  return value
}

export function hasTextureMap(asset: LabAsset): boolean {
  const metadata = JSON.stringify([asset.materials, asset.texture, asset.textureInfo]).toLowerCase()
  return metadata.includes('texture') || metadata.includes('colormap') || metadata.includes('.png') || metadata.includes('.jpg')
}

export function formatUnits(value: number, decimals = 2): string {
  return new Intl.NumberFormat('pt-PT', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

export function formatDimensions(size: readonly number[]): string {
  return size.map((dimension) => formatUnits(dimension, 2)).join(' × ') + ' u'
}
