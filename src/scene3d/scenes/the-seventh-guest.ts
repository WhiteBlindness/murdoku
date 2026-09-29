import type { SceneSpec } from '../schema'

// Casa preparada para um jantar de convidados, com pátio de chegada.
export const theSeventhGuest: SceneSpec = {
  puzzleId: 'easy-10',
  floor: 0,
  entry: { wall: 'north', at: 6.2 },
  floors: [
    { id: 'arrival-yard', cells: [0, 0, 3, 2], material: 'grass', kind: 'exterior' },
    { id: 'pantry', cells: [4, 0, 6, 2], material: 'tile', kind: 'interior' },
    { id: 'kitchen', cells: [0, 3, 3, 6], material: 'tile', kind: 'interior' },
    { id: 'dining-room', cells: [4, 3, 6, 6], material: 'wood', kind: 'interior' },
  ],
  walls: [
    { id: 'yard-pantry', from: [4, 0], to: [4, 3], height: 'half', openings: [{ at: 0.6, width: 1.15, kind: 'door' }] },
    { id: 'kitchen-dining', from: [4, 3], to: [4, 7], height: 'half', openings: [{ at: 3.6, width: 1.1, kind: 'open' }] },
    { id: 'yard-kitchen', from: [0, 3], to: [4, 3], height: 'half', openings: [{ at: 1.5, width: 1.15, kind: 'open' }] },
    { id: 'pantry-dining', from: [4, 3], to: [7, 3], height: 'half', openings: [{ at: 5.5, width: 1.15, kind: 'door' }] },
  ],
  furniture: [
    { id: 'yard-shrub-north', model: 'plant_bushSmall', logic: 'shrub@0,2', at: [2.5, 0.5] },
    { id: 'yard-flower-west', model: 'flower_yellowA', logic: 'plant@0,1', at: [1.5, 0.5] },
    { id: 'yard-flower-east', model: 'flower_purpleA', logic: 'plant@0,3', at: [3.0, 0.5] },
    { id: 'yard-shrub-south', model: 'plant_bushDetailed', logic: 'shrub@2,3', at: [2.9, 2.5] },

    { id: 'pantry-fridge', model: 'kitchenFridgeSmall', logic: 'fridge@0,4', at: [4.95, 0.55], facing: 'W' },
    { id: 'pantry-box', model: 'cardboardBoxClosed', logic: 'box@1,4', at: [4.55, 1.5] },
    { id: 'pantry-counter', model: 'kitchenBar', logic: 'counter@1,6', at: [6.55, 1.5], facing: 'W' },

    { id: 'kitchen-stove-north', model: 'kitchenStoveElectric', logic: 'stove@4,3', at: [3.25, 4.45], facing: 'E' },
    { id: 'kitchen-fridge-east', model: 'kitchenFridgeSmall', logic: 'fridge@5,3', at: [3.65, 5.5], facing: 'W' },
    { id: 'kitchen-stove-south', model: 'kitchenStove', logic: 'stove@6,3', at: [3.25, 6.55], facing: 'E' },
    { id: 'kitchen-fridge-west', model: 'kitchenFridgeSmall', logic: 'fridge@6,1', at: [1.5, 6.5], facing: 'W' },

    { id: 'dining-chair-tomas', model: 'chair', logic: 'chair@6,5', at: [5.35, 6.5], facing: 'N' },
    { id: 'dining-chair-extra', model: 'chair', logic: 'chair@6,6', at: [6.6, 6.5], facing: 'W' },
    { id: 'dining-table', model: 'table', at: [5.1, 5.5], facing: 'E' },
    { id: 'dining-lamp-side-table', model: 'sideTable', at: [6.15, 5.5] },
    { id: 'dining-lamp-victim', model: 'lampRoundTable', logic: 'lamp@5,6', on: { parent: 'dining-lamp-side-table' } },
    { id: 'dining-lamp-west', model: 'lampRoundFloor', logic: 'lamp@4,4', at: [4.35, 4.3] },
  ],
}
