import type { SceneSpec } from '../schema'
import { lockedPantryStairwellBounds } from './the-locked-pantry-ground'

export const theLockedPantryUpper: SceneSpec = {
  puzzleId: 'expert-3',
  floor: 1,
  storeyFootprint: { kind: 'full' },
  stairwellBounds: lockedPantryStairwellBounds,
  circulation: {
    landing: [
      lockedPantryStairwellBounds[0],
      lockedPantryStairwellBounds[3],
      lockedPantryStairwellBounds[2],
      lockedPantryStairwellBounds[3] + 0.95,
    ],
    halls: [
      { id: 'study-south-cross', bounds: [3.1, 4.05, 7.8, 4.95] },
      { id: 'bathroom-link', bounds: [3.1, 2.8, 3.9, 4.9] },
      { id: 'office-bedroom-spine', bounds: [7.0, 2.8, 7.8, 5.8] },
    ],
    roomAccessTargets: [
      { id: 'bathroom-entry', bounds: [3.1, 2.4, 3.9, 3.7] },
      { id: 'office-entry', bounds: [7.0, 2.4, 7.8, 3.7] },
      { id: 'bedroom-entry', bounds: [7.0, 5.0, 7.8, 5.75] },
    ],
  },
  shell: { features: [
    { wall: 'north', at: 1.5, kind: 'window' },
    { wall: 'north', at: 6.5, kind: 'window' },
    { wall: 'west', at: 1.5, kind: 'window' },
  ] },
  floors: [
    { id: 'bathroom', cells: [0, 0, 3, 2], material: 'tile' },
    { id: 'office', cells: [4, 0, 7, 2], material: 'wood' },
    { id: 'study', cells: [0, 3, 7, 4], material: 'wood' },
    { id: 'bedroom', cells: [0, 5, 7, 7], material: 'wood' },
  ],
  walls: [
    { id: 'bathroom-office', from: [4, 0], to: [4, 3], height: 'half' },
    { id: 'bathroom-study-door-wall', from: [0, 3], to: [lockedPantryStairwellBounds[0] - 0.1, 3], height: 'half', freeEnds: ['to'], openings: [{ at: 3.5, width: 1.0, kind: 'door' }] },
    { id: 'office-study-door-wall', from: [lockedPantryStairwellBounds[2] + 0.1, 3], to: [8, 3], height: 'half', freeEnds: ['from'], openings: [{ at: 7.5, width: 1.0, kind: 'door' }] },
    { id: 'study-bedroom', from: [0, 5], to: [8, 5], height: 'half', openings: [{ at: 7.4, width: 1.0, kind: 'door' }] },
    { id: 'stairwell-west-guard', from: [lockedPantryStairwellBounds[0], lockedPantryStairwellBounds[1]], to: [lockedPantryStairwellBounds[0], lockedPantryStairwellBounds[3] - 0.15], height: 'half', treatment: 'railing', freeEnds: ['to'] },
    { id: 'stairwell-east-guard', from: [lockedPantryStairwellBounds[2], lockedPantryStairwellBounds[1]], to: [lockedPantryStairwellBounds[2], lockedPantryStairwellBounds[3] - 0.15], height: 'half', treatment: 'railing', freeEnds: ['to'] },
    { id: 'stairwell-north-guard', from: [lockedPantryStairwellBounds[0], lockedPantryStairwellBounds[1]], to: [lockedPantryStairwellBounds[2], lockedPantryStairwellBounds[1]], height: 'half', treatment: 'railing' },
  ],
  furniture: [
    { id: 'study-bookshelf-west', model: 'bookcaseOpen', logic: 'bookshelf@3,0', against: { wall: 'west', at: 3.5 }, facing: 'E' },
    { id: 'study-bookshelf-books', model: 'books', on: { parent: 'study-bookshelf-west', surface: 'shelf2' } },
    { id: 'study-desk', model: 'desk', logic: 'desk@3,2', at: [1.8, 3.8], facing: 'N' },
    { id: 'study-chair', model: 'chair', at: [1.8, 3.25], facing: 'S' },
    { id: 'study-box', model: 'cardboardBoxClosed', logic: 'box@4,1', at: [1.5, 4.5] },
    { id: 'study-lamp-west', model: 'lampRoundFloor', logic: 'lamp@4,0', at: [0.5, 4.5] },

    { id: 'bathroom-bathtub', model: 'bathtub', logic: 'bathtub@0,0', at: [1.1, 0.7], facing: 'N' },
    { id: 'bathroom-toilet-east', model: 'toilet', logic: 'toilet@2,3', against: { wall: 'bathroom-office', side: 'W', at: 2.15 }, facing: 'W' },
    { id: 'bathroom-sink', model: 'bathroomSink', against: { wall: 'west', at: 2.4 }, facing: 'E' },

    { id: 'office-clock-west', model: 'speaker', logic: 'clock@0,5', at: [5.5, 0.55] },
    { id: 'office-chair', model: 'chair', logic: 'chair@0,6', at: [6.9, 0.85], facing: 'E' },
    { id: 'office-desk-east', model: 'desk', logic: 'desk@0,7', at: [7.3, 0.85], facing: 'W' },

    { id: 'bedroom-lamp-north', model: 'lampRoundFloor', logic: 'lamp@5,5', at: [5.5, 5.5] },
    { id: 'bedroom-clock-north', model: 'speaker', logic: 'clock@5,6', at: [6.5, 5.9] },
    { id: 'bedroom-bed-west', model: 'bedDouble', against: { wall: 'west', at: 6.5 }, facing: 'E' },
    { id: 'bedroom-nightstand-north', model: 'sideTable', at: [0.3, 5.5], facing: 'E' },
    { id: 'bedroom-nightstand-south', model: 'sideTable', at: [0.3, 7.5], facing: 'E' },
    { id: 'bedroom-reading-chair', model: 'loungeChair', at: [5.0, 7.45], facing: 'N' },
    { id: 'bedroom-lamp-southwest', model: 'lampRoundFloor', logic: 'lamp@7,4', at: [4.5, 7.5] },
    { id: 'bedroom-lamp-south', model: 'lampRoundFloor', logic: 'lamp@7,5', at: [5.5, 7.5] },
    { id: 'bedroom-clock-east', model: 'speaker', logic: 'clock@7,7', at: [7.5, 7.5] },
  ],
}
