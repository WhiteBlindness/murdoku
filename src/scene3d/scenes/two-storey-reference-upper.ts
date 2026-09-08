import type { SceneSpec } from '../schema'

export const twoStoreyReferenceUpper: SceneSpec = {
  puzzleId: 'hard-1',
  floor: 1,
  shell: {
    features: [
      { wall: 'north', at: 1.8, kind: 'window' },
      { wall: 'north', at: 5.8, kind: 'window' },
      { wall: 'west', at: 5.5, kind: 'window' },
    ],
  },
  walls: [
    { id: 'upper-spine', from: [3.9, 3.05], to: [3.9, 8], openings: [
      { at: 3.55, width: 1, kind: 'open' },
      { at: 7.5, width: 1, kind: 'open' },
    ], freeEnds: ['from', 'to'] },
    { id: 'upper-west', from: [0, 4], to: [3.9, 4], openings: [{ at: 2.8, kind: 'door' }] },
    { id: 'upper-east', from: [3.9, 4], to: [8, 4], openings: [
      { at: 6.2, width: 1.4, kind: 'open' },
    ] },
    // A generous well exposes the descending flight; guards protect both sides.
    { id: 'stairwell-west', from: [1.9, 0], to: [1.9, 3.05], height: 'half' },
    { id: 'stairwell-parapet', from: [1.9, 3.05], to: [5.1, 3.05], height: 'half', freeEnds: ['to'] },
    { id: 'study-service', from: [5.1, 1.5], to: [8, 1.5], height: 'half', freeEnds: ['from'] },
  ],
  stairwell: [2, 0, 4, 2],
  floors: [
    { id: 'bathroom-tile', cells: [0, 4, 3, 7], material: 'tile' },
  ],
  furniture: [
    { id: 'bed', model: 'bedDouble', logic: 'bed@2,0', against: { wall: 'west', at: 2.5 } },
    { id: 'nightstand', model: 'cabinetBedDrawerTable', logic: 'lamp@1,0', against: { wall: 'west', at: 1.5 } },
    { id: 'bedside-lamp', model: 'lampRoundTable', logic: 'lamp@1,0', on: { parent: 'nightstand' } },
    { id: 'study-desk', model: 'desk', logic: 'desk@1,5', against: { wall: 'study-service', at: 5.9, side: 'S' } },
    { id: 'study-laptop', model: 'laptop', on: { parent: 'study-desk' } },
    { id: 'study-chair', model: 'chairDesk', logic: 'chair@2,6', at: [6.05, 2.6], facing: 'N' },
    { id: 'study-shelves', model: 'bookcaseOpenLow', against: { wall: 'study-service', at: 7.35, side: 'S' } },
    { id: 'study-books', model: 'books', on: { parent: 'study-shelves' } },
    { id: 'bath', model: 'bathtub', logic: 'bathtub@6,0', against: { wall: 'west', at: 6.5 } },
    { id: 'bathroom-basin', model: 'bathroomSink', against: { wall: 'upper-west', at: 1, side: 'S' } },
    { id: 'toilet', model: 'toilet', logic: 'toilet@7,2', against: { wall: 'south', at: 2.5 } },
    { id: 'landing-bookcase', model: 'bookcaseOpenLow', logic: 'bookshelf@5,7', against: { wall: 'east', at: 5.5 } },
    { id: 'landing-books', model: 'books', on: { parent: 'landing-bookcase' } },
    { id: 'landing-chair', model: 'loungeChair', at: [6.4, 5.5], facing: 'S' },
    { id: 'landing-plant', model: 'pottedPlant', logic: 'plant@6,6', at: [6.5, 6.5] },
    { id: 'landing-console', model: 'sideTable', logic: 'clock@7,7', against: { wall: 'east', at: 7.4 } },
    { id: 'landing-clock', model: 'radio', logic: 'clock@7,7', on: { parent: 'landing-console' } },
  ],
  rugs: [
    { id: 'bedroom-rug', model: 'rugRectangle', at: [1.05, 2.7], facing: 'E' },
    { id: 'landing-reading-rug', model: 'rugRound', at: [6.6, 5.8] },
  ],
}
