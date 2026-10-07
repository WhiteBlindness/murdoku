import type { SceneSpec } from '../schema'
import { MODEL_BOUNDS } from '../catalog.generated'
import { CELL } from '../units'

const stairAt: [number, number] = [6.5, 5.3]
const stairWidth = MODEL_BOUNDS.stairsOpen.size[2] / CELL
const stairLength = MODEL_BOUNDS.stairsOpen.size[0] / CELL

export const aWitnessRecantsStairwellBounds: [number, number, number, number] = [
  stairAt[0] - stairWidth / 2,
  stairAt[1] - stairLength / 2,
  stairAt[0] + stairWidth / 2,
  stairAt[1] + stairLength / 2,
]

export const aWitnessRecantsGround: SceneSpec = {
  puzzleId: 'expert-2',
  floor: 0,
  storeyFootprint: { kind: 'full' },
  entry: { wall: 'west', at: 6.5 },
  shell: {
    features: [
      { wall: 'north', at: 1.1, kind: 'window' },
      { wall: 'north', at: 6.8, kind: 'window' },
      { wall: 'west', at: 1.8, kind: 'window' },
    ],
  },
  stairs: { model: 'stairsOpen', at: stairAt, facing: 'S' },
  exteriorSupportBays: [
    { id: 'garden-north-bay', cells: [2, 0, 4, 2] },
    { id: 'garden-centre-bay', cells: [2, 3, 4, 5] },
    { id: 'garden-south-bay', cells: [2, 6, 4, 7] },
  ],
  floors: [
    { id: 'hallway', cells: [0, 0, 1, 7], material: 'wood', kind: 'interior' },
    { id: 'garden-spine', cells: [2, 0, 4, 7], material: 'grass', kind: 'exterior' },
    { id: 'dining-room', cells: [5, 0, 7, 4], material: 'wood', kind: 'interior' },
    { id: 'pantry', cells: [5, 5, 7, 7], material: 'tile', kind: 'interior' },
  ],
  walls: [
    {
      id: 'hallway-garden-edge',
      from: [2, 0],
      to: [2, 8],
      height: 'half',
      openings: [{ at: 4.5, width: 1.2, kind: 'open' }],
    },
    {
      id: 'dining-garden-edge',
      from: [5, 0],
      to: [5, 8],
      height: 'half',
      openings: [{ at: 2.5, width: 1.2, kind: 'open' }],
    },
  ],
  furniture: [
    { id: 'garden-plant-southwest', model: 'pottedPlant', logic: 'plant@2,2', at: [2.95, 2.95] },
    { id: 'garden-shrub-east-north', model: 'plant_bushSmall', logic: 'shrub@1,4', at: [4.0, 1.5] },
    { id: 'garden-shrub-east-south', model: 'plant_bushSmall', logic: 'shrub@3,4', at: [4.25, 3.5] },
    { id: 'garden-plant-north', model: 'flower_yellowA', logic: 'plant@0,3', at: [3.5, 0.5] },
    { id: 'garden-idris-shrub', model: 'plant_bushSmall', logic: 'shrub@1,2', at: [2.5, 1.5] },

    { id: 'hall-clock-south', model: 'speaker', logic: 'clock@3,1', at: [1.5, 3.5] },
    { id: 'hall-plant', model: 'pottedPlant', logic: 'plant@4,1', at: [1.2, 4.5] },
    { id: 'hall-clock-north', model: 'speaker', logic: 'clock@7,0', at: [0.5, 7.5] },
    { id: 'hall-clock-west', model: 'speaker', logic: 'clock@0,1', at: [1.5, 0.5] },
    { id: 'dining-floor-lamp', model: 'lampRoundFloor', logic: 'lamp@3,5', at: [5.5, 3.5] },
    { id: 'dining-table', model: 'table', logic: 'table@4,5', at: [5.7, 4.3], facing: 'E' },
    // Recanto de refeições: banco estofado contra a parede norte, mesa e cadeira na cabeceira.
    { id: 'dining-banquette', model: 'loungeSofa', against: { wall: 'north', at: 6.6 } },
    { id: 'dining-nook-table', model: 'table', at: [6.55, 1.0], facing: 'N' },
    { id: 'dining-chair', model: 'chair', logic: 'chair@0,5', at: [5.6, 0.95], facing: 'E' },
    { id: 'pantry-box', model: 'cardboardBoxClosed', logic: 'box@7,7', at: [7.5, 7.5] },
    { id: 'pantry-fridge', model: 'kitchenFridge', logic: 'fridge@6,7', at: [7.5, 6.5], facing: 'S' },
    // Copa aberta para a sala: bancada com lava-loiça e placa na parede sul.
    { id: 'pantry-cabinet-west', model: 'kitchenCabinet', against: { wall: 'south', at: 5.36 }, facing: 'N' },
    { id: 'pantry-sink', model: 'kitchenSink', against: { wall: 'south', at: 5.9 }, facing: 'N' },
    { id: 'pantry-stove', model: 'kitchenStove', against: { wall: 'south', at: 6.44 }, facing: 'N' },
    { id: 'pantry-cabinet-east', model: 'kitchenCabinetDrawer', against: { wall: 'south', at: 6.98 }, facing: 'N' },
  ],
}
