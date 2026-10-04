import type { SceneSpec } from '../schema'
import { theSecondStudyStairwellBounds } from './the-second-study-ground'

const well = theSecondStudyStairwellBounds
const guardOffset = 0.08

export const theSecondStudyUpper: SceneSpec = {
  puzzleId: 'expert-7',
  floor: 1,
  storeyFootprint: { kind: 'full' },
  stairwellBounds: well,
  circulation: {
    landing: [well[2], well[1], 5.25, well[3]],
    halls: [
      { id: 'upper-connector', bounds: [5.25, 3.05, 6.3, 3.97] },
      { id: 'study-gallery', bounds: [6.3, 3.05, 7.2, 3.97] },
      { id: 'east-gallery', bounds: [7.2, 3.05, 7.95, 5] },
      { id: 'north-gallery', bounds: [5.05, 2, 7.2, 3.05] },
      { id: 'study-west-run', bounds: [5.05, 0.1, 7.2, 2] },
    ],
    roomAccessTargets: [
      { id: 'pantry-entry', bounds: [4.05, 0.15, 5.05, 1.05] },
      { id: 'study-approach', bounds: [6.3, 3.05, 7.2, 3.97] },
      { id: 'bathroom-entry', bounds: [4.05, 2.05, 5.05, 2.95] },
      { id: 'bedroom-entry', bounds: [7.05, 4.3, 7.95, 5.55] },
    ],
  },
  shell: {
    features: [
      { wall: 'north', at: 1.8, kind: 'window' },
      { wall: 'north', at: 6.8, kind: 'window' },
      { wall: 'west', at: 6.2, kind: 'window' },
    ],
  },
  floors: [
    { id: 'pantry-tile', cells: [0, 0, 4, 1], material: 'tile' },
    { id: 'bathroom-tile', cells: [0, 2, 4, 4], material: 'tile' },
    { id: 'study-wood', cells: [5, 0, 7, 4], material: 'wood' },
    { id: 'bedroom-wood', cells: [0, 5, 7, 7], material: 'wood' },
  ],
  walls: [
    {
      id: 'pantry-bathroom',
      from: [0, 2],
      to: [5, 2],
      height: 'half',
      openings: [{ at: 3.5, width: 1, kind: 'door' }],
    },
    {
      id: 'pantry-study',
      from: [5, 0],
      to: [5, 2],
      height: 'cutaway',
      openings: [{ at: 0.6, width: 1, kind: 'open' }],
    },
    {
      id: 'bathroom-study-north',
      from: [5, 2],
      to: [5, 3],
      height: 'half',
      openings: [{ at: 2.5, width: 1, kind: 'open' }],
      freeEnds: ['to'],
    },
    {
      id: 'bathroom-study-south',
      from: [5, 4.35],
      to: [5, 5],
      height: 'half',
      freeEnds: ['from'],
    },
    {
      id: 'bedroom-divider',
      from: [0, 5],
      to: [8, 5],
      height: 'cutaway',
      openings: [
        { at: 3.5, width: 1, kind: 'door' },
        { at: 7.5, width: 1, kind: 'door' },

      ],
    },
    {
      id: 'stairwell-north',
      from: [well[0] - guardOffset, well[1] - guardOffset],
      to: [well[2], well[1] - guardOffset],
      height: 'half',
      treatment: 'railing',
      freeEnds: ['to'],
    },
    {
      id: 'stairwell-south',
      from: [well[0] - guardOffset, well[3] + guardOffset],
      to: [well[2], well[3] + guardOffset],
      height: 'half',
      treatment: 'railing',
      freeEnds: ['to'],
    },
    {
      id: 'stairwell-west',
      from: [well[0] - guardOffset, well[1] - guardOffset],
      to: [well[0] - guardOffset, well[3] + guardOffset],
      height: 'half',
      treatment: 'railing',
    },
  ],
  furniture: [
    { id: 'bedroom-clock-north', model: 'speaker', logic: 'clock@5,0', at: [0.5, 5.5], facing: 'S' },
    { id: 'bedroom-lamp-west', model: 'lampRoundFloor', logic: 'lamp@7,1', at: [1.5, 7.5], facing: 'S' },
    { id: 'bedroom-clock-south', model: 'speaker', logic: 'clock@6,0', at: [0.5, 6.5], facing: 'S' },
    { id: 'bedroom-lamp-east', model: 'lampRoundFloor', logic: 'lamp@7,5', at: [5.5, 7.5], facing: 'S' },
    { id: 'bedroom-rug', model: 'rugRectangle', logic: 'rug@5,4', at: [5, 6], facing: 'S' },
    { id: 'study-box-north', model: 'cardboardBoxClosed', logic: 'box@0,7', at: [7.5, 0.5], facing: 'S' },
    { id: 'study-bookcase', model: 'bookcaseOpenLow', logic: 'bookshelf@4,6', at: [6.7, 4.2], facing: 'S' },
    { id: 'study-desk', model: 'desk', logic: 'desk@4,5', at: [5.6, 4.48], facing: 'E' },
    { id: 'study-chair', model: 'chairDesk', at: [6.2, 4.48], facing: 'W' },
    { id: 'pantry-fridge', model: 'kitchenFridge', logic: 'fridge@1,4', at: [4.5, 1.5], facing: 'S' },
    { id: 'pantry-box', model: 'cardboardBoxClosed', logic: 'box@0,1', at: [1.5, 0.5], facing: 'S' },
    { id: 'pantry-counter', model: 'kitchenCabinet', logic: 'counter@0,2', at: [2.7, 0.5], facing: 'S' },
    { id: 'pantry-sink-counter', model: 'kitchenSink', logic: 'counter@0,2', at: [3.3, 0.5], facing: 'S' },
    { id: 'bathroom-shower', model: 'showerRound', logic: 'shower@4,1', at: [1.5, 4.5], facing: 'S' },
    { id: 'bathroom-toilet', model: 'toilet', logic: 'toilet@2,2', at: [2.5, 2.5], facing: 'S' },
    { id: 'nadia-bathtub', model: 'bathtub', logic: 'bathtub@2,0', at: [1, 2.5], facing: 'S' },
    { id: 'yuki-clock', model: 'speaker', logic: 'clock@7,6', at: [6.5, 7.5], facing: 'S' },
    { id: 'carol-lamp', model: 'lampRoundFloor', logic: 'lamp@6,7', at: [7.5, 6.5], facing: 'S' },
    { id: 'bed', model: 'bedDouble', against: { wall: 'south', at: 2.5 } },
  ],
}
