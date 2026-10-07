import type { SceneSpec } from '../schema'

// A walled urban property with a front court, a transverse entrance hall,
// a compact pantry and a garden court. The two outdoor puzzle zones are real
// exterior ground, joined to the house by visible thresholds.
export const noWayOut: SceneSpec = {
  puzzleId: 'easy-4',
  floor: 0,
  entry: { wall: 'west', at: 4.5 },
  shell: {
    features: [
      { wall: 'north', at: 5.55, kind: 'window' },
    ],
  },
  floors: [
    { id: 'front-yard', cells: [0, 0, 3, 2], material: 'grass', kind: 'exterior' },
    { id: 'pantry-tile', cells: [4, 0, 6, 2], material: 'tile', kind: 'interior' },
    { id: 'entrance-hall', cells: [0, 3, 6, 4], material: 'stone', kind: 'interior' },
    { id: 'garden-court', cells: [0, 5, 6, 6], material: 'grass', kind: 'exterior' },
  ],
  walls: [
    { id: 'front-yard-hall', from: [0, 3], to: [4, 3], height: 'half', openings: [{ at: 2.8, width: 1.15, kind: 'open' }] },
    { id: 'front-yard-pantry', from: [4, 0], to: [4, 3], height: 'half' },
    { id: 'pantry-hall', from: [4, 3], to: [7, 3], height: 'half', openings: [{ at: 6.3, kind: 'door' }] },
    { id: 'hall-garden', from: [0, 5], to: [7, 5], height: 'half', openings: [{ at: 3.65, width: 1.2, kind: 'open' }] },
  ],
  furniture: [
    // Pantry: a compact work run with storage and a small refrigerator.
    { id: 'pantry-counter', model: 'kitchenCabinet', logic: 'counter@0,4', against: { wall: 'north', at: 4.45 } },
    { id: 'pantry-sink', model: 'kitchenSink', logic: 'counter@0,4', against: { wall: 'north', at: 5.25 } },
    { id: 'pantry-box', model: 'cardboardBoxClosed', logic: 'box@1,4', at: [4.55, 1.55] },
    { id: 'pantry-fridge', model: 'kitchenFridgeSmall', logic: 'fridge@2,5', at: [5.5, 2.5], facing: 'S' },

    // The hall stays open from the front door to both exterior thresholds.
    { id: 'hall-clock-front', model: 'speaker', logic: 'clock@3,0', at: [0.5, 3.5] },
    { id: 'hall-plant', model: 'pottedPlant', logic: 'plant@3,1', at: [1.5, 3.5] },
    { id: 'hall-clock-garden', model: 'speaker', logic: 'clock@4,2', at: [2.5, 4.5] },

    // Plants and shrubs use distinct approved models so clue targets remain clear.
    { id: 'front-plant-victim', model: 'flower_yellowA', logic: 'plant@0,2', at: [2.5, 0.5] },
    { id: 'front-plant-east', model: 'flower_redA', logic: 'plant@0,3', at: [3.5, 0.5] },
    { id: 'front-shrub-yuki', model: 'plant_bushDetailed', logic: 'shrub@2,1', at: [1.5, 2.5] },
    { id: 'front-shrub-east', model: 'plant_bush', logic: 'shrub@1,3', at: [3.35, 1.4] },
    { id: 'garden-plant', model: 'flower_purpleA', logic: 'plant@5,2', at: [2.5, 5.5] },
    { id: 'garden-shrub-north', model: 'plant_bushLarge', logic: 'shrub@6,4', at: [4.5, 6.5] },
    { id: 'garden-shrub-evangeline', model: 'plant_bush', logic: 'shrub@6,0', at: [0.5, 6.5] },
  ],
  rugs: [
    { id: 'front-path', model: 'path_stone', at: [2.35, 2.7] },
    { id: 'garden-path', model: 'path_stone', at: [3.55, 5.45] },
  ],
}
