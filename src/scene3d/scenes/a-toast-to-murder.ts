import type { SceneSpec } from '../schema'

// Moradia de receção com sala de jantar central, escritório e jardim de entrada.
export const aToastToMurder: SceneSpec = {
  puzzleId: 'medium-1',
  floor: 0,
  entry: { wall: 'north', at: 7.0 },
  shell: { features: [{ wall: 'north', at: 4.4, kind: 'window' }] },
  floors: [
    { id: 'office', cells: [0, 0, 2, 4], material: 'wood', kind: 'interior' },
    { id: 'front-garden', cells: [0, 5, 2, 7], material: 'grass', kind: 'exterior' },
    { id: 'dining-spine', cells: [3, 0, 5, 7], material: 'wood', kind: 'interior' },
    { id: 'east-hall', cells: [6, 0, 7, 7], material: 'tile', kind: 'interior' },
  ],
  walls: [
    { id: 'office-dining', from: [3, 0], to: [3, 5], height: 'half', openings: [{ at: 2.4, width: 1.15, kind: 'door' }] },
    { id: 'office-garden', from: [0, 5], to: [3, 5], height: 'half', openings: [{ at: 1.55, width: 1.2, kind: 'door' }] },
    { id: 'garden-dining', from: [3, 5], to: [3, 8], height: 'half', openings: [{ at: 7.4, width: 1.2, kind: 'door' }] },
    { id: 'dining-east-hall', from: [6, 0], to: [6, 8], height: 'half', openings: [{ at: 3.0, width: 1.3, kind: 'open' }] },
  ],
  furniture: [
    { id: 'office-greta-desk', model: 'desk', logic: 'desk@0,0', at: [0.55, 0.52], facing: 'E' },
    { id: 'office-idris-bookshelf-west', model: 'bookcaseOpenLow', logic: 'bookshelf@1,0', at: [0.48, 2.05], facing: 'E' },
    { id: 'office-idris-chair', model: 'chair', logic: 'chair@0,1', at: [1.5, 0.5], facing: 'S' },
    { id: 'office-bookshelf-north', model: 'bookcaseOpenLow', logic: 'bookshelf@1,1', at: [2.1, 1.55], facing: 'W' },
    { id: 'office-clock', model: 'speaker', logic: 'clock@0,2', at: [2.52, 0.48] },

    { id: 'dining-lamp-west', model: 'lampRoundFloor', logic: 'lamp@0,4', at: [4.38, 0.48] },
    { id: 'dining-lamp-east-table', model: 'sideTable', at: [5.5, 1.5] },
    { id: 'dining-lamp-east', model: 'lampRoundTable', logic: 'lamp@1,5', on: { parent: 'dining-lamp-east-table' } },
    { id: 'dining-table', model: 'table', at: [4.1, 4.1], facing: 'E' },
    { id: 'dining-chair-west', model: 'chair', at: [3.4, 4.25], facing: 'E' },
    { id: 'dining-chair-north', model: 'chair', at: [4.7, 3.0], facing: 'S' },
    { id: 'dining-viraj-chair', model: 'chair', logic: 'chair@4,5', at: [5.52, 4.5], facing: 'W' },
    { id: 'dining-desk-extra', model: 'desk', logic: 'desk@3,0', at: [0.5, 3.5], facing: 'E' },

    { id: 'hall-clock', model: 'speaker', logic: 'clock@3,7', at: [7.5, 3.5] },
    { id: 'hall-nadia-rug', model: 'rugRound', logic: 'rug@4,6', at: [6.3, 5.0] },
    { id: 'hall-nadia-chair', model: 'chair', logic: 'chair@6,5', at: [5.5, 6.5], facing: 'N' },
    { id: 'hall-plants-east', model: 'flower_yellowA', logic: 'plant@2,6', at: [6.8, 2.5] },
    { id: 'hall-victim-flower', model: 'flower_purpleA', logic: 'plant@7,7', at: [7.5, 7.5] },

    { id: 'garden-flower', model: 'flower_redA', logic: 'plant@7,0', at: [0.5, 7.5] },
    { id: 'garden-shrub-west', model: 'plant_bushSmall', logic: 'shrub@6,0', at: [0.45, 6.45] },
    { id: 'garden-shrub-east', model: 'plant_bushDetailed', logic: 'shrub@6,2', at: [2.5, 6.35] },
  ],
}
