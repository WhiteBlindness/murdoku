import type { SceneSpec } from '../schema'

// Habitação compacta com alpendre de entrada fechado, usado como vestíbulo.
export const theUnlitLampGround: SceneSpec = {
  puzzleId: 'hard-7',
  floor: 0,
  storeyFootprint: { kind: 'full' },
  entry: { wall: 'west', at: 6.5 },
  shell: { features: [
    { wall: 'north', at: 1.25, kind: 'window' },
    { wall: 'north', at: 6.6, kind: 'window' },
    { wall: 'west', at: 1.6, kind: 'window' },
  ] },
  stairs: { model: 'stairsOpen', at: [2.65, 2.0], facing: 'S' },
  floors: [
    { id: 'living-room', cells: [0, 0, 2, 4], material: 'wood' },
    { id: 'central-hall', cells: [3, 0, 4, 7], material: 'wood' },
    { id: 'entry-vestibule', cells: [0, 5, 2, 7], material: 'stone' },
    { id: 'kitchen', cells: [5, 0, 7, 7], material: 'tile' },
  ],
  walls: [
    { id: 'living-vestibule', from: [0, 5], to: [3, 5] },
    { id: 'vestibule-hall', from: [3, 5], to: [3, 8], openings: [{ at: 7.0, width: 1.2, kind: 'door' }] },
    { id: 'hall-kitchen', from: [5, 0], to: [5, 8], openings: [{ at: 3.9, width: 1.4, kind: 'open' }] },
  ],
  furniture: [
    { id: 'living-sofa', model: 'loungeSofaLong', logic: 'sofa@1,0', at: [1.0, 1.5], facing: 'E' },
    { id: 'living-tv-west', model: 'cabinetTelevision', logic: 'tv@4,1', at: [1.25, 4.45], facing: 'N' },
    { id: 'living-tv-east', model: 'cabinetTelevision', logic: 'tv@4,2', at: [2.35, 4.45], facing: 'N' },
    { id: 'living-clock', model: 'speaker', logic: 'clock@0,2', at: [1.88, 0.45] },
    { id: 'hall-clock-table', model: 'sideTable', at: [4.55, 2.5], facing: 'E' },
    { id: 'hall-clock', model: 'radio', logic: 'clock@2,4', on: { parent: 'hall-clock-table' } },
    { id: 'hall-plant-north', model: 'flower_yellowA', logic: 'plant@0,4', at: [4.15, 0.5] },
    { id: 'hall-plant-south', model: 'flower_redA', logic: 'plant@5,4', at: [4.15, 5.5] },
    { id: 'hall-rug', model: 'rugRectangle', logic: 'rug@6,3', at: [4.0, 7.0], facing: 'E' },

    { id: 'kitchen-stove-north', model: 'kitchenStove', logic: 'stove@0,5', at: [5.5, 0.5], facing: 'S' },
    { id: 'kitchen-fridge', model: 'kitchenFridgeSmall', logic: 'fridge@5,5', at: [5.5, 5.5], facing: 'W' },
    { id: 'kitchen-counter', model: 'kitchenCabinet', logic: 'counter@5,7', at: [7.5, 5.5], facing: 'W' },
    { id: 'kitchen-stove-south', model: 'kitchenStove', logic: 'stove@4,7', at: [7.5, 4.5], facing: 'W' },

    { id: 'vestibule-chair', model: 'chair', logic: 'chair@5,0', at: [0.7, 5.5], facing: 'E' },
    { id: 'vestibule-plant', model: 'flower_purpleA', logic: 'plant@6,0', at: [0.7, 6.7] },
  ],
}
