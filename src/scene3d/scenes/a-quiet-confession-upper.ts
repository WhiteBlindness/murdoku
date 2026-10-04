import type { PlanRect, SceneSpec } from '../schema'
import { MODEL_BOUNDS } from '../catalog.generated'
import { CELL } from '../units'

const stairAt: [number, number] = [6.5, 1.97]
const stairHalfWidth = MODEL_BOUNDS.stairsOpen.size[2] / (2 * CELL)
const stairHalfRun = MODEL_BOUNDS.stairsOpen.size[0] / (2 * CELL)
const stairwellBounds: PlanRect = [
  stairAt[0] - stairHalfWidth,
  stairAt[1] - stairHalfRun,
  stairAt[0] + stairHalfWidth,
  stairAt[1] + stairHalfRun,
]

// The north-facing stair arrives in an open bedroom aisle and connects to
// separate study, bathroom and kitchen routes.
export const aQuietConfessionUpper: SceneSpec = {
  puzzleId: 'expert-10',
  floor: 1,
  storeyFootprint: { kind: 'full' },
  stairwellBounds,
  circulation: {
    landing: [6, 0.08, 7, stairwellBounds[1]],
    halls: [
      { id: 'north-bedroom-study-gallery', bounds: [2, 0.05, 8, 0.81] },
      { id: 'study-main-spine', bounds: [2, 0.5, 2.8, 2.9] },
      { id: 'study-south-link', bounds: [2, 2.15, 4, 2.9] },
      { id: 'bathroom-entry-bridge', bounds: [2, 2.15, 2.8, 3.75] },
      { id: 'kitchen-entry-bridge', bounds: [3.1, 2.15, 4, 3.75] },
      { id: 'kitchen-gallery', bounds: [3.1, 3.1, 3.9, 7.95] },
    ],
    roomAccessTargets: [
      { id: 'bedroom-entry', bounds: [6, 0.08, 7, 0.81] },
      { id: 'study-entry', bounds: [4, 0.05, 5, 0.81] },
      { id: 'bathroom-entry', bounds: [2, 3, 2.8, 3.75] },
      { id: 'kitchen-entry', bounds: [3.1, 3.1, 3.9, 3.75] },
    ],
  },
  shell: { features: [
    { wall: 'north', at: 1.8, kind: 'window' },
    { wall: 'north', at: 7, kind: 'window' },
  ] },
  floors: [
    { id: 'study-floor', cells: [0, 0, 4, 2], material: 'wood' },
    { id: 'bedroom-floor', cells: [5, 0, 7, 7], material: 'wood' },
    { id: 'bathroom-tile', cells: [0, 3, 2, 7], material: 'tile' },
    { id: 'kitchen-tile', cells: [3, 3, 4, 7], material: 'stone' },
  ],
  walls: [
    { id: 'bedroom-study', from: [5, 0], to: [5, 3], height: 'half', openings: [{ at: 0.45, width: 0.9, kind: 'door' }] },
    { id: 'study-bathroom', from: [0, 3], to: [3, 3], height: 'half', openings: [{ at: 2.4, width: 0.8, kind: 'door' }] },
    { id: 'study-kitchen', from: [3, 3], to: [5, 3], height: 'half', openings: [{ at: 3.5, width: 1, kind: 'door' }] },
    { id: 'bathroom-kitchen', from: [3, 3], to: [3, 8], height: 'half' },
    { id: 'bedroom-kitchen', from: [5, 3], to: [5, 8], height: 'half' },
  ],
  furniture: [
    { id: 'bedroom-clock-carol', model: 'speaker', logic: 'clock@1,5', at: [5.5, 1.5] },
    { id: 'bedroom-bed', model: 'bedDouble', logic: 'bed@3,5', at: [6, 4.2], facing: 'E' },
    { id: 'bedroom-rug', model: 'rugRectangle', logic: 'rug@5,5', at: [6, 6], facing: 'S' },
    { id: 'bedroom-lamp-north', model: 'lampRoundFloor', logic: 'lamp@5,7', at: [7.5, 5.5] },
    { id: 'bedroom-clock-south', model: 'speaker', logic: 'clock@7,5', at: [5.5, 7.5] },
    { id: 'bedroom-lamp-south', model: 'lampRoundFloor', logic: 'lamp@7,7', at: [7.5, 7.5] },

    { id: 'study-box', model: 'cardboardBoxClosed', logic: 'box@0,0', at: [0.5, 0.5] },
    { id: 'study-bookshelf', model: 'bookcaseOpenLow', logic: 'bookshelf@1,0', against: { wall: 'west', at: 1.5 } },
    { id: 'study-desk', model: 'desk', logic: 'desk@2,0', at: [0.5, 2.5], facing: 'N' },
    { id: 'study-lamp', model: 'lampRoundFloor', logic: 'lamp@2,4', at: [4.5, 2.5] },

    { id: 'bathroom-toilet-north', model: 'toilet', logic: 'toilet@3,1', at: [1.5, 3.5], facing: 'N' },
    { id: 'bathroom-shower-south', model: 'shower', logic: 'shower@5,2', at: [2.35, 5.5], facing: 'S' },
    { id: 'bathroom-shower-north', model: 'shower', logic: 'shower@4,2', at: [2.35, 4.5], facing: 'S' },
    { id: 'bathroom-toilet-south', model: 'toilet', logic: 'toilet@7,2', at: [2.35, 7.5], facing: 'N' },

    { id: 'kitchen-stove', model: 'kitchenStoveElectric', logic: 'stove@3,4', at: [4.5, 3.5], facing: 'S' },
    { id: 'kitchen-counter', model: 'kitchenCabinet', logic: 'counter@5,4', at: [4.5, 6.2], facing: 'W' },
  ],
}
