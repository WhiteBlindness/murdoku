import type { SceneSpec } from '../schema'
import { MODEL_BOUNDS } from '../catalog.generated'
import { CELL } from '../units'

const stairRunCells = MODEL_BOUNDS.stairsOpen.size[0] / CELL
const stairWidthCells = MODEL_BOUNDS.stairsOpen.size[2] / CELL
const stairHeadRow = 7
const stairAt: [number, number] = [5.1, stairHeadRow - stairRunCells / 2]
const stairwellBounds: [number, number, number, number] = [
  stairAt[0] - stairWidthCells / 2,
  stairAt[1] - stairRunCells / 2,
  stairAt[0] + stairWidthCells / 2,
  stairHeadRow,
]

export const aClockStoppedStairwellBounds = stairwellBounds

export const aClockStoppedGround: SceneSpec = {
  puzzleId: 'expert-6',
  floor: 0,
  storeyFootprint: { kind: 'full' },
  entry: { wall: 'west', at: 1.5 },
  shell: {
    features: [{ wall: 'north', at: 1.5, kind: 'window' }],
  },
  exteriorSupportBays: [
    { id: 'garden-west', cells: [3, 0, 5, 2] },
    { id: 'garden-east', cells: [6, 0, 7, 2] },
    { id: 'front-yard-west-middle', cells: [0, 3, 1, 5] },
    { id: 'front-yard-east-middle', cells: [2, 3, 3, 5] },
    { id: 'front-yard-west-south', cells: [0, 6, 1, 7] },
    { id: 'front-yard-east-south', cells: [2, 6, 3, 7] },
  ],
  stairs: { model: 'stairsOpen', at: stairAt, facing: 'S' },
  floors: [
    { id: 'garden', cells: [3, 0, 7, 2], material: 'grass', kind: 'exterior' },
    { id: 'front-yard', cells: [0, 3, 3, 7], material: 'dirt', kind: 'exterior' },
    { id: 'pantry-tile', cells: [0, 0, 2, 2], material: 'tile', kind: 'interior' },
  ],
  walls: [
    { id: 'pantry-garden', from: [3, 0], to: [3, 3], height: 'cutaway', openings: [{ at: 1.25, width: 1.2, kind: 'open' }] },
    { id: 'pantry-front-yard', from: [0, 3], to: [3, 3], height: 'cutaway', openings: [{ at: 1.5, width: 1, kind: 'door' }] },
    { id: 'office-front-yard', from: [4, 3], to: [4, 8], height: 'cutaway', openings: [{ at: 4.2, width: 1, kind: 'door' }] },
    { id: 'office-garden', from: [4, 3], to: [8, 3], height: 'cutaway' },
  ],
  furniture: [
    { id: 'front-shrub', model: 'plant_bushSmall', logic: 'shrub@3,3', at: [3.5, 3.5] },
    { id: 'front-plant', model: 'plant_bushSmall', logic: 'plant@7,1', at: [1.5, 7.5] },
    { id: 'front-entry-shrub', model: 'plant_bushSmall', logic: 'shrub@6,0', at: [0.5, 6.5] },

    { id: 'office-chair', model: 'chair', logic: 'chair@4,7', at: [7.5, 4.5], facing: 'W' },
    { id: 'office-bookcase', model: 'bookcaseOpenLow', logic: 'bookshelf@7,4', against: { wall: 'south', at: 5 } },
    { id: 'office-clock-stand', model: 'sideTable', at: [6.5, 3.5] },
    { id: 'office-clock', model: 'radio', logic: 'clock@3,6', on: { parent: 'office-clock-stand' } },
    { id: 'office-desk', model: 'desk', logic: 'desk@5,4', at: [4.32, 5.9], facing: 'E' },
    { id: 'pantry-box-south', model: 'cardboardBoxClosed', logic: 'box@2,2', at: [2.35, 2.1] },
    { id: 'pantry-fridge', model: 'kitchenFridge', logic: 'fridge@2,0', at: [0.5, 2.5], facing: 'S' },
    { id: 'pantry-box-north', model: 'cardboardBoxClosed', logic: 'box@1,2', at: [2.1, 1.25] },

    { id: 'garden-plant-east', model: 'pottedPlant', logic: 'plant@0,7', at: [7.5, 0.5] },
    { id: 'garden-shrub', model: 'plant_bushSmall', logic: 'shrub@0,4', at: [4.5, 0.5] },
    { id: 'garden-plant-south-east', model: 'pottedPlant', logic: 'plant@1,7', at: [7.5, 1.5] },
    { id: 'office-solution-desk', model: 'desk', logic: 'desk@3,7', against: { wall: 'east', at: 3.5 } },
  ],
}
