import type { SceneSpec } from '../schema'
import { MODEL_BOUNDS } from '../catalog.generated'
import { CELL } from '../units'

const stairAt: [number, number] = [3.2, 3.7]
const stairHalfRun = MODEL_BOUNDS.stairsOpen.size[0] / (2 * CELL)
const stairHalfWidth = MODEL_BOUNDS.stairsOpen.size[2] / (2 * CELL)

export const theSecondStudyStairwellBounds: [number, number, number, number] = [
  stairAt[0] - stairHalfRun,
  stairAt[1] - stairHalfWidth,
  stairAt[0] + stairHalfRun,
  stairAt[1] + stairHalfWidth,
]

export const theSecondStudyGround: SceneSpec = {
  puzzleId: 'expert-7',
  floor: 0,
  storeyFootprint: { kind: 'full' },
  entry: { wall: 'west', at: 4.5 },
  shell: {
    features: [
      { wall: 'north', at: 1.5, kind: 'window' },
      { wall: 'west', at: 1.4, kind: 'window' },
    ],
  },
  stairs: { model: 'stairsOpen', at: stairAt, facing: 'E' },
  exteriorSupportBays: [
    { id: 'garden-west-frame', cells: [4, 0, 6, 2] },
    { id: 'garden-east-frame', cells: [7, 0, 7, 2] },
  ],
  floors: [
    { id: 'office-wood', cells: [0, 0, 3, 2], material: 'wood' },
    { id: 'garden-grass', cells: [4, 0, 7, 2], material: 'grass', kind: 'exterior' },
    { id: 'dining-wood', cells: [0, 3, 7, 5], material: 'wood' },
    { id: 'hallway-wood', cells: [0, 6, 7, 7], material: 'wood' },
  ],
  walls: [
    {
      id: 'office-dining',
      from: [0, 3],
      to: [4, 3],
      height: 'cutaway',
      openings: [{ at: 0.8, width: 1.2, kind: 'door' }],
    },
    {
      id: 'office-garden-facade',
      from: [4, 0],
      to: [4, 3],
      height: 'full',
      openings: [{ at: 1.5, width: 2.8, kind: 'open' }],
    },
    {
      id: 'garden-dining-threshold',
      from: [4, 3],
      to: [8, 3],
      height: 'half',
      openings: [{ at: 7.5, width: 0.9, kind: 'open' }],
    },
    {
      id: 'dining-hallway',
      from: [0, 6],
      to: [8, 6],
      height: 'cutaway',
      openings: [{ at: 4.2, width: 1.2, kind: 'door' }],
    },
  ],
  furniture: [
    { id: 'dining-east-chair', model: 'chair', logic: 'chair@4,7', at: [7.5, 4.5], facing: 'E' },
    { id: 'dining-east-table', model: 'table', logic: 'table@3,6', at: [6.3, 3.7], facing: 'E' },
    { id: 'victim-lamp', model: 'lampRoundFloor', logic: 'lamp@4,4', at: [4.5, 4.5], facing: 'S' },
    { id: 'dining-rug', model: 'rugRectangle', logic: 'rug@3,0', at: [0.7, 4], facing: 'E' },
    { id: 'dining-west-table', model: 'table', logic: 'table@5,5', at: [6, 5.5], facing: 'S' },
    { id: 'hallway-clock-north', model: 'speaker', logic: 'clock@6,5', at: [5.5, 6.5], facing: 'S' },
    { id: 'evangeline-plant', model: 'flower_redA', logic: 'plant@6,2', at: [2.5, 6.5], facing: 'S' },
    { id: 'hallway-clock-south', model: 'speaker', logic: 'clock@7,6', at: [6.5, 7.5], facing: 'S' },

    { id: 'office-bookcase', model: 'bookcaseOpenLow', logic: 'bookshelf@0,2', against: { wall: 'north', at: 3 } },
    { id: 'office-desk-south', model: 'desk', logic: 'desk@2,3', at: [2.7, 2.4], facing: 'N' },
    { id: 'office-entry-chair', model: 'chair', logic: 'chair@0,0', at: [0.5, 0.5], facing: 'W' },
    { id: 'garden-shrub-east', model: 'plant_bushSmall', logic: 'shrub@1,7', at: [7.5, 1.5], facing: 'S' },
    { id: 'garden-plant-west', model: 'pottedPlant', logic: 'plant@0,4', at: [4.95, 0.5], facing: 'S' },
    { id: 'garden-shrub-west', model: 'plant_bushSmall', logic: 'shrub@0,5', at: [5.5, 0.5], facing: 'S' },
    { id: 'viraj-desk', model: 'desk', logic: 'desk@1,3', at: [2.7, 1.5], facing: 'S' },
    { id: 'dining-west-lamp', model: 'lampRoundFloor', logic: 'lamp@5,0', at: [0.5, 5.5], facing: 'S' },
  ],
}
