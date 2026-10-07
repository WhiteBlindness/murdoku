import type { SceneSpec } from '../schema'
import { MODEL_BOUNDS } from '../catalog.generated'
import { CELL } from '../units'

const stairAt: [number, number] = [5, 5.25]
const halfRun = MODEL_BOUNDS.stairsOpen.size[0] / (2 * CELL)
const halfWidth = MODEL_BOUNDS.stairsOpen.size[2] / (2 * CELL)
const well: [number, number, number, number] = [
  stairAt[0] - halfWidth,
  stairAt[1] - halfRun,
  stairAt[0] + halfWidth,
  stairAt[1] + halfRun,
]

// The cross-gallery meets the stair arrival and the three bedroom, study,
// and bathroom doors; the long west hall remains the shared circulation spine.
export const theTornLedgerUpper: SceneSpec = {
  puzzleId: 'master-1',
  floor: 1,
  storeyFootprint: { kind: 'full' },
  stairwellBounds: well,
  circulation: {
    landing: [well[0], well[1] - 0.9, well[2], well[1]],
    halls: [
      { id: 'west-hall-spine', bounds: [0.12, 0.12, 1.06, 7.88] },
      { id: 'cross-gallery', bounds: [0.1, 3.3, 6.6, well[1] - 0.05] },
    ],
    roomAccessTargets: [
      { id: 'bedroom-door', bounds: [1.4, 3.3, 2.6, well[1] - 0.05] },
      { id: 'study-door', bounds: [3.4, 3.3, 4.6, well[1] - 0.05] },
      { id: 'bathroom-door', bounds: [5.4, 3.3, 6.6, well[1] - 0.05] },
    ],
  },
  shell: {
    features: [
      { wall: 'north', at: 1.25, kind: 'window' },
      { wall: 'north', at: 3.25, kind: 'window' },
      { wall: 'north', at: 7, kind: 'window' },
      { wall: 'west', at: 2.4, kind: 'window' },
      { wall: 'west', at: 6.5, kind: 'window' },
    ],
  },
  floors: [
    { id: 'hallway-stone', cells: [0, 0, 1, 7], material: 'stone' },
    { id: 'bedroom-wood', cells: [2, 0, 3, 7], material: 'wood' },
    { id: 'study-wood', cells: [4, 0, 5, 7], material: 'wood' },
    { id: 'bathroom-tile', cells: [6, 0, 7, 7], material: 'tile' },
  ],
  walls: [
    { id: 'hallway-bedroom', from: [2, 0], to: [2, 8], height: 'half', openings: [
      { at: 4.25, width: 2, kind: 'door' },
    ] },
    { id: 'bedroom-study', from: [4, 0], to: [4, 8], height: 'half', openings: [
      { at: 4.25, width: 2, kind: 'door' },
    ] },
    { id: 'study-bathroom', from: [6, 0], to: [6, 8], height: 'half', openings: [
      { at: 4.25, width: 2, kind: 'door' },
    ] },

    { id: 'stairwell-west-guard', from: [well[0] - 0.1, well[1]], to: [well[0] - 0.1, well[3]], height: 'half', treatment: 'railing', freeEnds: ['from'] },
    { id: 'stairwell-east-guard', from: [well[2] + 0.1, well[1]], to: [well[2] + 0.1, well[3]], height: 'half', treatment: 'railing', freeEnds: ['from'] },
    { id: 'stairwell-south-guard', from: [well[0] - 0.1, well[3]], to: [well[2] + 0.1, well[3]], height: 'half', treatment: 'railing' },
  ],
  furniture: [
    { id: 'hall-clock-table', model: 'sideTable', at: [1.5, 1.5] },
    { id: 'hall-clock', model: 'radio', logic: 'clock@1,1', on: { parent: 'hall-clock-table' } },
    { id: 'hall-plant', model: 'pottedPlant', logic: 'plant@2,1', at: [1.5, 2.5], facing: 'S' },
    { id: 'hall-rug-middle', model: 'rugRectangle', logic: 'rug@4,0', at: [1, 5], facing: 'E' },
    { id: 'hall-rug-south', model: 'rugRectangle', logic: 'rug@6,0', at: [1, 7], facing: 'E' },

    { id: 'bedroom-bed-north', model: 'bedDouble', logic: 'bed@2,2', at: [2.8, 2.5], facing: 'E' },
    { id: 'bedroom-bed-south-bella', model: 'bedDouble', logic: 'bed@4,2', at: [2.8, 5.9], facing: 'E' },
    { id: 'bedroom-clock-table', model: 'sideTable', at: [2.45, 6.85] },
    { id: 'bedroom-clock', model: 'radio', logic: 'clock@6,2', on: { parent: 'bedroom-clock-table' } },
    { id: 'bedroom-lamp-south', model: 'lampRoundFloor', logic: 'lamp@7,3', at: [3.7, 7.45] },
    { id: 'bedroom-lamp-east', model: 'lampRoundFloor', logic: 'lamp@6,3', at: [3.7, 6.45] },

    { id: 'study-ledger-box', model: 'cardboardBoxClosed', logic: 'box@0,5', at: [5.5, 0.5] },
    { id: 'study-desk-oscar', model: 'desk', logic: 'desk@3,4', against: { wall: 'bedroom-study', side: 'E', at: 2.75 }, facing: 'E' },
    { id: 'study-chair', model: 'chairDesk', at: [4.9, 2.95], facing: 'W' },
    { id: 'study-bookshelf', model: 'bookcaseOpenLow', logic: 'bookshelf@6,5', against: { wall: 'study-bathroom', side: 'W', at: 7.35 } },

    { id: 'bathroom-shower-nadia', model: 'showerRound', logic: 'shower@0,6', at: [6.5, 0.5], facing: 'S' },
    { id: 'bathroom-tub', model: 'bathtub', logic: 'bathtub@1,7', at: [7.3, 2.3], facing: 'W' },
    { id: 'bathroom-toilet', model: 'toilet', logic: 'toilet@7,7', against: { wall: 'east', at: 7.45 }, facing: 'W' },
    { id: 'bathroom-sink', model: 'bathroomSink', against: { wall: 'study-bathroom', side: 'E', at: 6.5 }, facing: 'E' },
  ],
}
