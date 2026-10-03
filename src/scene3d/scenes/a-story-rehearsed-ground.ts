import type { SceneSpec } from '../schema'
import { MODEL_BOUNDS } from '../catalog.generated'
import { CELL } from '../units'

const stairWidth = MODEL_BOUNDS.stairsOpen.size[2] / CELL
const stairLength = MODEL_BOUNDS.stairsOpen.size[0] / CELL
const stairAt: [number, number] = [1, 4.5]
const stairwell: [number, number, number, number] = [
  stairAt[0] - stairWidth / 2,
  stairAt[1] - stairLength / 2,
  stairAt[0] + stairWidth / 2,
  stairAt[1] + stairLength / 2,
]

export const aStoryRehearsedStairwellBounds = stairwell

export const aStoryRehearsedGround: SceneSpec = {
  puzzleId: 'hard-10',
  floor: 0,
  storeyFootprint: { kind: 'full' },
  entry: { wall: 'west', at: 6.5 },
  shell: { features: [
    { wall: 'north', at: 1.1, kind: 'window' },
    { wall: 'west', at: 2.7, kind: 'window' },
  ] },
  stairs: { model: 'stairsOpen', at: stairAt, facing: 'N' },
  exteriorSupportBays: [
    { id: 'northwest-garden-bay', cells: [2, 0, 4, 2] },
    { id: 'northeast-garden-bay', cells: [5, 0, 7, 2] },
    { id: 'middlewest-garden-bay', cells: [2, 3, 4, 5] },
    { id: 'middleeast-garden-bay', cells: [5, 3, 7, 5] },
    { id: 'southwest-porch-bay', cells: [2, 6, 4, 7] },
    { id: 'southeast-porch-bay', cells: [5, 6, 7, 7] },
  ],
  floors: [
    { id: 'hallway', cells: [0, 0, 1, 7], material: 'wood', kind: 'interior' },
    { id: 'front-yard', cells: [2, 0, 3, 7], material: 'grass', kind: 'exterior' },
    { id: 'garden', cells: [4, 0, 7, 4], material: 'grass', kind: 'exterior' },
    { id: 'porch', cells: [4, 5, 7, 7], material: 'stone', kind: 'exterior' },
  ],
  walls: [
    { id: 'hallway-garden-edge', from: [2, 0], to: [2, 8], openings: [{ at: 6.5, width: 1.3, kind: 'open' }] },
  ],
  furniture: [
    { id: 'hallway-clock-south', model: 'speaker', logic: 'clock@3,0', at: [0.23, 3.5] },
    { id: 'hallway-plant', model: 'pottedPlant', logic: 'plant@2,0', at: [0.23, 2.5] },
    { id: 'hallway-clock-north', model: 'speaker', logic: 'clock@0,1', at: [1.5, 0.5] },

    { id: 'front-yard-shrub-north', model: 'plant_bushSmall', logic: 'shrub@1,3', at: [3.5, 1.5] },
    { id: 'front-yard-plant-south', model: 'flower_yellowA', logic: 'plant@5,3', at: [3.5, 5.5] },
    { id: 'garden-shrub-west', model: 'plant_bushSmall', logic: 'shrub@2,2', at: [2.5, 2.5] },
    { id: 'front-yard-plant-east', model: 'flower_redA', logic: 'plant@4,2', at: [2.5, 4.5] },
    { id: 'garden-shrub-northwest', model: 'plant_bushSmall', logic: 'shrub@0,4', at: [4.5, 0.5] },
    { id: 'garden-alexander-plant', model: 'flower_purpleA', logic: 'plant@0,5', at: [5.5, 0.5] },
    { id: 'garden-shrub-southwest', model: 'plant_bushSmall', logic: 'shrub@4,5', at: [5.5, 4.5] },
    { id: 'garden-shrub-southeast', model: 'plant_bushSmall', logic: 'shrub@4,7', at: [7.5, 4.5] },
    { id: 'porch-chair-west', model: 'chair', logic: 'chair@5,4', at: [4.5, 5.5], facing: 'W' },
    { id: 'porch-yuki-plant', model: 'flower_redA', logic: 'plant@6,7', at: [7.5, 6.5] },
    { id: 'porch-chair-north', model: 'chair', logic: 'chair@7,5', at: [5.5, 7.5], facing: 'N' },
    { id: 'porch-chair-east', model: 'chair', logic: 'chair@7,6', at: [6.5, 7.5], facing: 'S' },
    { id: 'porch-tomas-chair', model: 'chair', logic: 'chair@5,7', at: [7.5, 5.5], facing: 'E' },
  ],
}
