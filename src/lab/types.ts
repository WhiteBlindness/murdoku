export type LabVec3 = [number, number, number]

export interface LabBounds {
  min: LabVec3
  max: LabVec3
  size: LabVec3
  center?: LabVec3
}

export type LabRole =
  | 'structure'
  | 'surface'
  | 'seating'
  | 'storage'
  | 'detail'
  | 'ground'
  | 'path'
  | 'vegetation'
  | 'light'
  | 'showcase'
  | string

export interface LabPackage {
  id: string
  displayName: string
  officialUrl: string
  zipSha256: string
  modelCount: number
  stats: Record<string, unknown>
}

export interface LabAsset {
  id: string
  packageId: string
  name: string
  publicPath: string
  bounds: LabBounds
  pivot?: unknown
  origin?: unknown
  vertexCount?: number
  triangleCount?: number
  materials?: unknown
  texture?: unknown
  textureInfo?: unknown
  sourceZipSha256?: string
  officialUrl?: string
  selectedForPrototype?: boolean
  prototypeTags?: string[]
  labRole?: LabRole
}

export interface LabPrototype {
  id: string
  title: string
  packIds: string[]
  assetIds: string[]
}

export interface KenneyLabManifest {
  schemaVersion: string | number
  units?: string
  packages: LabPackage[]
  assets: LabAsset[]
  prototypes: LabPrototype[]
  references?: unknown
}
