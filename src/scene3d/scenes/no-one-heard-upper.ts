import type { SceneSpec } from '../schema'
import { noOneHeardStairwellBounds } from './no-one-heard-ground'

const well = noOneHeardStairwellBounds

export const noOneHeardUpper: SceneSpec = {
  puzzleId: 'expert-8',
  floor: 1,
  storeyFootprint: { kind: 'full' },
  stairwellBounds: well,
  circulation: {
    landing: [well[0], well[3], well[2], well[3] + 0.75],
    halls: [
      { id: 'study-south-gallery', bounds: [3, well[3] + 0.05, 5, 7.5] },
      { id: 'bedroom-south-bridge', bounds: [4, well[3] + 0.05, 5.8, 7.5] },
      { id: 'bedroom-east-gallery', bounds: [5.05, 1.05, 5.8, 7.6] },
      { id: 'bedroom-north-bridge', bounds: [4, 1.05, 5.8, 1.95] },
      { id: 'study-north-gallery', bounds: [3, 1.05, 5, 1.95] },
    ],
    roomAccessTargets: [
      { id: 'office-access', bounds: [2, 1, 4, 2] },
      { id: 'bathroom-access', bounds: [2, well[3] + 0.05, 4, 7.5] },
      { id: 'bedroom-access', bounds: [5.05, 1.05, 5.8, 1.95] },
      { id: 'study-south-access', bounds: [3, well[3] + 0.05, 4.9, 7.5] },
    ],
  },
  shell: { features: [
    { wall: 'north', at: 1.45, kind: 'window' },
    { wall: 'north', at: 6.5, kind: 'window' },
    { wall: 'west', at: 1.5, kind: 'window' },
    { wall: 'west', at: 5.5, kind: 'window' },
  ] },
  floors: [
    { id: 'bedroom-floor', cells: [5, 0, 7, 7], material: 'wood', kind: 'interior' },
    { id: 'study-floor', cells: [3, 0, 4, 7], material: 'wood', kind: 'interior' },
    { id: 'office-floor', cells: [0, 0, 2, 2], material: 'wood', kind: 'interior' },
    { id: 'bathroom-floor', cells: [0, 3, 2, 7], material: 'tile', kind: 'interior' },
  ],
  walls: [
    { id: 'office-study-partition', from: [3, 0], to: [3, 3], height: 'half', openings: [{ at: 1.5, width: 1.2, kind: 'door' }] },
    { id: 'office-bathroom-partition', from: [0, 3], to: [3, 3], height: 'half' },
    { id: 'bathroom-study-partition', from: [3, 3], to: [3, 8], height: 'half', openings: [{ at: 7, width: 1.2, kind: 'door' }] },
    {
      id: 'study-bedroom-partition',
      from: [5, 0],
      to: [5, 8],
      height: 'half',
      openings: [
        { at: 1.5, width: 1.2, kind: 'door' },
        { at: 7, width: 1.2, kind: 'door' },
      ],
    },
    { id: 'stairwell-west-guard', from: [well[0] - 0.05, well[1] - 0.05], to: [well[0] - 0.05, well[3]], height: 'half', treatment: 'railing', freeEnds: ['to'] },
    { id: 'stairwell-east-guard', from: [well[2] + 0.05, well[1] - 0.05], to: [well[2] + 0.05, well[3]], height: 'half', treatment: 'railing', freeEnds: ['to'] },
    { id: 'stairwell-north-guard', from: [well[0] - 0.05, well[1] - 0.05], to: [well[2] + 0.05, well[1] - 0.05], height: 'half', treatment: 'railing' },
  ],
  furniture: [
    { id: 'bedroom-floor-lamp-east', model: 'lampRoundFloor', logic: 'lamp@6,7', at: [7.5, 6.5], facing: 'N' },
    // Quarto: cama de cabeceira na parede nascente; a passagem fica junto à divisória.
    { id: 'bedroom-bed', model: 'bedDouble', against: { wall: 'east', at: 4.0 }, facing: 'W' },
    { id: 'bedroom-clock-table-north', model: 'sideTable', at: [5.95, 3.5], facing: 'E' },
    { id: 'bedroom-clock-north', model: 'radio', logic: 'clock@3,5', on: { parent: 'bedroom-clock-table-north' } },
    { id: 'bedroom-floor-lamp-south', model: 'lampRoundFloor', logic: 'lamp@7,6', at: [6.5, 7.8], facing: 'N' },
    { id: 'bedroom-clock-table-south', model: 'sideTable', at: [5.5, 7.8] },
    { id: 'bedroom-clock-south', model: 'radio', logic: 'clock@7,5', on: { parent: 'bedroom-clock-table-south' } },
    { id: 'study-bookshelf', model: 'bookcaseOpenLow', logic: 'bookshelf@0,3', at: [4, 0.5], facing: 'E' },
    { id: 'study-bookshelf-books', model: 'books', on: { parent: 'study-bookshelf' } },
    { id: 'study-box', model: 'cardboardBoxClosed', logic: 'box@4,3', at: [3.5, 4] },
    { id: 'study-desk', model: 'desk', logic: 'desk@3,4', at: [4.5, 3.5], facing: 'S' },
    { id: 'study-desk-chair', model: 'chairDesk', at: [4.55, 4.05], facing: 'N' },

    { id: 'office-desk', model: 'desk', logic: 'desk@0,0', against: { wall: 'north', at: 0.75 } },
    { id: 'office-desk-chair', model: 'chairDesk', at: [0.75, 0.95], facing: 'N' },
    { id: 'office-chair', model: 'loungeChair', logic: 'chair@0,2', at: [2.45, 0.45], facing: 'S' },
    { id: 'bathroom-bathtub', model: 'bathtub', logic: 'bathtub@3,0', at: [1, 4.35], facing: 'E' },
    { id: 'bathroom-shower', model: 'showerRound', logic: 'shower@7,0', at: [0.5, 7.5], facing: 'S' },
    { id: 'bathroom-toilet', model: 'toilet', logic: 'toilet@7,1', at: [1.5, 7.5], facing: 'N' },
    { id: 'bathroom-sink', model: 'bathroomSink', against: { wall: 'west', at: 5.8 }, facing: 'E' },
    { id: 'bedroom-carol-rug', model: 'rugRectangle', logic: 'rug@0,5', at: [6, 1], facing: 'E' },
  ],
}