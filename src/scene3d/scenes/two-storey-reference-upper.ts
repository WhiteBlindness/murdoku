import type { SceneSpec } from '../schema'

export const twoStoreyReferenceUpper: SceneSpec = {
  puzzleId: 'hard-1',
  floor: 1,
  shell: {
    features: [
      { wall: 'north', at: 5.8, kind: 'window' },
      { wall: 'west', at: 5.5, kind: 'window' },
    ],
  },
  walls: [
    { id: 'upper-spine', from: [4, 1.2], to: [4, 8], openings: [
      { at: 2.5, kind: 'door' },
      { at: 6.0, kind: 'door' },
    ], freeEnds: ['from'] },
    { id: 'upper-west', from: [0, 4], to: [4, 4], openings: [{ at: 1.5, kind: 'door' }] },
    { id: 'upper-east', from: [4, 4], to: [8, 4], openings: [{ at: 6.5, kind: 'door' }] },
  ],
  stairwell: [1, 0, 3, 1],
  furniture: [
    { id: 'bed', model: 'bedDouble', logic: 'bed@2,0', at: [1.0, 2.5], facing: 'E' },
    { id: 'nightstand', model: 'cabinetBedDrawerTable', logic: 'lamp@1,0', at: [0.5, 1.5] },
    { id: 'bedside-lamp', model: 'lampRoundTable', logic: 'lamp@1,0', on: { parent: 'nightstand' } },
    { id: 'study-desk', model: 'desk', logic: 'desk@1,5', at: [5.5, 1.5], facing: 'N' },
    { id: 'study-chair', model: 'chairDesk', logic: 'chair@2,6', at: [6.5, 2.5], facing: 'N' },
    { id: 'bath', model: 'bathtub', logic: 'bathtub@6,0', at: [1.0, 6.5], facing: 'E' },
    { id: 'toilet', model: 'toilet', logic: 'toilet@7,2', at: [2.5, 7.5], facing: 'N' },
    { id: 'landing-bookcase', model: 'bookcaseOpenLow', logic: 'bookshelf@5,7', against: { wall: 'east', at: 5.5 } },
    { id: 'landing-plant', model: 'pottedPlant', logic: 'plant@6,6', at: [6.5, 6.5] },
    { id: 'landing-console', model: 'sideTable', logic: 'clock@7,7', at: [7.4, 7.4] },
    { id: 'landing-clock', model: 'radio', logic: 'clock@7,7', on: { parent: 'landing-console' } },
  ],
  rugs: [
    { id: 'bedroom-rug', model: 'rugRectangle', at: [1.6, 2.0] },
    { id: 'landing-runner', model: 'rugRectangle', at: [5.5, 5.6], facing: 'E' },
  ],
}
