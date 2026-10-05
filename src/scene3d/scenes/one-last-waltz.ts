import type { SceneSpec } from '../schema'

// Moradia estreita com galeria de jantar e dois jardins em faixas.
export const oneLastWaltz: SceneSpec = {
  puzzleId: 'medium-5',
  floor: 0,
  entry: { wall: 'west', at: 4.4 },
  shell: { features: [{ wall: 'north', at: 2.9, kind: 'window' }] },
  floors: [
    { id: 'entry-gallery', cells: [0, 0, 1, 7], material: 'tile', kind: 'interior' },
    { id: 'dining-gallery', cells: [2, 0, 3, 7], material: 'wood', kind: 'interior' },
    { id: 'front-court', cells: [4, 0, 5, 7], material: 'stone', kind: 'exterior' },
    { id: 'garden-walk', cells: [6, 0, 7, 7], material: 'grass', kind: 'exterior' },
  ],
  walls: [
    { id: 'gallery-dining', from: [2, 0], to: [2, 8], height: 'half', openings: [{ at: 4.5, width: 1.15, kind: 'door' }] },
    { id: 'dining-front-court', from: [4, 0], to: [4, 8], height: 'half', openings: [{ at: 5.2, width: 1.2, kind: 'open' }] },
    { id: 'court-garden-gate', from: [6, 0], to: [6, 8], height: 'half', openings: [{ at: 5.5, width: 1.0, kind: 'open' }] },
  ],
  furniture: [
    { id: 'gallery-clock-north-table', model: 'sideTable', at: [1.55, 0.5] },
    { id: 'gallery-clock-north', model: 'radio', logic: 'clock@0,1', on: { parent: 'gallery-clock-north-table' } },
    { id: 'gallery-clock-mid-table', model: 'sideTable', at: [1.55, 3.5] },
    { id: 'gallery-clock-mid', model: 'radio', logic: 'clock@3,1', on: { parent: 'gallery-clock-mid-table' } },
    { id: 'gallery-clock-south-east-table', model: 'sideTable', at: [1.55, 5.5] },
    { id: 'gallery-clock-south-east', model: 'radio', logic: 'clock@5,1', on: { parent: 'gallery-clock-south-east-table' } },
    { id: 'gallery-clock-south-west-table', model: 'sideTable', at: [0.55, 5.5] },
    { id: 'gallery-clock-south-west', model: 'radio', logic: 'clock@5,0', on: { parent: 'gallery-clock-south-west-table' } },
    { id: 'gallery-plant-north', model: 'flower_redA', logic: 'plant@0,0', at: [0.5, 0.5] },
    { id: 'gallery-plant-south', model: 'flower_yellowA', logic: 'plant@7,0', at: [0.5, 7.5] },

    { id: 'dining-table', model: 'table', logic: 'table@0,2', at: [3.0, 0.75], facing: 'E' },
    { id: 'dining-chair', model: 'chair', logic: 'chair@2,2', at: [2.5, 2.5], facing: 'N' },
    { id: 'dining-lamp', model: 'lampRoundFloor', logic: 'lamp@1,2', at: [2.5, 1.5] },
    { id: 'dining-runner', model: 'rugRectangle', at: [3.0, 5.1], facing: 'S' },

    { id: 'court-shrub-north-east', model: 'plant_bushSmall', logic: 'shrub@1,5', at: [5.5, 1.5] },
    { id: 'court-plant-north-west', model: 'flower_yellowA', logic: 'plant@1,6', at: [6.5, 1.5] },
    { id: 'court-plant-mid-west', model: 'flower_redA', logic: 'plant@2,5', at: [5.5, 2.5] },
    { id: 'court-shrub-centre-west', model: 'plant_bushDetailed', logic: 'shrub@2,6', at: [6.5, 2.5] },
    { id: 'court-shrub-south-west', model: 'plant_bushSmall', logic: 'shrub@4,5', at: [5.5, 4.5] },
    { id: 'court-shrub-south', model: 'plant_bushSmall', logic: 'shrub@6,5', at: [5.5, 6.5] },
    { id: 'court-shrub-far-south', model: 'plant_bushSmall', logic: 'shrub@7,5', at: [5.5, 7.5] },
    { id: 'court-plant-south-east', model: 'flower_purpleA', logic: 'plant@1,7', at: [7.5, 1.5] },
    { id: 'garden-shrub', model: 'plant_bushDetailed', logic: 'shrub@7,7', at: [7.5, 7.5] },
  ],
}
