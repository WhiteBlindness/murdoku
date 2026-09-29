import type { SceneSpec } from '../schema'

// Moradia urbana compacta: sala, cozinha estreita e galeria de entrada.
export const theUninvited: SceneSpec = {
  puzzleId: 'very-easy-7',
  floor: 0,
  entry: { wall: 'north', at: 5.0 },
  shell: {
    features: [
      { wall: 'north', at: 0.9, kind: 'window' },
      { wall: 'north', at: 2.8, kind: 'window' },
      { wall: 'west', at: 4.4, kind: 'window' },
    ],
  },
  floors: [
    { id: 'kitchen-tile', cells: [2, 0, 3, 5], material: 'tile', kind: 'interior' },
  ],
  walls: [
    { id: 'dining-kitchen', from: [2, 0], to: [2, 6], height: 'half', openings: [{ at: 4.55, kind: 'door' }] },
    { id: 'kitchen-gallery', from: [4, 0], to: [4, 6], height: 'half', openings: [{ at: 3.65, kind: 'door' }] },
  ],
  furniture: [
    // Sala de jantar a oeste.
    { id: 'dining-table', model: 'tableRound', at: [0.9, 1.8], facing: 'E' },
    { id: 'dining-chair', model: 'chair', logic: 'chair@2,1', at: [1.35, 2.6], facing: 'N' },
    { id: 'dining-chair-support', model: 'chair', at: [0.9, 2.5], facing: 'N' },
    { id: 'dining-bookcase', model: 'bookcaseOpenLow', against: { wall: 'west', at: 3.35 } },
    { id: 'sideboard-books', model: 'books', on: { parent: 'dining-bookcase' } },
    { id: 'dining-lamp', model: 'lampRoundFloor', logic: 'lamp@5,0', at: [0.35, 5.15] },

    // Cozinha galley no centro, com passagem livre nas duas extremidades.
    { id: 'kitchen-stove', model: 'kitchenStove', logic: 'stove@0,2', against: { wall: 'north', at: 2.5 } },
    { id: 'kitchen-fridge', model: 'kitchenFridgeSmall', logic: 'fridge@2,2', against: { wall: 'dining-kitchen', side: 'E', at: 2.2 } },
    { id: 'kitchen-counter-a', model: 'kitchenCabinet', logic: 'counter@2,3', against: { wall: 'kitchen-gallery', side: 'W', at: 2.35 } },
    { id: 'kitchen-sink', model: 'kitchenSink', logic: 'counter@2,3', against: { wall: 'kitchen-gallery', side: 'W', at: 2.95 } },
    { id: 'kitchen-microwave', model: 'kitchenMicrowave', on: { parent: 'kitchen-counter-a' } },

    // Galeria de entrada a leste. O centro fica livre para circulação.
    { id: 'gallery-console', model: 'sideTable', against: { wall: 'kitchen-gallery', side: 'E', at: 1.15 } },
    { id: 'gallery-clock', model: 'radio', logic: 'clock@0,4', on: { parent: 'gallery-console' } },
    { id: 'gallery-plant-a', model: 'pottedPlant', logic: 'plant@5,4', at: [4.35, 5.1] },
    { id: 'gallery-plant-b', model: 'plant_bushSmall', logic: 'plant@5,5', at: [5.45, 5.1], yaw: 8 },
  ],
  rugs: [
    { id: 'gallery-doormat', model: 'rugDoormat', at: [5.0, 0.35], facing: 'S' },
    { id: 'dining-rug', model: 'rugRound', at: [0.95, 2.0] },
  ],
}
