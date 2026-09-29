import type { SceneSpec } from '../schema'

// Hallway entry opens onto a walled central garden; two broad openings lead to
// the pantry and porch wings along the south.
export const theFinalCurtain: SceneSpec = {
  puzzleId: 'easy-5',
  floor: 0,
  entry: { wall: 'north', at: 3.5 },
  shell: {
    features: [
      { wall: 'north', at: 1.35, kind: 'window' },
      { wall: 'north', at: 5.8, kind: 'window' },
    ],
  },
  floors: [
    { id: 'central-courtyard', cells: [0, 2, 6, 3], material: 'grass', kind: 'courtyard' },
    { id: 'pantry', cells: [0, 4, 2, 6], material: 'tile', kind: 'interior' },
    { id: 'porch', cells: [3, 4, 6, 6], material: 'stone', kind: 'interior' },
  ],
  walls: [
    { id: 'hall-courtyard', from: [0, 2], to: [7, 2], height: 'half', openings: [
      { at: 1.55, width: 1.2, kind: 'open' },
      { at: 5.55, width: 1.2, kind: 'open' },
    ] },
    { id: 'courtyard-wings', from: [0, 4], to: [7, 4], height: 'half', openings: [
      { at: 2.1, width: 1.2, kind: 'open' },
      { at: 5.55, width: 1.2, kind: 'open' },
    ] },
    { id: 'pantry-porch', from: [3, 4], to: [3, 7], height: 'half', openings: [
      { at: 4.7, width: 1.05, kind: 'door' },
    ] },
  ],
  furniture: [
    // The logical rug is bound here so its clue remains represented in SceneSpec.
    { id: 'hall-rug', model: 'rugRectangle', logic: 'rug@0,0', at: [0.58, 1.0], facing: 'E' },
    { id: 'hall-clock', model: 'speaker', logic: 'clock@0,3', at: [3.15, 0.65] },

    // Low garden planting keeps both shrub clue cells open to view.
    { id: 'garden-shrub-west', model: 'plant_bushSmall', logic: 'shrub@3,0', at: [0.32, 3.45] },
    { id: 'garden-flowers', model: 'flower_yellowA', logic: 'plant@3,2', at: [2.55, 3.3] }, { id: 'hall-plant', model: 'flower_yellowA', logic: 'plant@0,4', at: [4.5, 0.55] },
    { id: 'garden-shrub-centre', model: 'plant_bushSmall', logic: 'shrub@2,3', at: [3.76, 2.28] },

    // Compact counter modules share the two-cell logical counter.
    { id: 'pantry-counter-a', model: 'kitchenCabinet', logic: 'counter@4,0', at: [0.4, 4.55] },
    { id: 'pantry-counter-b', model: 'kitchenCabinetDrawer', logic: 'counter@4,0', at: [0.95, 4.55] },
    { id: 'pantry-fridge', model: 'kitchenFridgeSmall', logic: 'fridge@6,1', at: [1.5, 6.5], facing: 'S' },
    { id: 'pantry-box', model: 'cardboardBoxClosed', logic: 'box@6,2', at: [2.5, 6.48] },

    { id: 'porch-chair-east', model: 'chair', logic: 'chair@4,4', at: [4.5, 4.55], facing: 'W' },
    { id: 'porch-chair-west', model: 'chair', logic: 'chair@5,3', at: [3.5, 5.5], facing: 'W' },
    { id: 'porch-flowers', model: 'flower_purpleA', logic: 'plant@5,6', at: [6.55, 5.5] },
  ],
}
