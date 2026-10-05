import type { SceneSpec } from '../schema'

// A quiet reception house: living room and office to the north, pantry and
// dining room to the south. Wide doorways make the four-room plan read as one
// connected home rather than a set of sealed boxes.
export const theSilentGuest: SceneSpec = {
  puzzleId: 'easy-3',
  floor: 0,
  entry: { wall: 'west', at: 4.0 },
  shell: {
    features: [
      { wall: 'north', at: 1.6, kind: 'window' },
      { wall: 'north', at: 5.7, kind: 'window' },
      { wall: 'west', at: 1.5, kind: 'window' },
    ],
  },
  floors: [
    { id: 'pantry-tile', cells: [0, 4, 2, 6], material: 'tile' },
  ],
  walls: [
    { id: 'living-office', from: [3, 0], to: [3, 4], height: 'half', openings: [{ at: 3.0, kind: 'door' }] },
    { id: 'pantry-dining', from: [3, 4], to: [3, 7], height: 'half', openings: [{ at: 5.5, kind: 'door' }] },
    { id: 'north-south-partition', from: [0, 4], to: [7, 4], height: 'half', openings: [
      { at: 1.5, kind: 'door' },
      { at: 5.5, kind: 'door' },
    ] },
  ],
  furniture: [
    // Office: the desk and bookshelf keep the victim's clue position open.
    { id: 'office-bookcase', model: 'bookcaseOpen', logic: 'bookshelf@0,3', against: { wall: 'north', at: 3.55 } },
    { id: 'office-books', model: 'books', on: { parent: 'office-bookcase', surface: 'shelf1' } },
    { id: 'office-desk', model: 'desk', logic: 'desk@0,5', against: { wall: 'north', at: 5.5 } },
    { id: 'office-laptop', model: 'laptop', on: { parent: 'office-desk' } },
    { id: 'office-chair', model: 'chairDesk', logic: 'chair@1,3', at: [3.45, 1.55], facing: 'E' },
    { id: 'office-clock', model: 'speaker', logic: 'clock@1,6', against: { wall: 'east', at: 1.2 } },

    // Living room: a vertical sofa faces a compact media console.
    { id: 'living-sofa', model: 'loungeSofa', logic: 'sofa@1,2', at: [2.5, 1.8], facing: 'E' },
    { id: 'living-media', model: 'cabinetTelevision', against: { wall: 'west', at: 2.85 } },
    { id: 'living-tv', model: 'televisionVintage', logic: 'tv@3,0', on: { parent: 'living-media' } },
    { id: 'living-clock', model: 'speaker', logic: 'clock@0,2', against: { wall: 'north', at: 2.5 } },

    // Dining room: maintain a clear route around the table and two lamps.
    { id: 'dining-table', model: 'table', logic: 'table@5,3', at: [4.35, 5.75], facing: 'E' },
    { id: 'dining-chair', model: 'chair', logic: 'chair@6,3', at: [4.1, 6.4], facing: 'N' },
    { id: 'dining-lamp-west', model: 'lampRoundFloor', logic: 'lamp@4,4', at: [4.5, 4.5] },
    { id: 'dining-lamp-east', model: 'lampSquareFloor', logic: 'lamp@4,6', at: [6.5, 4.5] },

    // Pantry: compact storage along the south and west walls.
    { id: 'pantry-box', model: 'cardboardBoxClosed', logic: 'box@5,0', at: [0.55, 5.5] },
    { id: 'pantry-fridge', model: 'kitchenFridgeSmall', logic: 'fridge@6,2', at: [2.35, 6.5], facing: 'S' },
  ],
  rugs: [
    { id: 'entry-mat', model: 'rugDoormat', at: [0.4, 5.3], facing: 'E' },
  ],
}
