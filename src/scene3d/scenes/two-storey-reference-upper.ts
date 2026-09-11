import type { SceneSpec } from '../schema'

export const twoStoreyReferenceUpper: SceneSpec = {
  puzzleId: 'hard-1',
  floor: 1,
  storeyFootprint: { kind: 'full' },
  // The south margin exposes the descending flight from the fixed camera.
  // The east edge still meets the measured final tread exactly.
  stairwellBounds: [2.65, 0, 5, 2.6],
  circulation: {
    // The stair arrives at x = 5; the landing continues east before the
    // corridor turns south along the open side of the study.
    landing: [5, 0.05, 7.95, 1.1],
    halls: [
      { id: 'east-corridor', bounds: [6.85, 1.1, 7.95, 4.65] },
      { id: 'transverse-hall', bounds: [0.05, 3.7, 7.95, 4.65] },
    ],
    // These are door approaches, rather than the full room rectangles. They
    // stay clear of the furniture groups while naming every upper-floor room.
    roomAccessTargets: [
      { id: 'bedroom-door', bounds: [2.25, 2.75, 3.15, 3.8] },
      { id: 'study-door', bounds: [5.15, 2.75, 5.9, 3.8] },
      { id: 'bathroom-door', bounds: [2.7, 4.5, 3.5, 5.3] },
      { id: 'reading-approach', bounds: [4.2, 4.5, 5.2, 5.3] },
    ],
  },
  shell: {
    features: [
      { wall: 'north', at: 1.8, kind: 'window' },
      { wall: 'north', at: 5.8, kind: 'window' },
      { wall: 'west', at: 5.5, kind: 'window' },
    ],
  },
  walls: [
    // The central spine starts beyond the transverse hall, so that the hall
    // stays open from the bedroom door to the reading approach.
    { id: 'upper-spine', from: [3.9, 4.7], to: [3.9, 8] },
    { id: 'bedroom-south', height: 'half', from: [0, 3.65], to: [5.05, 3.65], openings: [{ at: 2.7, width: 1, kind: 'open' }] },
    { id: 'bathroom-north', height: 'half', from: [0, 4.7], to: [3.9, 4.7], openings: [{ at: 3.1, width: 1, kind: 'open' }] },
    // The study occupies the east wing and has its own entrance from the hall.
    // The free end is the guard post beside the stair exit, not an unfinished partition.
    { id: 'study-west', from: [5.05, 1.15], to: [5.05, 3.65], height: 'half', treatment: 'railing', freeEnds: ['from'] },
    { id: 'study-north', from: [5.05, 1.65], to: [6.8, 1.65], height: 'half', treatment: 'railing' },
    { id: 'study-east', from: [6.8, 1.65], to: [6.8, 3.65] },
    { id: 'study-south', height: 'half', from: [5.05, 3.65], to: [6.8, 3.65], openings: [{ at: 5.65, width: 1, kind: 'open' }] },
    // Guards protect the west and south edges of the well. The east edge is
    // deliberately open so the head of the flight leads into the landing.
    { id: 'stairwell-west', from: [2.6, 0], to: [2.6, 2.65], height: 'half', treatment: 'railing' },
    { id: 'stairwell-south', from: [2.6, 2.65], to: [5.05, 2.65], height: 'half', treatment: 'railing' },
  ],
  floors: [
    { id: 'bathroom-tile', cells: [0, 4, 3, 7], material: 'tile' },
  ],
  furniture: [
    { id: 'bed', model: 'bedDouble', logic: 'bed@2,0', against: { wall: 'west', at: 2.5 } },
    { id: 'nightstand', model: 'cabinetBedDrawerTable', logic: 'lamp@1,0', against: { wall: 'west', at: 1.5 } },
    { id: 'bedside-lamp', model: 'lampRoundTable', logic: 'lamp@1,0', on: { parent: 'nightstand' } },
    { id: 'study-desk', model: 'desk', logic: 'desk@1,5', against: { wall: 'study-north', at: 6.2, side: 'S' } },
    { id: 'study-laptop', model: 'laptop', on: { parent: 'study-desk' } },
    { id: 'study-chair', model: 'chairDesk', logic: 'chair@2,6', at: [6.25, 2.85], facing: 'N' },
    { id: 'bath', model: 'bathtub', logic: 'bathtub@6,0', against: { wall: 'west', at: 6.5 } },
    { id: 'bathroom-basin', model: 'bathroomSink', against: { wall: 'bathroom-north', at: 1, side: 'S' } },
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
