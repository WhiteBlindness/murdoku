import type { SceneSpec } from '../schema'

// Casa de estudo com cozinha de serviço e jardim murado a sul.
export const ashesInTheStudy: SceneSpec = {
  puzzleId: 'easy-9',
  floor: 0,
  entry: { wall: 'north', at: 6.4 },
  shell: { features: [{ wall: 'north', at: 4.8, kind: 'window' }] },
  floors: [
    { id: 'front-yard', cells: [0, 0, 2, 3], material: 'grass', kind: 'exterior' },
    { id: 'kitchen', cells: [0, 4, 3, 6], material: 'tile', kind: 'interior' },
    { id: 'garden-court', cells: [4, 4, 6, 6], material: 'grass', kind: 'courtyard' },
  ],
  walls: [
    { id: 'yard-office', from: [3, 0], to: [3, 4], height: 'half', openings: [{ at: 0.7, width: 1.15, kind: 'door' }] },
    { id: 'kitchen-garden', from: [4, 4], to: [4, 7], height: 'half', openings: [{ at: 4.7, width: 1.15, kind: 'open' }] },
    { id: 'yard-kitchen', from: [0, 4], to: [4, 4], height: 'half', openings: [{ at: 0.65, width: 1.15, kind: 'door' }] },
    { id: 'office-garden', from: [3, 4], to: [7, 4], height: 'half', openings: [{ at: 5.7, width: 1.15, kind: 'open' }] },
  ],
  furniture: [
    { id: 'study-bookshelf', model: 'bookcaseOpen', logic: 'bookshelf@0,3', against: { wall: 'north', at: 3.9 } },
    { id: 'study-bookshelf-books', model: 'books', on: { parent: 'study-bookshelf', surface: 'shelf2' } },
    { id: 'study-desk', model: 'desk', logic: 'desk@1,6', at: [6.35, 1.45], facing: 'W' },
    { id: 'study-chair', model: 'chair', logic: 'chair@1,3', at: [3.75, 1.5], facing: 'E' },
    { id: 'study-clock', model: 'speaker', logic: 'clock@3,3', at: [3.45, 3.45] },

    { id: 'yard-shrub', model: 'plant_bushSmall', logic: 'shrub@3,1', at: [1.5, 3.5] },
    { id: 'yard-flower', model: 'flower_yellowA', logic: 'plant@0,1', at: [1.5, 0.5] },
    { id: 'yard-flower-south', model: 'flower_purpleA', logic: 'plant@3,2', at: [2.5, 3.5] },

    { id: 'kitchen-stove-south', model: 'kitchenStoveElectric', logic: 'stove@5,1', at: [1.55, 5.5], facing: 'E' },
    { id: 'kitchen-fridge', model: 'kitchenFridgeSmall', logic: 'fridge@4,2', at: [2.45, 4.5], facing: 'W' },
    { id: 'kitchen-stove-east', model: 'kitchenStove', logic: 'stove@4,3', at: [3.0, 4.45], facing: 'E' },
    { id: 'kitchen-table', model: 'table', logic: 'table@6,2', at: [2.5, 6.25], facing: 'E' },

    { id: 'garden-shrub', model: 'plant_bushSmall', logic: 'shrub@5,4', at: [4.7, 5.5] },
    { id: 'garden-flower', model: 'flower_redA', logic: 'plant@6,4', at: [4.5, 6.5] },
  ],
}
