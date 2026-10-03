import type { SceneSpec } from '../schema'
import { MODEL_BOUNDS } from '../catalog.generated'
import { CELL } from '../units'

const stairAt: [number, number] = [7.25, 2.5]
const halfRun = MODEL_BOUNDS.stairsOpen.size[0] / (2 * CELL)
const halfWidth = MODEL_BOUNDS.stairsOpen.size[2] / (2 * CELL)
const well: [number, number, number, number] = [
  stairAt[0] - halfWidth,
  stairAt[1] - halfRun,
  stairAt[0] + halfWidth,
  stairAt[1] + halfRun,
]

// Quarto e estudo servem-se de uma galeria que continua até à casa de banho.
export const threeEmptyGlassesUpper: SceneSpec = {
  puzzleId: 'hard-8',
  floor: 1,
  storeyFootprint: { kind: 'full' },
  stairwellBounds: well,
  circulation: {
    landing: [well[0], well[1] - 0.8, well[2], well[1]],
    halls: [
      { id: 'study-north-gallery', bounds: [5.2, 0.26, 7.75, 1.06] },
      { id: 'study-west-lane', bounds: [5.2, 0.6, 6, 4] },
      { id: 'study-south-connector', bounds: [4.5, 3.75, 6.8, 4.5] },
      { id: 'study-east-run', bounds: [6, 3.7, 7.4, 5.5] },
      { id: 'bedroom-south-run', bounds: [0.4, 4.2, 4, 4.95] },
      { id: 'bathroom-crossing', bounds: [0.4, 3.8, 1.6, 5.3] },
    ],
    roomAccessTargets: [
      { id: 'bedroom-door', bounds: [2.5, 3.2, 5.3, 4.2] },
      { id: 'bathroom-door', bounds: [0.4, 3.8, 1.6, 5.3] },
      { id: 'hallway-door', bounds: [6.1, 4.8, 7.4, 5.5] },
    ],
  },
  shell: { features: [
    { wall: 'north', at: 1.5, kind: 'window' },
    { wall: 'north', at: 6.5, kind: 'window' },
    { wall: 'west', at: 6.5, kind: 'window' },
  ] },
  floors: [
    { id: 'bedroom-wood', cells: [0, 0, 3, 4], material: 'wood' },
    { id: 'study-wood', cells: [4, 0, 7, 4], material: 'wood' },
    { id: 'bathroom-tile', cells: [0, 5, 4, 7], material: 'tile' },
    { id: 'hallway-stone', cells: [5, 5, 7, 7], material: 'stone' },
  ],
  walls: [
    { id: 'bedroom-study', from: [4, 0], to: [4, 5], openings: [{ at: 3.8, width: 1.2, kind: 'door' }] },
    { id: 'bedroom-bathroom', from: [0, 5], to: [5, 5], openings: [{ at: 1, width: 1.2, kind: 'door' }] },
    { id: 'study-hallway', from: [5, 5], to: [8, 5], openings: [{ at: 6.825, width: 1.65, kind: 'open' }] },
    { id: 'bathroom-hallway', from: [5, 5], to: [5, 8], openings: [{ at: 6.5, width: 1.2, kind: 'door' }] },
    { id: 'stairwell-west-guard', from: [well[0], well[1] + 0.12], to: [well[0], well[3]], height: 'half', treatment: 'railing', freeEnds: ['from', 'to'] },
    { id: 'stairwell-east-guard', from: [well[2], well[1] + 0.12], to: [well[2], well[3]], height: 'half', treatment: 'railing', freeEnds: ['from', 'to'] },
    { id: 'stairwell-south-guard', from: [well[0], well[3]], to: [well[2], well[3]], height: 'half', treatment: 'railing', freeEnds: ['from', 'to'] },
  ],
  furniture: [
    { id: 'bedroom-bed', model: 'bedDouble', at: [1.5, 1.55], facing: 'N' },
    { id: 'bedroom-clock-west-table', model: 'sideTable', at: [3.48, 2.25] },
    { id: 'bedroom-clock-west', model: 'radio', logic: 'clock@2,3', on: { parent: 'bedroom-clock-west-table' } },
    { id: 'bedroom-clock-south-table', model: 'sideTable', at: [2.05, 4.0625] },
    { id: 'bedroom-clock-south', model: 'radio', logic: 'clock@4,2', on: { parent: 'bedroom-clock-south-table' } },
    { id: 'bedroom-lamp-east', model: 'lampRoundFloor', logic: 'lamp@1,3', at: [3.45, 1.45] },
    { id: 'bedroom-lamp-north', model: 'lampRoundFloor', logic: 'lamp@0,2', at: [2.5, 0.5] },

    { id: 'study-bookshelf', model: 'bookcaseOpenLow', logic: 'bookshelf@2,4', at: [4.25, 2.5], facing: 'E' },
    { id: 'study-desk', model: 'desk', logic: 'desk@1,4', at: [4.525, 1.9], facing: 'S' },
    { id: 'study-chair', model: 'chairDesk', at: [6.2, 3.25], facing: 'W' },
    { id: 'study-box', model: 'cardboardBoxClosed', logic: 'box@3,7', at: [7.8, 3.85] },
    { id: 'study-lamp', model: 'lampRoundFloor', logic: 'lamp@4,4', at: [4.85, 4.6] },

    { id: 'bathroom-tub', model: 'bathtub', logic: 'bathtub@7,0', at: [0.8, 7.1], facing: 'E' },
    { id: 'bathroom-shower-east', model: 'showerRound', logic: 'shower@7,3', at: [3.5, 7.45], facing: 'S' },
    { id: 'bathroom-toilet', model: 'toilet', logic: 'toilet@5,2', at: [2.5, 5.85], facing: 'W' },
    { id: 'bathroom-shower-north', model: 'showerRound', logic: 'shower@5,4', at: [4.45, 5.5], facing: 'S' },

    { id: 'hallway-plant', model: 'pottedPlant', logic: 'plant@5,7', at: [7.5, 5.85] },
    { id: 'hallway-clock-table', model: 'sideTable', at: [5.5, 7.45] },
    { id: 'hallway-clock', model: 'radio', logic: 'clock@7,5', on: { parent: 'hallway-clock-table' } },
  ],
}
