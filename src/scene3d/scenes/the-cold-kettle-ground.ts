import type { SceneSpec } from '../schema'

// Casa de jardim com sala de receção, escritório lateral e alpendre coberto.
export const theColdKettleGround: SceneSpec = {
  puzzleId: 'hard-5',
  floor: 0,
  storeyFootprint: { kind: 'full' },
  entry: { wall: 'west', at: 6.5 },
  shell: { features: [{ wall: 'north', at: 6.1, kind: 'window' }] },
  stairs: { model: 'stairsOpen', at: [6.1, 2.0], facing: 'S' },
  exteriorSupportBays: [
    { id: 'front-yard-nw', cells: [0, 0, 2, 2] },
    { id: 'front-yard-ne', cells: [3, 0, 3, 2] },
    { id: 'front-yard-sw', cells: [0, 3, 2, 4] },
    { id: 'front-yard-se', cells: [3, 3, 3, 4] },
    { id: 'porch-covered', cells: [5, 5, 7, 7] },
  ],
  floors: [
    { id: 'front-yard', cells: [0, 0, 3, 4], material: 'grass', kind: 'exterior' },
    { id: 'living-room', cells: [4, 0, 7, 4], material: 'wood' },
    { id: 'office', cells: [0, 5, 4, 7], material: 'wood' },
    { id: 'covered-porch', cells: [5, 5, 7, 7], material: 'stone', kind: 'exterior' },
  ],
  walls: [
    { id: 'garden-living', from: [4, 0], to: [4, 5], height: 'half', openings: [{ at: 4.35, width: 1.3, kind: 'door' }] },
    { id: 'south-wing-front', from: [0, 5], to: [8, 5], openings: [
      { at: 2.8, width: 1.0, kind: 'door' },
      { at: 7.3, width: 1.0, kind: 'open' },
    ] },
    { id: 'office-porch', from: [5, 5], to: [5, 8], openings: [{ at: 6.5, width: 1.2, kind: 'door' }] },
  ],
  furniture: [
    { id: 'garden-shrub-north', model: 'plant_bushSmall', logic: 'shrub@0,1', at: [1.5, 0.5] },
    { id: 'garden-plant-north', model: 'flower_yellowA', logic: 'plant@0,2', at: [2.5, 0.5] },
    { id: 'garden-plant-south', model: 'flower_purpleA', logic: 'plant@1,3', at: [3.5, 1.5] },
    { id: 'garden-shrub-south', model: 'plant_bushSmall', logic: 'shrub@2,3', at: [3.5, 2.5] },
    { id: 'living-sofa', model: 'loungeSofaLong', logic: 'sofa@1,7', at: [7.35, 2.0], facing: 'W' },
    { id: 'living-tv', model: 'cabinetTelevision', logic: 'tv@3,4', against: { wall: 'garden-living', side: 'E', at: 3.05 }, facing: 'E' },
    { id: 'living-tv-set', model: 'televisionModern', on: { parent: 'living-tv' } },
    { id: 'living-rug', model: 'rugRectangle', logic: 'rug@0,5', at: [5.2, 1.5], facing: 'N' },
    { id: 'living-clock-table', model: 'sideTable', at: [4.8, 4.3], facing: 'E' },
    { id: 'living-clock', model: 'radio', logic: 'clock@4,4', on: { parent: 'living-clock-table' } },
    { id: 'office-chair-west', model: 'chair', logic: 'chair@5,0', at: [0.5, 5.5], facing: 'E' },
    { id: 'office-bookcase', model: 'bookcaseOpenLow', logic: 'bookshelf@5,1', at: [1.5, 5.5], facing: 'N' },
    { id: 'office-desk', model: 'desk', logic: 'desk@5,3', at: [3.8, 5.5], facing: 'N' },
    { id: 'porch-chair-north', model: 'chair', logic: 'chair@5,6', at: [6.5, 5.5], facing: 'S' },
    { id: 'porch-plant', model: 'flower_redA', logic: 'plant@7,6', at: [6.5, 7.5] },
    { id: 'porch-chair-south', model: 'chair', logic: 'chair@7,7', at: [7.5, 7.5], facing: 'N' },
  ],
}
