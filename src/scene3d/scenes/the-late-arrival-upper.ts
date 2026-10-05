import type { SceneSpec } from '../schema'
import { MODEL_BOUNDS } from '../catalog.generated'
import { CELL } from '../units'

const stairAt: [number, number] = [4.55, 3.5]
const halfRun = MODEL_BOUNDS.stairsOpen.size[0] / (2 * CELL)
const halfWidth = MODEL_BOUNDS.stairsOpen.size[2] / (2 * CELL)
const well: [number, number, number, number] = [
  stairAt[0] - halfWidth,
  stairAt[1] - halfRun,
  stairAt[0] + halfWidth,
  stairAt[1] + halfRun,
]

// O estudo serve de galeria seca entre o quarto, a casa de banho e a sala.
export const theLateArrivalUpper: SceneSpec = {
  puzzleId: 'hard-9',
  floor: 1,
  storeyFootprint: { kind: 'full' },
  stairwellBounds: well,
  circulation: {
    landing: [well[0], well[3], well[2], 5.65],
    halls: [
      { id: 'west-bedroom-branch', bounds: [3.05, 4.9, well[0], 5.75] },
      { id: 'east-landing-connector', bounds: [well[2], well[3], 6.05, 5.9] },
      { id: 'east-north-gallery', bounds: [5.1, 1.25, 6.05, well[3]] },
    ],
    roomAccessTargets: [
      { id: 'study-arrival', bounds: [3.1, 4.9, 4.0, 5.7] },
      { id: 'bedroom-door', bounds: [2.3, 5.0, 3.05, 5.75] },
      { id: 'bathroom-door', bounds: [5.3, 1.25, 6.8, 2.0] },
      { id: 'living-room-door', bounds: [5.3, 5.65, 6.8, 6.4] },
    ],
  },
  shell: { features: [
    { wall: 'north', at: 1.4, kind: 'window' },
    { wall: 'north', at: 6.5, kind: 'window' },
    { wall: 'west', at: 6.4, kind: 'window' },
  ] },
  floors: [
    { id: 'bedroom-wood', cells: [0, 0, 2, 7], material: 'wood' },
    { id: 'study-wood', cells: [3, 0, 4, 7], material: 'wood' },
    { id: 'bathroom-tile', cells: [5, 0, 7, 3], material: 'tile' },
    { id: 'living-wood', cells: [5, 4, 7, 7], material: 'wood' },
  ],
  walls: [
    { id: 'bedroom-study', from: [3, 0], to: [3, 8], height: 'half', openings: [
      { at: 3.5, width: 1.2, kind: 'door' },
      { at: 5.5, width: 1.2, kind: 'door' },
    ] },
    { id: 'study-service-wing', from: [6.1, 0], to: [6.1, 8], height: 'half', openings: [
      { at: 1.5, width: 1.2, kind: 'door' },
      { at: 6.25, width: 1.2, kind: 'door' },
    ] },
    { id: 'bathroom-living', from: [6.1, 4], to: [8, 4], height: 'half', openings: [] },
    { id: 'stairwell-west-guard', from: [well[0], well[1]], to: [well[0], well[3] - 0.12], height: 'half', treatment: 'railing', freeEnds: ['from', 'to'] },
    { id: 'stairwell-east-guard', from: [well[2], well[1]], to: [well[2], well[3] - 0.12], height: 'half', treatment: 'railing', freeEnds: ['from', 'to'] },
    { id: 'stairwell-north-guard', from: [well[0], well[1]], to: [well[2], well[1]], height: 'half', treatment: 'railing', freeEnds: ['from', 'to'] },
  ],
  furniture: [
    { id: 'bedroom-bed', model: 'bedDouble', logic: 'bed@0,0', at: [1, 1.1], facing: 'N' },
    { id: 'bedroom-lamp-south-west', model: 'lampRoundFloor', logic: 'lamp@7,1', at: [1.5, 7.5] },
    { id: 'bedroom-clock-south-table', model: 'sideTable', at: [0.5, 7.5] },
    { id: 'bedroom-clock-south', model: 'radio', logic: 'clock@7,0', on: { parent: 'bedroom-clock-south-table' } },
    { id: 'bedroom-clock-east-table', model: 'sideTable', at: [0.5, 4.5] },
    { id: 'bedroom-clock-east', model: 'radio', logic: 'clock@4,0', on: { parent: 'bedroom-clock-east-table' } },
    { id: 'bedroom-lamp-south-east', model: 'lampRoundFloor', logic: 'lamp@7,2', at: [2.5, 7.5] },

    { id: 'study-box', model: 'cardboardBoxClosed', logic: 'box@0,4', at: [4.5, 0.5] },
    { id: 'study-desk-viraj', model: 'desk', logic: 'desk@1,4', at: [4.65, 0.95], facing: 'S' },
    { id: 'study-desk-second', model: 'desk', logic: 'desk@2,4', at: [4.55, 2.0], facing: 'S' },
    { id: 'study-chair', model: 'chairDesk', at: [3.5, 1.5], facing: 'E' },
    { id: 'study-bookshelf', model: 'bookcaseOpenLow', logic: 'bookshelf@6,3', at: [3.3, 7.3], facing: 'E' },
    { id: 'study-lamp', model: 'lampRoundFloor', logic: 'lamp@4,3', at: [3.25, 4.2] },

    { id: 'bathroom-tub', model: 'bathtub', logic: 'bathtub@3,5', at: [7.0, 3.25], facing: 'N' },
    { id: 'bathroom-shower', model: 'showerRound', logic: 'shower@1,7', at: [7.5, 1.5], facing: 'S' },
    { id: 'bathroom-toilet', model: 'toilet', logic: 'toilet@0,6', at: [6.5, 0.5], facing: 'W' },

    { id: 'living-tv-south-west', model: 'cabinetTelevision', logic: 'tv@6,5', at: [5.0, 6.5], facing: 'E' },
    { id: 'living-tv-north-east', model: 'cabinetTelevision', logic: 'tv@5,6', at: [6.5, 5.1], facing: 'E' },
    { id: 'living-sofa', model: 'loungeSofa', logic: 'sofa@5,7', at: [7.5, 6], facing: 'E' },
    { id: 'living-clock-table', model: 'sideTable', at: [7.5, 7.5] },
    { id: 'living-clock', model: 'radio', logic: 'clock@7,7', on: { parent: 'living-clock-table' } },
  ],
}
