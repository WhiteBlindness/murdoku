import type { SceneSpec } from '../schema'

// Bungalow urbano com gabinete, alpendre frontal e jardim nas traseiras.
export const theCrackedMirror: SceneSpec = {
  puzzleId: 'medium-8',
  floor: 0,
  entry: { wall: 'west', at: 1.5 },
  shell: { features: [{ wall: 'north', at: 2.6, kind: 'window' }] },
  floors: [
    { id: 'office', cells: [0, 0, 4, 3], material: 'wood', kind: 'interior' },
    { id: 'front-porch', cells: [5, 0, 7, 3], material: 'stone', kind: 'courtyard' },
    { id: 'cross-hall', cells: [0, 4, 7, 5], material: 'tile', kind: 'interior' },
    { id: 'rear-garden', cells: [0, 6, 7, 7], material: 'grass', kind: 'exterior' },
  ],
  walls: [
    { id: 'office-porch', from: [5, 0], to: [5, 4], height: 'half', openings: [{ at: 1.5, width: 1.0, kind: 'door' }] },
    { id: 'office-hall', from: [0, 4], to: [5, 4], height: 'half', openings: [{ at: 2.5, width: 1.0, kind: 'door' }] },
    { id: 'porch-hall', from: [5, 4], to: [8, 4], height: 'half', openings: [{ at: 6.5, width: 1.2, kind: 'door' }] },
    { id: 'hall-garden', from: [0, 6], to: [8, 6], height: 'half', openings: [{ at: 4.0, width: 1.6, kind: 'open' }] },
  ],
  furniture: [
    { id: 'office-bookshelf', model: 'bookcaseOpenLow', logic: 'bookshelf@0,1', at: [2.0, 0.5], facing: 'S' },
    { id: 'office-chair-east', model: 'chair', logic: 'chair@2,4', at: [4.5, 2.5], facing: 'W' },
    { id: 'office-clock-table', model: 'sideTable', at: [4.5, 0.5] },
    { id: 'office-clock', model: 'radio', logic: 'clock@0,4', on: { parent: 'office-clock-table' } },
    { id: 'office-desk-south-west', model: 'desk', logic: 'desk@3,1', at: [1.5, 3.5], facing: 'N' },
    { id: 'office-desk-south-east', model: 'desk', logic: 'desk@3,0', at: [0.5, 3.5], facing: 'N' },
    { id: 'office-chair-reading', model: 'chair', logic: 'chair@1,2', at: [2.5, 1.5], facing: 'S' },

    { id: 'porch-plant-north', model: 'pottedPlant', logic: 'plant@0,6', at: [6.5, 0.5] },
    { id: 'porch-plant-south', model: 'flower_redA', logic: 'plant@2,5', at: [5.5, 2.5] },
    { id: 'porch-chair', model: 'chair', logic: 'chair@3,5', at: [5.5, 3.5], facing: 'N' },

    { id: 'hall-rug-west', model: 'rugRectangle', logic: 'rug@4,0', at: [1.0, 5.0], facing: 'E' },
    { id: 'hall-clock-table', model: 'sideTable', at: [3.5, 4.5] },
    { id: 'hall-clock', model: 'radio', logic: 'clock@4,3', on: { parent: 'hall-clock-table' } },
    { id: 'hall-plant-east', model: 'flower_yellowA', logic: 'plant@5,7', at: [7.5, 5.5] },

    { id: 'garden-plant-west', model: 'flower_yellowA', logic: 'plant@6,1', at: [1.5, 6.5] },
    { id: 'garden-shrub-west', model: 'plant_bushSmall', logic: 'shrub@7,1', at: [1.5, 7.5] },
    { id: 'garden-shrub-centre-west', model: 'plant_bushDetailed', logic: 'shrub@6,2', at: [2.5, 6.5] },
    { id: 'garden-shrub-east', model: 'plant_bushSmall', logic: 'shrub@7,6', at: [6.5, 7.5] },
    { id: 'garden-shrub-east-corner', model: 'plant_bushDetailed', logic: 'shrub@7,7', at: [7.5, 7.5] },
  ],
}
