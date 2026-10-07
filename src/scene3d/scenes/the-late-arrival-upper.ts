import type { SceneSpec } from '../schema'
import { MODEL_BOUNDS } from '../catalog.generated'
import { CELL } from '../units'

const stairAt: [number, number] = [4.55, 3.5]
const halfRun = MODEL_BOUNDS.stairsOpen.size[0] / (2 * CELL)
const halfWidth = MODEL_BOUNDS.stairsOpen.size[2] / (2 * CELL)
const well: [number, number, number, number] = [
  stairAt[0] - halfWidth,
  stairAt[1] - halfRun,
  stairAt[0] + halfWidth,
  stairAt[1] + halfRun,
]

// O estudo serve de galeria seca entre o quarto, a casa de banho e a sala.
export const theLateArrivalUpper: SceneSpec = {
  puzzleId: 'hard-9',
  floor: 1,
  storeyFootprint: { kind: 'full' },
  stairwellBounds: well,
  circulation: {
    landing: [well[0], well[3], well[2], 5.65],
    halls: [
      { id: 'west-bedroom-branch', bounds: [3.05, 4.9, well[0], 5.75] },
      { id: 'east-landing-connector', bounds: [well[2], well[3], 6.05, 5.9] },
      { id: 'east-north-gallery', bounds: [5.1, 1.25, 6.05, well[3]] },
    ],
    roomAccessTargets: [
      { id: 'study-arrival', bounds: [3.1, 4.9, 4.0, 5.7] },
      { id: 'bedroom-door', bounds: [2.3, 5.0, 3.05, 5.75] },
      { id: 'bathroom-door', bounds: [5.3, 1.25, 6.8, 2.0] },
      { id: 'living-room-door', bounds: [6.05, 4.64, 6.4, 5.9] },
    ],
  },
  shell: { features: [
    { wall: 'north', at: 1.4, kind: 'window' },
    { wall: 'north', at: 6.5, kind: 'window' },
    { wall: 'west', at: 6.4, kind: 'window' },
  ] },
  floors: [
    { id: 'bedroom-wood', cells: [0, 0, 2, 7], material: 'wood' },
    { id: 'study-wood', cells: [3, 0, 4, 7], material: 'wood' },
    { id: 'bathroom-tile', cells: [5, 0, 7, 3], material: 'tile' },
    { id: 'living-wood', cells: [5, 4, 7, 7], material: 'wood' },
  ],
  walls: [
    { id: 'bedroom-study', from: [3, 0], to: [3, 8], height: 'half', openings: [
      { at: 3.5, width: 1.2, kind: 'door' },
      { at: 5.5, width: 1.2, kind: 'door' },
    ] },
    { id: 'study-service-wing', from: [6.1, 0], to: [6.1, 4], height: 'half', openings: [
      { at: 1.5, width: 1.2, kind: 'door' },
    ] },
    { id: 'bathroom-living', from: [6.1, 4], to: [8, 4], height: 'half', openings: [] },
    { id: 'stairwell-west-guard', from: [well[0], well[1]], to: [well[0], well[3] - 0.12], height: 'half', treatment: 'railing', freeEnds: ['from', 'to'] },
    { id: 'stairwell-east-guard', from: [well[2], well[1]], to: [well[2], well[3] - 0.12], height: 'half', treatment: 'railing', freeEnds: ['from', 'to'] },
    { id: 'stairwell-north-guard', from: [well[0], well[1]], to: [well[2], well[1]], height: 'half', treatment: 'railing', freeEnds: ['from', 'to'] },
  ],
  furniture: [
    { id: 'bedroom-bed', model: 'bedDouble', logic: 'bed@0,0', against: { wall: 'north', at: 1 } },
    { id: 'bedroom-nightstand', model: 'sideTable', at: [2.05, 0.3], facing: 'S' },
    { id: 'bedroom-lamp-south-west', model: 'lampRoundFloor', logic: 'lamp@7,1', at: [1.5, 7.5] },
    { id: 'bedroom-clock-south-table', model: 'sideTable', at: [0.5, 7.5] },
    { id: 'bedroom-clock-south', model: 'radio', logic: 'clock@7,0', on: { parent: 'bedroom-clock-south-table' } },
    { id: 'bedroom-clock-east-table', model: 'sideTable', at: [0.5, 4.5] },
    { id: 'bedroom-clock-east', model: 'radio', logic: 'clock@4,0', on: { parent: 'bedroom-clock-east-table' } },
    { id: 'bedroom-lamp-south-east', model: 'lampRoundFloor', logic: 'lamp@7,2', at: [2.5, 7.5] },

    { id: 'study-box', model: 'cardboardBoxClosed', logic: 'box@0,4', at: [4.5, 0.5] },
    // As duas secretárias formam um posto de trabalho em L com uma só cadeira.
    { id: 'study-desk-viraj', model: 'desk', logic: 'desk@1,4', at: [4.75, 1.25], facing: 'W' },
    { id: 'study-desk-second', model: 'desk', logic: 'desk@2,4', at: [4.5, 2.0], facing: 'N' },
    { id: 'study-chair', model: 'chairDesk', at: [4.25, 1.45], facing: 'E' },
    { id: 'study-bookshelf', model: 'bookcaseOpenLow', logic: 'bookshelf@6,3', at: [3.3, 7.3], facing: 'E' },
    { id: 'study-bookshelf-north', model: 'bookcaseOpenLow', logic: 'bookshelf@6,3', at: [3.3, 6.65], facing: 'E' },
    { id: 'study-bookshelf-books', model: 'books', on: { parent: 'study-bookshelf' } },
    { id: 'study-lamp', model: 'lampRoundFloor', logic: 'lamp@4,3', at: [3.25, 4.2] },

    { id: 'bathroom-tub', model: 'bathtub', logic: 'bathtub@3,5', at: [7.0, 3.25], facing: 'N' },
    { id: 'bathroom-shower', model: 'showerRound', logic: 'shower@1,7', at: [7.5, 1.5], facing: 'S' },
    { id: 'bathroom-toilet', model: 'toilet', logic: 'toilet@0,6', against: { wall: 'north', at: 6.6 }, facing: 'S' },
    { id: 'bathroom-sink', model: 'bathroomSink', against: { wall: 'north', at: 7.45 }, facing: 'S' },

    // Sala aberta para o patamar: o sofá encara o televisor principal; um segundo aparelho fica numa mesa de apoio.
    { id: 'living-tv-stand', model: 'cabinetTelevision', at: [5.35, 6.5], facing: 'E' },
    { id: 'living-tv-south-west', model: 'televisionModern', logic: 'tv@6,5', on: { parent: 'living-tv-stand' } },
    { id: 'living-side-table', model: 'tableCoffeeSquare', at: [6.72, 5.5] },
    { id: 'living-tv-north-east', model: 'televisionVintage', logic: 'tv@5,6', on: { parent: 'living-side-table' } },
    { id: 'living-sofa', model: 'loungeSofa', logic: 'sofa@5,7', at: [7.5, 6], facing: 'W' },
    { id: 'living-clock-table', model: 'sideTable', at: [7.5, 7.5] },
    { id: 'living-clock', model: 'radio', logic: 'clock@7,7', on: { parent: 'living-clock-table' } },
  ],
}
