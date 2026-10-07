import type { SceneSpec } from '../schema'

// Casa térrea em L com sala de jantar, corredor de distribuição e cozinha.
export const whispersUpstairs: SceneSpec = {
  puzzleId: 'medium-7',
  floor: 0,
  entry: { wall: 'west', at: 7.4 },
  shell: { features: [{ wall: 'north', at: 1.7, kind: 'window' }] },
  floors: [
    { id: 'dining-wing', cells: [0, 0, 2, 7], material: 'wood', kind: 'interior' },
    { id: 'front-yard', cells: [3, 0, 7, 2], material: 'grass', kind: 'exterior' },
    { id: 'cross-hallway', cells: [3, 3, 7, 4], material: 'tile', kind: 'interior' },
    { id: 'service-kitchen', cells: [3, 5, 7, 7], material: 'tile', kind: 'interior' },
  ],
  walls: [
    { id: 'dining-hallway', from: [3, 0], to: [3, 8], height: 'half', openings: [{ at: 4.0, width: 1.1, kind: 'door' }] },
    { id: 'yard-hallway', from: [3, 3], to: [8, 3], height: 'half', openings: [{ at: 7.4, width: 1.1, kind: 'open' }] },
    { id: 'hallway-kitchen', from: [3, 5], to: [8, 5], height: 'half', openings: [{ at: 7.4, width: 1.0, kind: 'open' }] },
  ],
  furniture: [
    { id: 'dining-table', model: 'table', logic: 'table@4,0', at: [1.0, 4.5], facing: 'E' },
    { id: 'dining-rug', model: 'rugRectangle', logic: 'rug@1,0', at: [1.0, 2.0], facing: 'E' },
    { id: 'dining-chair-east', model: 'chair', logic: 'chair@3,2', at: [2.2, 3.2], facing: 'W' },
    { id: 'dining-chair-south-west', model: 'chair', logic: 'chair@6,0', at: [0.5, 6.5], facing: 'E' },
    { id: 'dining-lamp-north', model: 'lampRoundFloor', logic: 'lamp@0,2', at: [2.5, 0.5] },
    { id: 'dining-lamp-south', model: 'lampRoundFloor', logic: 'lamp@5,2', at: [2.5, 5.5] },

    { id: 'yard-shrub-north', model: 'plant_bushSmall', logic: 'shrub@0,5', at: [5.5, 0.5] },
    { id: 'yard-plant-west', model: 'flower_yellowA', logic: 'plant@0,4', at: [4.5, 0.5] },
    { id: 'yard-plant-east', model: 'flower_purpleA', logic: 'plant@0,6', at: [6.5, 0.5] },
    { id: 'yard-shrub-south-west', model: 'plant_bushDetailed', logic: 'shrub@2,4', at: [4.5, 2.5] },
    { id: 'yard-shrub-south-east', model: 'plant_bushSmall', logic: 'shrub@2,6', at: [6.5, 2.5] },
    { id: 'yard-plant-south', model: 'flower_redA', logic: 'plant@1,3', at: [3.5, 1.5] },

    { id: 'hall-clock-north-table', model: 'sideTable', at: [4.0, 3.2] },
    { id: 'hall-clock-north', model: 'radio', logic: 'clock@3,3', on: { parent: 'hall-clock-north-table' } },
    { id: 'hall-clock-south-table', model: 'sideTable', at: [3.98, 4.5] },
    { id: 'hall-clock-south', model: 'radio', logic: 'clock@4,3', on: { parent: 'hall-clock-south-table' } },
    { id: 'hall-plant', model: 'flower_purpleA', logic: 'plant@4,5', at: [5.5, 4.5] },

    { id: 'kitchen-stove', model: 'kitchenStoveElectric', logic: 'stove@6,3', at: [3.5, 6.5], facing: 'E' },
    { id: 'kitchen-counter', model: 'kitchenCabinet', logic: 'counter@5,5', at: [6.0, 5.5], facing: 'S' },
    { id: 'kitchen-sink', model: 'kitchenSink', at: [6.54, 5.5], facing: 'S' },
    { id: 'kitchen-fridge-west', model: 'kitchenFridgeSmall', logic: 'fridge@7,4', at: [4.5, 7.5], facing: 'E' },
    { id: 'kitchen-fridge-east', model: 'kitchenFridgeSmall', logic: 'fridge@7,6', at: [6.5, 7.5], facing: 'W' },
  ],
}
