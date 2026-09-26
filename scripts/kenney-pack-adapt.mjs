import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const labRoot = path.join(root, 'public', 'kenney-lab')
const productionRoot = path.join(root, 'public', 'kenney3d')
const reportPath = path.join(root, 'docs', 'reports', 'kenney-lab-measurements.json')
const catalogPath = path.join(root, 'src', 'scene3d', 'catalog.generated.ts')

// Keep this manifest aligned with PACK_ADAPTERS in src/scene3d/packAdapters.ts.
// Each source was measured in the V2 lab report before it enters production.
const assets = [
  { model: 'graveyard_cryptSmall', source: 'graveyard-kit--crypt-small', scale: 1 },
  { model: 'graveyard_grave', source: 'graveyard-kit--grave', scale: 1 },
  { model: 'graveyard_gravestoneCross', source: 'graveyard-kit--gravestone-cross', scale: 1 },
  { model: 'miniMarket_shelfBoxes', source: 'mini-market--shelf-boxes', scale: 1 },
  { model: 'miniMarket_freezer', source: 'mini-market--freezer', scale: 1 },
  { model: 'miniMarket_cashRegister', source: 'mini-market--cash-register', scale: 0.5 },
  { model: 'food_cake', source: 'food-kit--cake', scale: 0.3 },
  { model: 'food_plateDinner', source: 'food-kit--plate-dinner', scale: 0.3 },
  { model: 'food_cupCoffee', source: 'food-kit--cup-coffee', scale: 0.3 },
  { model: 'food_glassWine', source: 'food-kit--glass-wine', scale: 0.3 },
]

function assertInside(parent, candidate, label) {
  const relative = path.relative(parent, candidate)
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new Error(`${label} escapes its permitted directory: ${candidate}`)
  }
}

function parseGlb(bytes, label) {
  if (bytes.toString('ascii', 0, 4) !== 'glTF' || bytes.readUInt32LE(4) !== 2 || bytes.readUInt32LE(8) !== bytes.length) {
    throw new Error(`${label} is not a valid glTF 2.0 binary`)
  }

  const chunks = []
  let json = null
  for (let offset = 12; offset < bytes.length;) {
    const length = bytes.readUInt32LE(offset)
    const type = bytes.readUInt32LE(offset + 4)
    const data = bytes.subarray(offset + 8, offset + 8 + length)
    if (offset + 8 + length > bytes.length) throw new Error(`${label} has a truncated chunk`)
    chunks.push({ type, data })
    if (type === 0x4e4f534a) json = JSON.parse(data.toString('utf8').replaceAll('\0', '').trim())
    offset += 8 + length
  }
  if (!json) throw new Error(`${label} has no JSON chunk`)
  return { json, chunks }
}

function encodeGlb(json, chunks) {
  const encodedChunks = chunks.map(({ type, data }) => {
    if (type !== 0x4e4f534a) return { type, data }
    let jsonBytes = Buffer.from(JSON.stringify(json))
    const padding = (4 - jsonBytes.length % 4) % 4
    if (padding) jsonBytes = Buffer.concat([jsonBytes, Buffer.alloc(padding, 0x20)])
    return { type, data: jsonBytes }
  })
  const length = 12 + encodedChunks.reduce((sum, chunk) => sum + 8 + chunk.data.length, 0)
  const output = Buffer.alloc(length)
  output.write('glTF', 0, 'ascii')
  output.writeUInt32LE(2, 4)
  output.writeUInt32LE(length, 8)

  let offset = 12
  for (const chunk of encodedChunks) {
    output.writeUInt32LE(chunk.data.length, offset)
    output.writeUInt32LE(chunk.type, offset + 4)
    chunk.data.copy(output, offset + 8)
    offset += 8 + chunk.data.length
  }
  return output
}

function measureRow(catalog, model) {
  const escaped = model.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const match = catalog.match(new RegExp(`^\\s*${escaped}: \\{ size: \\[([^\\]]+)\\], min: \\[([^\\]]+)\\] \\},$`, 'm'))
  if (!match) throw new Error(`Measured catalog is missing ${model}`)
  return {
    size: match[1].split(',').map(value => Number(value.trim())),
    min: match[2].split(',').map(value => Number(value.trim())),
  }
}

function rounded(value, places = 3) {
  const factor = 10 ** places
  return Math.round(value * factor) / factor
}

function equalVec(actual, expected, label) {
  if (actual.length !== expected.length || actual.some((value, index) => Math.abs(value - expected[index]) > 0.0011)) {
    throw new Error(`${label} measurement differs: got [${actual}], expected [${expected}]`)
  }
}

async function copyReferencedTextures(json, sourcePath, model) {
  for (const [index, image] of (json.images ?? []).entries()) {
    if (!image.uri || image.uri.startsWith('data:')) continue
    if (/^[a-z][a-z\d+.-]*:/i.test(image.uri)) throw new Error(`${model} has an unsupported external texture URI`)

    const localUri = decodeURIComponent(image.uri.split(/[?#]/, 1)[0])
    const sourceTexture = path.resolve(path.dirname(sourcePath), localUri)
    assertInside(labRoot, sourceTexture, `${model} texture`)
    const extension = path.extname(sourceTexture).toLowerCase() || '.bin'
    const stem = path.basename(sourceTexture, path.extname(sourceTexture)).replace(/[^a-z0-9-]+/gi, '-')
    const relativeOutput = path.join('textures', model, `${index}-${stem}${extension}`)
    const destination = path.resolve(productionRoot, relativeOutput)
    assertInside(productionRoot, destination, `${model} texture output`)
    await fs.mkdir(path.dirname(destination), { recursive: true })
    await fs.copyFile(sourceTexture, destination)
    image.uri = relativeOutput.split(path.sep).join('/')
  }
}

async function adaptAsset(asset, measuredSources) {
  const measurement = measuredSources.get(asset.source)
  if (!measurement?.selectedForPrototype || !measurement.bounds) {
    throw new Error(`${asset.source} is not a selected, measured V2 lab asset`)
  }
  if (!measurement.pivot?.touchesGroundAtOrigin) {
    throw new Error(`${asset.source} does not meet the measured ground-contact contract`)
  }

  const sourcePath = path.join(labRoot, `${asset.source}.glb`)
  const destination = path.join(productionRoot, `${asset.model}.glb`)
  assertInside(labRoot, sourcePath, 'Source asset')
  assertInside(productionRoot, destination, 'Production asset')
  const { json, chunks } = parseGlb(await fs.readFile(sourcePath), asset.source)

  if (asset.scale !== 1) {
    const sceneIndex = Number.isInteger(json.scene) ? json.scene : 0
    const scene = json.scenes?.[sceneIndex]
    if (!scene || !Array.isArray(scene.nodes) || !Array.isArray(json.nodes)) {
      throw new Error(`${asset.source} has no measurable default scene roots`)
    }
    const originalRoots = [...scene.nodes]
    const adapterNode = json.nodes.length
    json.nodes.push({
      name: `pack-transform-${asset.model}`,
      children: originalRoots,
      scale: [asset.scale, asset.scale, asset.scale],
    })
    scene.nodes = [adapterNode]
  }

  await copyReferencedTextures(json, sourcePath, asset.model)
  await fs.mkdir(productionRoot, { recursive: true })
  await fs.writeFile(destination, encodeGlb(json, chunks))
}

async function main() {
  const report = JSON.parse(await fs.readFile(reportPath, 'utf8'))
  if (report.baselineSha !== 'aa384c2f69ab6168786abccf04f713ad3ae24a58') {
    throw new Error('The V2 measurement report does not match the approved lab baseline')
  }
  const measuredSources = new Map(report.models.map(model => [model.id, model]))

  for (const asset of assets) await adaptAsset(asset, measuredSources)

  const catalogGenerator = path.join(root, 'scripts', 'kenney-catalog.mjs')
  const generated = spawnSync(process.execPath, [catalogGenerator], { cwd: root, encoding: 'utf8' })
  if (generated.status !== 0) throw new Error(generated.stderr || 'Kenney catalog generation failed')

  const catalog = await fs.readFile(catalogPath, 'utf8')
  for (const asset of assets) {
    const source = measuredSources.get(asset.source)
    const measured = measureRow(catalog, asset.model)
    const expectedSize = source.bounds.size.map(size => rounded(size * asset.scale))
    const expectedMin = source.bounds.min.map(min => rounded(min * asset.scale))
    equalVec(measured.size, expectedSize, `${asset.model} size`)
    equalVec(measured.min, expectedMin, `${asset.model} minimum`)
    if (measured.min[1] !== 0) throw new Error(`${asset.model} no longer contacts the floor at y = 0`)
    console.log(`${asset.model}: size [${measured.size.join(', ')}], min [${measured.min.join(', ')}], scale ${asset.scale}`)
  }
}

main().catch(error => {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})
