import type { PlanRect, SceneSpec } from '../schema'
import { MODEL_BOUNDS } from '../catalog.generated'
import { CELL } from '../units'

const stairAt: [number, number] = [6.4, 2]
const stairHalfRun = MODEL_BOUNDS.stairsOpen.size[0] / (2 * CELL)
const stairHalfWidth = MODEL_BOUNDS.stairsOpen.size[2] / (2 * CELL)
const stairwellBounds: PlanRect = [
  stairAt[0] - stairHalfWidth,
  stairAt[1] - stairHalfRun,
  stairAt[0] + stairHalfWidth,
  stairAt[1] + stairHalfRun,
]

// The stair arrives at an east gallery. A transverse hall then serves the
// bedroom, bathroom and kitchen without using either service room as a route.
export const nothingWasTakenUpper: SceneSpec = {
  puzzleId: 'hard-12',
  floor: 1,
  storeyFootprint: { kind: 'full' },
  stairwellBounds,
  circulation: {
    landing: [5.85, 0.05, 7.1, stairwellBounds[1]],
    halls: [
      { id: 'east-gallery', bounds: [7, 0.05, 7.95, 3.95] },
      { id: 'bedroom-cross-hall', bounds: [0.05, 3.2, 7.95, 4] },
    ],
    roomAccessTargets: [
      { id: 'study-entry-approach', bounds: [7.1, 0.05, 7.9, 0.85] },
      { id: 'bedroom-entry-approach', bounds: [7.1, 2.2, 7.9, 3] },
      { id: 'bathroom-entry-approach', bounds: [2.25, 3.2, 2.95, 4] },
      { id: 'kitchen-entry-approach', bounds: [5.85, 3.2, 6.55, 4] },
    ],
  },
  shell: { features: [
    { wall: 'north', at: 2.2, kind: 'window' },
    { wall: 'north', at: 5.5, kind: 'window' },
    { wall: 'west', at: 6.5, kind: 'window' },
  ] },
  floors: [
    { id: 'study-floor', cells: [0, 0, 7, 1], material: 'wood' },
    { id: 'bedroom-floor', cells: [0, 2, 7, 3], material: 'wood' },
    { id: 'bathroom-tile', cells: [0, 4, 3, 7], material: 'tile' },
    { id: 'kitchen-floor', cells: [4, 4, 7, 7], material: 'wood' },
  ],
  walls: [
    { id: 'study-bedroom', from: [0, 1.9], to: [stairwellBounds[0], 1.9], height: 'half', openings: [{ at: 3.4, width: 1, kind: 'door' }] },
    { id: 'bedroom-service', from: [0, 4], to: [8, 4], height: 'half', openings: [
      { at: 2.6, width: 0.9, kind: 'door' },
      { at: 6.2, width: 1, kind: 'door' },
    ] },
    { id: 'bathroom-kitchen', from: [4, 4], to: [4, 8], height: 'half' },
    { id: 'east-gallery-wall', from: [7, 0], to: [7, 4], openings: [
      { at: 0.46, width: 0.82, kind: 'open' },
      { at: 2.65, width: 1, kind: 'door' },
      { at: 3.575, width: 0.85, kind: 'open' },
    ] },

    { id: 'stairwell-west-guard', from: [stairwellBounds[0], stairwellBounds[1] + 0.12], to: [stairwellBounds[0], stairwellBounds[3]], height: 'half', treatment: 'railing', freeEnds: ['from'] },
    { id: 'stairwell-east-guard', from: [stairwellBounds[2], stairwellBounds[1] + 0.12], to: [stairwellBounds[2], stairwellBounds[3]], height: 'half', treatment: 'railing', freeEnds: ['from'] },
    { id: 'stairwell-south-guard', from: [stairwellBounds[0], stairwellBounds[3]], to: [stairwellBounds[2], stairwellBounds[3]], height: 'half', treatment: 'railing' },
  ],
  furniture: [
    { id: 'study-bookshelf', model: 'bookcaseOpenLow', logic: 'bookshelf@1,0', against: { wall: 'west', at: 1.5 } },
    { id: 'study-lamp', model: 'lampRoundFloor', logic: 'lamp@0,0', at: [0.5, 0.5] },
    { id: 'study-desk', model: 'desk', logic: 'desk@0,5', against: { wall: 'north', at: 5.25 } },
    { id: 'study-chair', model: 'chairDesk', at: [5.25, 1.2], facing: 'N' },

    { id: 'bedroom-bed', model: 'bedDouble', at: [1.5, 2.56], facing: 'E' },
    { id: 'bedroom-clock-west', model: 'speaker', logic: 'clock@3,0', at: [0.5, 3.05] },
    { id: 'bedroom-clock-centre', model: 'speaker', logic: 'clock@2,2', at: [2.5, 2.5] },
    { id: 'bedroom-clock-east', model: 'speaker', logic: 'clock@2,4', at: [4.5, 2.5] },
    { id: 'bedroom-lamp', model: 'lampRoundFloor', logic: 'lamp@3,3', at: [3.5, 3.05] },

    { id: 'bathroom-shower-north', model: 'shower', logic: 'shower@4,1', at: [1.7, 4.8], facing: 'S' },
    { id: 'bathroom-toilet', model: 'toilet', logic: 'toilet@4,3', against: { wall: 'bathroom-kitchen', at: 4.5, side: 'W' } },
    { id: 'bathroom-shower-south', model: 'shower', logic: 'shower@6,0', against: { wall: 'west', at: 6.5 } },
    { id: 'bathroom-bathtub', model: 'bathtub', logic: 'bathtub@6,3', at: [3.5, 7], facing: 'W' },

    { id: 'kitchen-counter-sink', model: 'kitchenSink', logic: 'counter@5,4', against: { wall: 'bathroom-kitchen', at: 5.5, side: 'E' } },
    { id: 'kitchen-counter-prep', model: 'kitchenCabinet', logic: 'counter@5,4', against: { wall: 'bathroom-kitchen', at: 6.5, side: 'E' } },
    { id: 'kitchen-fridge', model: 'kitchenFridge', logic: 'fridge@6,7', at: [7.5, 6.5], facing: 'E' },
    { id: 'kitchen-table', model: 'table', logic: 'table@7,5', at: [6, 7.5], facing: 'S' },
  ],
}
