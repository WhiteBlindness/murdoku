import type { SceneSpec } from '../schema'

// Ground floor of the production reference case. The staircase crosses an
// intentional opening in the central spine; its lower and upper landings are
// kept clear by the paired-storey validator.
export const twoStoreyReferenceGround: SceneSpec = {
  puzzleId: 'hard-1',
  floor: 0,
  entry: { wall: 'west', at: 0.5 },
  shell: {
    features: [
      { wall: 'north', at: 1.5, kind: 'window' },
      { wall: 'north', at: 5.5, kind: 'window' },
      { wall: 'west', at: 2.5, kind: 'window' },
    ],
  },
  walls: [
    { id: 'spine', from: [4, 1.2], to: [4, 8], openings: [
      { at: 2.5, kind: 'door' },
      { at: 6.0, kind: 'door' },
    ], freeEnds: ['from'] },
    { id: 'ground-west', from: [0, 4], to: [4, 4], openings: [{ at: 1.5, kind: 'door' }] },
    { id: 'ground-east', from: [4, 4], to: [8, 4], openings: [{ at: 6.5, kind: 'door' }] },
  ],
  stairs: { model: 'stairsOpen', at: [2.5, 0.6], facing: 'E' },
  furniture: [
    { id: 'hall-bookcase', model: 'bookcaseOpenLow', logic: 'bookshelf@1,0', against: { wall: 'west', at: 1.5 } },
    { id: 'hall-console', model: 'sideTable', logic: 'clock@3,4', against: { wall: 'spine', side: 'E', at: 3.25 } },
    { id: 'hall-clock', model: 'radio', logic: 'clock@3,4', on: { parent: 'hall-console' } },
    { id: 'kitchen-counter', model: 'kitchenCabinet', logic: 'counter@1,4', at: [4.45, 1.5] },
    { id: 'kitchen-sink', model: 'kitchenSink', logic: 'counter@1,4', at: [5.05, 1.5] },
    { id: 'kitchen-stove', model: 'kitchenStove', logic: 'stove@0,6', against: { wall: 'north', at: 6.5 } },
    { id: 'kitchen-fridge', model: 'kitchenFridge', logic: 'fridge@2,7', at: [7.5, 2.5], facing: 'S' },
    { id: 'dining-table', model: 'table', logic: 'table@6,1', at: [2.0, 6.8], facing: 'E' },
    { id: 'dining-chair', model: 'chair', logic: 'chair@7,1', at: [1.5, 7.45], facing: 'N' },
    { id: 'dining-lamp', model: 'lampRoundFloor', logic: 'lamp@7,3', at: [3.5, 7.4] },
    { id: 'conservatory-plant', model: 'pottedPlant', logic: 'plant@5,5', at: [5.5, 5.5] },
    { id: 'conservatory-chair', model: 'loungeChair', logic: 'chair@6,6', at: [6.5, 6.5], facing: 'W' },
  ],
  rugs: [
    { id: 'entry-mat', model: 'rugDoormat', at: [0.4, 5.5], facing: 'E' },
    { id: 'dining-rug', model: 'rugRectangle', at: [2.0, 6.8], facing: 'E' },
  ],
}
