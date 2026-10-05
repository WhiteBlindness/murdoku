import type { SceneSpec } from '../schema'

// Casa estreita com sala de estar, alpendre, corredor e jardim lateral.
export const aDebtRepaid: SceneSpec = {
  puzzleId: 'medium-9',
  floor: 0,
  entry: { wall: 'west', at: 2.7 },
  shell: { features: [{ wall: 'north', at: 2.5, kind: 'window' }] },
  floors: [
    { id: 'living-room', cells: [0, 0, 3, 4], material: 'wood', kind: 'interior' },
    { id: 'south-porch', cells: [0, 5, 3, 7], material: 'stone', kind: 'exterior' },
    { id: 'central-hall', cells: [4, 0, 5, 7], material: 'tile', kind: 'interior' },
    { id: 'east-front-garden', cells: [6, 0, 7, 7], material: 'grass', kind: 'exterior' },
  ],
  walls: [
    { id: 'living-hall', from: [4, 0], to: [4, 5], height: 'half', openings: [{ at: 1.5, width: 1.2, kind: 'door' }] },
    { id: 'porch-hall', from: [4, 5], to: [4, 8], height: 'half', openings: [{ at: 7.2, width: 1.2, kind: 'door' }] },
    { id: 'hall-garden', from: [6, 0], to: [6, 8], height: 'half', openings: [{ at: 1.0, width: 1.2, kind: 'open' }] },
    { id: 'living-porch', from: [0, 5], to: [4, 5], height: 'half', openings: [{ at: 1.7, width: 1.2, kind: 'open' }] },
  ],
  furniture: [
    { id: 'living-sofa', model: 'loungeSofaLong', logic: 'sofa@0,0', at: [1.0, 0.9], facing: 'S' },
    { id: 'living-television', model: 'cabinetTelevision', logic: 'tv@1,0', against: { wall: 'west', at: 1.5 } },
    { id: 'living-clock-table', model: 'sideTable', at: [3.5, 4.35] },
    { id: 'living-clock', model: 'radio', logic: 'clock@4,3', on: { parent: 'living-clock-table' } },

    { id: 'porch-chair-yuki', model: 'chair', logic: 'chair@6,3', at: [3.5, 6.5], facing: 'W' },
    { id: 'porch-chair-viraj', model: 'chair', logic: 'chair@7,0', at: [0.5, 7.5], facing: 'E' },
    { id: 'porch-chair-extra', model: 'chair', logic: 'chair@7,2', at: [2.5, 7.5], facing: 'N' },
    { id: 'porch-plant', model: 'flower_redA', logic: 'plant@5,3', at: [3.5, 5.5] },

    { id: 'hall-clock-table-north', model: 'sideTable', at: [5.5, 4.25] },
    { id: 'hall-clock-north', model: 'radio', logic: 'clock@4,5', on: { parent: 'hall-clock-table-north' } },
    { id: 'hall-rug', model: 'rugRectangle', logic: 'rug@2,4', at: [5.0, 3.0], facing: 'E' },
    { id: 'hall-clock-table-south', model: 'sideTable', at: [5.5, 6.2] },
    { id: 'hall-clock-south', model: 'radio', logic: 'clock@6,5', on: { parent: 'hall-clock-table-south' } },
    { id: 'hall-plant', model: 'flower_yellowA', logic: 'plant@6,4', at: [4.5, 6.5] },

    { id: 'garden-shrub-north', model: 'plant_bushSmall', logic: 'shrub@0,7', at: [7.5, 0.5] },
    { id: 'garden-shrub-upper', model: 'plant_bushSmall', logic: 'shrub@2,6', at: [6.5, 2.5] },
    { id: 'garden-shrub-middle', model: 'plant_bushDetailed', logic: 'shrub@3,6', at: [6.5, 3.5] },
    { id: 'garden-shrub-south-east', model: 'plant_bushSmall', logic: 'shrub@7,7', at: [7.5, 7.5] },
    { id: 'garden-plant-south', model: 'flower_purpleA', logic: 'plant@4,6', at: [6.5, 4.5] },
  ],
}
