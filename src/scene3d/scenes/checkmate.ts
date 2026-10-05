import type { SceneSpec } from '../schema'

// Uma cozinha de demonstração ocupa a ala este, com dois pátios distintos.
export const checkmate: SceneSpec = {
  puzzleId: 'very-easy-4',
  floor: 0,
  entry: { wall: 'north', at: 4.65 },
  shell: {
    features: [
      { wall: 'north', at: 3.55, kind: 'window' },
      { wall: 'north', at: 5.45, kind: 'window' },
    ],
  },
  floors: [
    { id: 'front-yard', cells: [0, 0, 2, 2], material: 'grass', kind: 'exterior' },
    { id: 'rear-garden', cells: [0, 3, 2, 5], material: 'grass', kind: 'exterior' },
    { id: 'kitchen-wing', cells: [3, 0, 5, 5], material: 'stone', kind: 'interior' },
  ],
  walls: [
    {
      id: 'west-facade',
      from: [3, 0],
      to: [3, 6],
      height: 'half',
      openings: [
        { at: 1.15, kind: 'door' },
        { at: 5.35, width: 1, kind: 'open' },
      ],
    },
    {
      id: 'kitchen-island',
      from: [3, 3],
      to: [6, 3],
      height: 'half',
      openings: [{ at: 4.65, width: 1.25, kind: 'open' }],
    },
  ],
  furniture: [
    { id: 'north-stove', model: 'kitchenStove', logic: 'stove@0,5', against: { wall: 'east', at: 0.55 } },
    { id: 'north-fridge', model: 'kitchenFridgeSmall', logic: 'fridge@2,4', at: [4.65, 2], facing: 'S' },
    { id: 'west-stove', model: 'kitchenStoveElectric', logic: 'stove@1,3', against: { wall: 'west-facade', side: 'E', at: 2 } },
    { id: 'south-fridge', model: 'kitchenFridge', logic: 'fridge@3,3', at: [3.45, 3.6], facing: 'S' },

    { id: 'counter-a', model: 'kitchenCabinet', logic: 'counter@3,5', against: { wall: 'east', at: 3.35 } },
    { id: 'counter-sink', model: 'kitchenSink', logic: 'counter@3,5', against: { wall: 'east', at: 3.95 } },
    { id: 'counter-b', model: 'kitchenCabinetDrawer', logic: 'counter@3,5', against: { wall: 'east', at: 4.55 } },
    { id: 'counter-microwave', model: 'kitchenMicrowave', on: { parent: 'counter-b' } },

    { id: 'dining-table', model: 'table', at: [4.2, 4.65], facing: 'E' },
    { id: 'dining-chair-west', model: 'chair', at: [3.35, 4.65], facing: 'E' },
    { id: 'dining-chair-east', model: 'chair', at: [4.9, 4.65], facing: 'W' },
    { id: 'dining-lamp', model: 'lampRoundFloor', at: [5.55, 5.35] },
    { id: 'sideboard', model: 'cabinetTelevision', against: { wall: 'south', at: 4.55 } },
    { id: 'sideboard-radio', model: 'radio', on: { parent: 'sideboard' } },
    { id: 'dining-rug', model: 'rugRectangle', at: [4.4, 4.7], facing: 'E' },

    { id: 'front-tree', model: 'tree_small', logic: 'plant@0,0', at: [0.65, 0.55] },
    { id: 'front-shrub', model: 'plant_bushDetailed', logic: 'shrub@2,0', at: [0.55, 2.55], yaw: 12 },
    { id: 'front-bench', model: 'bench', at: [1.55, 1.55], facing: 'E' },
    { id: 'front-fence-a', model: 'fence_simple', at: [0.8, 0.08], facing: 'S' },
    { id: 'front-fence-b', model: 'fence_simple', at: [2.2, 0.08], facing: 'S' },

    { id: 'garden-shrub-west', model: 'plant_bushLarge', logic: 'shrub@4,0', at: [0.55, 4.45], yaw: -8 },
    { id: 'garden-flower', model: 'flower_redA', logic: 'plant@4,1', at: [1.55, 4.4], yaw: 12 },
    { id: 'garden-flower-tree', model: 'flower_yellowA', logic: 'plant@4,2', at: [2.38, 4.45] },
    { id: 'garden-shrub-south', model: 'plant_bushDetailed', logic: 'shrub@5,0', at: [0.6, 5.45], yaw: 15 },
    { id: 'garden-bench', model: 'benchCushion', at: [1.55, 5.35], facing: 'E' },
    { id: 'garden-fence-a', model: 'fence_simple', at: [0.8, 5.9], facing: 'S' },
    { id: 'garden-fence-b', model: 'fence_simple', at: [2.2, 5.9], facing: 'S' },
  ],
  rugs: [
    { id: 'front-path-a', model: 'path_stone', at: [1, 0.5], facing: 'S' },
    { id: 'front-path-b', model: 'path_stone', at: [1.8, 0.55], facing: 'S' },
    { id: 'front-path-c', model: 'path_stone', at: [2.6, 0.75], facing: 'S' },
    { id: 'garden-path-a', model: 'path_stone', at: [2.65, 5.1], facing: 'S' },
    { id: 'garden-path-b', model: 'path_stone', at: [2, 5.15], facing: 'S' },
    { id: 'garden-path-c', model: 'path_stone', at: [1.3, 5.1], facing: 'S' },
  ],
}
