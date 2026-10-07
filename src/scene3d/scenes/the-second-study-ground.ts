import type { SceneSpec } from '../schema'
import { MODEL_BOUNDS } from '../catalog.generated'
import { CELL } from '../units'

const stairAt: [number, number] = [3.2, 3.7]
const stairHalfRun = MODEL_BOUNDS.stairsOpen.size[0] / (2 * CELL)
const stairHalfWidth = MODEL_BOUNDS.stairsOpen.size[2] / (2 * CELL)

export const theSecondStudyStairwellBounds: [number, number, number, number] = [
  stairAt[0] - stairHalfRun,
  stairAt[1] - stairHalfWidth,
  stairAt[0] + stairHalfRun,
  stairAt[1] + stairHalfWidth,
]

export const theSecondStudyGround: SceneSpec = {
  puzzleId: 'expert-7',
  floor: 0,
  storeyFootprint: { kind: 'full' },
  entry: { wall: 'west', at: 4.5 },
  shell: {
    features: [
      { wall: 'north', at: 1.5, kind: 'window' },
      { wall: 'west', at: 1.4, kind: 'window' },
    ],
  },
  stairs: { model: 'stairsOpen', at: stairAt, facing: 'E' },
  exteriorSupportBays: [
    { id: 'garden-west-frame', cells: [4, 0, 6, 2] },
    { id: 'garden-east-frame', cells: [7, 0, 7, 2] },
  ],
  floors: [
    { id: 'office-wood', cells: [0, 0, 3, 2], material: 'wood' },
    { id: 'garden-grass', cells: [4, 0, 7, 2], material: 'grass', kind: 'exterior' },
    { id: 'dining-wood', cells: [0, 3, 7, 5], material: 'wood' },
    { id: 'hallway-wood', cells: [0, 6, 7, 7], material: 'wood' },
  ],
  walls: [
    {
      id: 'office-dining',
      from: [0, 3],
      to: [4, 3],
      height: 'cutaway',
      openings: [{ at: 0.8, width: 1.2, kind: 'door' }],
    },
    {
      id: 'office-garden-facade',
      from: [4, 0],
      to: [4, 3],
      height: 'cutaway',
      openings: [{ at: 1.0, width: 1.2, kind: 'open' }],
    },
    {
      id: 'garden-dining-threshold',
      from: [4, 3],
      to: [8, 3],
      height: 'half',
      openings: [{ at: 5.5, width: 0.9, kind: 'open' }],
    },
    {
      id: 'dining-hallway',
      from: [0, 6],
      to: [8, 6],
      height: 'cutaway',
      openings: [{ at: 4.2, width: 1.2, kind: 'door' }],
    },
  ],
  furniture: [
    // Sala de jantar com duas mesas e as respetivas cadeiras.
    { id: 'dining-east-table', model: 'table', logic: 'table@3,6', at: [7.0, 3.55], facing: 'N' },
    { id: 'dining-east-chair', model: 'chair', logic: 'chair@4,7', at: [7.5, 4.4], facing: 'N' },
    { id: 'dining-east-chair-b', model: 'chair', at: [6.75, 4.4], facing: 'N' },
    { id: 'victim-lamp', model: 'lampRoundFloor', logic: 'lamp@4,4', at: [4.5, 4.5], facing: 'S' },
    { id: 'dining-rug', model: 'rugRectangle', logic: 'rug@3,0', at: [0.7, 4], facing: 'E' },
    { id: 'dining-west-table', model: 'table', logic: 'table@5,5', at: [6, 5.45], facing: 'S' },
    { id: 'dining-west-chair-a', model: 'chair', at: [5.7, 4.85], facing: 'S' },
    { id: 'dining-west-chair-b', model: 'chair', at: [6.3, 4.85], facing: 'S' },
    { id: 'dining-west-lamp', model: 'lampRoundFloor', logic: 'lamp@5,0', at: [0.5, 5.5], facing: 'S' },
    // Corredor: relógios de mesa sobre mesas de apoio.
    { id: 'hallway-clock-north-table', model: 'sideTable', at: [5.5, 6.35] },
    { id: 'hallway-clock-north', model: 'radio', logic: 'clock@6,5', on: { parent: 'hallway-clock-north-table' } },
    { id: 'evangeline-plant', model: 'flower_redA', logic: 'plant@6,2', at: [2.5, 6.5], facing: 'S' },
    { id: 'hallway-clock-south-table', model: 'sideTable', at: [6.5, 7.65] },
    { id: 'hallway-clock-south', model: 'radio', logic: 'clock@7,6', on: { parent: 'hallway-clock-south-table' } },
    // Escritório: duas secretárias em L, cada uma com a sua cadeira.
    { id: 'office-bookcase', model: 'bookcaseOpenLow', logic: 'bookshelf@0,2', against: { wall: 'north', at: 3 } },
    { id: 'office-bookcase-books', model: 'books', on: { parent: 'office-bookcase' } },
    { id: 'viraj-desk', model: 'desk', logic: 'desk@1,3', at: [2.7, 1.3], facing: 'S' },
    { id: 'viraj-desk-chair', model: 'chairDesk', at: [2.7, 1.85], facing: 'N' },
    { id: 'office-desk-south', model: 'desk', logic: 'desk@2,3', at: [3.25, 2.5], facing: 'E' },
    { id: 'office-desk-south-chair', model: 'chairDesk', at: [3.75, 2.5], facing: 'W' },
    { id: 'office-entry-chair', model: 'loungeChair', logic: 'chair@0,0', at: [0.5, 0.55], facing: 'E' },
    { id: 'garden-shrub-east', model: 'plant_bushSmall', logic: 'shrub@1,7', at: [7.5, 1.5], facing: 'S' },
    { id: 'garden-plant-west', model: 'pottedPlant', logic: 'plant@0,4', at: [4.95, 0.5], facing: 'S' },
    { id: 'garden-shrub-west', model: 'plant_bushSmall', logic: 'shrub@0,5', at: [5.5, 0.5], facing: 'S' },
  ],
}
