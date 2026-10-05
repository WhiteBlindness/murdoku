import type { SceneSpec } from '../schema'
import { MODEL_BOUNDS } from '../catalog.generated'
import { CELL } from '../units'

const stairRun = MODEL_BOUNDS.stairsOpen.size[0] / CELL
const stairWidth = MODEL_BOUNDS.stairsOpen.size[2] / CELL
const stairAt: [number, number] = [3.65, 5.5]
const stairwellBounds: [number, number, number, number] = [
  stairAt[0] - stairWidth / 2,
  stairAt[1] - stairRun / 2,
  stairAt[0] + stairWidth / 2,
  stairAt[1] + stairRun / 2,
]
const stairPartitionClearance = 0.2

export const noOneHeardStairwellBounds = stairwellBounds

export const noOneHeardGround: SceneSpec = {
  puzzleId: 'expert-8',
  floor: 0,
  storeyFootprint: { kind: 'full' },
  entry: { wall: 'west', at: 4.25 },
  shell: { features: [
    { wall: 'north', at: 6.5, kind: 'window' },
    { wall: 'west', at: 6.35, kind: 'window' },
  ] },
  stairs: { model: 'stairsOpen', at: stairAt, facing: 'S' },
  exteriorSupportBays: [
    { id: 'front-yard-west-frame', cells: [0, 0, 2, 2] },
    { id: 'front-yard-east-frame', cells: [3, 0, 4, 2] },
  ],
  floors: [
    { id: 'front-yard', cells: [0, 0, 4, 2], material: 'grass', kind: 'exterior' },
    { id: 'pantry-floor', cells: [5, 0, 7, 2], material: 'tile', kind: 'interior' },
    { id: 'hallway-floor', cells: [0, 3, 7, 4], material: 'stone', kind: 'interior' },
    { id: 'dining-room-floor', cells: [0, 5, 7, 7], material: 'wood', kind: 'interior' },
  ],
  walls: [
    { id: 'yard-hall-facade', from: [0, 3], to: [5, 3], height: 'half', openings: [{ at: 2.5, width: 1.25, kind: 'door' }] },
    { id: 'yard-pantry-partition', from: [5, 0], to: [5, 3], height: 'half', openings: [{ at: 1.5, width: 1.1, kind: 'door' }] },
    { id: 'pantry-hall-partition', from: [5, 3], to: [8, 3], height: 'half', openings: [{ at: 5.5, width: 1, kind: 'door' }] },
    {
      id: 'hall-dining-west-partition',
      from: [0, 5],
      to: [stairwellBounds[0] - stairPartitionClearance, 5],
      height: 'half',
      freeEnds: ['to'],
      openings: [{ at: 1.5, width: 1.15, kind: 'door' }],
    },
    {
      id: 'hall-dining-east-partition',
      from: [stairwellBounds[2] + stairPartitionClearance, 5],
      to: [8, 5],
      height: 'half',
      freeEnds: ['from'],
      openings: [{ at: 5.5, width: 1.15, kind: 'door' }],
    },
  ],
  furniture: [
    { id: 'dining-west-lamp', model: 'lampRoundFloor', logic: 'lamp@7,0', at: [0.5, 7.5], facing: 'N' },
    { id: 'dining-table', model: 'table', logic: 'table@5,6', at: [6.75, 5.7], facing: 'N' },
    { id: 'dining-chair-west', model: 'chair', logic: 'chair@5,1', at: [1.5, 5.7], facing: 'N' },
    { id: 'dining-chair-table', model: 'chair', logic: 'chair@5,5', at: [5.8, 5.8], facing: 'E' },

    { id: 'hallway-plant-southwest', model: 'pottedPlant', logic: 'plant@4,0', at: [0.85, 4.1] },
    { id: 'hallway-clock-table', model: 'sideTable', at: [2.5, 4.5] },
    { id: 'hallway-clock', model: 'radio', logic: 'clock@4,2', on: { parent: 'hallway-clock-table' } },
    { id: 'hallway-plant-north', model: 'pottedPlant', logic: 'plant@3,1', at: [1.5, 3.5] },

    { id: 'yard-shrub-west', model: 'plant_bushSmall', logic: 'shrub@1,0', at: [0.5, 1.5] },
    { id: 'yard-plant-east', model: 'pottedPlant', logic: 'plant@0,4', at: [4.5, 0.5] },
    { id: 'yard-shrub-east', model: 'plant_bushSmall', logic: 'shrub@0,3', at: [3.5, 0.5] },
    { id: 'pantry-box-south', model: 'cardboardBoxClosed', logic: 'box@2,7', at: [7.5, 2.5] },
    { id: 'pantry-fridge-west', model: 'kitchenFridge', logic: 'fridge@0,5', at: [5.5, 0.5], facing: 'S' },
    { id: 'pantry-fridge-east', model: 'kitchenFridge', logic: 'fridge@0,7', at: [7.5, 0.5], facing: 'S' },

    { id: 'hallway-clock-table-southeast', model: 'sideTable', at: [6.5, 3.5] },
    { id: 'hallway-clock-southeast', model: 'radio', logic: 'clock@3,6', on: { parent: 'hallway-clock-table-southeast' } },
    { id: 'dining-victim-lamp', model: 'lampRoundFloor', logic: 'lamp@7,2', at: [2.5, 7.5], facing: 'N' },
    { id: 'pantry-box-greta', model: 'cardboardBoxClosed', logic: 'box@1,7', at: [7.2, 1.5] },
    { id: 'dining-culprit-lamp', model: 'lampRoundFloor', logic: 'lamp@5,0', at: [0.5, 5.5], facing: 'N' },
  ],
}