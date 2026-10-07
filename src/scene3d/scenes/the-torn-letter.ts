import type { SceneSpec } from '../schema'

// Moradia estreita com corredor de entrada, cozinha transversal e duas salas.
export const theTornLetter: SceneSpec = {
  puzzleId: 'medium-2',
  floor: 0,
  entry: { wall: 'north', at: 3.4 },
  shell: { features: [{ wall: 'west', at: 5.7, kind: 'window' }] },
  floors: [
    { id: 'entrance-hall', cells: [0, 0, 7, 1], material: 'wood', kind: 'interior' },
    { id: 'working-kitchen', cells: [0, 2, 7, 3], material: 'tile', kind: 'interior' },
    { id: 'dining-room', cells: [0, 4, 4, 7], material: 'wood', kind: 'interior' },
    { id: 'study', cells: [5, 4, 7, 7], material: 'wood', kind: 'interior' },
  ],
  walls: [
    { id: 'hall-kitchen', from: [0, 2], to: [8, 2], height: 'half', openings: [{ at: 1.8, width: 1.2, kind: 'open' }] },
    { id: 'kitchen-south-rooms', from: [0, 4], to: [8, 4], height: 'half', openings: [
      { at: 0.9, width: 1.2, kind: 'open' },
      { at: 6.4, width: 1.2, kind: 'door' },
    ] },
    { id: 'dining-study', from: [5, 4], to: [5, 8], height: 'half', openings: [{ at: 4.75, width: 1.15, kind: 'door' }] },
  ],
  furniture: [
    { id: 'hall-alexander-flower', model: 'flower_yellowA', logic: 'plant@0,2', at: [2.5, 0.5] },
    { id: 'hall-clock-west-table', model: 'sideTable', at: [3.5, 1.5] },
    { id: 'hall-clock-west', model: 'radio', logic: 'clock@1,3', on: { parent: 'hall-clock-west-table' } },
    { id: 'hall-clock-east-table', model: 'sideTable', at: [4.5, 0.5] },
    { id: 'hall-clock-east', model: 'radio', logic: 'clock@0,4', on: { parent: 'hall-clock-east-table' } },
    { id: 'hall-greta-clock-table', model: 'sideTable', at: [6.8, 1.5] },
    { id: 'hall-greta-clock', model: 'radio', logic: 'clock@1,6', on: { parent: 'hall-greta-clock-table' } },
    { id: 'hall-plant-greta', model: 'flower_purpleA', logic: 'plant@1,5', at: [5.5, 1.5] },
    { id: 'hall-plant-east', model: 'flower_redA', logic: 'plant@0,5', at: [5.5, 0.5] },

    { id: 'kitchen-idris-fridge', model: 'kitchenFridgeSmall', logic: 'fridge@2,7', at: [7.5, 2.5], facing: 'W' },
    { id: 'kitchen-fridge-south', model: 'kitchenFridgeSmall', logic: 'fridge@3,7', at: [7.5, 3.5], facing: 'W' },
    { id: 'kitchen-stove', model: 'kitchenStoveElectric', logic: 'stove@2,0', at: [0.5, 2.5], facing: 'E' },
    { id: 'kitchen-sink', model: 'kitchenSink', against: { wall: 'west', at: 3.04 }, facing: 'E' },

    { id: 'dining-table-bella', model: 'table', logic: 'table@5,0', at: [1.0, 5.5], facing: 'E' },
    { id: 'dining-chair-carol', model: 'chair', logic: 'chair@6,0', at: [0.5, 6.5], facing: 'E' },
    { id: 'dining-chair-extra', model: 'chair', logic: 'chair@4,2', at: [2.5, 4.5], facing: 'N' },
    { id: 'dining-lamp', model: 'lampRoundFloor', logic: 'lamp@4,3', at: [3.5, 4.5] },
    { id: 'study-bookshelf', model: 'bookcaseOpenLow', logic: 'bookshelf@5,5', at: [5.52, 6.5], facing: 'E' },
    { id: 'study-desk', model: 'desk', logic: 'desk@7,6', at: [6.5, 7.45], facing: 'N' },
  ],
}
