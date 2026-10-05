import type { SceneSpec } from '../schema'

// Casa formal com pátio interior e uma alcova de estudo na sala de jantar.
export const theLockedStudy: SceneSpec = {
  puzzleId: 'very-easy-6',
  floor: 0,
  entry: { wall: 'west', at: 1.25 },
  shell: {
    features: [
      { wall: 'north', at: 4.7, kind: 'window' },
      { wall: 'west', at: 5.2, kind: 'window' },
    ],
  },
  floors: [
    { id: 'front-courtyard', cells: [0, 0, 2, 3], material: 'grass', kind: 'courtyard' },
    { id: 'dining-study', cells: [3, 0, 5, 5], material: 'wood', kind: 'interior' },
    { id: 'pantry', cells: [0, 4, 2, 5], material: 'tile', kind: 'interior' },
  ],
  walls: [
    { id: 'courtyard-dining', from: [3, 0], to: [3, 4], height: 'half', openings: [{ at: 2.4, width: 1.2, kind: 'open' }] },
    { id: 'courtyard-pantry', from: [0, 4], to: [3, 4], height: 'half', openings: [{ at: 2.45, width: 1.0, kind: 'open' }] },
    { id: 'pantry-dining', from: [3, 4], to: [3, 6], openings: [{ at: 5.0, kind: 'door' }] },
  ],
  furniture: [
    // Alcova de estudo no extremo norte da sala de jantar.
    { id: 'study-desk', model: 'desk', against: { wall: 'north', at: 4.05 } },
    { id: 'study-laptop', model: 'laptop', on: { parent: 'study-desk' } },
    { id: 'study-chair', model: 'chairDesk', logic: 'chair@1,3', at: [3.5, 1.35], facing: 'N' },
    { id: 'study-bookcase', model: 'bookcaseOpenLow', against: { wall: 'north', at: 5.25 } },
    { id: 'study-books', model: 'books', on: { parent: 'study-bookcase', surface: 'top' } },

    // Sala de jantar e os dois candeeiros lógicos.
    { id: 'dining-table', model: 'tableRound', at: [4.3, 3.4], facing: 'E' },
    { id: 'dining-chair-east', model: 'chair', logic: 'chair@3,5', at: [5.35, 3.45], facing: 'W' },
    { id: 'dining-chair-west', model: 'chair', at: [3.35, 3.45], facing: 'E' },
    { id: 'reading-table', model: 'sideTable', logic: 'lamp@2,5', at: [5.25, 2.2], facing: 'S' },
    { id: 'reading-lamp', model: 'lampRoundTable', logic: 'lamp@2,5', on: { parent: 'reading-table' } },
    { id: 'buffet', model: 'cabinetTelevisionDoors', against: { wall: 'east', at: 4.55 } },
    { id: 'buffet-lamp', model: 'lampRoundTable', logic: 'lamp@4,5', on: { parent: 'buffet' } },

    // Balcão de preparação na despensa.
    { id: 'pantry-counter-a', model: 'kitchenCabinet', logic: 'counter@4,0', against: { wall: 'courtyard-pantry', side: 'S', at: 0.4 } },
    { id: 'pantry-sink', model: 'kitchenSink', logic: 'counter@4,0', against: { wall: 'courtyard-pantry', side: 'S', at: 1.0 } },
    { id: 'pantry-counter-b', model: 'kitchenCabinetDrawer', logic: 'counter@4,0', against: { wall: 'courtyard-pantry', side: 'S', at: 1.6 } },
    { id: 'pantry-microwave', model: 'kitchenMicrowave', on: { parent: 'pantry-counter-b' } },
    { id: 'pantry-fridge', model: 'kitchenFridge', against: { wall: 'west', at: 5.25 } },

    // Vegetação em grupos, fora da faixa de circulação.
    { id: 'courtyard-plant', model: 'flower_redA', logic: 'plant@0,1', at: [1.45, 0.65], yaw: -10 },
    { id: 'courtyard-shrub-west', model: 'plant_bushDetailed', logic: 'shrub@2,0', at: [0.55, 2.65], yaw: 12 },
    { id: 'courtyard-shrub-east', model: 'plant_bushLarge', logic: 'shrub@1,2', at: [2.55, 1.45], yaw: -10 },
  ],
  rugs: [
    { id: 'entry-mat', model: 'rugDoormat', at: [1.25, 1.0], facing: 'E' },
    { id: 'courtyard-path-a', model: 'path_stone', at: [1.5, 2.35], facing: 'E' },
    { id: 'courtyard-path-b', model: 'path_stone', at: [2.25, 3.2], facing: 'S' },
  ],
}
