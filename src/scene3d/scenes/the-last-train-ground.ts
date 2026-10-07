import type { SceneSpec } from '../schema'

// Moradia duplex com ala ajardinada envidraçada e escada a partir do escritório.
export const theLastTrainGround: SceneSpec = {
  puzzleId: 'hard-3',
  floor: 0,
  storeyFootprint: { kind: 'full' },
  entry: { wall: 'west', at: 5.7 },
  shell: { features: [
    { wall: 'north', at: 1.6, kind: 'window' },
    { wall: 'north', at: 6.7, kind: 'window' },
    { wall: 'west', at: 1.6, kind: 'window' },
  ] },
  stairs: { model: 'stairsOpen', at: [5.75, 2.0], facing: 'S' },
  floors: [
    { id: 'kitchen', cells: [0, 0, 3, 3], material: 'tile' },
    { id: 'office', cells: [4, 0, 7, 3], material: 'wood' },
    { id: 'covered-porch', cells: [0, 4, 2, 7], material: 'stone' },
    { id: 'glass-garden-room', cells: [3, 4, 7, 7], material: 'stone' },
  ],
  walls: [
    { id: 'north-south-spine', from: [3, 0], to: [3, 8], height: 'half', openings: [
      { at: 2.0, width: 1.2, kind: 'open' },
      { at: 6.0, width: 1.2, kind: 'open' },
    ] },
    { id: 'cross-wing-wall', from: [0, 4], to: [8, 4], height: 'half', openings: [
      { at: 1.5, width: 1.2, kind: 'open' },
      { at: 5.5, width: 1.2, kind: 'open' },
    ] },
  ],
  furniture: [
    { id: 'kitchen-counter', model: 'kitchenCabinet', logic: 'counter@0,1', against: { wall: 'north', at: 1.45 } },
    { id: 'kitchen-sink', model: 'kitchenSink', against: { wall: 'north', at: 0.88 } },
    { id: 'kitchen-fridge', model: 'kitchenFridge', logic: 'fridge@2,3', at: [3.9, 2.3], facing: 'S' },
    { id: 'kitchen-stove', model: 'kitchenStove', logic: 'stove@3,2', at: [2.5, 3.45], facing: 'S' },

    { id: 'office-chair', model: 'chair', logic: 'chair@0,6', at: [6.5, 0.5], facing: 'E' },
    { id: 'office-clock-table', model: 'sideTable', at: [4.55, 2.05], facing: 'S' },
    { id: 'office-clock', model: 'radio', logic: 'clock@2,4', on: { parent: 'office-clock-table' } },
    { id: 'office-desk', model: 'desk', logic: 'desk@0,7', at: [7.45, 0.55], facing: 'W' },

    { id: 'porch-plant-west', model: 'flower_redA', logic: 'plant@4,0', at: [0.45, 4.55] },
    { id: 'porch-plant-east', model: 'flower_yellowA', logic: 'plant@4,1', at: [1.45, 4.8] },
    { id: 'porch-chair', model: 'chair', logic: 'chair@5,2', at: [2.15, 5.4], facing: 'W' },
    { id: 'porch-chair-west', model: 'chair', logic: 'chair@5,0', at: [0.95, 5.5], facing: 'E' },
    { id: 'porch-table', model: 'tableCoffee', at: [1.55, 5.45], facing: 'E' },

    { id: 'garden-shrub-west', model: 'plant_bushSmall', logic: 'shrub@4,4', at: [4.45, 4.55] },
    { id: 'garden-shrub-north', model: 'plant_bushSmall', logic: 'shrub@5,7', at: [7.45, 5.45] },
    { id: 'garden-plant-east', model: 'flower_purpleA', logic: 'plant@6,7', at: [7.45, 6.45] },
    { id: 'garden-shrub-south', model: 'plant_bushDetailed', logic: 'shrub@7,5', at: [5.45, 7.45] },
  ],
}
