import type { SceneSpec } from '../schema'

// Four rooms share a single shell. Openings on all four sides of the cross
// partition let visitors follow a clear loop around the house.
export const theVanishingAct: SceneSpec = {
  puzzleId: 'easy-7',
  floor: 0,
  entry: { wall: 'west', at: 5.5 },
  shell: {
    features: [
      { wall: 'north', at: 1.45, kind: 'window' },
      { wall: 'north', at: 2.65, kind: 'window' },
    ],
  },
  floors: [
    { id: 'kitchen', cells: [0, 0, 3, 3], material: 'tile', kind: 'interior' },
    { id: 'front-yard', cells: [4, 0, 6, 3], material: 'grass', kind: 'courtyard' },
    { id: 'porch', cells: [0, 4, 3, 6], material: 'stone', kind: 'interior' },
    { id: 'pantry', cells: [4, 4, 6, 6], material: 'tile', kind: 'interior' },
  ],
  walls: [
    { id: 'kitchen-yard', from: [4, 0], to: [4, 4], height: 'half', openings: [
      { at: 0.8, width: 1.1, kind: 'door' },
    ] },
    { id: 'porch-pantry', from: [4, 4], to: [4, 7], height: 'half', openings: [
      { at: 5.5, width: 1.1, kind: 'door' },
    ] },
    { id: 'kitchen-porch', from: [0, 4], to: [4, 4], height: 'half', openings: [
      { at: 0.8, width: 1.1, kind: 'door' },
    ] },
    { id: 'yard-pantry', from: [4, 4], to: [7, 4], height: 'half', openings: [
      { at: 5.5, width: 1.1, kind: 'door' },
    ] },
  ],
  furniture: [
    // A two-module counter keeps the 1×2 logical position legible.
    { id: 'kitchen-counter-a', model: 'kitchenCabinet', logic: 'counter@2,3', against: { wall: 'kitchen-yard', side: 'W', at: 2.3 } },
    { id: 'kitchen-sink-run', model: 'kitchenSink', logic: 'counter@2,3', against: { wall: 'kitchen-yard', side: 'W', at: 2.85 } },
    { id: 'kitchen-counter-b', model: 'kitchenCabinetDrawer', logic: 'counter@2,3', against: { wall: 'kitchen-yard', side: 'W', at: 3.4 } },
    // Cooking wall on the north side: stove, prep sink and fridge in one run.
    { id: 'kitchen-stove', model: 'kitchenStove', against: { wall: 'north', at: 0.35 } },
    { id: 'kitchen-prep-sink', model: 'kitchenSink', against: { wall: 'north', at: 0.93 } },
    { id: 'kitchen-fridge', model: 'kitchenFridgeSmall', logic: 'fridge@0,1', against: { wall: 'north', at: 1.5 } },
    { id: 'kitchen-table', model: 'table', logic: 'table@0,2', at: [2.65, 0.8], facing: 'E' },

    // The garden clue shrubs are low and offset inside their own cells.
    { id: 'yard-shrub-east', model: 'plant_bushSmall', logic: 'shrub@2,6', at: [6.68, 2.55] },
    { id: 'yard-flowers-north', model: 'flower_yellowA', logic: 'plant@0,4', at: [4.75, 0.25] },
    { id: 'yard-flowers-east', model: 'flower_purpleA', logic: 'plant@1,6', at: [6.55, 1.5] },
    { id: 'yard-shrub-victim', model: 'plant_bush', logic: 'shrub@3,4', at: [4.4, 3.2] },
    { id: 'yard-shrub-killer', model: 'plant_bushSmall', logic: 'shrub@1,5', at: [5.72, 1.45] },

    { id: 'porch-chair', model: 'chair', logic: 'chair@5,3', at: [3.2, 5.55], facing: 'W' },
    { id: 'porch-flowers', model: 'flower_redA', logic: 'plant@4,2', at: [2.5, 4.48] },
    { id: 'pantry-box', model: 'cardboardBoxClosed', logic: 'box@5,6', at: [6.5, 5.55] },
    { id: 'pantry-fridge', model: 'kitchenFridgeSmall', logic: 'fridge@4,4', at: [4.35, 4.52], facing: 'E' },
  ],
}
