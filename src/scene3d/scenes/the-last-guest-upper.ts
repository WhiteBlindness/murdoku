import type { SceneSpec } from '../schema'
import { MODEL_BOUNDS } from '../catalog.generated'
import { CELL } from '../units'

const stairAt: [number, number] = [4.3, 4.65]
const halfRun = MODEL_BOUNDS.stairsOpen.size[0] / (2 * CELL)
const halfWidth = MODEL_BOUNDS.stairsOpen.size[2] / (2 * CELL)
const well: [number, number, number, number] = [
  stairAt[0] - halfWidth,
  stairAt[1] - halfRun,
  stairAt[0] + halfWidth,
  stairAt[1] + halfRun,
]

// The upper landing feeds a cross-gallery; a west branch reaches the office without crossing the bath.
export const theLastGuestUpper: SceneSpec = {
  puzzleId: 'master-3',
  floor: 1,
  storeyFootprint: { kind: 'full' },
  stairwellBounds: well,
  circulation: {
    landing: [3.8, 2.65, 4.8, well[1]],
    halls: [
      { id: 'main-doorway-run', bounds: [2.4, 2.6, 5.8, 3.45] },
      { id: 'bathroom-east-run', bounds: [5.0, 2.6, 6.15, 4.9] },
      { id: 'office-doorway', bounds: [5.05, 4.1, 6.1, 5.9] },
    ],
    roomAccessTargets: [
      { id: 'bedroom-door', bounds: [2.05, 2.65, 3, 3.45] },
      { id: 'study-door', bounds: [3.1, 2.6, 4.85, 3.44] },
      { id: 'bathroom-door', bounds: [5.05, 2.6, 6.15, 4.2] },
      { id: 'office-door', bounds: [5.05, 5.05, 6.1, 6.2] },
    ],
  },
  shell: {
    features: [
      { wall: 'north', at: 1.4, kind: 'window' },
      { wall: 'north', at: 4.1, kind: 'window' },
      { wall: 'north', at: 6.3, kind: 'window' },
      { wall: 'west', at: 6.5, kind: 'window' },
    ],
  },
  floors: [
    { id: 'bedroom-wood', cells: [0, 0, 2, 7], material: 'wood' },
    { id: 'study-wood', cells: [3, 0, 4, 7], material: 'wood' },
    { id: 'bathroom-tile', cells: [5, 0, 7, 4], material: 'tile' },
    { id: 'office-wood', cells: [5, 5, 7, 7], material: 'wood' },
  ],
  walls: [
    { id: 'bedroom-study', from: [3, 0], to: [3, 8], height: 'half', openings: [
      { at: 3.05, width: 1.2, kind: 'door' },
    ] },
    { id: 'study-east-gallery', from: [5, 0], to: [5, 8], height: 'half', openings: [
      { at: 3.05, width: 1.3, kind: 'door' },
    ] },
    { id: 'bathroom-office', from: [5, 5], to: [8, 5], height: 'half', openings: [
      { at: 5.6, width: 1.2, kind: 'door' },
    ] },
    { id: 'stairwell-west-guard', from: [well[0] - 0.1, well[1]], to: [well[0] - 0.1, well[3]], height: 'half', treatment: 'railing', freeEnds: ['from', 'to'] },
    { id: 'stairwell-east-guard', from: [well[2] + 0.1, well[1]], to: [well[2] + 0.1, well[3]], height: 'half', treatment: 'railing', freeEnds: ['from', 'to'] },
    { id: 'stairwell-south-guard', from: [well[0] - 0.1, well[3]], to: [well[2] + 0.1, well[3]], height: 'half', treatment: 'railing' },
  ],
  furniture: [
    { id: 'bedroom-lamp-southwest', model: 'lampRoundFloor', logic: 'lamp@6,0', at: [0.5, 6.5] },
    { id: 'bedroom-bed', model: 'bedDouble', logic: 'bed@2,0', at: [0.75, 2.5], facing: 'E' },
    { id: 'bedroom-clock-table', model: 'sideTable', at: [2.5, 6.5], facing: 'S' },
    { id: 'bedroom-clock', model: 'radio', logic: 'clock@6,2', on: { parent: 'bedroom-clock-table' } },
    { id: 'bedroom-lamp-northwest', model: 'lampRoundFloor', logic: 'lamp@5,0', at: [0.5, 5.5] },

    { id: 'study-bookshelf', model: 'bookcaseOpenLow', logic: 'bookshelf@1,3', at: [3.5, 1.8], facing: 'E' },
    { id: 'study-box', model: 'cardboardBoxClosed', logic: 'box@2,4', at: [4.6, 2.15] },
    { id: 'study-desk', model: 'desk', logic: 'desk@5,3', at: [3.4, 5.5], facing: 'E' },
    { id: 'study-chair', model: 'chairDesk', at: [3.4, 6.2], facing: 'W' },

    { id: 'bathroom-shower', model: 'showerRound', logic: 'shower@0,5', at: [5.5, 0.5], facing: 'S' },
    { id: 'bathroom-alcove-tub', model: 'bathtub', logic: 'bathtub@2,5', at: [5.8, 2.05], facing: 'N' },
    { id: 'bathroom-toilet', model: 'toilet', logic: 'toilet@0,7', at: [7.5, 0.5], facing: 'S' },
    { id: 'bathroom-second-tub', model: 'bathtub', logic: 'bathtub@4,6', at: [6.95, 4.2], facing: 'E' },

    { id: 'office-chair', model: 'chair', logic: 'chair@6,5', at: [5.8, 6.5], facing: 'E' },
    { id: 'office-desk', model: 'desk', logic: 'desk@7,7', at: [7.3, 7.3], facing: 'N' },
    { id: 'office-clock-table', model: 'sideTable', at: [5.5, 7.5], facing: 'E' },
    { id: 'office-clock', model: 'radio', logic: 'clock@7,5', on: { parent: 'office-clock-table' } },
    { id: 'office-desk-chair', model: 'chairDesk', at: [6.3, 7.3], facing: 'E' },

    { id: 'bedroom-south-clock-table', model: 'sideTable', at: [2.5, 4.9], facing: 'E' },
    { id: 'bedroom-south-clock', model: 'radio', logic: 'clock@4,2', on: { parent: 'bedroom-south-clock-table' } },
  ],
}
