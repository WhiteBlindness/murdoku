import type { PlanRect, SceneSpec } from '../schema'
import { MODEL_BOUNDS } from '../catalog.generated'
import { CELL } from '../units'

const stairAt: [number, number] = [2.8, 6.5]
const stairHalfRun = MODEL_BOUNDS.stairsOpen.size[0] / (2 * CELL)
const stairHalfWidth = MODEL_BOUNDS.stairsOpen.size[2] / (2 * CELL)
const stairwellBounds: PlanRect = [
  stairAt[0] - stairHalfRun,
  stairAt[1] - stairHalfWidth,
  stairAt[0] + stairHalfRun,
  stairAt[1] + stairHalfWidth,
]

// The landing joins a service-side gallery; the bathroom has its own door,
// while the Study gives separate access to the Bedroom and Pantry.
export const dustOnTheSillUpper: SceneSpec = {
  puzzleId: 'expert-4',
  floor: 1,
  storeyFootprint: { kind: 'full' },
  stairwellBounds,
  circulation: {
    landing: [stairwellBounds[2], stairwellBounds[1], 4.8, stairwellBounds[3]],
    halls: [
      { id: 'bathroom-gallery', bounds: [4, 0.05, 4.8, 7.95] },
      { id: 'study-cross-gallery', bounds: [2.9, 0.5, 7.15, 1.25] },
      { id: 'study-east-gallery', bounds: [7.15, 0.35, 7.9, 3.6] },
      { id: 'bathroom-entry-bridge', bounds: [4.425, 4, 5.175, 4.75] },
    ],
    roomAccessTargets: [
      { id: 'bedroom-entry', bounds: [2.1, 0.35, 3, 1.25] },
      { id: 'study-entry', bounds: [3, 0.35, 4.4, 1.25] },
      { id: 'bathroom-entry', bounds: [5.175, 4, 5.925, 4.75] },
      { id: 'pantry-entry', bounds: [7.15, 3.1, 7.9, 3.8] },
    ],
  },
  shell: { features: [
    { wall: 'north', at: 1.2, kind: 'window' },
    { wall: 'north', at: 5.5, kind: 'window' },
  ] },
  floors: [
    { id: 'bedroom-floor', cells: [0, 0, 2, 7], material: 'wood' },
    { id: 'study-floor', cells: [3, 0, 7, 2], material: 'wood' },
    { id: 'bathroom-tile', cells: [3, 3, 5, 7], material: 'tile' },
    { id: 'pantry-floor', cells: [6, 3, 7, 7], material: 'stone' },
  ],
  walls: [
    { id: 'bedroom-study', from: [3, 0], to: [3, 3], height: 'half', openings: [{ at: 0.8, width: 1, kind: 'door' }] },
    { id: 'study-bathroom', from: [3, 3], to: [6, 3], height: 'half', openings: [{ at: 4.4, width: 0.8, kind: 'open' }] },
    { id: 'study-pantry', from: [6, 3], to: [8, 3], height: 'half', openings: [{ at: 7.55, width: 0.9, kind: 'door' }] },
    { id: 'bathroom-gallery', from: [4.8, 3], to: [4.8, 8], height: 'half', openings: [{ at: 4.4, width: 1, kind: 'door' }] },
    { id: 'bathroom-pantry', from: [6, 3], to: [6, 8], height: 'half' },
    { id: 'study-desk-back', from: [6, 2], to: [6, 3], height: 'half', freeEnds: ['from'] },

    { id: 'stairwell-north-guard', from: [stairwellBounds[0], stairwellBounds[1] - 0.08], to: [stairwellBounds[2], stairwellBounds[1] - 0.08], height: 'half', treatment: 'railing', freeEnds: ['to'] },
    { id: 'stairwell-south-guard', from: [stairwellBounds[0], stairwellBounds[3] + 0.08], to: [stairwellBounds[2], stairwellBounds[3] + 0.08], height: 'half', treatment: 'railing', freeEnds: ['to'] },
    { id: 'stairwell-west-guard', from: [stairwellBounds[0], stairwellBounds[1] - 0.08], to: [stairwellBounds[0], stairwellBounds[3] + 0.08], height: 'half', treatment: 'railing' },
  ],
  furniture: [
    { id: 'bedroom-bed', model: 'bedDouble', logic: 'bed@1,0', against: { wall: 'west', at: 2, side: 'E' }, facing: 'E' },
    { id: 'bedroom-rug', model: 'rugRectangle', logic: 'rug@3,0', at: [1, 3.1], facing: 'E' },
    { id: 'bedroom-entry-lamp', model: 'lampRoundFloor', logic: 'lamp@5,0', at: [0.5, 5.5] },
    { id: 'bedroom-clock', model: 'speaker', logic: 'clock@7,2', at: [2.75, 7.5] },

    { id: 'study-bookshelf', model: 'bookcaseOpenLow', logic: 'bookshelf@0,5', against: { wall: 'north', at: 5.8 } },
    { id: 'study-desk', model: 'desk', logic: 'desk@2,6', against: { wall: 'study-desk-back', at: 2.5, side: 'E' }, facing: 'E' },
    { id: 'study-chair', model: 'chairDesk', at: [6.8, 2.5], facing: 'W' },
    { id: 'study-box', model: 'cardboardBoxClosed', logic: 'box@1,3', at: [3.75, 1.85] },
    { id: 'study-lamp', model: 'lampRoundFloor', logic: 'lamp@2,3', at: [3.5, 2.5] },

    { id: 'bathroom-shower-north', model: 'shower', logic: 'shower@3,5', against: { wall: 'study-bathroom', at: 5.5, side: 'S' } },
    { id: 'bathroom-toilet', model: 'toilet', logic: 'toilet@5,5', against: { wall: 'bathroom-pantry', at: 5.5, side: 'W' } },
    { id: 'bathroom-shower-south', model: 'shower', logic: 'shower@6,5', against: { wall: 'bathroom-gallery', at: 6.5, side: 'E' } },

    { id: 'pantry-box-clue', model: 'cardboardBoxClosed', logic: 'box@3,6', at: [6.5, 3.5] },
    // Copa: lava-loiça, placa e bancada contínuas; frigorífico baixo contra a parede nascente.
    { id: 'pantry-counter-sink', model: 'kitchenSink', logic: 'counter@5,6', against: { wall: 'bathroom-pantry', at: 5.46, side: 'E' } },
    { id: 'pantry-stove', model: 'kitchenStove', against: { wall: 'bathroom-pantry', at: 6.0, side: 'E' } },
    { id: 'pantry-counter-prep', model: 'kitchenCabinet', logic: 'counter@5,6', against: { wall: 'bathroom-pantry', at: 6.54, side: 'E' } },
    { id: 'pantry-fridge', model: 'kitchenFridgeSmall', logic: 'fridge@7,7', against: { wall: 'east', at: 7.3 }, facing: 'W' },
    { id: 'bathroom-sink', model: 'bathroomSink', against: { wall: 'south', at: 5.25 }, facing: 'N' },
    { id: 'pantry-clock-table', model: 'sideTable', at: [0.5, 6.5], facing: 'E' },
    { id: 'pantry-clock', model: 'radio', logic: 'clock@6,0', on: { parent: 'pantry-clock-table' } },
  ],
}
