import type { SceneSpec } from '../schema'

// Moradia térrea entre um pátio verde e um pequeno jardim de entrada.
export const nobodyLeft: SceneSpec = {
  puzzleId: 'medium-11',
  floor: 0,
  entry: { wall: 'west', at: 6.5 },
  shell: { features: [
    { wall: 'north', at: 1.5, kind: 'window' },
    { wall: 'north', at: 6.5, kind: 'window' },
    { wall: 'west', at: 1.6, kind: 'window' },
  ] },
  floors: [
    { id: 'living-room', cells: [0, 0, 2, 3], material: 'wood' },
    { id: 'walled-garden', cells: [3, 0, 7, 3], material: 'grass', kind: 'courtyard' },
    { id: 'arrival-garden', cells: [0, 4, 2, 7], material: 'stone', kind: 'courtyard' },
    { id: 'office-floor', cells: [3, 4, 7, 7], material: 'wood' },
  ],
  walls: [
    { id: 'living-garden', from: [3, 0], to: [3, 4], height: 'half', openings: [{ at: 2.15, width: 1.2, kind: 'open' }] },
    { id: 'arrival-office', from: [3, 4], to: [3, 8], height: 'half', openings: [{ at: 6.15, width: 1.2, kind: 'door' }] },
    { id: 'living-arrival', from: [0, 4], to: [3, 4], height: 'half', openings: [{ at: 1.45, width: 1.2, kind: 'open' }] },
    { id: 'garden-office', from: [3, 4], to: [8, 4], height: 'half', openings: [{ at: 5.65, width: 1.25, kind: 'open' }] },
  ],
  furniture: [
    { id: 'living-television', model: 'cabinetTelevision', logic: 'tv@0,2', against: { wall: 'north', at: 2.45 } },
    { id: 'living-clock-table', model: 'sideTable', at: [2.45, 3.5] },
    { id: 'living-clock', model: 'radio', logic: 'clock@3,2', on: { parent: 'living-clock-table' } },

    { id: 'garden-shrub-west', model: 'plant_bushSmall', logic: 'shrub@0,3', at: [3.45, 0.45] },
    { id: 'garden-shrub-east', model: 'plant_bushSmall', logic: 'shrub@0,6', at: [6.45, 0.45] },
    { id: 'garden-plant', model: 'pottedPlant', logic: 'plant@1,7', at: [7.45, 1.5] },

    { id: 'yard-shrub', model: 'plant_bushSmall', logic: 'shrub@4,0', at: [0.48, 4.5] },
    { id: 'yard-plant-border', model: 'flower_redA', logic: 'plant@4,1', at: [1.55, 4.8] },
    { id: 'yard-plant', model: 'pottedPlant', logic: 'plant@6,2', at: [2.15, 6.5] },

    { id: 'office-bookcase', model: 'bookcaseOpenLow', logic: 'bookshelf@4,3', at: [3.55, 4.5], facing: 'E' },
    { id: 'office-clock-table', model: 'sideTable', at: [6.45, 4.5], facing: 'W' },
    { id: 'office-clock', model: 'radio', logic: 'clock@4,6', on: { parent: 'office-clock-table' } },
    { id: 'office-desk', model: 'desk', logic: 'desk@5,5', at: [5.5, 5.55], facing: 'N' },
    { id: 'office-desk-chair', model: 'chairDesk', at: [5.5, 4.95], facing: 'S' },
    { id: 'office-visitor-chair', model: 'chair', logic: 'chair@5,7', at: [7.4, 5.5], facing: 'W' },
  ],
}
