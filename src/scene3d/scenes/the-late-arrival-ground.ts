import type { SceneSpec } from '../schema'

const stairAt: [number, number] = [4.55, 3.5]

// Casa com cozinha comprida, sala de jantar e alpendre-jardim frontal.
export const theLateArrivalGround: SceneSpec = {
  puzzleId: 'hard-9',
  floor: 0,
  storeyFootprint: { kind: 'full' },
  entry: { wall: 'north', at: 4 },
  shell: { features: [
    { wall: 'north', at: 1.3, kind: 'window' },
    { wall: 'north', at: 6.7, kind: 'window' },
    { wall: 'west', at: 6.5, kind: 'window' },
  ] },
  stairs: { model: 'stairsOpen', at: stairAt, facing: 'S' },
  exteriorSupportBays: [
    { id: 'yard-west-frame', cells: [3, 5, 4, 7] },
    { id: 'yard-east-frame', cells: [5, 5, 7, 7] },
  ],
  floors: [
    { id: 'kitchen-tile', cells: [0, 0, 2, 7], material: 'tile' },
    { id: 'hallway-wood', cells: [3, 0, 7, 1], material: 'wood' },
    { id: 'dining-wood', cells: [3, 2, 7, 4], material: 'wood' },
    { id: 'front-yard-grass', cells: [3, 5, 7, 7], material: 'grass', kind: 'exterior' },
  ],
  walls: [
    { id: 'kitchen-hall-dining', from: [3, 0], to: [3, 8], openings: [
      { at: 0.6, width: 1.2, kind: 'door' },
    ] },
    { id: 'dining-yard-facade', from: [3, 5], to: [8, 5], height: 'half', openings: [
      { at: 3.55, width: 1.0, kind: 'door' },
    ] },
  ],
  furniture: [
    { id: 'kitchen-stove', model: 'kitchenStove', logic: 'stove@6,0', at: [0.5, 6.5], facing: 'E' },
    { id: 'kitchen-counter', model: 'kitchenCabinet', logic: 'counter@4,0', at: [0.45, 4.9], facing: 'E' },
    { id: 'kitchen-fridge-south', model: 'kitchenFridge', logic: 'fridge@2,2', at: [2.5, 2.5], facing: 'S' },
    { id: 'kitchen-fridge-north', model: 'kitchenFridge', logic: 'fridge@1,2', at: [2.2, 1.5], facing: 'S' },
    { id: 'kitchen-table', model: 'table', logic: 'table@0,1', at: [1.35, 0.65], facing: 'N' },

    { id: 'yard-shrub-north', model: 'plant_bushSmall', logic: 'shrub@5,6', at: [6.5, 5.65] },
    { id: 'yard-plant-south-west', model: 'flower_redA', logic: 'plant@7,5', at: [5.65, 7.45] },
    { id: 'yard-shrub-south-east', model: 'plant_bushSmall', logic: 'shrub@7,7', at: [7.4, 7.35] },
    { id: 'yard-plant-north-east', model: 'flower_yellowA', logic: 'plant@5,7', at: [7.4, 5.65] },
    { id: 'yard-shrub-murder-clue', model: 'plant_bushSmall', logic: 'shrub@6,3', at: [3.5, 6.55] },

    { id: 'hallway-clock-table', model: 'sideTable', at: [5.5, 0.65] },
    { id: 'hallway-clock', model: 'radio', logic: 'clock@0,5', on: { parent: 'hallway-clock-table' } },
    { id: 'hallway-plant', model: 'flower_purpleA', logic: 'plant@1,6', at: [6.5, 1.5] },

    { id: 'dining-chair', model: 'chair', logic: 'chair@3,3', at: [3.3, 3.5], facing: 'W' },
    { id: 'dining-lamp-east', model: 'lampRoundFloor', logic: 'lamp@4,7', at: [7.5, 4.55] },
    { id: 'dining-lamp-west', model: 'lampRoundFloor', logic: 'lamp@4,4', at: [4.5, 4.8] },
  ],
}
