import type { SceneSpec } from '../schema'

// A despensa abre para o jardim e para o pátio de ensaio ao ar livre.
export const aFatalRehearsal: SceneSpec = {
  puzzleId: 'very-easy-3',
  floor: 0,
  entry: { wall: 'west', at: 4.8 },
  floors: [
    { id: 'garden', cells: [0, 0, 2, 2], material: 'grass', kind: 'exterior' },
    { id: 'pantry', cells: [0, 3, 2, 5], material: 'tile', kind: 'interior' },
    { id: 'yard', cells: [3, 0, 5, 5], material: 'grass', kind: 'exterior' },
    { id: 'yard-apron', cells: [3, 4, 5, 5], material: 'stone', kind: 'exterior' },
    { id: 'yard-stone-edge', cells: [5, 0, 5, 3], material: 'stone', kind: 'exterior' },
    { id: 'garden-bed-north', cells: [0, 0, 1, 1], material: 'dirt', kind: 'exterior' },
    { id: 'garden-bed-south', cells: [0, 2, 0, 2], material: 'dirt', kind: 'exterior' },
    { id: 'yard-bed-north', cells: [3, 2, 4, 2], material: 'dirt', kind: 'exterior' },
    { id: 'yard-bed-centre', cells: [3, 3, 3, 3], material: 'dirt', kind: 'exterior' },
    { id: 'yard-bed-south', cells: [3, 4, 4, 5], material: 'dirt', kind: 'exterior' },
  ],
  walls: [
    { id: 'pantry-garden', from: [0, 3], to: [3, 3], height: 'half', openings: [{ at: 2.35, width: 1, kind: 'open' }] },
    { id: 'pantry-yard', from: [3, 3], to: [3, 6], height: 'half', openings: [{ at: 5.35, width: 1, kind: 'open' }] },
  ],
  furniture: [
    { id: 'pantry-cabinet', model: 'kitchenCabinet', against: { wall: 'south', at: 1.0 } },
    { id: 'pantry-microwave', model: 'kitchenMicrowave', on: { parent: 'pantry-cabinet' } },
    { id: 'pantry-sink', model: 'kitchenSink', against: { wall: 'south', at: 1.65 } },
    { id: 'fridge', model: 'kitchenFridge', logic: 'fridge@3,1', at: [1.35, 3.55], facing: 'S' },
    { id: 'box', model: 'cardboardBoxClosed', logic: 'box@5,2', at: [2.25, 5.45], yaw: 12 },

    { id: 'garden-flower', model: 'flower_yellowA', logic: 'plant@0,0', at: [0.5, 0.5] },
    { id: 'garden-plant', model: 'tree_small', logic: 'plant@1,0', at: [0.5, 1.5] },
    { id: 'garden-shrub', model: 'plant_bushDetailed', logic: 'shrub@0,1', at: [1.5, 0.5] },
    { id: 'garden-bench', model: 'bench', at: [0.55, 2.5], facing: 'E' },

    { id: 'yard-shrub-west', model: 'plant_bushDetailed', logic: 'shrub@2,3', at: [3.5, 2.5] },
    { id: 'yard-flower', model: 'flower_redA', logic: 'plant@3,3', at: [3.5, 3.5] },
    { id: 'yard-plant', model: 'pottedPlant', logic: 'plant@4,3', at: [3.5, 4.5] },
    { id: 'yard-shrub-east', model: 'plant_bushSmall', logic: 'shrub@2,4', at: [4.5, 2.5] },
    { id: 'yard-shrub-south', model: 'plant_bushDetailed', logic: 'shrub@5,4', at: [4.5, 5.5] },

    { id: 'yard-fence-north-a', model: 'fence_simple', at: [3.6, 0.1], facing: 'S' },
    { id: 'yard-fence-north-b', model: 'fence_simple', at: [5, 0.1], facing: 'S' },

    { id: 'rehearsal-table', model: 'tableRound', at: [4.1, 0.9], facing: 'E' },
    { id: 'rehearsal-speaker', model: 'speakerSmall', on: { parent: 'rehearsal-table' } },
    { id: 'rehearsal-seat-west', model: 'chair', at: [3.2, 0.9], facing: 'E' },
    { id: 'rehearsal-seat-east', model: 'chair', at: [5, 0.9], facing: 'W' },
  ],
  rugs: [
    { id: 'pantry-mat', model: 'rugDoormat', at: [2.35, 3.25], facing: 'E' },
    { id: 'garden-path-a', model: 'path_stone', at: [2.35, 2.6] },
    { id: 'garden-path-b', model: 'path_stone', at: [2.35, 1.8] },
    { id: 'yard-path-a', model: 'path_stone', at: [3.5, 4.8] },
    { id: 'yard-path-b', model: 'path_stone', at: [3.5, 3.9] },
  ],
}
