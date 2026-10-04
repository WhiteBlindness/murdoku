import type { SceneSpec } from '../schema'
import { theBorrowedKnifeStairwellBounds } from './the-borrowed-knife-ground'

const stairwell = theBorrowedKnifeStairwellBounds

export const theBorrowedKnifeUpper: SceneSpec = {
  puzzleId: 'expert-5',
  floor: 1,
  storeyFootprint: { kind: 'full' },
  stairwellBounds: stairwell,
  circulation: {
    landing: [stairwell[0], stairwell[1] - 0.75, stairwell[2], stairwell[1]],
    halls: [
      { id: 'study-north-gallery', bounds: [stairwell[0], stairwell[1] - 0.75, 5.3, stairwell[1]] },
      { id: 'study-east-gallery', bounds: [5.3, stairwell[1] - 0.75, 6.6, stairwell[1]] },
      { id: 'bedroom-east-gallery', bounds: [5.8, stairwell[1] - 0.75, 6.6, 5] },
    ],
    roomAccessTargets: [
      { id: 'bathroom-entry', bounds: [3, 2.25, 3.9, stairwell[1]] },
      { id: 'dining-entry', bounds: [5.8, 2.25, 6.6, stairwell[1]] },
      { id: 'bedroom-entry', bounds: [5.8, 4.2, 6.6, 5.75] },
    ],
  },
  shell: {
    features: [
      { wall: 'north', at: 1.5, kind: 'window' },
      { wall: 'north', at: 6.6, kind: 'window' },
      { wall: 'west', at: 6.2, kind: 'window' },
    ],
  },
  floors: [
    { id: 'bathroom', cells: [0, 0, 3, 2], material: 'tile', kind: 'interior' },
    { id: 'dining-room', cells: [4, 0, 7, 2], material: 'wood', kind: 'interior' },
    { id: 'study', cells: [0, 3, 7, 4], material: 'wood', kind: 'interior' },
    { id: 'bedroom', cells: [0, 5, 7, 7], material: 'wood', kind: 'interior' },
  ],
  walls: [
    {
      id: 'bathroom-study-divider',
      from: [0, 3],
      to: [4, 3],
      height: 'half',
      openings: [{ at: 3.5, width: 1, kind: 'open' }],
    },
    {
      id: 'dining-study-divider',
      from: [4, 3],
      to: [8, 3],
      height: 'half',
      openings: [{ at: 6.2, width: 1.2, kind: 'open' }],
    },
    {
      id: 'bathroom-dining-divider',
      from: [4, 0],
      to: [4, 3],
      height: 'half',
      openings: [{ at: 1.5, width: 1.2, kind: 'open' }],
    },
    {
      id: 'study-bedroom-divider-west',
      from: [0, 5],
      to: [0.9, 5],
      height: 'half',
      freeEnds: ['to'],
    },
    {
      id: 'study-bedroom-divider-east',
      from: [2.1, 5],
      to: [8, 5],
      height: 'half',
      openings: [{ at: 6.2, width: 1.2, kind: 'open' }],
      freeEnds: ['from'],
    },
    {
      id: 'stairwell-west-guard',
      from: [stairwell[0], stairwell[1] + 0.1],
      to: [stairwell[0], stairwell[3] - 0.1],
      height: 'half',
      treatment: 'railing',
      freeEnds: ['from', 'to'],
    },
    {
      id: 'stairwell-east-guard',
      from: [stairwell[2], stairwell[1] + 0.1],
      to: [stairwell[2], stairwell[3] - 0.1],
      height: 'half',
      treatment: 'railing',
      freeEnds: ['from', 'to'],
    },
  ],
  furniture: [
    { id: 'bedroom-bed', model: 'bedDouble', logic: 'bed@5,4', at: [5, 6], facing: 'S' },
    { id: 'bedroom-lamp', model: 'lampRoundFloor', logic: 'lamp@7,1', at: [1.5, 7.5] },
    { id: 'bedroom-clock-west', model: 'speaker', logic: 'clock@6,0', at: [0.9, 6.5] },
    { id: 'bedroom-clock-east', model: 'speaker', logic: 'clock@7,6', at: [6.5, 7.5] },

    { id: 'study-desk-tomas', model: 'desk', logic: 'desk@3,6', at: [7.1, 3.95], facing: 'S' },
    { id: 'study-bookshelf', model: 'bookcaseOpenLow', logic: 'bookshelf@3,4', at: [4.8, 4.12], facing: 'E' },
    { id: 'study-box', model: 'cardboardBoxClosed', logic: 'box@4,2', at: [2.9, 4.79] },
    { id: 'bathroom-toilet', model: 'toilet', logic: 'toilet@2,0', at: [0.3, 2.35], facing: 'N' },
    { id: 'bathroom-shower-east', model: 'shower', logic: 'shower@2,2', at: [2.5, 2.5], facing: 'S' },
    { id: 'bathroom-shower-west', model: 'shower', logic: 'shower@2,1', at: [1.5, 2.5], facing: 'S' },
    { id: 'dining-chair', model: 'chair', logic: 'chair@1,7', at: [7.5, 1.5], facing: 'W' },
    { id: 'dining-table', model: 'table', logic: 'table@0,4', at: [5.3, 0.65], facing: 'S' },
    { id: 'dining-lamp', model: 'lampRoundFloor', logic: 'lamp@2,5', at: [5.5, 2.5] },
    { id: 'study-desk-idris', model: 'desk', logic: 'desk@4,4', at: [4.8, 4.67], facing: 'S' },
    { id: 'study-chair-tomas', model: 'chairDesk', at: [7.3, 4.65], facing: 'N' },
    { id: 'study-chair-idris', model: 'chairDesk', at: [4.05, 4.67], facing: 'E' },
  ],
}
