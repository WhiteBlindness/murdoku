import type { SceneSpec } from '../schema'
import { MODEL_BOUNDS } from '../catalog.generated'
import { CELL } from '../units'

const stairAt: [number, number] = [6.4, 2.8]
const stairLengthCells = MODEL_BOUNDS.stairsOpen.size[0] / CELL
const stairWidthCells = MODEL_BOUNDS.stairsOpen.size[2] / CELL

export const lockedPantryStairwellBounds: [number, number, number, number] = [
  stairAt[0] - stairWidthCells / 2,
  stairAt[1] - stairLengthCells / 2,
  stairAt[0] + stairWidthCells / 2,
  stairAt[1] + stairLengthCells / 2,
]

export const theLockedPantryGround: SceneSpec = {
  puzzleId: 'expert-3',
  floor: 0,
  storeyFootprint: { kind: 'full' },
  entry: { wall: 'north', at: 6.2 },
  shell: { features: [
    { wall: 'north', at: 1.4, kind: 'window' },
    { wall: 'north', at: 7.0, kind: 'window' },
    { wall: 'west', at: 2.0, kind: 'window' },
  ] },
  stairs: { model: 'stairsOpen', at: stairAt, facing: 'S' },
  exteriorSupportBays: [
    { id: 'rear-garden-west-bay', cells: [0, 5, 1, 7] },
    { id: 'rear-garden-east-bay', cells: [2, 5, 3, 7] },
  ],
  floors: [
    { id: 'living-room', cells: [0, 0, 7, 2], material: 'wood' },
    { id: 'hallway', cells: [0, 3, 7, 4], material: 'stone' },
    { id: 'rear-garden', cells: [0, 5, 3, 7], material: 'grass', kind: 'exterior' },
    { id: 'kitchen', cells: [4, 5, 7, 7], material: 'tile', kind: 'interior' },
  ],
  walls: [
    { id: 'rear-garden-facade', from: [0, 5], to: [4, 5], height: 'half', openings: [{ at: 3.45, width: 1.0, kind: 'open' }] },
    { id: 'hall-kitchen', from: [4, 5], to: [8, 5], height: 'half', openings: [{ at: 6.5, width: 1.2, kind: 'door' }] },
    { id: 'kitchen-garden-facade', from: [4, 5], to: [4, 8], height: 'half', openings: [{ at: 7.5, width: 0.95, kind: 'door' }] },
  ],
  furniture: [
    // Sala: sofá e poltrona viram-se para os televisores; mesa de centro sobre o tapete.
    { id: 'living-clock-east', model: 'speaker', logic: 'clock@2,6', at: [7.05, 2.85] },
    { id: 'living-tv-north', model: 'cabinetTelevision', logic: 'tv@0,4', at: [4.5, 0.6], facing: 'S' },
    { id: 'living-tv-north-set', model: 'televisionModern', on: { parent: 'living-tv-north' } },
    { id: 'living-rug', model: 'rugRectangle', logic: 'rug@0,2', at: [3.0, 1.0], facing: 'N' },
    { id: 'living-coffee-table', model: 'tableCoffee', at: [3.0, 1.15], facing: 'N' },
    { id: 'living-armchair', model: 'loungeChair', at: [4.5, 2.2], facing: 'N' },
    { id: 'living-sofa-east', model: 'loungeSofaLong', logic: 'sofa@1,7', at: [7.41, 1.2], facing: 'W' },
    { id: 'living-tv-west', model: 'cabinetTelevision', logic: 'tv@2,2', at: [2.5, 2.5], facing: 'E' },
    { id: 'living-tv-west-set', model: 'televisionVintage', on: { parent: 'living-tv-west' } },
    { id: 'hall-plant', model: 'flower_redA', logic: 'plant@4,2', at: [2.5, 4.5] },
    { id: 'hall-clock-south', model: 'speaker', logic: 'clock@4,5', at: [5.5, 4.85] },
    { id: 'hall-rug', model: 'rugRectangle', logic: 'rug@3,0', at: [1.0, 3.8], facing: 'N' },
    { id: 'garden-shrub-west', model: 'plant_bushSmall', logic: 'shrub@5,0', at: [0.5, 5.5] },
    { id: 'garden-shrub-centre', model: 'plant_bushSmall', logic: 'shrub@5,1', at: [1.5, 5.5] },
    { id: 'garden-shrub-east', model: 'plant_bushSmall', logic: 'shrub@5,2', at: [2.5, 5.5] },
    { id: 'garden-plant-southeast', model: 'flower_purpleA', logic: 'plant@6,3', at: [3.5, 6.5] },
    // Cozinha: lava-loiça, placas e bancada em linha na parede nascente, frigorífico em frente e mesa ao centro.
    { id: 'kitchen-fridge-west', model: 'kitchenFridge', logic: 'fridge@6,4', against: { wall: 'kitchen-garden-facade', side: 'E', at: 6.72 }, facing: 'E' },
    { id: 'kitchen-sink', model: 'kitchenSink', against: { wall: 'east', at: 5.69 }, facing: 'W' },
    { id: 'kitchen-stove-north', model: 'kitchenStove', logic: 'stove@6,7', against: { wall: 'east', at: 6.23 }, facing: 'W' },
    { id: 'kitchen-counter', model: 'kitchenCabinet', against: { wall: 'east', at: 6.77 }, facing: 'W' },
    { id: 'kitchen-stove-south', model: 'kitchenStove', logic: 'stove@7,7', against: { wall: 'east', at: 7.31 }, facing: 'W' },
    { id: 'kitchen-table', model: 'table', at: [5.85, 6.55], facing: 'N' },
    { id: 'kitchen-chair-west', model: 'chairCushion', at: [5.55, 7.15], facing: 'N' },
    { id: 'kitchen-chair-east', model: 'chairCushion', at: [6.15, 7.15], facing: 'N' },
  ],
}
