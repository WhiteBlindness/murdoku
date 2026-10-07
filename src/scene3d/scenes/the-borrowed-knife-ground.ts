import type { SceneSpec } from '../schema'
import { MODEL_BOUNDS } from '../catalog.generated'
import { CELL } from '../units'

const stairAt: [number, number] = [1.5, 5]
const stairRun = MODEL_BOUNDS.stairsOpen.size[0] / CELL
const stairWidth = MODEL_BOUNDS.stairsOpen.size[2] / CELL

export const theBorrowedKnifeStairwellBounds: [number, number, number, number] = [
  stairAt[0] - stairWidth / 2,
  stairAt[1] - stairRun / 2,
  stairAt[0] + stairWidth / 2,
  stairAt[1] + stairRun / 2,
]

export const theBorrowedKnifeGround: SceneSpec = {
  puzzleId: 'expert-5',
  floor: 0,
  storeyFootprint: { kind: 'full' },
  entry: { wall: 'west', at: 5.5 },
  shell: {
    features: [
      { wall: 'north', at: 1.3, kind: 'window' },
      { wall: 'north', at: 5.1, kind: 'window' },
      { wall: 'west', at: 1.4, kind: 'window' },
    ],
  },
  stairs: { model: 'stairsOpen', at: stairAt, facing: 'N' },
  exteriorSupportBays: [
    { id: 'front-yard-west-bay', cells: [3, 3, 5, 5] },
    { id: 'front-yard-east-bay', cells: [6, 3, 7, 5] },
  ],
  floors: [
    { id: 'living-room', cells: [0, 0, 7, 2], material: 'wood', kind: 'interior' },
    { id: 'office', cells: [0, 3, 2, 7], material: 'wood', kind: 'interior' },
    { id: 'front-yard', cells: [3, 3, 7, 5], material: 'grass', kind: 'exterior' },
    { id: 'hallway', cells: [3, 6, 7, 7], material: 'tile', kind: 'interior' },
  ],
  walls: [
    {
      id: 'living-office-divider',
      from: [0, 3],
      to: [3, 3],
      height: 'half',
      openings: [{ at: 0.75, width: 1, kind: 'open' }],
    },
    {
      id: 'living-yard-facade',
      from: [3, 3],
      to: [8, 3],
      height: 'half',
      openings: [{ at: 5.5, width: 1.6, kind: 'open' }],
      freeEnds: ['to'],
    },
    {
      id: 'office-yard-facade',
      from: [3, 3],
      to: [3, 6],
      height: 'half',
      openings: [{ at: 5.55, width: 0.9, kind: 'open' }],
    },
    {
      id: 'office-hallway-divider',
      from: [3, 6],
      to: [3, 8],
      height: 'half',
      openings: [{ at: 7, width: 1.2, kind: 'open' }],
    },
    {
      id: 'yard-hallway-facade',
      from: [3, 6],
      to: [8, 6],
      height: 'half',
      openings: [{ at: 4, width: 1.2, kind: 'open' }],
    },
  ],
  furniture: [
    { id: 'living-clock', model: 'speaker', logic: 'clock@0,3', at: [3.5, 0.5] },
    { id: 'living-tv-west', model: 'cabinetTelevision', logic: 'tv@0,2', against: { wall: 'north', at: 2.5 } },
    { id: 'living-tv-west-set', model: 'televisionModern', on: { parent: 'living-tv-west' } },
    { id: 'living-coffee-table', model: 'tableCoffeeSquare', at: [1.75, 1.75] },
    { id: 'living-armchair', model: 'loungeChair', at: [2.8, 1.9], facing: 'W' },
    { id: 'living-sofa', model: 'loungeSofaLong', logic: 'sofa@1,0', at: [0.7, 1.75], facing: 'E' },
    { id: 'living-rug', model: 'rugRectangle', logic: 'rug@0,4', at: [5, 1], facing: 'E' },
    { id: 'living-tv-east', model: 'cabinetTelevision', logic: 'tv@0,7', against: { wall: 'north', at: 7 } },
    { id: 'living-tv-east-set', model: 'televisionVintage', on: { parent: 'living-tv-east' } },
    { id: 'living-sofa-east', model: 'loungeSofa', at: [6.95, 2.1], facing: 'N' },

    // Escritório: secretária contra a divisória da sala, cadeira à frente e estante na parede do pátio.
    { id: 'office-desk', model: 'desk', logic: 'desk@3,2', against: { wall: 'living-office-divider', side: 'S', at: 2.5 }, facing: 'S' },
    { id: 'office-desk-chair', model: 'chairDesk', at: [2.45, 4.12], facing: 'N' },
    { id: 'office-chair', model: 'chair', logic: 'chair@7,1', at: [1.3, 7.55], facing: 'E' },
    { id: 'office-bookshelf', model: 'bookcaseOpenLow', logic: 'bookshelf@4,2', against: { wall: 'office-yard-facade', side: 'W', at: 4.75 }, facing: 'W' },
    { id: 'office-bookshelf-books', model: 'books', on: { parent: 'office-bookshelf' } },

    { id: 'yard-plant-west', model: 'flower_yellowA', logic: 'plant@5,6', at: [6.5, 5.5] },
    { id: 'yard-shrub-east-north', model: 'plant_bushSmall', logic: 'shrub@3,7', at: [7.5, 3.5] },
    { id: 'yard-shrub-west-north', model: 'plant_bushSmall', logic: 'shrub@3,3', at: [3.7, 3.5] },
    { id: 'yard-plant-east', model: 'flower_redA', logic: 'plant@5,7', at: [7.5, 5.5] },
    { id: 'hallway-clock-west', model: 'speaker', logic: 'clock@7,5', at: [5.5, 7.5] },
    { id: 'hallway-plant', model: 'flower_purpleA', logic: 'plant@7,6', at: [6.5, 7.5] },
    { id: 'yard-shrub-clue', model: 'plant_bushSmall', logic: 'shrub@5,5', at: [5.5, 5.5] },
    { id: 'hallway-clock-east', model: 'speaker', logic: 'clock@7,7', at: [7.5, 7.5] },
  ],
}
