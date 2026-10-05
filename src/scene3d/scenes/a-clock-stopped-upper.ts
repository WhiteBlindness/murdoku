import type { SceneSpec } from '../schema'
import { aClockStoppedStairwellBounds } from './a-clock-stopped-ground'

const well = aClockStoppedStairwellBounds
const stairGuardEnd = well[3] - 0.1

export const aClockStoppedUpper: SceneSpec = {
  puzzleId: 'expert-6',
  floor: 1,
  storeyFootprint: { kind: 'full' },
  stairwellBounds: well,
  circulation: {
    landing: [well[0], well[3], well[2], well[3] + 0.75],
    halls: [
      { id: 'hallway-crossing', bounds: [0.1, 7, 5.8, 7.75] },
      { id: 'hallway-bedroom-turn', bounds: [3.35, 6.2, 4.2, 7] },
      { id: 'bedroom-gallery', bounds: [3.05, 3.1, 4, 5.5] },
      { id: 'bedroom-cross-gallery', bounds: [3.2, 3.9, 6.3, 4.65] },
      { id: 'bedroom-bathroom-gallery', bounds: [5.9, 3.1, 6.8, 5.3] },
      { id: 'study-gallery', bounds: [2.8, 0.1, 4.4, 2.9] },
    ],
    roomAccessTargets: [
      { id: 'bedroom-entry', bounds: [3.2, 5.5, 4.4, 6.5] },
      { id: 'study-entry', bounds: [2.6, 2.5, 3.8, 3.5] },
      { id: 'bathroom-entry', bounds: [5.9, 2.5, 7.1, 3.5] },
    ],
  },
  shell: {
    features: [
      { wall: 'north', at: 1.5, kind: 'window' },
      { wall: 'north', at: 6.5, kind: 'window' },
    ],
  },
  walls: [
    { id: 'study-bathroom', from: [5, 0], to: [5, 3], height: 'half' },
    { id: 'study-bedroom', from: [0, 3], to: [5, 3], height: 'cutaway', openings: [{ at: 3.2, width: 1.2, kind: 'door' }] },
    { id: 'bathroom-bedroom', from: [5, 3], to: [8, 3], height: 'cutaway', openings: [{ at: 6.5, width: 1.2, kind: 'door' }] },
    { id: 'bedroom-hallway-west', from: [0, 6], to: [well[0], 6], height: 'cutaway', openings: [{ at: 3.8, width: 1.2, kind: 'door' }] },
    { id: 'bedroom-hallway-east', from: [well[2], 6], to: [8, 6], height: 'cutaway' },
    { id: 'stairwell-west-guard', from: [well[0], well[1]], to: [well[0], stairGuardEnd], height: 'half', treatment: 'railing', freeEnds: ['from', 'to'] },
    { id: 'stairwell-east-guard', from: [well[2], well[1]], to: [well[2], stairGuardEnd], height: 'half', treatment: 'railing', freeEnds: ['from', 'to'] },
    { id: 'stairwell-north-guard', from: [well[0], well[1]], to: [well[2], well[1]], height: 'half', treatment: 'railing', freeEnds: ['from', 'to'] },
  ],
  floors: [
    { id: 'bathroom-tile', cells: [5, 0, 7, 2], material: 'tile', kind: 'interior' },
  ],
  furniture: [
    { id: 'study-bookshelf', model: 'bookcaseOpenLow', logic: 'bookshelf@0,0', against: { wall: 'north', at: 0.75 } },
    { id: 'study-desk', model: 'desk', logic: 'desk@2,2', at: [2.2, 2.1], facing: 'S' },
    { id: 'study-box', model: 'cardboardBoxClosed', logic: 'box@1,4', at: [4.8, 1.9] },
    { id: 'study-lamp', model: 'lampRoundFloor', logic: 'lamp@0,4', at: [4.85, 0.5], facing: 'S' },

    { id: 'bathroom-shower', model: 'shower', logic: 'shower@0,5', at: [5.5, 0.5], facing: 'E' },
    { id: 'bathroom-toilet', model: 'toilet', logic: 'toilet@2,5', at: [5.3, 2.1], facing: 'N' },
    { id: 'bathroom-tub', model: 'bathtub', logic: 'bathtub@1,7', against: { wall: 'east', at: 2 } },

    { id: 'bedroom-bed', model: 'bedDouble', logic: 'bed@4,0', against: { wall: 'west', at: 5 } },
    { id: 'bedroom-clock-4-stand', model: 'sideTable', at: [4.85, 3.65] },
    { id: 'bedroom-clock-4', model: 'radio', logic: 'clock@3,4', on: { parent: 'bedroom-clock-4-stand' } },
    { id: 'bedroom-clock-7-stand', model: 'sideTable', at: [7.55, 3.85] },
    { id: 'bedroom-clock-7', model: 'radio', logic: 'clock@3,7', on: { parent: 'bedroom-clock-7-stand' } },
    { id: 'bedroom-lamp-6-stand', model: 'sideTable', at: [6.55, 5.5] },
    { id: 'bedroom-lamp-6', model: 'lampRoundTable', logic: 'lamp@5,6', on: { parent: 'bedroom-lamp-6-stand' } },
    { id: 'bedroom-lamp-7-stand', model: 'sideTable', at: [7.45, 5.5] },
    { id: 'bedroom-lamp-7', model: 'lampRoundTable', logic: 'lamp@5,7', on: { parent: 'bedroom-lamp-7-stand' } },

    { id: 'hallway-plant-3', model: 'plant_bushSmall', logic: 'plant@6,3', at: [2.93, 6.5] },
    { id: 'hallway-plant-5', model: 'pottedPlant', logic: 'plant@6,5', at: [5.95, 6.5] },
    { id: 'hallway-clock', model: 'speaker', logic: 'clock@7,4', at: [4.5, 7.85] },
    { id: 'hallway-plant-south-east', model: 'pottedPlant', logic: 'plant@7,5', at: [5.95, 7.5] },
  ],
}
