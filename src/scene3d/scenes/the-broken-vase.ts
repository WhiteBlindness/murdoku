import type { SceneSpec } from '../schema'

// Um escritório com alpendre dá para um pátio ajardinado e murado.
export const theBrokenVase: SceneSpec = {
  puzzleId: 'very-easy-5',
  floor: 0,
  entry: { wall: 'west', at: 1.05 },
  shell: {
    features: [{ wall: 'west', at: 5.2, kind: 'window' }],
  },
  floors: [
    { id: 'porch', cells: [0, 0, 2, 2], material: 'stone', kind: 'interior' },
    { id: 'office', cells: [0, 3, 2, 5], material: 'wood', kind: 'interior' },
    { id: 'courtyard', cells: [3, 0, 5, 5], material: 'grass', kind: 'courtyard' },
  ],
  walls: [
    { id: 'porch-office', from: [0, 3], to: [3, 3], height: 'half', openings: [{ at: 1.5, width: 1, kind: 'door' }] },
    { id: 'porch-courtyard', from: [3, 0], to: [3, 3], height: 'half', openings: [{ at: 0.85, width: 1, kind: 'open' }] },
    { id: 'office-courtyard', from: [3, 3], to: [3, 6], height: 'half', openings: [{ at: 4.75, width: 1.2, kind: 'open' }] },
  ],
  furniture: [
    { id: 'office-desk', model: 'desk', against: { wall: 'west', at: 4.1 } },
    { id: 'office-laptop', model: 'laptop', on: { parent: 'office-desk' } },
    { id: 'office-chair', model: 'chairDesk', at: [1.15, 4.15], facing: 'W' },
    { id: 'office-rug', model: 'rugRound', at: [1.15, 4.25] },

    { id: 'office-shelf-a', model: 'bookcaseOpenLow', logic: 'bookshelf@5,0', against: { wall: 'south', at: 0.35 } },
    { id: 'office-shelf-b', model: 'bookcaseOpenLow', against: { wall: 'south', at: 0.85 } },
    { id: 'office-shelf-c', model: 'bookcaseOpenLow', against: { wall: 'south', at: 1.35 } },
    { id: 'office-shelf-d', model: 'bookcaseOpenLow', against: { wall: 'south', at: 1.85 } },
    { id: 'office-books', model: 'books', on: { parent: 'office-shelf-c', surface: 'top' } },

    { id: 'office-console', model: 'sideTable', at: [2.35, 3.55], facing: 'W' },
    { id: 'office-clock', model: 'radio', logic: 'clock@3,2', on: { parent: 'office-console' } },

    { id: 'porch-plant', model: 'pottedPlant', logic: 'plant@0,1', at: [1.5, 0.5] },
    { id: 'porch-bench', model: 'bench', logic: 'chair@2,0', at: [0.55, 2.5], facing: 'E' },
    { id: 'porch-mat', model: 'rugDoormat', at: [1.1, 0.35] },

    { id: 'courtyard-shrub-west', model: 'plant_bushSmall', logic: 'shrub@1,3', at: [3.8, 1.7] },
    { id: 'courtyard-plant-west', model: 'flower_yellowA', logic: 'plant@2,3', at: [3.8, 2.6] },
    { id: 'courtyard-shrub-north', model: 'plant_bushSmall', logic: 'shrub@0,4', at: [4.5, 0.5] },
    { id: 'courtyard-shrub-south', model: 'plant_bushSmall', logic: 'shrub@5,4', at: [4.5, 5.5] },
    { id: 'courtyard-plant-south', model: 'pottedPlant', logic: 'plant@5,5', at: [5.5, 5.5] },
  ],
  rugs: [
    { id: 'courtyard-path-a', model: 'path_stone', at: [4.5, 4.5] },
    { id: 'courtyard-path-b', model: 'path_stone', at: [4.5, 3.5] },
    { id: 'courtyard-path-c', model: 'path_stone', at: [4.5, 2.5] },
    { id: 'porch-step-a', model: 'path_stone', at: [2.45, 1.55] },
  ],
}
