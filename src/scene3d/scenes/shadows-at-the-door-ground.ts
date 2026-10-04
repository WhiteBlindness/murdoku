import type { SceneSpec } from '../schema'
import { MODEL_BOUNDS } from '../catalog.generated'
import { CELL } from '../units'

const stairRun = MODEL_BOUNDS.stairsOpen.size[0] / CELL
const stairWidth = MODEL_BOUNDS.stairsOpen.size[2] / CELL
const stairAt: [number, number] = [1.5, 5.96]
const stairwellBounds: [number, number, number, number] = [
  stairAt[0] - stairWidth / 2,
  stairAt[1] - stairRun / 2,
  stairAt[0] + stairWidth / 2,
  stairAt[1] + stairRun / 2,
]

export const shadowsAtTheDoorStairwellBounds = stairwellBounds

export const shadowsAtTheDoorGround: SceneSpec = {
  puzzleId: 'master-2',
  floor: 0,
  storeyFootprint: { kind: 'full' },
  entry: { wall: 'west', at: 6.9 },
  shell: { features: [
    { wall: 'north', at: 1.5, kind: 'window' },
    { wall: 'north', at: 6.5, kind: 'window' },
    { wall: 'west', at: 5.4, kind: 'window' },
  ] },
  stairs: { model: 'stairsOpen', at: stairAt, facing: 'S' },
  exteriorSupportBays: [
    { id: 'garden-north-west', cells: [4, 4, 5, 6] },
    { id: 'garden-south-west', cells: [4, 7, 5, 7] },
    { id: 'garden-north-east', cells: [6, 4, 7, 6] },
    { id: 'garden-south-east', cells: [6, 7, 7, 7] },
  ],
  floors: [
    { id: 'kitchen-floor', cells: [0, 0, 3, 3], material: 'tile', kind: 'interior' },
    { id: 'dining-floor', cells: [4, 0, 7, 3], material: 'wood', kind: 'interior' },
    { id: 'living-floor', cells: [0, 4, 3, 7], material: 'wood', kind: 'interior' },
    { id: 'garden-ground', cells: [4, 4, 7, 7], material: 'grass', kind: 'exterior' },
  ],
  walls: [
    { id: 'kitchen-dining-partition', from: [4, 0], to: [4, 4], height: 'half', openings: [{ at: 2.4, width: 1.2, kind: 'door' }] },
    { id: 'kitchen-living-partition', from: [0, 4], to: [4, 4], height: 'half', openings: [{ at: 3.35, width: 1, kind: 'door' }] },
    { id: 'dining-garden-facade', from: [4, 4], to: [8, 4], height: 'half', openings: [{ at: 6.35, width: 1.2, kind: 'door' }] },
    { id: 'living-garden-facade', from: [4, 4], to: [4, 8], height: 'half', openings: [{ at: 6.2, width: 1.2, kind: 'door' }] },
  ],
  furniture: [
    { id: 'kitchen-stove', model: 'kitchenStove', logic: 'stove@0,0', at: [0.5, 0.5], facing: 'S' },
    { id: 'kitchen-fridge-north', model: 'kitchenFridge', logic: 'fridge@0,1', at: [1.5, 0.5], facing: 'S' },
    { id: 'kitchen-counter-upper-run', model: 'kitchenCabinet', logic: 'counter@1,0', at: [0.45, 1.15], facing: 'E' },
    { id: 'kitchen-counter-lower-run', model: 'kitchenCabinet', logic: 'counter@1,0', at: [0.45, 2.05], facing: 'E' },
    { id: 'kitchen-fridge-clue', model: 'kitchenFridgeSmall', logic: 'fridge@1,3', at: [3.5, 1.5], facing: 'W' },

    { id: 'dining-table', model: 'table', logic: 'table@3,6', at: [5.6, 2.8], facing: 'S' },
    { id: 'dining-chair-anchor', model: 'chair', logic: 'chair@0,7', at: [7.5, 0.5], facing: 'S' },
    { id: 'dining-chair-table-north', model: 'chair', at: [5.6, 2.05], facing: 'S' },
    { id: 'dining-chair-table-south', model: 'chair', at: [5.6, 3.55], facing: 'N' },
    { id: 'dining-lamp', model: 'lampRoundFloor', logic: 'lamp@3,4', at: [4.5, 3.5], facing: 'S' },

    { id: 'living-sofa', model: 'loungeSofa', logic: 'sofa@5,0', at: [0.5, 5.4], facing: 'E' },
    { id: 'living-clock', model: 'speaker', logic: 'clock@4,2', at: [2.5, 4.5], facing: 'S' },
    { id: 'living-tv-cabinet', model: 'cabinetTelevision', logic: 'tv@7,1', at: [1.5, 7.5], facing: 'S' },
    { id: 'living-tv', model: 'televisionVintage', logic: 'tv@7,1', on: { parent: 'living-tv-cabinet' } },

    { id: 'garden-plant-west', model: 'pottedPlant', logic: 'plant@4,5', at: [5.5, 4.5], facing: 'S' },
    { id: 'garden-shrub-north-east', model: 'plant_bushSmall', logic: 'shrub@4,7', at: [7.5, 4.5], facing: 'S' },
    { id: 'garden-plant-east', model: 'pottedPlant', logic: 'plant@5,7', at: [7.5, 5.5], facing: 'S' },
    { id: 'garden-shrub-south-east', model: 'plant_bushSmall', logic: 'shrub@6,7', at: [7.5, 6.5], facing: 'S' },
  ],
}
