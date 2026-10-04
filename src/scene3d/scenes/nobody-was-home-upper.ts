import type { SceneSpec } from '../schema'
import { nobodyWasHomeStairwellBounds } from './nobody-was-home-ground'

const well = nobodyWasHomeStairwellBounds

export const nobodyWasHomeUpper: SceneSpec = {
  puzzleId: 'master-8',
  floor: 1,
  storeyFootprint: { kind: 'full' },
  stairwellBounds: well,
  circulation: {
    landing: [well[0], 0.1, well[2] + 0.1, well[1]],
    halls: [
      { id: 'study-north-crossing', bounds: [6.1, 0.1, 7.8, well[1] - 0.05] },
      { id: 'study-bedroom-gallery', bounds: [well[2] + 0.16, well[1] - 0.05, 7.8, 2] },
      { id: 'bedroom-east-gallery', bounds: [well[2] + 0.16, 2, 7.75, 4.15] },
      { id: 'bedroom-south-gallery', bounds: [1.5, 4.15, 7.8, 4.9] },
    ],
    roomAccessTargets: [
      { id: 'study-entry', bounds: [7, 0.2, 7.8, 1.05] },
      { id: 'bedroom-entry', bounds: [6.95, 2, 7.6, 2.75] },
      { id: 'bathroom-entry', bounds: [2.1, 4.75, 2.95, 5.7] },
      { id: 'office-entry', bounds: [5.0, 4.75, 5.8, 5.7] },
    ],
  },
  shell: {
    features: [
      { wall: 'north', at: 2.5, kind: 'window' },
      { wall: 'north', at: 6.3, kind: 'window' },
      { wall: 'west', at: 3.3, kind: 'window' },
    ],
  },
  walls: [
    {
      id: 'study-bedroom-west',
      from: [0, 2],
      to: [well[0], 2],
      height: 'cutaway',
      openings: [{ at: 3.5, width: 1.1, kind: 'open' }],
      freeEnds: ['to'],
    },
    {
      id: 'study-bedroom-east',
      from: [well[2], 2],
      to: [8, 2],
      height: 'cutaway',
      openings: [{ at: 7.35, width: 1.0, kind: 'open' }],
      freeEnds: ['from'],
    },
    {
      id: 'bedroom-bathroom',
      from: [0, 5],
      to: [4, 5],
      height: 'cutaway',
      openings: [{ at: 2.5, width: 1.1, kind: 'open' }],
    },
    {
      id: 'bedroom-office',
      from: [4, 5],
      to: [8, 5],
      height: 'cutaway',
      openings: [{ at: 5.45, width: 1.1, kind: 'open' }],
    },
    { id: 'bathroom-office-divider', from: [4, 5], to: [4, 8], height: 'half' },
    { id: 'stairwell-west-guard', from: [well[0] - 0.06, well[1]], to: [well[0] - 0.06, well[3]], height: 'half', treatment: 'railing', freeEnds: ['from', 'to'] },
    { id: 'stairwell-east-guard', from: [well[2] + 0.06, well[1]], to: [well[2] + 0.06, well[3]], height: 'half', treatment: 'railing', freeEnds: ['from', 'to'] },
    { id: 'stairwell-foot-guard', from: [well[0], well[3]], to: [well[2], well[3]], height: 'half', treatment: 'railing', freeEnds: ['from', 'to'] },
  ],
  floors: [
    { id: 'study-wood', cells: [0, 0, 7, 1], material: 'wood', kind: 'interior' },
    { id: 'bedroom-wood', cells: [0, 2, 7, 4], material: 'wood', kind: 'interior' },
    { id: 'bathroom-tile', cells: [0, 5, 3, 7], material: 'tile', kind: 'interior' },
    { id: 'office-wood', cells: [4, 5, 7, 7], material: 'wood', kind: 'interior' },
  ],
  furniture: [
    { id: 'bedroom-clock-east', model: 'speaker', logic: 'clock@4,4', at: [4.5, 4.02], facing: 'S' },
    { id: 'bedroom-clock-west', model: 'speaker', logic: 'clock@4,3', at: [3.5, 4.02], facing: 'S' },
    { id: 'bedroom-lamp-north', model: 'lampRoundFloor', logic: 'lamp@2,7', at: [7.85, 2.85], facing: 'S' },
    { id: 'bedroom-rug-priya', model: 'rugRectangle', logic: 'rug@2,0', at: [1.0, 3.0], facing: 'E' },
    { id: 'study-box', model: 'cardboardBoxClosed', logic: 'box@0,5', at: [5.5, 0.5], facing: 'S' },
    { id: 'study-bookcase', model: 'bookcaseOpenLow', logic: 'bookshelf@1,2', at: [2.5, 1.5], facing: 'E' },
    { id: 'study-desk', model: 'desk', logic: 'desk@0,4', at: [4.5, 0.5], facing: 'E' },
    { id: 'bathroom-bathtub', model: 'bathtub', logic: 'bathtub@6,3', at: [3.5, 6.9], facing: 'E' },
    { id: 'bathroom-shower', model: 'showerRound', logic: 'shower@5,1', at: [1.5, 5.5], facing: 'S' },
    { id: 'office-chair', model: 'chair', logic: 'chair@5,6', at: [6.5, 5.5], facing: 'W' },
    { id: 'office-desk', model: 'desk', logic: 'desk@7,7', at: [7.5, 7.5], facing: 'N' },
    { id: 'bedroom-lamp-greta', model: 'lampRoundFloor', logic: 'lamp@3,5', at: [5.5, 3.85], facing: 'S' },
  ],
}
