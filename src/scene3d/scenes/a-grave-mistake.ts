import type { SceneSpec } from '../schema'

// The east wing holds the hallway and kitchen. Dining rooms extend south-west
// around a small garden open to the north-west.
export const aGraveMistake: SceneSpec = {
  puzzleId: 'easy-6',
  floor: 0,
  entry: { wall: 'north', at: 4.2 },
  shell: {
    features: [
      { wall: 'north', at: 4.85, kind: 'window' },
      { wall: 'west', at: 5.3, kind: 'window' },
    ],
  },
  storeyFootprint: {
    kind: 'cell-rects',
    rects: [
      [3, 0, 6, 6],
      [0, 3, 2, 6],
      [0, 0, 2, 2],
    ],
  },
  floors: [
    { id: 'north-garden', cells: [0, 0, 2, 2], material: 'grass', kind: 'exterior' },
    { id: 'dining-room', cells: [0, 3, 2, 6], material: 'wood', kind: 'interior' },
    { id: 'kitchen', cells: [5, 0, 6, 6], material: 'tile', kind: 'interior' },
  ],
  walls: [
    { id: 'garden-hall-dining', from: [3, 0], to: [3, 7], height: 'half', openings: [
      { at: 1.5, width: 1.1, kind: 'door' },
      { at: 5.5, width: 1.1, kind: 'door' },
    ] },
    { id: 'garden-dining-edge', from: [0, 3], to: [3, 3], height: 'half', openings: [
      { at: 1.45, width: 1.1, kind: 'open' },
    ] },
    { id: 'hall-kitchen', from: [5, 0], to: [5, 7], height: 'half', openings: [
      { at: 6.2, width: 1.1, kind: 'door' },
    ] },
  ],
  furniture: [
    // Small flowers and low shrubs preserve the garden clue markers.
    { id: 'hall-clock-table', model: 'sideTable', at: [4.0, 0.95] }, { id: 'hall-clock-radio', model: 'radio', logic: 'clock@0,4', on: { parent: 'hall-clock-table' } },
    { id: 'hall-flowers', model: 'flower_yellowA', logic: 'plant@1,4', at: [4.55, 1.48] },
    { id: 'garden-shrub-west', model: 'plant_bushSmall', logic: 'shrub@2,0', at: [0.32, 2.5] },
    { id: 'garden-shrub-clue', model: 'plant_bushSmall', logic: 'shrub@2,1', at: [1.15, 2.12] },
    { id: 'garden-flowers', model: 'flower_purpleA', logic: 'plant@0,1', at: [1.5, 0.58] },

    { id: 'dining-chair', model: 'chair', logic: 'chair@3,1', at: [1.78, 3.82], facing: 'N' },
    { id: 'dining-rug', model: 'rugRectangle', logic: 'rug@4,0', at: [1, 5] },
    { id: 'dining-lamp', model: 'lampRoundFloor', logic: 'lamp@5,2', at: [2.2, 5.25] },

    { id: 'kitchen-stove', model: 'kitchenStove', logic: 'stove@4,5', at: [5.8, 4.1], facing: 'E' },
    { id: 'kitchen-fridge', model: 'kitchenFridgeSmall', logic: 'fridge@4,6', at: [6.5, 4.5], facing: 'S' },
  ],
}
