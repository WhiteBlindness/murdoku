import type { SceneSpec } from '../schema'
import { theSpareKeyStairwellBounds } from './the-spare-key-ground'

const well = theSpareKeyStairwellBounds

export const theSpareKeyUpper: SceneSpec = {
  puzzleId: 'expert-9',
  floor: 1,
  storeyFootprint: { kind: 'full' },
  stairwellBounds: well,
  circulation: {
    landing: [well[0] - 1.0, well[1] - 1.0, 7.4, well[1]],
    halls: [
      { id: 'study-stair-bypass', bounds: [4.0, well[1] - 1.0, well[0] - 0.05, 4.95] },
      { id: 'study-south-gallery', bounds: [0.3, 4.1, well[0] - 0.05, 5.0] },
      { id: 'bathroom-entry-run', bounds: [0.9, 2.2, 1.7, 4.95] },
      { id: 'office-entry-run', bounds: [6.7, 2.7, 7.55, 4.2] },
      { id: 'bedroom-entry-run', bounds: [1.8, 4.2, 2.6, 5.35] },
    ],
    roomAccessTargets: [
      { id: 'bathroom-entry', bounds: [0.9, 2.7, 1.7, 3.55] },
      { id: 'office-entry', bounds: [6.7, 2.7, 7.55, 3.55] },
      { id: 'bedroom-entry', bounds: [1.8, 4.65, 2.6, 5.4] },
    ],
  },
  shell: {
    features: [
      { wall: 'north', at: 1.2, kind: 'window' },
      { wall: 'north', at: 6.5, kind: 'window' },
      { wall: 'west', at: 6.5, kind: 'window' },
    ],
  },
  floors: [
    { id: 'bathroom', cells: [0, 0, 4, 2], material: 'tile', kind: 'interior' },
    { id: 'office', cells: [5, 0, 7, 2], material: 'wood', kind: 'interior' },
    { id: 'study', cells: [0, 3, 7, 4], material: 'wood', kind: 'interior' },
    { id: 'bedroom', cells: [0, 5, 7, 7], material: 'wood', kind: 'interior' },
  ],
  walls: [
    {
      id: 'bathroom-study-door',
      from: [0, 3],
      to: [5, 3],
      height: 'half',
      openings: [{ at: 1.3, width: 1.2, kind: 'door' }],
    },
    {
      id: 'office-study-door',
      from: [5, 3],
      to: [8, 3],
      height: 'half',
      openings: [{ at: 7.3, width: 1.4, kind: 'door' }],
    },
    {
      id: 'bathroom-office-door',
      from: [5, 0],
      to: [5, 3],
      height: 'half',
      openings: [{ at: 1.5, width: 1.2, kind: 'door' }],
    },
    {
      id: 'study-bedroom-door-west',
      from: [0, 5],
      to: [well[0], 5],
      height: 'half',
      openings: [{ at: 2.2, width: 1.2, kind: 'door' }],
    },
    {
      id: 'study-bedroom-door-east',
      from: [well[2], 5],
      to: [8, 5],
      height: 'half',
    },
    {
      id: 'stairwell-west-guard',
      from: [well[0], well[1] + 0.12],
      to: [well[0], well[3]],
      height: 'half',
      treatment: 'railing',
      freeEnds: ['from'],
    },
    {
      id: 'stairwell-east-guard',
      from: [well[2], well[1] + 0.12],
      to: [well[2], well[3]],
      height: 'half',
      treatment: 'railing',
      freeEnds: ['from'],
    },
    {
      id: 'stairwell-south-guard',
      from: [well[0], well[3]],
      to: [well[2], well[3]],
      height: 'half',
      treatment: 'railing',
    },
  ],
  furniture: [
    { id: 'study-desk-carol', model: 'desk', logic: 'desk@3,3', at: [3.5, 3.5], facing: 'S' },
    { id: 'study-box-east', model: 'cardboardBoxClosed', logic: 'box@3,7', at: [7.75, 4.1] },
    { id: 'study-lamp-east', model: 'lampRoundFloor', logic: 'lamp@4,6', at: [6.5, 4.8], facing: 'N' },

    { id: 'bathroom-tub-west', model: 'bathtub', logic: 'bathtub@0,0', at: [1, 0.5], facing: 'S' },
    { id: 'bathroom-tub-east', model: 'bathtub', logic: 'bathtub@0,3', at: [4, 0.5], facing: 'S' },
    { id: 'bathroom-toilet-west', model: 'toilet', logic: 'toilet@2,2', at: [2.5, 2.5], facing: 'E' },
    { id: 'bathroom-toilet-east', model: 'toilet', logic: 'toilet@1,4', at: [4.05, 1.2], facing: 'N' },
    { id: 'bathroom-shower-east', model: 'shower', logic: 'shower@2,4', at: [4.5, 2.5], facing: 'S' },

    { id: 'office-desk', model: 'desk', logic: 'desk@0,6', at: [6.5, 0.65], facing: 'S' },
    { id: 'office-chair', model: 'chair', logic: 'chair@2,7', at: [7.8, 2.15], facing: 'N' },

    { id: 'bedroom-clock-west', model: 'speaker', logic: 'clock@7,0', at: [0.5, 7.5] },
    { id: 'bedroom-rug', model: 'rugDoormat', logic: 'rug@5,6', at: [7.5, 6.5], facing: 'S' },
    { id: 'bedroom-lamp', model: 'lampRoundFloor', logic: 'lamp@7,7', at: [7.5, 7.5], facing: 'N' },
    { id: 'bedroom-bed', model: 'bedDouble', logic: 'bed@5,3', at: [4, 6], facing: 'S' },
    { id: 'bedroom-clock-east', model: 'speaker', logic: 'clock@7,1', at: [1.5, 7.5] },
  ],
}
