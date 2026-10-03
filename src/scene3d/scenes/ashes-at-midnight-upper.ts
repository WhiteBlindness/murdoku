import type { SceneSpec } from '../schema'

export const ashesAtMidnightUpper: SceneSpec = {
  puzzleId: 'hard-2',
  floor: 1,
  storeyFootprint: { kind: 'full' },
  stairwellBounds: [4.660625, 2.10625, 6.939375, 3.09375],
  circulation: {
    landing: [6.939375, 2.10625, 7.689375, 3.09375],
    halls: [
      { id: 'study-run', bounds: [7.0, 2.1, 7.75, 4.9] },
      { id: 'bedroom-spur', bounds: [3.2, 4.1, 7.0, 5.0] },
      { id: 'bath-spur', bounds: [3.2, 5.0, 7.0, 5.8] },
    ],
    roomAccessTargets: [
      { id: 'study-door', bounds: [7.0, 3.0, 7.75, 4.0] },
      { id: 'hall-door', bounds: [6.35, 5.05, 7.2, 5.8] },
      { id: 'bedroom-door', bounds: [3.2, 4.2, 3.95, 5.0] },
      { id: 'bathroom-door', bounds: [3.2, 5.0, 3.95, 5.8] },
    ],
  },
  shell: { features: [
    { wall: 'north', at: 1.7, kind: 'window' },
    { wall: 'north', at: 6.5, kind: 'window' },
    { wall: 'west', at: 6.4, kind: 'window' },
  ] },
  floors: [
    { id: 'bedroom-floor', cells: [0, 0, 3, 4], material: 'wood' },
    { id: 'study-floor', cells: [4, 0, 7, 4], material: 'wood' },
    { id: 'bathroom-tile', cells: [0, 5, 3, 7], material: 'tile' },
    { id: 'upper-hall-floor', cells: [4, 5, 7, 7], material: 'wood' },
  ],
  walls: [
    { id: 'bedroom-study', from: [4, 0], to: [4, 5], height: 'half', openings: [
      { at: 2.5, width: 1.2, kind: 'door' },
      { at: 4.4, width: 1.2, kind: 'open' },
    ] },
    { id: 'bedroom-bath', from: [0, 5], to: [4, 5], height: 'half', openings: [{ at: 3.6, width: 0.8, kind: 'door' }] },
    { id: 'bathroom-hall', from: [4, 5], to: [4, 8], height: 'half', openings: [{ at: 6, width: 2, kind: 'door' }] },
    { id: 'study-hall', from: [4, 5], to: [8, 5], height: 'half', openings: [{ at: 6.7, width: 1.2, kind: 'open' }] },
    { id: 'stairwell-west-guard', from: [4.660625, 2.10625], to: [4.660625, 3.09375], height: 'half', treatment: 'railing', freeEnds: ['from', 'to'] },
    { id: 'stairwell-north-guard', from: [4.660625, 2.02625], to: [6.939375, 2.02625], height: 'half', treatment: 'railing', freeEnds: ['from', 'to'] },
    { id: 'stairwell-south-guard', from: [4.660625, 3.17375], to: [6.939375, 3.17375], height: 'half', treatment: 'railing', freeEnds: ['from', 'to'] },
  ],
  furniture: [
    { id: 'bedroom-bed', model: 'bedDouble', logic: 'bed@2,0', at: [1.25, 2.5], facing: 'W' },
    { id: 'bedroom-lamp-west', model: 'lampRoundFloor', logic: 'lamp@4,0', at: [0.25, 4.25] },
    { id: 'bedroom-clock-table', model: 'sideTable', at: [2.4, 4.5] },
    { id: 'bedroom-clock', model: 'radio', logic: 'clock@4,2', on: { parent: 'bedroom-clock-table' } },
    { id: 'bedroom-lamp-east', model: 'lampRoundFloor', logic: 'lamp@4,3', at: [3.0, 4.05] },

    { id: 'study-box', model: 'cardboardBoxClosed', logic: 'box@0,4', at: [4.3, 0.5] },
    { id: 'study-bookcase', model: 'bookcaseOpen', logic: 'bookshelf@1,7', at: [7.55, 1.5], facing: 'E' },
    { id: 'study-desk', model: 'desk', logic: 'desk@3,4', at: [4.8, 3.5], facing: 'N' },

    { id: 'bathroom-tub', model: 'bathtub', logic: 'bathtub@5,2', at: [2.3, 5.5], facing: 'N' },
    { id: 'bathroom-shower', model: 'shower', logic: 'shower@7,2', at: [2.5, 7.45], facing: 'S' },
    { id: 'bathroom-toilet', model: 'toilet', logic: 'toilet@6,3', at: [3.2, 6.95], facing: 'N' },

    { id: 'hall-clock-table', model: 'sideTable', at: [4.98, 6.15], facing: 'E' },
    { id: 'hall-clock', model: 'radio', logic: 'clock@5,4', on: { parent: 'hall-clock-table' } },
    { id: 'hall-plant', model: 'flower_yellowA', logic: 'plant@6,4', at: [4.7, 6.8] },
    { id: 'hall-plant-east', model: 'flower_purpleA', logic: 'plant@6,7', at: [7.5, 6.55] },
    { id: 'hall-plant-south', model: 'flower_redA', logic: 'plant@7,7', at: [7.5, 7.5] },
  ],
}
