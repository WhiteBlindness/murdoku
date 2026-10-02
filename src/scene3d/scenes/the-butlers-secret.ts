import type { SceneSpec } from '../schema'

// Casa de serviço organizada em torno de um jardim murado e um pátio de chegada.
export const theButlersSecret: SceneSpec = {
  puzzleId: 'medium-6',
  floor: 0,
  entry: { wall: 'north', at: 6.5 },
  shell: { features: [{ wall: 'north', at: 4.9, kind: 'window' }] },
  floors: [
    { id: 'walled-garden', cells: [0, 0, 3, 2], material: 'grass', kind: 'courtyard' },
    { id: 'service-office', cells: [4, 0, 7, 4], material: 'wood', kind: 'interior' },
    { id: 'dining-room', cells: [0, 3, 3, 7], material: 'wood', kind: 'interior' },
    { id: 'arrival-court', cells: [4, 5, 7, 7], material: 'stone', kind: 'exterior' },
  ],
  walls: [
    { id: 'garden-office', from: [4, 0], to: [4, 3], height: 'half', openings: [{ at: 1.55, width: 1.15, kind: 'door' }] },
    { id: 'garden-dining', from: [0, 3], to: [4, 3], height: 'half', openings: [{ at: 3.5, width: 1.0, kind: 'open' }] },
    { id: 'office-court', from: [4, 5], to: [8, 5], height: 'half', openings: [{ at: 7.5, width: 1.0, kind: 'door' }] },
    { id: 'dining-court', from: [4, 3], to: [4, 8], height: 'half', openings: [{ at: 5.2, width: 1.0, kind: 'open' }] },
  ],
  furniture: [
    { id: 'garden-shrub', model: 'plant_bushSmall', logic: 'shrub@0,1', at: [1.5, 0.5] },
    { id: 'garden-plant-west', model: 'flower_yellowA', logic: 'plant@1,0', at: [0.5, 1.5] },
    { id: 'garden-plant-south', model: 'flower_purpleA', logic: 'plant@2,2', at: [2.5, 2.5] },

    { id: 'office-desk', model: 'desk', logic: 'desk@3,4', at: [4.5, 3.5], facing: 'E' },
    { id: 'office-bookshelf', model: 'bookcaseOpenLow', logic: 'bookshelf@3,7', at: [7.5, 4.0], facing: 'W' },
    { id: 'office-clock-table', model: 'sideTable', at: [5.5, 4.5] },
    { id: 'office-clock', model: 'radio', logic: 'clock@4,5', on: { parent: 'office-clock-table' } },
    { id: 'office-chair', model: 'chair', logic: 'chair@4,4', at: [4.5, 4.5], facing: 'N' },

    { id: 'dining-chair', model: 'chair', logic: 'chair@4,0', at: [0.5, 4.5], facing: 'S' },
    { id: 'dining-table', model: 'table', logic: 'table@5,0', at: [1.0, 5.5], facing: 'E' },
    { id: 'dining-lamp-north', model: 'lampRoundFloor', logic: 'lamp@4,3', at: [3.5, 4.5] },
    { id: 'dining-lamp-south', model: 'lampRoundFloor', logic: 'lamp@6,3', at: [3.5, 6.5] },

    { id: 'court-shrub-west', model: 'plant_bushDetailed', logic: 'shrub@5,6', at: [6.0, 5.5] },
    { id: 'court-plant-south-west', model: 'flower_redA', logic: 'plant@6,4', at: [4.5, 6.5] },
    { id: 'court-shrub-south-east', model: 'plant_bushSmall', logic: 'shrub@7,7', at: [7.5, 7.5] },
    { id: 'court-plant-north', model: 'flower_yellowA', logic: 'plant@0,2', at: [2.5, 0.5] },
  ],
}
