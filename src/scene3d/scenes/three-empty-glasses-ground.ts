import type { SceneSpec } from '../schema'

const stairAt: [number, number] = [7.25, 2.5]

// Moradia de dois pisos com despensa de entrada, sala de jantar e jardim aberto.
export const threeEmptyGlassesGround: SceneSpec = {
  puzzleId: 'hard-8',
  floor: 0,
  storeyFootprint: { kind: 'full' },
  entry: { wall: 'north', at: 5 },
  shell: { features: [
    { wall: 'north', at: 1.4, kind: 'window' },
    { wall: 'north', at: 6.7, kind: 'window' },
    { wall: 'west', at: 1.5, kind: 'window' },
  ] },
  stairs: { model: 'stairsOpen', at: stairAt, facing: 'N' },
  exteriorSupportBays: [
    { id: 'garden-north-frame', cells: [0, 3, 2, 4] },
    { id: 'garden-south-frame', cells: [0, 5, 2, 7] },
  ],
  floors: [
    { id: 'pantry-tile', cells: [0, 0, 2, 2], material: 'tile' },
    { id: 'office-wood', cells: [3, 0, 7, 3], material: 'wood' },
    { id: 'dining-wood', cells: [3, 4, 7, 7], material: 'wood' },
    { id: 'open-garden', cells: [0, 3, 2, 7], material: 'grass', kind: 'exterior' },
  ],
  walls: [
    { id: 'pantry-garden-facade', from: [3, 0], to: [3, 8], openings: [
      { at: 1.5, width: 1.2, kind: 'door' },
      { at: 6.2, width: 1.3, kind: 'door' },
    ] },
    { id: 'garden-north-facade', from: [0, 3], to: [3, 3] },
    { id: 'office-dining-west', from: [3, 4], to: [5, 4], height: 'half', freeEnds: ['to'] },
  ],
  furniture: [
    { id: 'office-clock-table', model: 'sideTable', at: [3.45, 2.45] },
    { id: 'office-clock', model: 'radio', logic: 'clock@2,3', on: { parent: 'office-clock-table' } },
    { id: 'office-bookshelf', model: 'bookcaseOpenLow', logic: 'bookshelf@3,5', at: [5.9, 3.275], facing: 'E' },
    { id: 'office-chair', model: 'chair', logic: 'chair@0,7', at: [7.45, 0.55], facing: 'W' },
    { id: 'office-desk', model: 'desk', logic: 'desk@3,4', at: [4.1, 3.45], facing: 'S' },

    { id: 'dining-rug', model: 'rugRectangle', logic: 'rug@4,4', at: [5, 5], facing: 'E' },
    { id: 'dining-table', model: 'table', logic: 'table@7,6', at: [6.95, 7.45], facing: 'N' },
    { id: 'dining-lamp', model: 'lampRoundFloor', logic: 'lamp@5,3', at: [3.45, 5.1] },

    { id: 'pantry-box', model: 'cardboardBoxClosed', logic: 'box@0,2', at: [2.55, 0.55] },
    { id: 'pantry-counter', model: 'kitchenCabinet', logic: 'counter@2,1', at: [1.55, 2.45], facing: 'S' },

    { id: 'garden-plant-south-west', model: 'pottedPlant', logic: 'plant@6,0', at: [0.5, 6.78] },
    { id: 'garden-shrub-south', model: 'plant_bushSmall', logic: 'shrub@7,1', at: [1.45, 7.55] },
    { id: 'garden-shrub-north', model: 'plant_bushSmall', logic: 'shrub@3,0', at: [0.5, 3.55] },
    { id: 'garden-plant-south-edge', model: 'flower_redA', logic: 'plant@7,0', at: [0.5, 7.45] },
  ],
}
