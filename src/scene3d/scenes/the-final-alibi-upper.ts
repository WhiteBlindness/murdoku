import type { PlanRect, SceneSpec } from '../schema'
import { MODEL_BOUNDS } from '../catalog.generated'
import { CELL } from '../units'

const stairAt: [number, number] = [6.0, 1.4]
const stairHalfRun = MODEL_BOUNDS.stairsOpen.size[0] / (2 * CELL)
const stairHalfWidth = MODEL_BOUNDS.stairsOpen.size[2] / (2 * CELL)
const stairwellBounds: PlanRect = [
  stairAt[0] - stairHalfRun,
  stairAt[1] - stairHalfWidth,
  stairAt[0] + stairHalfRun,
  stairAt[1] + stairHalfWidth,
]

// The west landing turns into the bathroom and study routes; a separate
// doorway continues south from the hall into the bedroom.
export const theFinalAlibiUpper: SceneSpec = {
  puzzleId: 'master-7',
  floor: 1,
  storeyFootprint: { kind: 'full' },
  stairwellBounds,
  circulation: {
    landing: [stairwellBounds[0] - 0.75, stairwellBounds[1], stairwellBounds[0], stairwellBounds[3]],
    halls: [
      { id: 'hallway-west-spine', bounds: [4.0, 0.05, stairwellBounds[0], 2.95] },
      { id: 'bathroom-threshold-route', bounds: [3.0, 1.0, stairwellBounds[0], 2.0] },
      { id: 'bathroom-transverse-aisle', bounds: [0.2, 1.0, 4.0, 2.0] },
      { id: 'bathroom-study-bridge', bounds: [1.0, 1.0, 2.0, 3.8] },
      { id: 'hall-bedroom-bridge', bounds: [4.6, 2.0, 5.6, 3.8] },
    ],
    roomAccessTargets: [
      { id: 'bathroom-entry', bounds: [3.05, 1.05, stairwellBounds[0], 1.95] },
      { id: 'study-entry', bounds: [1.05, 3.05, 1.95, 3.75] },
      { id: 'bedroom-entry', bounds: [4.65, 3.05, 5.55, 3.75] },
    ],
  },
  shell: { features: [
    { wall: 'north', at: 1.4, kind: 'window' },
    { wall: 'north', at: 6.8, kind: 'window' },
  ] },
  floors: [
    { id: 'bathroom-tile', cells: [0, 0, 3, 2], material: 'tile' },
    { id: 'hallway-floor', cells: [4, 0, 7, 2], material: 'stone' },
    { id: 'study-floor', cells: [0, 3, 3, 7], material: 'wood' },
    { id: 'bedroom-floor', cells: [4, 3, 7, 7], material: 'wood' },
  ],
  walls: [
    { id: 'bathroom-hallway', from: [4, 0], to: [4, 3], height: 'half', openings: [{ at: 1.5, width: 1.2, kind: 'door' }] },
    { id: 'bathroom-study', from: [0, 3], to: [4, 3], height: 'half', openings: [{ at: 1.5, width: 1.2, kind: 'door' }] },
    { id: 'hallway-bedroom', from: [4, 3], to: [8, 3], height: 'half', openings: [{ at: 5.1, width: 1.2, kind: 'door' }] },
    { id: 'study-bedroom', from: [4, 3], to: [4, 8], height: 'half', openings: [{ at: 5.5, width: 1.2, kind: 'door' }] },
  ],
  furniture: [
    { id: 'study-bookshelf-marco', model: 'bookcaseOpenLow', logic: 'bookshelf@4,0', against: { wall: 'west', at: 5.0 } },
    { id: 'study-box-north', model: 'cardboardBoxClosed', logic: 'box@3,0', at: [0.5, 3.5] },
    { id: 'study-lamp-south', model: 'lampRoundFloor', logic: 'lamp@5,3', at: [3.125, 5.5] },
    { id: 'study-desk', model: 'desk', logic: 'desk@3,2', at: [2.7, 3.5], facing: 'S' },
    { id: 'bedroom-rug', model: 'rugRectangle', logic: 'rug@6,4', at: [6.1, 6.1], facing: 'S' },
    { id: 'bedroom-clock', model: 'speaker', logic: 'clock@3,4', at: [4.2, 3.5] },
    { id: 'bedroom-bed', model: 'bedDouble', logic: 'bed@3,6', at: [6.5, 4.5], facing: 'S' },
    { id: 'bedroom-lamp-south', model: 'lampRoundFloor', logic: 'lamp@7,6', at: [6.5, 7.5] },
    { id: 'bathroom-toilet-west', model: 'toilet', logic: 'toilet@0,1', at: [1.5, 0.5], facing: 'N' },
    { id: 'bathroom-shower', model: 'shower', logic: 'shower@2,2', at: [2.5, 2.5], facing: 'S' },
    { id: 'hallway-plant-southwest', model: 'pottedPlant', logic: 'plant@2,5', at: [5.9, 2.5] },
    { id: 'hallway-clock-north', model: 'speaker', logic: 'clock@0,5', at: [5.5, 0.5] },
    { id: 'hallway-plant-east', model: 'pottedPlant', logic: 'plant@1,7', at: [7.5, 1.5] },
    { id: 'study-box-marco', model: 'cardboardBoxClosed', logic: 'box@4,1', at: [1.5, 4.5] },
    { id: 'bathroom-toilet-yuki', model: 'toilet', logic: 'toilet@0,3', at: [3.5, 0.5] },
  ],
}
