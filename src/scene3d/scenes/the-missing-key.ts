import type { SceneSpec } from '../schema'

// Moradia compacta com pátio de entrada, escritório e despensa.
export const theMissingKey: SceneSpec = {
  puzzleId: 'easy-8',
  floor: 0,
  entry: { wall: 'west', at: 1.45 },
  shell: { features: [{ wall: 'north', at: 5.45, kind: 'window' }] },
  floors: [
    { id: 'entry-court', cells: [0, 0, 3, 3], material: 'grass', kind: 'courtyard' },
    { id: 'pantry', cells: [0, 4, 2, 6], material: 'tile', kind: 'interior' },
    { id: 'porch', cells: [3, 4, 6, 6], material: 'stone', kind: 'interior' },
  ],
  walls: [
    { id: 'court-office', from: [4, 0], to: [4, 4], height: 'half', openings: [{ at: 2.8, width: 1.15, kind: 'door' }] },
    { id: 'pantry-porch', from: [3, 4], to: [3, 7], height: 'half', openings: [{ at: 4.7, width: 1.15, kind: 'door' }] },
    { id: 'court-pantry', from: [0, 4], to: [4, 4], height: 'half', openings: [{ at: 1.4, width: 1.15, kind: 'open' }] },
    { id: 'office-porch', from: [4, 4], to: [7, 4], height: 'half', openings: [{ at: 5.5, width: 1.15, kind: 'door' }] },
  ],
  furniture: [
    { id: 'court-shrub', model: 'plant_bushSmall', logic: 'shrub@1,3', at: [3.45, 1.55] },
    { id: 'court-flower-west', model: 'flower_yellowA', logic: 'plant@0,1', at: [1.5, 0.5] },
    { id: 'court-flower-east', model: 'flower_purpleA', logic: 'plant@0,3', at: [3.5, 0.5] },

    { id: 'office-clock-table', model: 'sideTable', at: [6.25, 3.15], facing: 'S' },
    { id: 'office-clock', model: 'radio', logic: 'clock@3,6', on: { parent: 'office-clock-table' } },
    { id: 'office-clue-chair', model: 'chair', logic: 'chair@0,5', at: [5.5, 0.55], facing: 'S' },
    { id: 'office-desk', model: 'desk', at: [5.45, 1.7], facing: 'W' },
    { id: 'office-writing-chair', model: 'chairDesk', at: [5.3, 2.35], facing: 'N' },

    { id: 'pantry-box', model: 'cardboardBoxClosed', logic: 'box@6,0', at: [0.42, 6.5] },
    { id: 'pantry-counter', model: 'kitchenCabinet', logic: 'counter@5,0', at: [0.9, 5.45], facing: 'E' },
    { id: 'pantry-fridge', model: 'kitchenFridgeSmall', logic: 'fridge@6,1', at: [1.9, 6.45], facing: 'W' },

    { id: 'porch-chair', model: 'chair', logic: 'chair@5,6', at: [6.5, 5.5], facing: 'W' },
    { id: 'porch-flower', model: 'flower_redA', logic: 'plant@5,3', at: [3.82, 5.5] },
  ],
}
