import type { SceneSpec } from '../schema'

// Hall central com galeria de entrada, alpendre e jardim.
export const shadowsInTheHall: SceneSpec = {
  puzzleId: 'medium-3',
  floor: 0,
  entry: { wall: 'west', at: 3.1 },
  shell: { features: [{ wall: 'north', at: 3.1, kind: 'window' }] },
  floors: [
    { id: 'west-gallery', cells: [0, 0, 1, 7], material: 'tile', kind: 'interior' },
    { id: 'central-hall', cells: [2, 0, 4, 7], material: 'wood', kind: 'interior' },
    { id: 'north-porch-court', cells: [5, 0, 7, 3], material: 'stone', kind: 'courtyard' },
    { id: 'south-garden', cells: [5, 4, 7, 7], material: 'grass', kind: 'exterior' },
  ],
  walls: [
    { id: 'gallery-hall', from: [2, 0], to: [2, 8], height: 'half', openings: [{ at: 3.15, width: 1.25, kind: 'door' }] },
    { id: 'hall-porch', from: [5, 0], to: [5, 4], height: 'half', openings: [{ at: 3.3, width: 1.2, kind: 'open' }] },
    { id: 'hall-garden', from: [5, 4], to: [5, 8], height: 'half', openings: [{ at: 4.75, width: 1.2, kind: 'open' }] },
    { id: 'porch-garden', from: [5, 4], to: [8, 4], height: 'half', openings: [{ at: 6.0, width: 1.25, kind: 'open' }] },
  ],
  furniture: [
    { id: 'gallery-rug', model: 'rugRectangle', logic: 'rug@1,0', at: [1.0, 2.0] },
    { id: 'gallery-clock', model: 'speaker', logic: 'clock@7,0', at: [0.55, 7.45] },
    { id: 'gallery-plant-north', model: 'flower_yellowA', logic: 'plant@6,1', at: [1.5, 6.5] },
    { id: 'gallery-plant-south', model: 'flower_purpleA', logic: 'plant@7,1', at: [1.5, 7.5] },

    { id: 'dining-chair-north', model: 'chair', logic: 'chair@4,2', at: [2.5, 4.5], facing: 'E' },
    { id: 'dining-chair-west', model: 'chair', logic: 'chair@1,4', at: [4.5, 1.5], facing: 'N' },
    { id: 'dining-chair-centre', model: 'chair', logic: 'chair@2,5', at: [5.45, 2.3], facing: 'W' },
    { id: 'dining-lamp-north', model: 'lampRoundFloor', logic: 'lamp@0,2', at: [2.5, 0.5] },
    { id: 'dining-tomas-lamp-table', model: 'sideTable', at: [4.2, 0.5] },
    { id: 'dining-tomas-lamp', model: 'lampRoundTable', logic: 'lamp@0,4', on: { parent: 'dining-tomas-lamp-table' } },
    { id: 'dining-lena-lamp', model: 'lampRoundFloor', logic: 'lamp@6,4', at: [4.5, 6.5] },
    { id: 'dining-east-shrub', model: 'plant_bushSmall', logic: 'shrub@4,7', at: [7.5, 4.5] },

    { id: 'porch-yuki-chair', model: 'chair', logic: 'chair@3,7', at: [7.5, 3.5], facing: 'N' },
    { id: 'porch-tomas-chair', model: 'chair', logic: 'chair@0,5', at: [5.5, 0.5], facing: 'W' },
    { id: 'porch-plant', model: 'flower_redA', logic: 'plant@3,6', at: [6.5, 3.0] },

    { id: 'garden-shrub', model: 'plant_bushDetailed', logic: 'shrub@7,5', at: [5.5, 7.5] },
    { id: 'garden-plant-east', model: 'flower_purpleA', logic: 'plant@7,6', at: [6.5, 7.5] },
  ],
}
