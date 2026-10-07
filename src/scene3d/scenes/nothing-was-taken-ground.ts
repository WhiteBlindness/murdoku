import type { SceneSpec } from '../schema'

// A linear residence opens from the entry hall through dining and office to
// the true exterior front yard. The upper service wing is carried over that
// yard by three measured post-and-beam bays.
export const nothingWasTakenGround: SceneSpec = {
  puzzleId: 'hard-12',
  floor: 0,
  storeyFootprint: { kind: 'full' },
  entry: { wall: 'north', at: 7 },
  shell: { features: [
    { wall: 'north', at: 1.5, kind: 'window' },
    { wall: 'north', at: 4.2, kind: 'window' },
  ] },
  stairs: { model: 'stairsOpen', at: [6.4, 2], facing: 'N' },
  exteriorSupportBays: [
    { id: 'front-yard-west', cells: [0, 6, 2, 7] },
    { id: 'front-yard-middle', cells: [3, 6, 5, 7] },
    { id: 'front-yard-east', cells: [6, 6, 7, 7] },
  ],
  floors: [
    { id: 'hallway-floor', cells: [0, 0, 7, 1], material: 'stone' },
    { id: 'dining-room-floor', cells: [0, 2, 7, 3], material: 'wood' },
    { id: 'office-floor', cells: [0, 4, 7, 5], material: 'wood' },
    { id: 'front-yard-ground', cells: [0, 6, 7, 7], material: 'grass', kind: 'exterior' },
  ],
  walls: [
    { id: 'dining-office', from: [0, 4], to: [8, 4], openings: [{ at: 6.2, width: 1.2, kind: 'door' }] },
    { id: 'front-yard-facade', from: [0, 6], to: [8, 6], height: 'half', openings: [{ at: 6.5, width: 1, kind: 'door' }] },
  ],
  furniture: [
    { id: 'hall-clock', model: 'speaker', logic: 'clock@0,2', at: [2.5, 0.5] },
    { id: 'hall-plant-west', model: 'pottedPlant', logic: 'plant@1,0', at: [0.5, 1.5] },
    { id: 'hall-plant-centre', model: 'pottedPlant', logic: 'plant@1,3', at: [3.5, 1.5] },
    { id: 'hall-rug', model: 'rugRectangle', logic: 'rug@0,4', at: [5, 1], facing: 'S' },

    { id: 'dining-chair-west', model: 'chair', logic: 'chair@2,1', at: [1.95, 2.5], facing: 'E' },
    { id: 'dining-table', model: 'table', logic: 'table@2,2', at: [3.2, 2.5], facing: 'S' },
    { id: 'dining-lamp-east', model: 'lampRoundFloor', logic: 'lamp@3,5', at: [5.25, 3.3] },
    { id: 'dining-chair-east', model: 'chair', logic: 'chair@3,7', at: [7.5, 3.5], facing: 'W' },

    { id: 'office-desk', model: 'desk', logic: 'desk@4,0', against: { wall: 'west', at: 4.7 } },
    { id: 'office-clock', model: 'speaker', logic: 'clock@4,2', at: [2.5, 4.5] },
    { id: 'office-chair', model: 'chair', logic: 'chair@5,0', at: [0.85, 5.1], facing: 'W' },
    // Duas estantes baixas em fila, como numa pequena biblioteca, com as prateleiras viradas para a sala.
    { id: 'office-bookshelf', model: 'bookcaseOpenLow', logic: 'bookshelf@5,3', at: [3.25, 5.45], facing: 'E' },
    { id: 'office-bookshelf-books', model: 'books', on: { parent: 'office-bookshelf' } },
    { id: 'office-bookshelf-east', model: 'bookcaseOpenLow', logic: 'bookshelf@5,3', at: [4.4, 5.45], facing: 'E' },
    { id: 'office-bookshelf-east-books', model: 'books', on: { parent: 'office-bookshelf-east' } },

    { id: 'front-yard-shrub-west', model: 'plant_bushSmall', logic: 'shrub@6,0', at: [0.5, 6.5] },
    { id: 'front-yard-shrub-centre', model: 'plant_bushSmall', logic: 'shrub@6,5', at: [5.5, 6.5] },
    { id: 'front-yard-shrub-east', model: 'plant_bushSmall', logic: 'shrub@6,7', at: [7.5, 6.5] },
    { id: 'front-yard-flower', model: 'flower_yellowA', logic: 'plant@7,4', at: [4.5, 7.5] },
  ],
}
