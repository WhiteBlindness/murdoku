import type { SceneSpec } from '../schema'
import { MODEL_BOUNDS } from '../catalog.generated'
import { CELL } from '../units'

const stairRun = MODEL_BOUNDS.stairsOpen.size[0] / CELL
const stairWidth = MODEL_BOUNDS.stairsOpen.size[2] / CELL
const stairHeadX = 5
const stairAt: [number, number] = [stairHeadX - stairRun / 2, 5.5]
const stairwellBounds: [number, number, number, number] = [
  stairHeadX - stairRun,
  stairAt[1] - stairWidth / 2,
  stairHeadX,
  stairAt[1] + stairWidth / 2,
]
const stairPartitionClearance = 0.2

export const theMissingHourStairwellBounds = stairwellBounds

export const theMissingHourGround: SceneSpec = {
  puzzleId: 'hard-11',
  floor: 0,
  storeyFootprint: { kind: 'full' },
  entry: { wall: 'west', at: stairAt[1] },
  shell: { features: [
    { wall: 'north', at: 1.35, kind: 'window' },
    { wall: 'north', at: 6.5, kind: 'window' },
    { wall: 'west', at: 6.4, kind: 'window' },
  ] },
  stairs: { model: 'stairsOpen', at: stairAt, facing: 'E' },
  floors: [
    { id: 'kitchen-floor', cells: [0, 0, 3, 3], material: 'tile', kind: 'interior' },
    { id: 'office-floor', cells: [4, 0, 7, 3], material: 'wood', kind: 'interior' },
    { id: 'living-floor', cells: [0, 4, 2, 7], material: 'wood', kind: 'interior' },
    { id: 'dining-floor', cells: [3, 4, 7, 7], material: 'wood', kind: 'interior' },
  ],
  walls: [
    { id: 'kitchen-office-partition', from: [4, 0], to: [4, 4], height: 'half', openings: [{ at: 1.8, width: 1.15, kind: 'door' }] },
    { id: 'front-rear-partition', from: [0, 4], to: [8, 4], height: 'half', openings: [
      { at: 1.55, width: 1.2, kind: 'door' },
      { at: 6.5, width: 1.2, kind: 'door' },
    ] },
    { id: 'living-dining-north-screen', from: [3, 4], to: [3, stairwellBounds[1] - stairPartitionClearance], height: 'half', freeEnds: ['to'] },
    { id: 'living-dining-south-screen', from: [3, stairwellBounds[3] + stairPartitionClearance], to: [3, 8], height: 'half', freeEnds: ['from'] },
  ],
  furniture: [
    { id: 'kitchen-table', model: 'table', logic: 'table@0,0', at: [1, 0.55], facing: 'S' },
    { id: 'kitchen-fridge', model: 'kitchenFridge', logic: 'fridge@3,1', at: [1.5, 3.1], facing: 'S' },
    { id: 'kitchen-stove', model: 'kitchenStove', logic: 'stove@3,3', at: [3.5, 3.45], facing: 'S' },

    { id: 'office-desk', model: 'desk', logic: 'desk@2,4', at: [4.6, 2.9], facing: 'E' },
    { id: 'office-chair', model: 'chairDesk', logic: 'chair@3,5', at: [5.45, 3.45], facing: 'N' },
    { id: 'office-bookcase', model: 'bookcaseOpenLow', logic: 'bookshelf@1,7', at: [7.55, 1.45], facing: 'W' },

    { id: 'living-television-stand', model: 'cabinetTelevision', logic: 'tv@4,2', at: [2.4, 4.78], facing: 'N' },
    { id: 'living-television', model: 'televisionVintage', logic: 'tv@4,2', on: { parent: 'living-television-stand' } },
    { id: 'living-clock-table', model: 'sideTable', at: [1.5, 7.5] },
    { id: 'living-clock', model: 'radio', logic: 'clock@7,1', on: { parent: 'living-clock-table' } },
    { id: 'living-sofa', model: 'loungeSofa', logic: 'sofa@6,0', against: { wall: 'west', at: 7 } },

    { id: 'dining-rug', model: 'rugRectangle', logic: 'rug@4,5', at: [6.15, 5], facing: 'S' },
    { id: 'dining-chair', model: 'chair', logic: 'chair@4,4', at: [4.5, 4.5], facing: 'N' },
    { id: 'dining-lamp-south', model: 'lampRoundFloor', logic: 'lamp@5,7', at: [7.5, 5.5], facing: 'N' },
    { id: 'dining-lamp-north', model: 'lampRoundFloor', logic: 'lamp@4,7', at: [7.5, 4.5], facing: 'N' },
    { id: 'dining-table', model: 'table', at: [5.5, 6.7], facing: 'N' },
    { id: 'dining-side-chair', model: 'chair', at: [4.55, 6.7], facing: 'E' },
  ],
}