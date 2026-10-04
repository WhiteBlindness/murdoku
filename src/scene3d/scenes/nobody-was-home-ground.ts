import type { SceneSpec } from '../schema'
import { MODEL_BOUNDS } from '../catalog.generated'
import { CELL } from '../units'

const stairRunCells = MODEL_BOUNDS.stairsOpen.size[0] / CELL
const stairWidthCells = MODEL_BOUNDS.stairsOpen.size[2] / CELL
const stairHeadRow = 1.0
const stairAt: [number, number] = [6.32, stairHeadRow + stairRunCells / 2]
const stairwellBounds: [number, number, number, number] = [
  stairAt[0] - stairWidthCells / 2,
  stairHeadRow,
  stairAt[0] + stairWidthCells / 2,
  stairHeadRow + stairRunCells,
]

export const nobodyWasHomeStairwellBounds = stairwellBounds

export const nobodyWasHomeGround: SceneSpec = {
  puzzleId: 'master-8',
  floor: 0,
  storeyFootprint: { kind: 'full' },
  entry: { wall: 'west', at: 1.5 },
  shell: {
    features: [
      { wall: 'north', at: 4.2, kind: 'window' },
      { wall: 'north', at: 7.1, kind: 'window' },
    ],
  },
  stairs: { model: 'stairsOpen', at: stairAt, facing: 'N' },
  exteriorSupportBays: [
    { id: 'garden-north-bay', cells: [0, 3, 2, 4] },
    { id: 'garden-south-bay', cells: [0, 5, 2, 7] },
  ],
  floors: [
    { id: 'pantry-tile', cells: [0, 0, 2, 2], material: 'tile', kind: 'interior' },
    { id: 'living-room-wood', cells: [3, 0, 5, 7], material: 'wood', kind: 'interior' },
    { id: 'hallway-stone', cells: [6, 0, 7, 7], material: 'stone', kind: 'interior' },
    { id: 'garden-earth', cells: [0, 3, 2, 7], material: 'grass', kind: 'exterior' },
  ],
  walls: [
    {
      id: 'pantry-living-room',
      from: [3, 0],
      to: [3, 3],
      height: 'cutaway',
      openings: [{ at: 2.4, width: 1.0, kind: 'door' }],
    },
    {
      id: 'garden-living-room-facade',
      from: [3, 3],
      to: [3, 8],
      height: 'half',
      openings: [{ at: 6.5, width: 1.2, kind: 'open' }],
    },
    {
      id: 'pantry-garden-edge',
      from: [0, 3],
      to: [3, 3],
      height: 'cutaway',
      openings: [{ at: 1.5, width: 1.1, kind: 'door' }],
    },
    {
      id: 'living-room-hallway',
      from: [6, 5.6],
      to: [6, 8],
      height: 'cutaway',
      openings: [{ at: 6.4, width: 1.6, kind: 'open' }],
      freeEnds: ['from'],
    },
  ],
  furniture: [
    { id: 'living-clock-north', model: 'speaker', logic: 'clock@0,5', at: [5.5, 0.5], facing: 'S' },
    { id: 'living-tv-north', model: 'cabinetTelevision', logic: 'tv@0,3', at: [3.65, 0.5], facing: 'N' },
    { id: 'living-rug', model: 'rugRectangle', logic: 'rug@2,3', at: [4.1, 3.0], facing: 'E' },
    { id: 'living-tv-south', model: 'cabinetTelevision', logic: 'tv@5,5', at: [5.5, 5.35], facing: 'N' },
    { id: 'hallway-plant-north', model: 'pottedPlant', logic: 'plant@1,6', at: [6.99, 1.5], facing: 'E' },
    { id: 'hallway-rug', model: 'rugRectangle', logic: 'rug@3,6', at: [7.425, 4.0], facing: 'E' },
    { id: 'hallway-clock-south', model: 'speaker', logic: 'clock@6,7', at: [7.5, 6.5], facing: 'S' },
    { id: 'hallway-plant-south', model: 'pottedPlant', logic: 'plant@7,6', at: [6.5, 7.5], facing: 'S' },
    { id: 'hallway-clock-corner', model: 'speaker', logic: 'clock@7,7', at: [7.5, 7.5], facing: 'S' },

    { id: 'pantry-fridge', model: 'kitchenFridge', logic: 'fridge@1,2', at: [2.5, 1.5], facing: 'S' },
    { id: 'pantry-counter', model: 'kitchenCabinet', logic: 'counter@0,1', at: [1.5, 0.5], facing: 'S' },
    { id: 'garden-shrub-west', model: 'plant_bushSmall', logic: 'shrub@7,0', at: [0.5, 7.5], facing: 'S' },
    { id: 'garden-plant-south', model: 'pottedPlant', logic: 'plant@7,1', at: [1.5, 7.5], facing: 'S' },
    { id: 'garden-shrub-east', model: 'plant_bushSmall', logic: 'shrub@5,2', at: [2.5, 5.5], facing: 'S' },
    { id: 'garden-shrub-oscar', model: 'plant_bushSmall', logic: 'shrub@4,1', at: [1.5, 4.5], facing: 'S' },
  ],
}
