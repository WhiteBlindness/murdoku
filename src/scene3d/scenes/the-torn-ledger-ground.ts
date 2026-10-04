import type { SceneSpec } from '../schema'

// A west-side living wing meets the kitchen across a sheltered garden edge.
// The upper study and bath sit over the garden on the two declared timber bays.
const stairAt: [number, number] = [5, 5.25]

export const theTornLedgerGround: SceneSpec = {
  puzzleId: 'master-1',
  floor: 0,
  storeyFootprint: { kind: 'full' },
  entry: { wall: 'west', at: 4 },
  shell: {
    features: [
      { wall: 'north', at: 1.35, kind: 'window' },
      { wall: 'north', at: 3.05, kind: 'window' },
      { wall: 'west', at: 1.8, kind: 'window' },

    ],
  },
  stairs: { model: 'stairsOpen', at: stairAt, facing: 'N' },
  exteriorSupportBays: [
    { id: 'garden-study-support', cells: [4, 0, 5, 2] },
    { id: 'garden-bath-support', cells: [6, 0, 7, 2] },
  ],
  floors: [
    { id: 'living-room-wood', cells: [0, 0, 3, 4], material: 'wood' },
    { id: 'office-wood', cells: [0, 5, 3, 7], material: 'wood' },
    { id: 'open-garden-grass', cells: [4, 0, 7, 2], material: 'grass', kind: 'exterior' },
    { id: 'southeast-kitchen-tile', cells: [4, 3, 7, 7], material: 'tile' },
  ],
  walls: [
    { id: 'living-office', from: [0, 5], to: [4, 5], openings: [
      { at: 2.2, width: 1.4, kind: 'open' },
    ] },
    { id: 'garden-living-facade', from: [4, 0], to: [4, 3], height: 'half', openings: [
      { at: 1.55, width: 1.2, kind: 'door' },
    ] },
    { id: 'kitchen-garden-facade', from: [4, 3], to: [8, 3], height: 'half', openings: [
      { at: 7.15, width: 1.4, kind: 'door' },
    ] },
    { id: 'living-kitchen', from: [4, 3], to: [4, 5], openings: [
      { at: 3.6, width: 1, kind: 'door' },
    ] },
  ],
  furniture: [
    { id: 'living-television', model: 'cabinetTelevision', logic: 'tv@4,1', at: [1.7, 3.6], facing: 'W' },
    { id: 'living-sofa', model: 'loungeSofa', logic: 'sofa@3,0', against: { wall: 'west', at: 2.8 } },
    { id: 'living-clock-table', model: 'sideTable', at: [3.45, 2.45] },
    { id: 'living-clock', model: 'radio', logic: 'clock@2,3', on: { parent: 'living-clock-table' } },
    { id: 'living-area-rug', model: 'rugRectangle', logic: 'rug@0,2', at: [3, 1], facing: 'E' },

    { id: 'office-desk', model: 'desk', logic: 'desk@7,2', at: [2.55, 7.4], facing: 'E' },
    { id: 'office-chair-marco', model: 'chair', logic: 'chair@6,0', at: [0.75, 6.5], facing: 'E' },

    { id: 'garden-plant', model: 'pottedPlant', logic: 'plant@1,4', at: [4.95, 1.5], facing: 'S' },
    { id: 'garden-shrub-north', model: 'plant_bushSmall', logic: 'shrub@0,5', at: [5.55, 0.5] },
    { id: 'garden-shrub-east', model: 'plant_bushSmall', logic: 'shrub@1,7', at: [7.45, 1.5] },

    { id: 'kitchen-dining-table', model: 'table', logic: 'table@3,4', at: [5.3, 3.6], facing: 'S' },
    { id: 'kitchen-stove', model: 'kitchenStove', logic: 'stove@6,4', at: [4.15, 6.5], facing: 'S' },
    { id: 'kitchen-fridge', model: 'kitchenFridge', logic: 'fridge@6,7', at: [7.65, 6.8], facing: 'S' },
    { id: 'kitchen-counter', model: 'kitchenCabinet', logic: 'counter@3,6', at: [7, 4], facing: 'S' },
    { id: 'kitchen-sink', model: 'kitchenSink', at: [7.65, 4], facing: 'S' },
    { id: 'kitchen-table-lena', model: 'table', logic: 'table@7,4', at: [5, 7.5], facing: 'S' },
  ],
}









