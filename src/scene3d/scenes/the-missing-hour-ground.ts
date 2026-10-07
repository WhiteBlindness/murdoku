import type { SceneSpec } from '../schema'
import { MODEL_BOUNDS } from '../catalog.generated'
import { CELL } from '../units'

const stairRun = MODEL_BOUNDS.stairsOpen.size[0] / CELL
const stairWidth = MODEL_BOUNDS.stairsOpen.size[2] / CELL
const stairHeadX = 5
const stairAt: [number, number] = [stairHeadX - stairRun / 2, 5.5]
const stairwellBounds: [number, number, number, number] = [
  stairHeadX - stairRun,
  stairAt[1] - stairWidth / 2,
  stairHeadX,
  stairAt[1] + stairWidth / 2,
]
const stairPartitionClearance = 0.2

export const theMissingHourStairwellBounds = stairwellBounds

export const theMissingHourGround: SceneSpec = {
  puzzleId: 'hard-11',
  floor: 0,
  storeyFootprint: { kind: 'full' },
  entry: { wall: 'west', at: stairAt[1] },
  shell: { features: [
    { wall: 'north', at: 1.35, kind: 'window' },
    { wall: 'north', at: 6.5, kind: 'window' },
    { wall: 'west', at: 6.4, kind: 'window' },
  ] },
  stairs: { model: 'stairsOpen', at: stairAt, facing: 'E' },
  floors: [
    { id: 'kitchen-floor', cells: [0, 0, 3, 3], material: 'tile', kind: 'interior' },
    { id: 'office-floor', cells: [4, 0, 7, 3], material: 'wood', kind: 'interior' },
    { id: 'living-floor', cells: [0, 4, 2, 7], material: 'wood', kind: 'interior' },
    { id: 'dining-floor', cells: [3, 4, 7, 7], material: 'wood', kind: 'interior' },
  ],
  walls: [
    { id: 'kitchen-office-partition', from: [4, 0], to: [4, 4], height: 'half', openings: [{ at: 1.8, width: 1.15, kind: 'door' }] },
    { id: 'front-rear-partition', from: [0, 4], to: [8, 4], height: 'half', openings: [
      { at: 0.55, width: 0.9, kind: 'door' },
      { at: 6.5, width: 1.2, kind: 'door' },
    ] },
    { id: 'living-dining-north-screen', from: [3, 4], to: [3, stairwellBounds[1] - stairPartitionClearance], height: 'half', freeEnds: ['to'] },
    { id: 'living-dining-south-screen', from: [3, stairwellBounds[3] + stairPartitionClearance], to: [3, 8], height: 'half', freeEnds: ['from'] },
  ],
  furniture: [
    // Cozinha: mesa de pequenas refeições no canto e bancada contínua (frigorífico encastrado, lava-loiça, fogão) contra a meia parede.
    { id: 'kitchen-table', model: 'table', logic: 'table@0,0', at: [1, 0.55], facing: 'S' },
    { id: 'kitchen-chair-south-a', model: 'chairCushion', at: [0.7, 1.2], facing: 'N' },
    { id: 'kitchen-chair-south-b', model: 'chairCushion', at: [1.3, 1.2], facing: 'N' },
    { id: 'kitchen-chair-east', model: 'chairCushion', at: [1.95, 0.55], facing: 'W' },
    { id: 'kitchen-fridge', model: 'kitchenFridgeSmall', logic: 'fridge@3,1', against: { wall: 'front-rear-partition', side: 'N', at: 1.3 }, facing: 'N' },
    { id: 'kitchen-sink', model: 'kitchenSink', against: { wall: 'front-rear-partition', side: 'N', at: 1.84 }, facing: 'N' },
    { id: 'kitchen-cabinet-a', model: 'kitchenCabinet', against: { wall: 'front-rear-partition', side: 'N', at: 2.38 }, facing: 'N' },
    { id: 'kitchen-cabinet-b', model: 'kitchenCabinetDrawer', against: { wall: 'front-rear-partition', side: 'N', at: 2.92 }, facing: 'N' },
    { id: 'kitchen-stove', model: 'kitchenStove', logic: 'stove@3,3', against: { wall: 'front-rear-partition', side: 'N', at: 3.46 }, facing: 'N' },

    // Escritório: secretária com a cadeira à frente e estantes na parede nascente.
    { id: 'office-desk', model: 'desk', logic: 'desk@2,4', at: [4.6, 2.9], facing: 'E' },
    { id: 'office-chair', model: 'chairDesk', logic: 'chair@3,5', at: [5.2, 3.15], facing: 'W' },
    { id: 'office-bookcase', model: 'bookcaseOpenLow', logic: 'bookshelf@1,7', at: [7.55, 1.45], facing: 'W' },
    { id: 'office-bookcase-south', model: 'bookcaseOpenLow', logic: 'bookshelf@1,7', at: [7.55, 2.0], facing: 'W' },
    { id: 'office-bookcase-books', model: 'books', on: { parent: 'office-bookcase' } },

    // Sala de estar: sofá e poltrona à volta de uma mesa de centro; a poltrona encara o televisor.
    { id: 'living-television-stand', model: 'cabinetTelevision', logic: 'tv@4,2', against: { wall: 'front-rear-partition', side: 'S', at: 2.45 }, facing: 'S' },
    { id: 'living-television', model: 'televisionVintage', logic: 'tv@4,2', on: { parent: 'living-television-stand' } },
    { id: 'living-clock-table', model: 'sideTable', at: [1.5, 7.5] },
    { id: 'living-clock', model: 'radio', logic: 'clock@7,1', on: { parent: 'living-clock-table' } },
    { id: 'living-sofa', model: 'loungeSofa', logic: 'sofa@6,0', against: { wall: 'west', at: 7 } },
    { id: 'living-coffee-table', model: 'tableCoffeeSquare', at: [1.15, 6.75] },
    { id: 'living-armchair', model: 'loungeChair', at: [2.25, 6.75], facing: 'N' },

    // Sala de jantar: recanto de conversa sobre o tapete e mesa de jantar com quatro cadeiras.
    { id: 'dining-rug', model: 'rugRectangle', logic: 'rug@4,5', at: [6.15, 5], facing: 'S' },
    { id: 'dining-chair', model: 'loungeChair', logic: 'chair@4,4', at: [4.55, 4.6], facing: 'E' },
    { id: 'dining-armchair-east', model: 'loungeChair', at: [6.85, 5.0], facing: 'W' },
    { id: 'dining-coffee-table', model: 'tableCoffeeSquare', at: [5.75, 4.95] },
    { id: 'dining-lamp-south', model: 'lampRoundFloor', logic: 'lamp@5,7', at: [7.5, 5.5], facing: 'N' },
    { id: 'dining-lamp-north', model: 'lampRoundFloor', logic: 'lamp@4,7', at: [7.5, 4.5], facing: 'N' },
    { id: 'dining-table', model: 'table', at: [5.6, 7.0], facing: 'N' },
    { id: 'dining-chair-north-a', model: 'chairCushion', at: [5.3, 6.4], facing: 'S' },
    { id: 'dining-chair-north-b', model: 'chairCushion', at: [5.9, 6.4], facing: 'S' },
    { id: 'dining-chair-south-a', model: 'chairCushion', at: [5.3, 7.6], facing: 'N' },
    { id: 'dining-chair-south-b', model: 'chairCushion', at: [5.9, 7.6], facing: 'N' },
  ],
}