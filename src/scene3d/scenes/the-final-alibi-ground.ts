import type { SceneSpec } from '../schema'

const stairAt: [number, number] = [6.0, 1.4]

// A west-climbing flight sits in the north-east kitchen bay, clear of the
// cooking line and the two dining tables.
export const theFinalAlibiGround: SceneSpec = {
  puzzleId: 'master-7',
  floor: 0,
  storeyFootprint: { kind: 'full' },
  entry: { wall: 'west', at: 3.5 },
  stairs: { model: 'stairsOpen', at: stairAt, facing: 'W' },
  exteriorSupportBays: [
    { id: 'study-over-garden-north', cells: [3, 4, 3, 6] },
    { id: 'study-over-garden-south', cells: [3, 7, 3, 7] },
    { id: 'bedroom-over-garden-northwest', cells: [4, 4, 6, 6] },
    { id: 'bedroom-over-garden-northeast', cells: [7, 4, 7, 6] },
    { id: 'bedroom-over-garden-southwest', cells: [4, 7, 6, 7] },
    { id: 'bedroom-over-garden-southeast', cells: [7, 7, 7, 7] },
  ],
  shell: { features: [
    { wall: 'north', at: 6.4, kind: 'window' },
    { wall: 'west', at: 1.4, kind: 'window' },
  ] },
  floors: [
    { id: 'kitchen-floor', cells: [3, 0, 7, 3], material: 'tile' },
    { id: 'garden-ground', cells: [3, 4, 7, 7], material: 'grass', kind: 'exterior' },
    { id: 'office-floor', cells: [0, 0, 2, 4], material: 'wood' },
    { id: 'pantry-floor', cells: [0, 5, 2, 7], material: 'stone' },
  ],
  walls: [
    { id: 'office-kitchen', from: [3, 0], to: [3, 4], height: 'half', openings: [{ at: 2.5, width: 1.2, kind: 'door' }] },
    { id: 'kitchen-garden', from: [3, 4], to: [8, 4], height: 'half', openings: [{ at: 4.8, width: 1.2, kind: 'door' }] },
    { id: 'office-pantry', from: [0, 5], to: [3, 5], height: 'half', openings: [{ at: 2.2, width: 1.2, kind: 'door' }] },
    { id: 'garden-west-return', from: [3, 4], to: [3, 5], height: 'half' },
    { id: 'pantry-garden', from: [3, 5], to: [3, 8], height: 'half', openings: [{ at: 6.3, width: 1.2, kind: 'door' }] },
  ],
  furniture: [
    // Bancada em península de costas para a escada, com a placa no topo nascente.
    { id: 'kitchen-stove', model: 'kitchenStoveElectric', logic: 'stove@2,7', at: [7.43, 2.3], facing: 'S' },
    { id: 'kitchen-run-gap', model: 'kitchenCabinetDrawer', at: [6.89, 2.3], facing: 'S' },
    { id: 'kitchen-table-west', model: 'table', logic: 'table@3,3', at: [4.1, 3.125], facing: 'N' },
    { id: 'kitchen-fridge', model: 'kitchenFridge', logic: 'fridge@3,5', at: [5.5, 3.2], facing: 'S' },
    { id: 'garden-plant-north', model: 'pottedPlant', logic: 'plant@4,4', at: [4.0, 4.5] },
    { id: 'garden-shrub-west', model: 'plant_bushSmall', logic: 'shrub@6,3', at: [3.9, 6.5] },
    { id: 'garden-shrub-east', model: 'plant_bushSmall', logic: 'shrub@6,7', at: [7.5, 6.5] },

    { id: 'office-bookshelf', model: 'bookcaseOpenLow', logic: 'bookshelf@0,1', against: { wall: 'north', at: 1.5 } },
    { id: 'office-chair', model: 'chair', logic: 'chair@4,0', at: [0.5, 4.5], facing: 'E' },
    { id: 'office-clock', model: 'speaker', logic: 'clock@2,2', at: [2.1, 2.1] },
    { id: 'office-desk', model: 'desk', logic: 'desk@2,0', at: [0.55, 2.5], facing: 'E' },
    { id: 'office-desk-chair', model: 'chairDesk', at: [1.15, 2.5], facing: 'W' },
    { id: 'pantry-box', model: 'cardboardBoxClosed', logic: 'box@6,0', at: [0.5, 6.5] },
    { id: 'pantry-counter', model: 'kitchenCabinet', logic: 'counter@5,0', at: [0.7, 5.55] },
    { id: 'pantry-fridge-bella', model: 'kitchenFridge', logic: 'fridge@6,2', at: [2.1, 6.5], facing: 'E' },
    { id: 'kitchen-table-nadia', model: 'table', logic: 'table@3,6', at: [6.5, 3.5], facing: 'N' },
    { id: 'garden-plant-evangeline', model: 'pottedPlant', logic: 'plant@5,7', at: [7.5, 5.5] },
    { id: 'kitchen-counter-lena', model: 'kitchenCabinet', logic: 'counter@2,5', at: [5.81, 2.3], facing: 'S' },
    { id: 'kitchen-counter-lena-b', model: 'kitchenCabinet', logic: 'counter@2,5', at: [6.35, 2.3], facing: 'S' },
  ],
}
