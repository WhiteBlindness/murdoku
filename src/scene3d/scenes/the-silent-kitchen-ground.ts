import type { SceneSpec } from '../schema'
import { MODEL_BOUNDS } from '../catalog.generated'
import { CELL } from '../units'

// The east-climbing flight fits inside the kitchen and opens toward the upper bedroom.
const stairAt: [number, number] = [2, 3]
const stairHalfRun = MODEL_BOUNDS.stairsOpen.size[0] / (2 * CELL)
const stairHalfWidth = MODEL_BOUNDS.stairsOpen.size[2] / (2 * CELL)

export const theSilentKitchenStairwellBounds: [number, number, number, number] = [
  stairAt[0] - stairHalfRun,
  stairAt[1] - stairHalfWidth,
  stairAt[0] + stairHalfRun,
  stairAt[1] + stairHalfWidth,
]

export const theSilentKitchenGround: SceneSpec = {
  puzzleId: 'master-5',
  floor: 0,
  storeyFootprint: { kind: 'full' },
  entry: { wall: 'west', at: 1.5 },
  shell: {
    features: [
      { wall: 'north', at: 1.35, kind: 'window' },
      { wall: 'north', at: 5.4, kind: 'window' },
      { wall: 'north', at: 7.2, kind: 'window' },
    ],
  },
  stairs: { model: 'stairsOpen', at: stairAt, facing: 'E' },
  exteriorSupportBays: [
    { id: 'garden-west-frame', cells: [0, 5, 2, 7] },
    { id: 'garden-east-frame', cells: [3, 5, 4, 7] },
  ],
  floors: [
    { id: 'kitchen-tile', cells: [0, 0, 3, 4], material: 'tile', kind: 'interior' },
    { id: 'office-wood', cells: [4, 0, 7, 4], material: 'wood', kind: 'interior' },
    { id: 'garden-grass', cells: [0, 5, 4, 7], material: 'grass', kind: 'exterior' },
    { id: 'dining-wood', cells: [5, 5, 7, 7], material: 'wood', kind: 'interior' },
  ],
  walls: [
    {
      id: 'kitchen-office-divider',
      from: [4, 0],
      to: [4, 5],
      height: 'half',
      openings: [{ at: 3, width: 1.2, kind: 'door' }],
    },
    {
      id: 'kitchen-garden-facade',
      from: [0, 5],
      to: [4, 5],
      height: 'half',
      openings: [{ at: 3.6, width: 0.8, kind: 'open' }],
    },
    {
      id: 'office-south-divider',
      from: [4, 5],
      to: [8, 5],
      height: 'half',
      openings: [
        { at: 4.55, width: 0.9, kind: 'open' },
        { at: 6.7, width: 1.2, kind: 'door' },
      ],
    },
    {
      id: 'garden-dining-facade',
      from: [5, 5],
      to: [5, 8],
      height: 'half',
      openings: [{ at: 6.6, width: 1.2, kind: 'open' }],
    },
  ],
  furniture: [
    { id: 'kitchen-table', model: 'table', logic: 'table@0,1', at: [1.5, 0.65], facing: 'E' },
    { id: 'kitchen-stove', model: 'kitchenStove', logic: 'stove@2,3', at: [3.5, 2.05], facing: 'W' },
    { id: 'kitchen-fridge', model: 'kitchenFridge', logic: 'fridge@4,0', at: [0.5, 4.5], facing: 'E' },
    { id: 'kitchen-counter', model: 'kitchenCabinet', logic: 'counter@4,1', at: [1.45, 4.45], facing: 'S' },
    { id: 'kitchen-counter-sink', model: 'kitchenSink', logic: 'counter@4,1', at: [2.1, 4.45], facing: 'S' },

    { id: 'office-bookshelf-carol', model: 'bookcaseOpenLow', logic: 'bookshelf@2,7', at: [7.5, 3], facing: 'W' },
    { id: 'office-desk', model: 'desk', logic: 'desk@1,7', at: [7.5, 1.5], facing: 'W' },
    { id: 'office-bookshelf-north', model: 'bookcaseOpenLow', logic: 'bookshelf@0,5', at: [6, 0.5], facing: 'S' },
    { id: 'office-chair', model: 'chair', logic: 'chair@2,4', at: [4.75, 2.5], facing: 'E' },
    { id: 'office-clock-bella', model: 'speaker', logic: 'clock@3,5', at: [5.5, 3.5] },
    { id: 'office-clock-south', model: 'speaker', logic: 'clock@4,5', at: [5.5, 4.5] },

    { id: 'garden-plant-west', model: 'pottedPlant', logic: 'plant@5,2', at: [2.35, 5.5] },
    { id: 'garden-shrub-evangeline', model: 'plant_bushSmall', logic: 'shrub@6,4', at: [4.2, 6.5] },
    { id: 'garden-plant-south', model: 'flower_yellowA', logic: 'plant@7,2', at: [2.5, 7.5] },

    { id: 'dining-lamp-west', model: 'lampRoundFloor', logic: 'lamp@5,5', at: [5.5, 5.5] },
    { id: 'dining-chair', model: 'chair', logic: 'chair@7,6', at: [6.5, 7.5], facing: 'N' },
    { id: 'dining-lamp-east', model: 'lampRoundFloor', logic: 'lamp@7,7', at: [7.5, 7.5] },
  ],
}
