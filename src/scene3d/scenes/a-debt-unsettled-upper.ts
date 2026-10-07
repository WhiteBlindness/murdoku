import type { SceneSpec } from '../schema'
import { aDebtUnsettledStairwellBounds } from './a-debt-unsettled-ground'

const well = aDebtUnsettledStairwellBounds
const rail = 0.07

export const aDebtUnsettledUpper: SceneSpec = {
  puzzleId: 'master-4',
  floor: 1,
  storeyFootprint: { kind: 'full' },
  stairwellBounds: well,
  circulation: {
    landing: [well[2], well[1], well[2] + 0.85, well[3]],
    halls: [
      { id: 'hallway-main-run', bounds: [3.21, 0.62, 7.65, 1.48] },
      { id: 'bedroom-doorway', bounds: [5.95, 0.8, 7.15, 3.5] },
      { id: 'bedroom-east-run', bounds: [6, 2.7, 7.15, 4.7] },
      { id: 'bedroom-south-run', bounds: [2.05, 3.7, 7.15, 4.6] },
      { id: 'bedroom-west-run', bounds: [0.05, 2.1, 0.9, 4.9] },
      { id: 'bedroom-west-turn', bounds: [0.05, 3.6, 1.6, 4.4] },
      { id: 'bedroom-middle-connector', bounds: [1.2, 3.6, 2.2, 4.6] },
      { id: 'bathroom-doorway', bounds: [0.05, 4.9, 1.25, 6.1] },
      { id: 'study-doorway', bounds: [5.25, 4, 6.45, 5.8] },
    ],
    roomAccessTargets: [
      { id: 'bedroom-entry', bounds: [6, 2.05, 7.1, 2.8] },
      { id: 'bathroom-entry', bounds: [0.05, 5.05, 1.2, 5.95] },
      { id: 'study-entry', bounds: [5.3, 5.05, 6.4, 5.8] },
    ],
  },
  shell: { features: [
    { wall: 'north', at: 4.6, kind: 'window' },
    { wall: 'north', at: 3.25, kind: 'window' },
    { wall: 'west', at: 3.25, kind: 'window' },
  ] },
  floors: [
    { id: 'hallway-floor', cells: [0, 0, 7, 1], material: 'wood', kind: 'interior' },
    { id: 'bedroom-floor', cells: [0, 2, 7, 4], material: 'wood', kind: 'interior' },
    { id: 'bathroom-floor', cells: [0, 5, 2, 7], material: 'tile', kind: 'interior' },
    { id: 'study-floor', cells: [3, 5, 7, 7], material: 'wood', kind: 'interior' },
  ],
  walls: [
    { id: 'hallway-bedroom-door', from: [0, 2], to: [8, 2], height: 'half', openings: [{ at: 6.55, width: 1.2, kind: 'door' }] },
    { id: 'bedroom-bathroom-door', from: [0, 5], to: [3, 5], height: 'half', openings: [{ at: 0.65, width: 1.2, kind: 'door' }] },
    { id: 'bedroom-study-door', from: [3, 5], to: [8, 5], height: 'half', openings: [{ at: 5.85, width: 1.2, kind: 'door' }] },
    { id: 'bathroom-study-wall', from: [3, 5], to: [3, 8], height: 'half' },
    { id: 'stairwell-north-guard', from: [well[0], well[1] - rail], to: [well[2], well[1] - rail], height: 'half', treatment: 'railing', freeEnds: ['from', 'to'] },
    { id: 'stairwell-south-guard', from: [well[0], well[3] + rail], to: [well[2], well[3] + rail], height: 'half', treatment: 'railing', freeEnds: ['from', 'to'] },
    { id: 'stairwell-west-guard', from: [well[0] - rail, well[1]], to: [well[0] - rail, well[3]], height: 'half', treatment: 'railing', freeEnds: ['from', 'to'] },
  ],
  furniture: [
    { id: 'hallway-plant-west', model: 'pottedPlant', logic: 'plant@0,4', at: [4.5, 0.4], facing: 'S' },
    { id: 'hallway-clock', model: 'speaker', logic: 'clock@1,2', at: [2.5, 1.85], facing: 'S' },
    { id: 'hallway-plant-east', model: 'pottedPlant', logic: 'plant@1,4', at: [4.5, 1.72], facing: 'S' },

    { id: 'bedroom-rug-bella', model: 'rugRectangle', logic: 'rug@2,2', at: [2.45, 3.1], facing: 'E' },
    { id: 'bedroom-bed', model: 'bedDouble', logic: 'bed@2,4', against: { wall: 'hallway-bedroom-door', side: 'S', at: 5.0 } },
    { id: 'bedroom-clock', model: 'speaker', logic: 'clock@4,1', at: [1.5, 4.75], facing: 'S' },
    { id: 'bedroom-lamp', model: 'lampRoundFloor', logic: 'lamp@4,4', at: [4.5, 4.75], facing: 'S' },

    { id: 'bathroom-shower', model: 'showerRound', logic: 'shower@5,1', at: [1.85, 5.55], facing: 'E' },
    { id: 'bathroom-bathtub', model: 'bathtub', logic: 'bathtub@7,0', at: [0.55, 7.0], facing: 'E' },
    { id: 'bathroom-toilet', model: 'toilet', against: { wall: 'bathroom-study-wall', side: 'W', at: 6.6 }, facing: 'W' },
    { id: 'bathroom-sink', model: 'bathroomSink', against: { wall: 'bedroom-bathroom-door', side: 'S', at: 2.6 }, facing: 'S' },

    { id: 'study-bookshelf', model: 'bookcaseOpenLow', logic: 'bookshelf@5,4', at: [4.35, 5.55], facing: 'S' },
    { id: 'study-desk', model: 'desk', logic: 'desk@6,7', at: [7.35, 6.45], facing: 'W' },
    { id: 'study-chair', model: 'chairDesk', at: [6.9, 6.42], facing: 'E' },
    { id: 'study-box', model: 'cardboardBoxClosed', logic: 'box@7,7', at: [7.5, 7.5], facing: 'S' },
    { id: 'study-lamp', model: 'lampRoundFloor', logic: 'lamp@7,5', at: [5.5, 7.4], facing: 'S' },
  ],
}
