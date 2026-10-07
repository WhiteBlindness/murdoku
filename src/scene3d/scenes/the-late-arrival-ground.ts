import type { SceneSpec } from '../schema'

const stairAt: [number, number] = [4.55, 3.5]

// Casa com cozinha comprida, sala de jantar e alpendre-jardim frontal.
export const theLateArrivalGround: SceneSpec = {
  puzzleId: 'hard-9',
  floor: 0,
  storeyFootprint: { kind: 'full' },
  entry: { wall: 'north', at: 4 },
  shell: { features: [
    { wall: 'north', at: 1.3, kind: 'window' },
    { wall: 'north', at: 6.7, kind: 'window' },
    { wall: 'west', at: 6.5, kind: 'window' },
  ] },
  stairs: { model: 'stairsOpen', at: stairAt, facing: 'S' },
  exteriorSupportBays: [
    { id: 'yard-west-frame', cells: [3, 5, 4, 7] },
    { id: 'yard-east-frame', cells: [5, 5, 7, 7] },
  ],
  floors: [
    { id: 'kitchen-tile', cells: [0, 0, 2, 7], material: 'tile' },
    { id: 'hallway-wood', cells: [3, 0, 7, 1], material: 'wood' },
    { id: 'dining-wood', cells: [3, 2, 7, 4], material: 'wood' },
    { id: 'front-yard-grass', cells: [3, 5, 7, 7], material: 'grass', kind: 'exterior' },
  ],
  walls: [
    { id: 'kitchen-hall-dining', from: [3, 0], to: [3, 8], openings: [
      { at: 0.6, width: 1.2, kind: 'door' },
    ] },
    { id: 'dining-yard-facade', from: [3, 5], to: [8, 5], height: 'half', openings: [
      { at: 3.55, width: 1.0, kind: 'door' },
    ] },
  ],
  furniture: [
    // Cozinha em linha na parede poente (lava-loiça, bancada e fogão) e coluna de frigorífico e congelador.
    { id: 'kitchen-counter', model: 'kitchenCabinet', logic: 'counter@4,0', against: { wall: 'west', at: 4.36 } },
    { id: 'kitchen-counter-b', model: 'kitchenCabinet', logic: 'counter@4,0', against: { wall: 'west', at: 4.9 } },
    { id: 'kitchen-sink', model: 'kitchenSink', against: { wall: 'west', at: 5.44 } },
    { id: 'kitchen-drawers-b', model: 'kitchenCabinetDrawer', against: { wall: 'west', at: 5.98 } },
    { id: 'kitchen-stove', model: 'kitchenStove', logic: 'stove@6,0', against: { wall: 'west', at: 6.52 } },
    { id: 'kitchen-drawers-c', model: 'kitchenCabinetDrawer', against: { wall: 'west', at: 7.06 } },
    { id: 'kitchen-fridge-north', model: 'kitchenFridge', logic: 'fridge@1,2', at: [2.6, 1.4], facing: 'S' },
    { id: 'kitchen-fridge-south', model: 'kitchenFridge', logic: 'fridge@2,2', at: [2.6, 2.62], facing: 'S' },
    { id: 'kitchen-table', model: 'table', logic: 'table@0,1', at: [1.6, 0.65], facing: 'N' },
    { id: 'kitchen-chair-west', model: 'chairCushion', at: [0.75, 0.65], facing: 'E' },
    { id: 'kitchen-chair-south-a', model: 'chairCushion', at: [1.1, 1.3], facing: 'N' },
    { id: 'kitchen-chair-south-b', model: 'chairCushion', at: [1.65, 1.3], facing: 'N' },

    { id: 'yard-shrub-north', model: 'plant_bushSmall', logic: 'shrub@5,6', at: [6.5, 5.65] },
    { id: 'yard-plant-south-west', model: 'flower_redA', logic: 'plant@7,5', at: [5.65, 7.45] },
    { id: 'yard-shrub-south-east', model: 'plant_bushSmall', logic: 'shrub@7,7', at: [7.4, 7.35] },
    { id: 'yard-plant-north-east', model: 'flower_yellowA', logic: 'plant@5,7', at: [7.4, 5.65] },
    { id: 'yard-shrub-murder-clue', model: 'plant_bushSmall', logic: 'shrub@6,3', at: [3.5, 6.55] },

    { id: 'hallway-clock-table', model: 'sideTable', at: [5.5, 0.65] },
    { id: 'hallway-clock', model: 'radio', logic: 'clock@0,5', on: { parent: 'hallway-clock-table' } },
    { id: 'hallway-plant', model: 'flower_purpleA', logic: 'plant@1,6', at: [6.5, 1.5] },

    // Canto de leitura junto à escada e mesa de jantar a nascente.
    { id: 'dining-chair', model: 'chair', logic: 'chair@3,3', at: [3.3, 3.5], facing: 'E' },
    { id: 'dining-reading-table', model: 'sideTable', at: [3.3, 2.75], facing: 'E' },
    { id: 'dining-table', model: 'table', at: [6.6, 3.3], facing: 'N' },
    { id: 'dining-chair-north-a', model: 'chairCushion', at: [6.3, 2.6], facing: 'S' },
    { id: 'dining-chair-north-b', model: 'chairCushion', at: [6.9, 2.6], facing: 'S' },
    { id: 'dining-chair-south-a', model: 'chairCushion', at: [6.3, 4.0], facing: 'N' },
    { id: 'dining-chair-south-b', model: 'chairCushion', at: [6.9, 4.0], facing: 'N' },
    { id: 'dining-lamp-east', model: 'lampRoundFloor', logic: 'lamp@4,7', at: [7.5, 4.55] },
    { id: 'dining-lamp-west', model: 'lampRoundFloor', logic: 'lamp@4,4', at: [4.5, 4.8] },
  ],
}
