import type { SceneSpec } from '../schema'

// Casa em L com um alpendre exterior, escritório e sala de jantar.
export const aColdReception: SceneSpec = {
  puzzleId: 'very-easy-8',
  floor: 0,
  entry: { wall: 'west', at: 4.7 },
  shell: {
    features: [
      { wall: 'north', at: 4.8, kind: 'window' },
    ],
  },
  floors: [
    { id: 'open-porch', cells: [0, 0, 2, 2], material: 'stone', kind: 'exterior' },
    { id: 'office', cells: [3, 0, 5, 2], material: 'wood', kind: 'interior' },
    { id: 'dining-room', cells: [0, 3, 5, 5], material: 'wood', kind: 'interior' },
  ],
  walls: [
    // A fachada a nascente protege o escritório; o lado exposto do alpendre
    // mantém-se aberto para o exterior.
    { id: 'porch-office', from: [3, 0], to: [3, 3], height: 'half', openings: [{ at: 1.25, kind: 'door' }] },
    { id: 'porch-dining', from: [0, 3], to: [3, 3], height: 'half', openings: [{ at: 1.45, width: 1.2, kind: 'open' }] },
    { id: 'office-dining', from: [3, 3], to: [6, 3], openings: [{ at: 5.4, kind: 'door' }] },
  ],
  furniture: [
    // A vegetação acompanha o bordo e deixa livre o acesso pelo caminho.
    { id: 'porch-chair', model: 'chair', logic: 'chair@0,0', at: [0.5, 0.5], facing: 'E' },
    { id: 'porch-shrub', model: 'plant_bushSmall', logic: 'plant@2,0', at: [0.35, 2.0], yaw: -12 },
    { id: 'porch-flower', model: 'flower_yellowA', at: [1.5, 0.45], yaw: 8 },

    // Escritório compacto, com o relógio-radio sobre uma mesa auxiliar.
    { id: 'office-desk', model: 'desk', logic: 'desk@2,3', against: { wall: 'porch-office', side: 'E', at: 2.3 } },
    { id: 'office-laptop', model: 'laptop', on: { parent: 'office-desk' } },
    { id: 'office-chair', model: 'chairDesk', at: [3.95, 2.15], facing: 'W' },
    { id: 'office-clock-table', model: 'sideTable', at: [4.75, 2.1], facing: 'S' },
    { id: 'office-clock', model: 'radio', logic: 'clock@2,4', on: { parent: 'office-clock-table' } },
    { id: 'office-bookcase', model: 'bookcaseOpenLow', against: { wall: 'north', at: 5.2 } },
    { id: 'office-books', model: 'books', on: { parent: 'office-bookcase', surface: 'top' } },

    // Mesa, tapete lógico e iluminação da sala de jantar.
    { id: 'dining-table', model: 'tableRound', at: [4.1, 4.15], facing: 'E' },
    { id: 'dining-chair-east', model: 'chair', logic: 'chair@3,5', at: [5.4, 3.95], facing: 'W' },
    { id: 'dining-chair-south', model: 'chair', at: [4.9, 4.55], facing: 'N' },
    { id: 'dining-rug', model: 'rugRound', logic: 'rug@3,3', at: [4.1, 4.15] },
    { id: 'dining-lamp-table', model: 'sideTable', logic: 'lamp@5,3', against: { wall: 'south', at: 3.45 } },
    { id: 'dining-lamp', model: 'lampRoundTable', logic: 'lamp@5,3', on: { parent: 'dining-lamp-table' } },
    { id: 'dining-sideboard', model: 'cabinetTelevisionDoors', against: { wall: 'south', at: 5.15 } },
    { id: 'dining-flowers', model: 'plantSmall2', on: { parent: 'dining-sideboard' } },
  ],
  rugs: [
    { id: 'porch-mat', model: 'rugDoormat', at: [1.45, 2.7], facing: 'S' },
    { id: 'porch-path-a', model: 'path_stone', at: [0.5, 1.45], facing: 'E' },
    { id: 'porch-path-b', model: 'path_stone', at: [1.35, 1.45], facing: 'E' },
    { id: 'porch-path-c', model: 'path_stone', at: [1.45, 2.3], facing: 'S' },
  ],
}
