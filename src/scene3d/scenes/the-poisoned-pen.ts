import type { SceneSpec } from '../schema'

// Moradia de campo com galeria de jantar e jardim de entrada.
export const thePoisonedPen: SceneSpec = {
  puzzleId: 'medium-4',
  floor: 0,
  entry: { wall: 'west', at: 6.8 },
  shell: { features: [{ wall: 'north', at: 6.7, kind: 'window' }] },
  floors: [
    { id: 'dining-gallery', cells: [5, 0, 7, 7], material: 'wood', kind: 'interior' },
    { id: 'front-yard', cells: [0, 0, 4, 2], material: 'stone', kind: 'exterior' },
    { id: 'walled-garden', cells: [0, 3, 4, 5], material: 'grass', kind: 'courtyard' },
    { id: 'south-hallway', cells: [0, 6, 4, 7], material: 'tile', kind: 'interior' },
  ],
  walls: [
    { id: 'dining-front-yard', from: [5, 0], to: [5, 3], height: 'half', openings: [{ at: 1.7, width: 1.2, kind: 'door' }] },
    { id: 'dining-garden', from: [5, 3], to: [5, 6], height: 'half', openings: [{ at: 4.5, width: 1.0, kind: 'open' }] },
    { id: 'dining-hallway', from: [5, 6], to: [5, 8], height: 'half', openings: [{ at: 6.5, width: 0.9, kind: 'door' }] },
    { id: 'yard-garden', from: [0, 3], to: [5, 3], height: 'half', openings: [{ at: 4.4, width: 0.9, kind: 'open' }] },
    { id: 'garden-hallway', from: [0, 6], to: [5, 6], height: 'half', openings: [{ at: 4.5, width: 0.8, kind: 'door' }] },
  ],
  furniture: [
    { id: 'dining-table-carol', model: 'table', logic: 'table@0,5', at: [6.0, 0.75], facing: 'E' },
    { id: 'dining-chair-dalia', model: 'chair', logic: 'chair@2,5', at: [5.5, 2.5], facing: 'E' },
    { id: 'dining-chair-carol', model: 'chair', logic: 'chair@1,7', at: [7.5, 1.5], facing: 'W' },
    { id: 'dining-lamp-north', model: 'lampRoundFloor', logic: 'lamp@0,7', at: [7.5, 0.5] },
    { id: 'dining-lamp-south', model: 'lampRoundFloor', logic: 'lamp@7,7', at: [7.5, 7.5] },
    { id: 'dining-lamp-west', model: 'lampRoundFloor', logic: 'lamp@4,7', at: [7.5, 4.5] },
    { id: 'dining-rug-south', model: 'rugRectangle', logic: 'rug@6,5', at: [6.0, 7.0], facing: 'E' },

    { id: 'front-yard-shrub', model: 'plant_bushSmall', logic: 'shrub@0,0', at: [0.5, 0.5] },
    { id: 'front-yard-plant-west', model: 'flower_yellowA', logic: 'plant@0,1', at: [1.5, 0.5] },
    { id: 'front-yard-plant-east', model: 'flower_redA', logic: 'plant@0,4', at: [4.5, 0.5] },
    { id: 'garden-shrub-west', model: 'plant_bushDetailed', logic: 'shrub@3,1', at: [1.5, 3.5] },
    { id: 'garden-plant-west', model: 'flower_purpleA', logic: 'plant@3,2', at: [2.5, 3.5] },
    { id: 'garden-shrub-south', model: 'plant_bushSmall', logic: 'shrub@5,3', at: [3.5, 5.5] },
    { id: 'garden-shrub-east', model: 'plant_bushSmall', logic: 'shrub@4,4', at: [4.05, 4.5] },
    { id: 'garden-plant-south', model: 'pottedPlant', logic: 'plant@5,2', at: [2.4, 5.35] },

    { id: 'hall-rug-west', model: 'rugRectangle', logic: 'rug@6,1', at: [2.0, 7.0], facing: 'E' },
    { id: 'hall-clock-table-west', model: 'sideTable', at: [3.5, 7.5] },
    { id: 'hall-clock-west', model: 'radio', logic: 'clock@7,3', on: { parent: 'hall-clock-table-west' } },
    { id: 'hall-clock-table-east', model: 'sideTable', at: [4.5, 7.5] },
    { id: 'hall-clock-east', model: 'radio', logic: 'clock@7,4', on: { parent: 'hall-clock-table-east' } },
  ],
}
