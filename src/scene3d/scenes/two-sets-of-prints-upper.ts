import type { SceneSpec } from '../schema'
import { twoSetsOfPrintsStairwellBounds } from './two-sets-of-prints-ground'

const well = twoSetsOfPrintsStairwellBounds

export const twoSetsOfPrintsUpper: SceneSpec = {
  puzzleId: 'master-6',
  floor: 1,
  storeyFootprint: { kind: 'full' },
  stairwellBounds: well,
  circulation: {
    landing: [well[0], well[1] - 0.75, well[2], well[1]],
    halls: [
      { id: 'study-gallery', bounds: [0.2, 3.4, 4.0, well[1]] },
      { id: 'bedroom-connector', bounds: [3.2, 3.4, 4.2, 5.9] },
      { id: 'dining-entry-run', bounds: [3.4, 5.1, 6.2, 5.9] },
    ],
    roomAccessTargets: [
      { id: 'study-entry', bounds: [0.2, 3.45, 1.8, 4.05] },
      { id: 'bedroom-entry', bounds: [2.3, 3.45, 3.1, 4.1] },
      { id: 'dining-entry', bounds: [4.0, 5.1, 6.2, 5.9] },
    ],
  },
  shell: { features: [
    { wall: 'north', at: 1.4, kind: 'window' },
    { wall: 'north', at: 6.6, kind: 'window' },
    { wall: 'west', at: 6.4, kind: 'window' },
  ] },
  floors: [
    { id: 'study', cells: [0, 0, 7, 1], material: 'wood' },
    { id: 'bedroom', cells: [0, 2, 7, 4], material: 'wood' },
    { id: 'bathroom', cells: [0, 5, 3, 7], material: 'tile' },
    { id: 'dining-room', cells: [4, 5, 7, 7], material: 'wood' },
  ],
  walls: [
    { id: 'study-bedroom', from: [2, 0], to: [2, 8], height: 'half', openings: [{ at: 4.0, width: 1.8, kind: 'door' }] },
    { id: 'bedroom-east-suite', from: [5, 0], to: [5, 8], height: 'half', openings: [
      { at: 0.6, width: 1, kind: 'open' },
      { at: 5.5, width: 1.8, kind: 'door' },
    ] },
    { id: 'bathroom-dining-open', from: [5, 4], to: [8, 4], height: 'half', openings: [{ at: 6.7, width: 0.8, kind: 'open' }] },
    { id: 'stairwell-west-guard', from: [well[0], well[1] + 0.12], to: [well[0], well[3]], height: 'half', treatment: 'railing', freeEnds: ['from'] },
    { id: 'stairwell-east-guard', from: [well[2], well[1] + 0.12], to: [well[2], well[3]], height: 'half', treatment: 'railing', freeEnds: ['from'] },
    { id: 'stairwell-south-guard', from: [well[0], well[3]], to: [well[2], well[3]], height: 'half', treatment: 'railing' },
  ],
  furniture: [
    { id: 'study-desk-tomas', model: 'desk', logic: 'desk@2,0', at: [0.5, 2.5], facing: 'E' },
    { id: 'study-box', model: 'cardboardBoxClosed', logic: 'box@1,1', at: [1.5, 1.25] },
    { id: 'study-box-priya', model: 'cardboardBoxClosed', logic: 'box@6,1', at: [1.65, 6.5] },
    { id: 'study-bookcase', model: 'bookcaseOpenLow', logic: 'bookshelf@2,1', at: [1.25, 2.3], facing: 'W' },
    { id: 'study-desk-bella', model: 'desk', logic: 'desk@6,0', at: [0.5, 6.9], facing: 'N' },
    { id: 'study-lamp-south', model: 'lampRoundFloor', logic: 'lamp@7,0', at: [1.0, 7.65] },

    { id: 'bedroom-clock-table-north', model: 'sideTable', at: [4.1, 1.5], facing: 'E' },
    { id: 'bedroom-clock-north', model: 'radio', logic: 'clock@1,4', on: { parent: 'bedroom-clock-table-north' } },
    { id: 'bedroom-rug', model: 'rugSquare', logic: 'rug@0,2', at: [3, 1], facing: 'E' },
    { id: 'bedroom-lamp-west', model: 'lampRoundFloor', logic: 'lamp@4,2', at: [2.9, 4.65] },
    { id: 'bedroom-bed', model: 'bedDouble', logic: 'bed@6,2', at: [3, 7], facing: 'E' },
    { id: 'bedroom-lamp-east', model: 'lampRoundFloor', logic: 'lamp@3,4', at: [4.35, 3.45] },

    { id: 'bathroom-shower-south', model: 'shower', logic: 'shower@3,5', at: [5.9, 3.5], facing: 'S' },
    { id: 'bathroom-shower-north', model: 'shower', logic: 'shower@0,7', at: [7.5, 0.5], facing: 'S' },
    { id: 'bathroom-toilet', model: 'toilet', logic: 'toilet@3,7', at: [7.5, 3.5], facing: 'E' },

    { id: 'dining-table', model: 'table', logic: 'table@4,5', at: [6.5, 5.2], facing: 'E' },
    { id: 'dining-chair', model: 'chair', logic: 'chair@6,7', at: [7.5, 6.5], facing: 'S' },
  ],
}
