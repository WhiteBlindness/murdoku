import type { SceneSpec } from '../schema'
import { aWitnessRecantsStairwellBounds } from './a-witness-recants-ground'

const well = aWitnessRecantsStairwellBounds
const guardOffset = 0.1

export const aWitnessRecantsUpper: SceneSpec = {
  puzzleId: 'expert-2',
  floor: 1,
  storeyFootprint: { kind: 'full' },
  stairwellBounds: well,
  circulation: {
    landing: [well[0], well[3], well[2], 7.3],
    halls: [
      { id: 'garden-spine-gallery', bounds: [3.12, 0.1, 3.87, 7.2] },
      { id: 'south-cross-gallery', bounds: [3.12, well[3] + 0.07, well[0], 7.27] },
      { id: 'bathroom-entry-run', bounds: [3.12, 1.1, 4.8, 1.9] },
    ],
    roomAccessTargets: [
      { id: 'study-access', bounds: [3.12, 0.35, 3.87, 1.1] },
      { id: 'bedroom-access', bounds: [3.12, 5.25, 3.87, 6.1] },
      { id: 'bathroom-access', bounds: [4.05, 1.1, 4.8, 1.9] },
      { id: 'office-access', bounds: [4.05, 6.5, 4.8, 7.15] },
    ],
  },
  shell: {
    features: [
      { wall: 'north', at: 1.7, kind: 'window' },
      { wall: 'north', at: 6.5, kind: 'window' },
      { wall: 'west', at: 6.2, kind: 'window' },
    ],
  },
  floors: [
    { id: 'study', cells: [0, 0, 3, 3], material: 'wood', kind: 'interior' },
    { id: 'bathroom', cells: [4, 0, 7, 3], material: 'tile', kind: 'interior' },
    { id: 'bedroom', cells: [0, 4, 3, 7], material: 'wood', kind: 'interior' },
    { id: 'office', cells: [4, 4, 7, 7], material: 'wood', kind: 'interior' },
  ],
  walls: [
    {
      id: 'study-bedroom-divider',
      from: [0, 4],
      to: [4, 4],
      height: 'half',
      openings: [{ at: 3.5, width: 0.85, kind: 'open' }],
    },
    {
      id: 'west-east-wings',
      from: [4, 0],
      to: [4, 8],
      height: 'half',
      openings: [
        { at: 1.5, width: 1.2, kind: 'open' },
        { at: 6.8, width: 1.0, kind: 'open' },
      ],
    },
    {
      id: 'bathroom-office-divider',
      from: [4, 4],
      to: [8, 4],
      height: 'half',
    },

    {
      id: 'stairwell-west-guard',
      from: [well[0] - guardOffset, well[1]],
      to: [well[0] - guardOffset, well[3]],
      height: 'half',
      treatment: 'railing',
      freeEnds: ['from', 'to'],
    },
    {
      id: 'stairwell-east-guard',
      from: [well[2] + guardOffset, well[1]],
      to: [well[2] + guardOffset, well[3]],
      height: 'half',
      treatment: 'railing',
      freeEnds: ['from', 'to'],
    },
    {
      id: 'stairwell-north-guard',
      from: [well[0], well[1] - guardOffset],
      to: [well[2], well[1] - guardOffset],
      height: 'half',
      treatment: 'railing',
      freeEnds: ['from', 'to'],
    },
  ],
  furniture: [
    { id: 'study-desk', model: 'desk', logic: 'desk@0,0', at: [0.5, 0.5], facing: 'N' },
    { id: 'study-bookshelf', model: 'bookcaseOpenLow', logic: 'bookshelf@3,0', at: [0.5, 3.5], facing: 'S' },
    { id: 'study-lamp', model: 'lampRoundFloor', logic: 'lamp@0,2', at: [2.5, 0.5], facing: 'S' },
    { id: 'study-box', model: 'cardboardBoxClosed', logic: 'box@1,0', at: [0.5, 1.5] },

    { id: 'bedroom-clock-north', model: 'speaker', logic: 'clock@5,3', at: [3.0, 5.5] },
    { id: 'bedroom-lamp-south', model: 'lampRoundFloor', logic: 'lamp@7,2', at: [2.5, 7.5], facing: 'S' },
    { id: 'bedroom-clock-south', model: 'speaker', logic: 'clock@7,3', at: [3.0, 7.5] },
    { id: 'bedroom-rug', model: 'rugRectangle', logic: 'rug@4,0', at: [1.6, 5.5], facing: 'E' },

    { id: 'bathroom-tub-north', model: 'bathtub', logic: 'bathtub@0,4', at: [5.0, 0.5], facing: 'S' },
    { id: 'bathroom-toilet-west', model: 'toilet', logic: 'toilet@2,4', at: [4.55, 2.5], facing: 'S' },
    { id: 'bathroom-shower-south', model: 'showerRound', logic: 'shower@2,7', at: [7.5, 2.5], facing: 'S' },
    { id: 'bathroom-shower-north', model: 'showerRound', logic: 'shower@0,7', at: [7.5, 0.5], facing: 'S' },
    { id: 'bathroom-tub-evangeline', model: 'bathtub', logic: 'bathtub@3,4', at: [4.85, 3.5], facing: 'S' },
    { id: 'bathroom-toilet-tomas', model: 'toilet', logic: 'toilet@2,6', at: [6.5, 2.5], facing: 'S' },

    { id: 'office-chair-north', model: 'chair', logic: 'chair@4,7', at: [7.5, 4.5], facing: 'E' },
    { id: 'office-desk', model: 'desk', logic: 'desk@4,5', at: [5.5, 4.5], facing: 'E' },
    { id: 'office-bookshelf', model: 'bookcaseOpenLow', logic: 'bookshelf@5,4', at: [4.5, 5.5], facing: 'E' },
    { id: 'office-clock', model: 'speaker', logic: 'clock@6,7', at: [7.5, 6.5] },
    { id: 'office-greta-chair', model: 'chair', logic: 'chair@7,5', at: [5.5, 7.5], facing: 'S' },
  ],
}
