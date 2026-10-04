import type { SceneSpec } from '../schema'
import { theSilentKitchenStairwellBounds } from './the-silent-kitchen-ground'

const well = theSilentKitchenStairwellBounds
const guardOffset = 0.08

export const theSilentKitchenUpper: SceneSpec = {
  puzzleId: 'master-5',
  floor: 1,
  storeyFootprint: { kind: 'full' },
  stairwellBounds: well,
  circulation: {
    landing: [well[2], well[1] - 0.05, 3.93, 4.4],
    halls: [
      { id: 'bedroom-study-bath-gallery', bounds: [well[2], 2.6, 7.9, 3.4] },
      { id: 'bedroom-east-link', bounds: [well[2], 3.55, 3.93, 5.5] },
      { id: 'bedroom-south-cross-gallery', bounds: [2, 4.6, 3.93, 5.4] },
      { id: 'hallway-bedroom-connector', bounds: [1.2, 4.6, 2.8, 5.4] },
    ],
    roomAccessTargets: [
      { id: 'hallway-south-access', bounds: [0.2, 4.6, 1.95, 5.4] },
      { id: 'bedroom-access', bounds: [2.05, 4.6, 2.8, 5.4] },
      { id: 'study-access', bounds: [4.15, 2.65, 5.85, 3.35] },
      { id: 'bathroom-access', bounds: [6.15, 2.65, 7.75, 3.35] },
    ],
  },
  shell: {
    features: [
      { wall: 'north', at: 1.45, kind: 'window' },
      { wall: 'north', at: 3.15, kind: 'window' },
      { wall: 'north', at: 5.2, kind: 'window' },
      { wall: 'west', at: 6.5, kind: 'window' },
    ],
  },
  floors: [
    { id: 'hallway-stone', cells: [0, 0, 1, 7], material: 'stone', kind: 'interior' },
    { id: 'bedroom-wood', cells: [2, 0, 3, 7], material: 'wood', kind: 'interior' },
    { id: 'study-wood', cells: [4, 0, 5, 7], material: 'wood', kind: 'interior' },
    { id: 'bathroom-tile', cells: [6, 0, 7, 7], material: 'tile', kind: 'interior' },
  ],
  walls: [
    {
      id: 'hallway-bedroom-north-divider',
      from: [2, 0],
      to: [2, well[1] - guardOffset],
      height: 'half',
    },
    {
      id: 'hallway-bedroom-south-divider',
      from: [2, well[3] + guardOffset],
      to: [2, 8],
      height: 'half',
      openings: [{ at: 5, width: 1.2, kind: 'door' }],
    },
    {
      id: 'bedroom-study-divider',
      from: [4, 0],
      to: [4, 8],
      height: 'half',
      openings: [{ at: 3, width: 1.2, kind: 'door' }],
    },
    {
      id: 'study-bathroom-divider',
      from: [6, 0],
      to: [6, 8],
      height: 'half',
      openings: [{ at: 3, width: 1.2, kind: 'door' }],
    },
    {
      id: 'stairwell-north-guard',
      from: [well[0], well[1] - guardOffset],
      to: [well[2], well[1] - guardOffset],
      height: 'half',
      treatment: 'railing',
      freeEnds: ['from', 'to'],
    },
    {
      id: 'stairwell-south-guard-west',
      from: [well[0] - guardOffset, well[3] + guardOffset],
      to: [well[2] - guardOffset, well[3] + guardOffset],
      height: 'half',
      treatment: 'railing',
      freeEnds: ['to'],
    },
    {
      id: 'stairwell-west-guard',
      from: [well[0] - guardOffset, well[1]],
      to: [well[0] - guardOffset, well[3] + guardOffset],
      height: 'half',
      treatment: 'railing',
      freeEnds: ['from', 'to'],
    },
  ],
  furniture: [
    { id: 'hallway-plant', model: 'flower_yellowA', logic: 'plant@3,0', at: [0.15, 3] },
    { id: 'hallway-clock-south', model: 'speaker', logic: 'clock@6,0', at: [0.25, 6.5] },
    { id: 'hallway-clock-east', model: 'speaker', logic: 'clock@4,1', at: [1.05, 4.2] },
    { id: 'hallway-rug-lena', model: 'rugRectangle', logic: 'rug@1,0', at: [1, 1.7], facing: 'S' },

    { id: 'bedroom-lamp-north', model: 'lampRoundFloor', logic: 'lamp@4,3', at: [3, 4.3], facing: 'W' },
    { id: 'bedroom-clock-east', model: 'speaker', logic: 'clock@6,3', at: [3.5, 6.5] },
    { id: 'bedroom-lamp-south', model: 'lampRoundFloor', logic: 'lamp@5,2', at: [2.15, 5.8] },
    { id: 'bedroom-clock-priya', model: 'speaker', logic: 'clock@7,2', at: [2.5, 7.5] },

    { id: 'study-desk-idris', model: 'desk', logic: 'desk@0,4', at: [4.5, 0.5], facing: 'S' },
    { id: 'study-box', model: 'cardboardBoxClosed', logic: 'box@0,5', at: [5.5, 0.5] },
    { id: 'study-bookshelf', model: 'bookcaseOpenLow', logic: 'bookshelf@4,4', at: [4.5, 5], facing: 'E' },
    { id: 'study-lamp', model: 'lampRoundFloor', logic: 'lamp@7,5', at: [5.5, 7.5] },
    { id: 'study-desk-extra', model: 'desk', logic: 'desk@6,4', at: [4.5, 6.5], facing: 'W' },

    { id: 'bathroom-toilet', model: 'toilet', logic: 'toilet@3,6', at: [6.75, 3.85], facing: 'W' },
    { id: 'bathroom-bathtub', model: 'bathtub', logic: 'bathtub@6,6', at: [7, 6.5], facing: 'S' },
    { id: 'bathroom-shower', model: 'showerRound', logic: 'shower@7,6', at: [6.5, 7.5], facing: 'S' },
  ],
}
