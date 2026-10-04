import type { SceneSpec } from '../schema'
import { MODEL_BOUNDS } from '../catalog.generated'
import { CELL } from '../units'

const stairAt: [number, number] = [0.65, 5.3]
const stairwellHalfRun = MODEL_BOUNDS.stairsOpen.size[0] / (2 * CELL)
const stairwellHalfWidth = MODEL_BOUNDS.stairsOpen.size[2] / (2 * CELL)
export const twoSetsOfPrintsStairwellBounds: [number, number, number, number] = [
  stairAt[0] - stairwellHalfWidth,
  stairAt[1] - stairwellHalfRun,
  stairAt[0] + stairwellHalfWidth,
  stairAt[1] + stairwellHalfRun,
]

export const twoSetsOfPrintsGround: SceneSpec = {
  puzzleId: 'master-6',
  floor: 0,
  storeyFootprint: { kind: 'full' },
  entry: { wall: 'west', at: 7.2 },
  shell: { features: [
    { wall: 'north', at: 3.5, kind: 'window' },
    { wall: 'north', at: 5.5, kind: 'window' },
  ] },
  stairs: { model: 'stairsOpen', at: stairAt, facing: 'N' },
  floors: [
    { id: 'hallway', cells: [0, 0, 7, 1], material: 'wood' },
    { id: 'kitchen', cells: [0, 2, 7, 3], material: 'tile' },
    { id: 'living-room', cells: [0, 4, 7, 5], material: 'wood' },
    { id: 'office', cells: [0, 6, 7, 7], material: 'wood' },
  ],
  walls: [
    { id: 'hall-kitchen', from: [2, 0], to: [2, 8], height: 'half', openings: [{ at: 4.2, width: 1.4, kind: 'door' }] },
    { id: 'kitchen-living', from: [4, 0], to: [4, 8], height: 'half', openings: [{ at: 7.2, width: 1.2, kind: 'open' }] },
    { id: 'living-office', from: [6, 0], to: [6, 8], height: 'half', openings: [{ at: 1.0, width: 1.2, kind: 'door' }] },
  ],
  furniture: [
    { id: 'hallway-rug', model: 'rugRectangle', logic: 'rug@2,0', at: [1, 2.7], facing: 'E' },
    { id: 'hallway-clock-table', model: 'sideTable', at: [1.8, 5.5], facing: 'E' },
    { id: 'hallway-clock', model: 'radio', logic: 'clock@5,1', on: { parent: 'hallway-clock-table' } },
    { id: 'hallway-plant', model: 'pottedPlant', logic: 'plant@7,1', at: [1.5, 7.5] },

    { id: 'kitchen-counter', model: 'kitchenCabinetDrawer', logic: 'counter@0,2', at: [3, 0.5], facing: 'E' },
    { id: 'kitchen-fridge', model: 'kitchenFridge', logic: 'fridge@2,3', at: [3.5, 2.5], facing: 'S' },
    { id: 'kitchen-stove', model: 'kitchenStove', logic: 'stove@3,2', at: [2.5, 3.05], facing: 'E' },
    { id: 'kitchen-table', model: 'table', logic: 'table@4,2', at: [3, 4.5], facing: 'E' },

    { id: 'living-tv-east', model: 'cabinetTelevision', logic: 'tv@2,5', at: [5.5, 2.5], facing: 'W' },
    { id: 'living-tv-west', model: 'cabinetTelevision', logic: 'tv@4,4', at: [5.0, 4.5], facing: 'S' },
    { id: 'living-clock-table', model: 'sideTable', at: [5.5, 4.9], facing: 'N' },
    { id: 'living-clock', model: 'radio', logic: 'clock@4,5', on: { parent: 'living-clock-table' } },
    { id: 'living-sofa', model: 'loungeSofa', at: [4.8, 5.8], facing: 'N' },

    { id: 'office-chair-north', model: 'chair', logic: 'chair@1,7', at: [7.5, 1.5], facing: 'W' },
    { id: 'office-bookcase-north', model: 'bookcaseOpenLow', logic: 'bookshelf@2,7', at: [7.5, 2.5], facing: 'W' },
    { id: 'office-desk', model: 'desk', logic: 'desk@5,7', at: [7.5, 5.5], facing: 'N' },
    { id: 'office-chair', model: 'chair', logic: 'chair@5,6', at: [6.5, 5.5], facing: 'E' },
    { id: 'office-bookshelf', model: 'bookcaseOpenLow', logic: 'bookshelf@4,6', at: [7.15, 4.5], facing: 'E' },
    { id: 'office-clock-table', model: 'sideTable', at: [6.8, 7.5], facing: 'E' },
    { id: 'office-clock', model: 'radio', logic: 'clock@7,6', on: { parent: 'office-clock-table' } },
  ],
}








