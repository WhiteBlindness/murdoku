import type { SceneSpec } from '../schema'
import { aStoryRehearsedStairwellBounds } from './a-story-rehearsed-ground'

export const aStoryRehearsedUpper: SceneSpec = {
  puzzleId: 'hard-10',
  floor: 1,
  storeyFootprint: { kind: 'full' },
  stairwellBounds: aStoryRehearsedStairwellBounds,
  circulation: {
    landing: [0.50625, 2.610625, 1.56, 3.360625],
    halls: [
      { id: 'west-stair-gallery', bounds: [1.56, 2.610625, 2.4375, 4.75] },
      { id: 'bathroom-south-passage', bounds: [2.3, 3.85, 5.65, 4.75] },
      { id: 'east-bedroom-bypass', bounds: [4, 4.5, 4.95, 5.4] },
      { id: 'south-kitchen-gallery', bounds: [2, 5.4, 4.95, 6.15] },
    ],
    roomAccessTargets: [
      { id: 'study-door', bounds: [1.56, 1.20, 2.31, 2.610625] },
      { id: 'bathroom-approach', bounds: [4.75, 3.85, 5.65, 4.35] },
      { id: 'kitchen-entry', bounds: [1.56, 5.4, 2.31, 6.15] },
      { id: 'bedroom-entry', bounds: [4.15, 4.45, 5.2, 5.2] },
    ],
  },
  shell: { features: [
    { wall: 'north', at: 1.5, kind: 'window' },
    { wall: 'north', at: 6.3, kind: 'window' },
    { wall: 'west', at: 4.4, kind: 'window' },
  ] },
  floors: [
    { id: 'study', cells: [0, 0, 7, 1], material: 'wood', kind: 'interior' },
    { id: 'bathroom', cells: [0, 2, 7, 3], material: 'tile', kind: 'interior' },
    { id: 'kitchen', cells: [0, 4, 2, 7], material: 'tile', kind: 'interior' },
    { id: 'bedroom', cells: [3, 4, 7, 7], material: 'wood', kind: 'interior' },
  ],
  walls: [
    { id: 'study-bathroom', from: [0, 2], to: [8, 2], height: 'half', openings: [{ at: 1.9, width: 1.3, kind: 'door' }] },
    { id: 'bathroom-west-screen', from: [2.4375, 2], to: [2.4375, 3.75], height: 'half', freeEnds: ['to'] },
    { id: 'bathroom-south-screen', from: [2.4375, 3.75], to: [8, 3.75], height: 'half', openings: [{ at: 5.2, width: 0.9, kind: 'door' }, { at: 7.25, kind: 'door' }] },
    // A separate WC, opening into the bedroom, so the second toilet is an en-suite rather than a fixture in the bath.
    { id: 'en-suite-wc', from: [6.6, 2], to: [6.6, 3.75], height: 'half' },
    { id: 'kitchen-west-screen', from: [0, 4], to: [0.42, 4], height: 'half', freeEnds: ['to'] },
    { id: 'bedroom-west-screen', from: [3, 6.45], to: [3, 8], height: 'half', freeEnds: ['from'] },
    { id: 'stairwell-west-guard', from: [0.50625, 3.45], to: [0.50625, 5.639375], height: 'half', treatment: 'railing', freeEnds: ['from', 'to'] },
    { id: 'stairwell-east-guard', from: [1.49375, 3.45], to: [1.49375, 5.639375], height: 'half', treatment: 'railing', freeEnds: ['from', 'to'] },
    { id: 'stairwell-south-guard', from: [0.50625, 5.639375], to: [1.49375, 5.639375], height: 'half', treatment: 'railing' },
  ],
  furniture: [
    { id: 'study-bookcase', model: 'bookcaseOpen', logic: 'bookshelf@0,3', at: [4.0, 0.5], facing: 'S' },
    { id: 'study-desk', model: 'desk', logic: 'desk@0,5', at: [5.5, 0.5], facing: 'S' },
    { id: 'study-box', model: 'cardboardBoxClosed', logic: 'box@1,0', at: [0.5, 1.5] },

    { id: 'bathroom-toilet-east', model: 'toilet', logic: 'toilet@2,7', at: [7.5, 2.4], facing: 'S' },
    { id: 'bathroom-shower', model: 'showerRound', logic: 'shower@2,3', at: [3.5, 2.4], facing: 'S' },
    { id: 'bathroom-bathtub', model: 'bathtub', logic: 'bathtub@3,1', at: [3.25, 3.275], facing: 'N' },
    { id: 'bathroom-toilet-west', model: 'toilet', logic: 'toilet@2,2', at: [2.9, 2.4], facing: 'S' },

    { id: 'kitchen-fridge', model: 'kitchenFridge', logic: 'fridge@4,1', at: [1.9, 5.0], facing: 'S' },
    { id: 'kitchen-stove', model: 'kitchenStove', logic: 'stove@5,0', against: { wall: 'west', at: 6.1 } },
    { id: 'kitchen-sink', model: 'kitchenSink', against: { wall: 'west', at: 6.75 } },
    { id: 'kitchen-cabinet', model: 'kitchenCabinet', against: { wall: 'west', at: 7.35 } },

    { id: 'bedroom-bed', model: 'bedDouble', logic: 'bed@6,3', against: { wall: 'bedroom-west-screen', side: 'E', at: 7.22 } },
    { id: 'bedroom-clock', model: 'speaker', logic: 'clock@5,3', at: [3.2, 5.0] },
    { id: 'bathroom-floor-lamp', model: 'lampRoundFloor', logic: 'lamp@4,3', at: [3.85, 4.95] },
    { id: 'bedroom-floor-lamp', model: 'lampRoundFloor', logic: 'lamp@6,7', at: [7.5, 6.5] },
  ],
}
