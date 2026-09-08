import type { SceneSpec } from '../schema'
import { MODEL_BOUNDS } from '../catalog.generated'
import { CELL } from '../units'

// The north flight arrives at the upper study's clear entrance gallery.
// Its head meets the column-5 slab edge; the hall stays clear below.
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
    { id: 'spine', from: [3.9, 1.25], to: [3.9, 8], openings: [
      { at: 2.5, kind: 'door' },
      { at: 4.05, width: 1, kind: 'open' },
    ], freeEnds: ['from'] },
    { id: 'ground-west', from: [0, 4], to: [3.9, 4], openings: [{ at: 2.8, width: 1.4, kind: 'open' }] },
    { id: 'ground-east', from: [3.9, 4], to: [8, 4], height: 'half', openings: [{ at: 4.7, width: 1.6, kind: 'open' }, { at: 6.7, width: 1.3, kind: 'open' }], freeEnds: ['from'] },
    { id: 'kitchen-service', from: [4.2, 1.2], to: [6, 1.2], height: 'half', freeEnds: ['from', 'to'] },
  ],
  stairs: { model: 'stairsOpen', at: [5 - MODEL_BOUNDS.stairsOpen.size[0] / (2 * CELL), 0.6], facing: 'E' },
  floors: [{ id: 'kitchen-tile', cells: [4, 0, 7, 3], material: 'tile' }],
  furniture: [
    { id: 'hall-bookcase', model: 'bookcaseOpenLow', logic: 'bookshelf@1,0', against: { wall: 'west', at: 1.5 } },
    { id: 'hall-console', model: 'sideTable', logic: 'clock@3,4', at: [4.95, 3.08] },
    { id: 'hall-clock', model: 'radio', logic: 'clock@3,4', on: { parent: 'hall-console' } },
    { id: 'kitchen-counter', model: 'kitchenCabinet', logic: 'counter@1,4', against: { wall: 'kitchen-service', at: 4.55, side: 'S' } },
    { id: 'kitchen-sink', model: 'kitchenSink', logic: 'counter@1,4', against: { wall: 'kitchen-service', at: 5.2, side: 'S' } },
    { id: 'coffee-machine', model: 'kitchenCoffeeMachine', on: { parent: 'kitchen-counter' } },
    { id: 'kitchen-stove', model: 'kitchenStove', logic: 'stove@0,6', against: { wall: 'north', at: 6.5 } },
    { id: 'kitchen-fridge', model: 'kitchenFridge', logic: 'fridge@2,7', at: [7.5, 2.5], facing: 'S' },
    { id: 'dining-table', model: 'table', logic: 'table@6,1', at: [2.0, 6.8], facing: 'E' },
    { id: 'dining-chair', model: 'chair', logic: 'chair@7,1', at: [1.5, 7.45], facing: 'N' },
    { id: 'dining-chair-opposite', model: 'chair', at: [2.0, 6.05], facing: 'S' },
    { id: 'dining-lamp', model: 'lampRoundFloor', logic: 'lamp@7,3', at: [3.5, 7.4] },
    { id: 'conservatory-plant', model: 'pottedPlant', logic: 'plant@5,5', at: [5.5, 5.5] },
    { id: 'conservatory-chair', model: 'loungeChair', logic: 'chair@6,6', at: [6.5, 6.5], facing: 'W' },
    { id: 'conservatory-table', model: 'tableCoffeeSquare', at: [5.65, 6.5] },
    { id: 'hall-coat-stand', model: 'coatRackStanding', at: [2.7, 3.25] },
  ],
  rugs: [
    { id: 'entry-mat', model: 'rugDoormat', at: [0.45, 0.5], facing: 'E' },
    { id: 'dining-rug', model: 'rugRectangle', at: [2.0, 6.8], facing: 'E' },
  ],
}
