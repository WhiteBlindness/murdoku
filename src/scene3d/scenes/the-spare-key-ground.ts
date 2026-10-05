import type { SceneSpec } from '../schema'
import { MODEL_BOUNDS } from '../catalog.generated'
import { CELL } from '../units'

const stairAt: [number, number] = [5.5, 5.5]
const stairRun = MODEL_BOUNDS.stairsOpen.size[0] / CELL
const stairWidth = MODEL_BOUNDS.stairsOpen.size[2] / CELL

export const theSpareKeyStairwellBounds: [number, number, number, number] = [
  stairAt[0] - stairWidth / 2,
  stairAt[1] - stairRun / 2,
  stairAt[0] + stairWidth / 2,
  stairAt[1] + stairRun / 2,
]

export const theSpareKeyGround: SceneSpec = {
  puzzleId: 'expert-9',
  floor: 0,
  storeyFootprint: { kind: 'full' },
  entry: { wall: 'west', at: 6.3 },
  shell: {
    features: [
      { wall: 'north', at: 0.7, kind: 'window' },
      { wall: 'west', at: 3.8, kind: 'window' },
    ],
  },
  stairs: { model: 'stairsOpen', at: stairAt, facing: 'N' },
  exteriorSupportBays: [
    { id: 'garden-north-support', cells: [2, 0, 3, 2] },
    { id: 'garden-middle-support', cells: [2, 3, 3, 5] },
    { id: 'garden-south-support', cells: [2, 6, 3, 7] },
    { id: 'porch-west-support', cells: [4, 0, 5, 2] },
    { id: 'porch-east-support', cells: [6, 0, 7, 2] },
  ],
  floors: [
    { id: 'hallway', cells: [0, 0, 1, 7], material: 'wood', kind: 'interior' },
    { id: 'garden', cells: [2, 0, 3, 7], material: 'grass', kind: 'exterior' },
    { id: 'porch', cells: [4, 0, 7, 2], material: 'stone', kind: 'exterior' },
    { id: 'dining-room', cells: [4, 3, 7, 7], material: 'wood', kind: 'interior' },
  ],
  walls: [
    {
      id: 'hall-garden-facade',
      from: [2, 0],
      to: [2, 8],
      height: 'half',
      openings: [{ at: 1.5, width: 1.3, kind: 'open' }, { at: 6.3, width: 1.2, kind: 'door' }],
    },
    {
      id: 'garden-porch-railing',
      from: [4, 0],
      to: [4, 3],
      height: 'half',
      treatment: 'railing',
      openings: [{ at: 1.5, width: 1.4, kind: 'open' }],
      freeEnds: ['from'],
    },
    {
      id: 'porch-dining-entry',
      from: [4, 3],
      to: [8, 3],
      height: 'half',
      openings: [{ at: 5.3, width: 1.0, kind: 'door' }],
    },
    {
      id: 'garden-dining-facade',
      from: [4, 3],
      to: [4, 8],
      height: 'half',
    },
  ],
  furniture: [
    { id: 'hall-clock-north', model: 'speaker', logic: 'clock@0,1', at: [1.5, 0.5] },
    { id: 'hallway-plant', model: 'pottedPlant', logic: 'plant@2,1', at: [1.5, 2.5], facing: 'E' },
    { id: 'hall-clock-middle', model: 'speaker', logic: 'clock@3,1', at: [1.5, 3.5] },
    { id: 'hallway-runner', model: 'rugRectangle', logic: 'rug@4,0', at: [1, 5], facing: 'E' },

    { id: 'garden-shrub-west', model: 'plant_bushSmall', logic: 'shrub@4,2', at: [2.5, 4.5] },
    { id: 'garden-shrub-east', model: 'plant_bushSmall', logic: 'shrub@5,3', at: [3.5, 5.5] },
    { id: 'garden-flower-south', model: 'flower_redA', logic: 'plant@7,3', at: [3.5, 7.5] },

    { id: 'porch-chair-west', model: 'chair', logic: 'chair@0,4', at: [4.5, 0.5], facing: 'E' },
    { id: 'porch-chair-east', model: 'chair', logic: 'chair@0,6', at: [6.5, 0.5], facing: 'W' },
    { id: 'porch-flower', model: 'flower_purpleA', logic: 'plant@0,7', at: [7.5, 0.5] },
    { id: 'porch-victim-chair', model: 'chair', logic: 'chair@2,4', at: [4.5, 2.5], facing: 'E' },
    { id: 'porch-culprit-flower', model: 'flower_redA', logic: 'plant@1,6', at: [6.5, 1.5] },

    { id: 'dining-lamp-west', model: 'lampRoundFloor', logic: 'lamp@3,6', at: [6.7, 3.5], facing: 'N' },
    { id: 'dining-lamp-east', model: 'lampRoundFloor', logic: 'lamp@3,7', at: [7.5, 3.5], facing: 'N' },
    { id: 'dining-table', model: 'table', logic: 'table@5,4', at: [4.5, 5.5], facing: 'E' },
    { id: 'dining-chair-south', model: 'chair', logic: 'chair@5,7', at: [7.5, 5.5], facing: 'N' },
  ],
}
