import type { SceneSpec } from '../schema'
import { theMissingHourStairwellBounds } from './the-missing-hour-ground'

const well = theMissingHourStairwellBounds
const partitionClearance = 0.2
const guardHeadInset = 0.15

export const theMissingHourUpper: SceneSpec = {
  puzzleId: 'hard-11',
  floor: 1,
  storeyFootprint: { kind: 'full' },
  stairwellBounds: well,
  circulation: {
    landing: [well[2], well[1], well[2] + 0.95, well[3]],
    halls: [
      { id: 'hallway-arrival-gallery', bounds: [well[2] + 0.75, well[1] + 0.05, 7.15, well[3] - 0.05] },
      { id: 'hallway-east-gallery', bounds: [7.15, 5.05, 7.9, 7.85] },
      { id: 'hallway-south-gallery', bounds: [5, 7.05, 7.9, 7.85] },
      { id: 'study-south-approach', bounds: [2.65, 6.85, 5, 7.85] },
      { id: 'study-west-gallery', bounds: [1.85, 4.05, 2.65, 7.85] },
      { id: 'study-north-gallery', bounds: [2.65, 4.05, 4.8, 4.8] },
      { id: 'bathroom-entry-gallery', bounds: [6, 4.75, 6.9, 5.95] },
    ],
    roomAccessTargets: [
      { id: 'bedroom-entry', bounds: [3, 3.45, 4.2, 4.55] },
      { id: 'bathroom-entry', bounds: [6, 3.5, 7, 4.75] },
      { id: 'study-entry', bounds: [4.2, 6.85, 5.8, 7.85] },
    ],
  },
  shell: { features: [
    { wall: 'north', at: 1.4, kind: 'window' },
    { wall: 'north', at: 6.55, kind: 'window' },
    { wall: 'west', at: 6.45, kind: 'window' },
  ] },
  floors: [
    { id: 'bedroom-floor', cells: [0, 0, 4, 3], material: 'wood', kind: 'interior' },
    { id: 'bathroom-floor', cells: [5, 0, 7, 3], material: 'tile', kind: 'interior' },
    { id: 'study-floor', cells: [0, 4, 4, 7], material: 'wood', kind: 'interior' },
    { id: 'hallway-floor', cells: [5, 4, 7, 7], material: 'wood', kind: 'interior' },
  ],
  walls: [
    { id: 'bedroom-study-partition', from: [0, 4], to: [5, 4], height: 'half', openings: [{ at: 3.6, width: 1.2, kind: 'door' }] },
    { id: 'bathroom-hallway-partition', from: [5, 4], to: [8, 4], height: 'half', openings: [{ at: 6.5, width: 1, kind: 'door' }] },
    { id: 'bedroom-bathroom-partition', from: [5, 0], to: [5, 4], height: 'half' },
    { id: 'study-hallway-south-partition', from: [5, well[3] + partitionClearance], to: [5, 8], height: 'half', freeEnds: ['from'], openings: [{ at: 7.35, width: 1, kind: 'door' }] },
    { id: 'stairwell-west-guard', from: [well[0], well[1]], to: [well[0], well[3]], height: 'half', treatment: 'railing', freeEnds: ['from', 'to'] },
    { id: 'stairwell-north-guard', from: [well[0], well[1]], to: [well[2] - guardHeadInset, well[1]], height: 'half', treatment: 'railing', freeEnds: ['from', 'to'] },
    { id: 'stairwell-south-guard', from: [well[0], well[3]], to: [well[2] - guardHeadInset, well[3]], height: 'half', treatment: 'railing', freeEnds: ['from', 'to'] },
  ],
  furniture: [
    { id: 'bedroom-bed', model: 'bedDouble', logic: 'bed@2,0', against: { wall: 'west', at: 3 }, facing: 'E' },
    { id: 'bedroom-lamp', model: 'lampRoundFloor', logic: 'lamp@3,4', at: [4.55, 3.35], facing: 'N' },
    { id: 'bedroom-clock-table', model: 'sideTable', at: [2.5, 0.5] },
    { id: 'bedroom-clock', model: 'radio', logic: 'clock@0,2', on: { parent: 'bedroom-clock-table' } },
    { id: 'bedroom-bella-lamp-table', model: 'sideTable', at: [1.5, 0.5] },
    { id: 'bedroom-bella-lamp', model: 'lampRoundTable', logic: 'lamp@0,1', on: { parent: 'bedroom-bella-lamp-table' } },

    { id: 'study-desk', model: 'desk', logic: 'desk@4,1', at: [1.55, 4.55], facing: 'W' },
    { id: 'study-desk-chair', model: 'chairDesk', at: [0.95, 4.55], facing: 'E' },
    { id: 'study-bookcase', model: 'bookcaseOpenLow', logic: 'bookshelf@6,4', against: { wall: 'study-hallway-south-partition', side: 'W', at: 6.5 }, facing: 'W' },
    { id: 'study-bookcase-books', model: 'books', on: { parent: 'study-bookcase' } },
    { id: 'study-lamp', model: 'lampRoundFloor', logic: 'lamp@6,0', at: [0.5, 6.5], facing: 'N' },
    { id: 'study-greta-box', model: 'cardboardBoxClosed', logic: 'box@7,0', at: [0.5, 7.5] },
    { id: 'study-storage-box', model: 'cardboardBoxClosed', logic: 'box@7,1', at: [1.5, 7.5] },

    { id: 'bathroom-shower', model: 'showerRound', logic: 'shower@1,7', at: [7.5, 1.5], facing: 'S' },
    { id: 'bathroom-bathtub', model: 'bathtub', logic: 'bathtub@2,5', at: [5.95, 2.65], facing: 'E' },
    { id: 'bathroom-toilet', model: 'toilet', against: { wall: 'north', at: 6.6 }, facing: 'S' },
    { id: 'bathroom-sink', model: 'bathroomSink', against: { wall: 'north', at: 7.45 }, facing: 'S' },

    { id: 'hallway-yuki-plant', model: 'pottedPlant', logic: 'plant@4,5', at: [5.5, 4.25] },
    { id: 'hallway-clock-table', model: 'sideTable', at: [5.85, 6.5] },
    { id: 'hallway-clock', model: 'radio', logic: 'clock@6,5', on: { parent: 'hallway-clock-table' } },
    { id: 'hallway-plant', model: 'pottedPlant', logic: 'plant@4,7', at: [7.5, 4.5] },
    { id: 'hallway-rug', model: 'rugRectangle', logic: 'rug@6,6', at: [7, 7.2], facing: 'S' },
  ],
}