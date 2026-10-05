import type { SceneSpec } from '../schema'
import { MODEL_BOUNDS } from '../catalog.generated'
import { CELL } from '../units'

const stairAt: [number, number] = [2.0, 1.05]
const stairRun = MODEL_BOUNDS.stairsOpen.size[0] / CELL
const stairWidth = MODEL_BOUNDS.stairsOpen.size[2] / CELL

export const aDebtUnsettledStairwellBounds: [number, number, number, number] = [
  stairAt[0] - stairRun / 2,
  stairAt[1] - stairWidth / 2,
  stairAt[0] + stairRun / 2,
  stairAt[1] + stairWidth / 2,
]

export const aDebtUnsettledGround: SceneSpec = {
  puzzleId: 'master-4',
  floor: 0,
  storeyFootprint: { kind: 'full' },
  entry: { wall: 'north', at: 2.55 },
  stairs: { model: 'stairsOpen', at: stairAt, facing: 'E' },
  exteriorSupportBays: [
    { id: 'garden-hall-west', cells: [4, 0, 6, 2] },
    { id: 'garden-hall-east', cells: [7, 0, 7, 2] },
    { id: 'garden-bedroom-west', cells: [4, 3, 6, 4] },
    { id: 'garden-bedroom-east', cells: [7, 3, 7, 4] },
    { id: 'porch-bathroom', cells: [0, 5, 2, 7] },
    { id: 'porch-study', cells: [3, 5, 3, 7] },
  ],
  shell: { features: [
    { wall: 'west', at: 2.5, kind: 'window' },
    { wall: 'north', at: 0.7, kind: 'window' },
    { wall: 'north', at: 3.6, kind: 'window' },
  ] },
  floors: [
    { id: 'living-room-floor', cells: [0, 0, 3, 4], material: 'wood', kind: 'interior' },
    { id: 'garden-ground', cells: [4, 0, 7, 4], material: 'grass', kind: 'exterior' },
    { id: 'porch-ground', cells: [0, 5, 3, 7], material: 'stone', kind: 'exterior' },
    { id: 'dining-room-floor', cells: [4, 5, 7, 7], material: 'wood', kind: 'interior' },
  ],
  walls: [
    { id: 'living-garden-opening', from: [4, 0], to: [4, 5], height: 'half', openings: [{ at: 3.5, width: 1.2, kind: 'door' }] },
    { id: 'living-porch-opening', from: [0, 5], to: [4, 5], height: 'half', openings: [{ at: 1.3, width: 1.2, kind: 'door' }] },
    { id: 'garden-dining-boundary', from: [4, 5], to: [8, 5], height: 'half' },
    { id: 'porch-dining-opening', from: [4, 5], to: [4, 8], height: 'half', openings: [{ at: 7.25, width: 1, kind: 'door' }] },
  ],
  furniture: [
    { id: 'living-clock', model: 'speaker', logic: 'clock@0,3', at: [3.5, 0.55], facing: 'S' },
    { id: 'living-sofa', model: 'loungeSofa', logic: 'sofa@1,3', at: [3.65, 1.95], facing: 'W' },
    { id: 'living-tv-cabinet-north', model: 'cabinetTelevision', logic: 'tv@0,1', at: [1.5, 0.36], facing: 'S' },
    { id: 'living-tv-north', model: 'televisionVintage', on: { parent: 'living-tv-cabinet-north' } },
    { id: 'living-tv-cabinet-south', model: 'cabinetTelevision', logic: 'tv@4,3', at: [3.0, 4.45], facing: 'N' },
    { id: 'living-tv-south', model: 'televisionVintage', on: { parent: 'living-tv-cabinet-south' } },
    { id: 'living-rug', model: 'rugRectangle', at: [1.9, 2.75], facing: 'E' },

    { id: 'garden-plant-north', model: 'pottedPlant', logic: 'plant@0,5', at: [5.5, 0.5], facing: 'S' },
    { id: 'garden-plant-west', model: 'pottedPlant', logic: 'plant@1,4', at: [4.5, 1.5], facing: 'S' },
    { id: 'garden-shrub-south', model: 'plant_bushSmall', logic: 'shrub@4,5', at: [5.5, 4.5], facing: 'S' },
    { id: 'garden-path-stone-a', model: 'path_stone', at: [6.5, 2.45], facing: 'E' },
    { id: 'garden-path-stone-b', model: 'path_stone', at: [6.5, 3.35], facing: 'E' },

    { id: 'porch-chair-yuki', model: 'chair', logic: 'chair@5,0', at: [0.55, 5.55], facing: 'E' },
    { id: 'porch-plant-yuki', model: 'pottedPlant', logic: 'plant@5,3', at: [3.5, 5.55], facing: 'S' },
    { id: 'porch-chair-south', model: 'chair', logic: 'chair@7,1', at: [1.5, 7.45], facing: 'N' },

    { id: 'dining-table-north', model: 'table', logic: 'table@5,5', at: [5.75, 5.75], facing: 'E' },
    { id: 'dining-lamp', model: 'lampRoundFloor', logic: 'lamp@5,4', at: [4.55, 5.55], facing: 'N' },
    { id: 'dining-chair', model: 'chair', logic: 'chair@6,4', at: [4.92, 6.12], facing: 'N' },
    { id: 'dining-table-alexander', model: 'table', logic: 'table@7,4', at: [4.92, 7.2], facing: 'E' },
    { id: 'dining-chair-south', model: 'chair', at: [6.5, 7.35], facing: 'W' },
  ],
}
