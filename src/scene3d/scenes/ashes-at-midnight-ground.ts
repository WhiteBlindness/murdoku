import type { SceneSpec } from '../schema'

// Moradia de dois pisos com alpendre coberto e pátio frontal.
export const ashesAtMidnightGround: SceneSpec = {
  puzzleId: 'hard-2',
  floor: 0,
  storeyFootprint: { kind: 'full' },
  entry: { wall: 'west', at: 1.5 },
  shell: { features: [
    { wall: 'north', at: 1.6, kind: 'window' },
    { wall: 'north', at: 6.7, kind: 'window' },
    { wall: 'west', at: 6.5, kind: 'window' },
  ] },
  stairs: { model: 'stairsOpen', at: [5.8, 2.6], facing: 'E' },
  floors: [
    { id: 'covered-porch', cells: [0, 0, 2, 3], material: 'stone' },
    { id: 'dining-room', cells: [3, 0, 7, 3], material: 'wood' },
    { id: 'kitchen', cells: [0, 4, 3, 7], material: 'tile' },
    { id: 'front-yard', cells: [4, 4, 7, 7], material: 'grass', kind: 'exterior' },
  ],
  walls: [
    { id: 'north-porch-dining', from: [3, 0], to: [3, 4], height: 'half', openings: [{ at: 0.9, width: 1.2, kind: 'open' }] },
    { id: 'south-kitchen-entry', from: [4, 4], to: [4, 8], height: 'half', openings: [{ at: 5.5, width: 1.2, kind: 'open' }] },
    { id: 'porch-kitchen', from: [0, 4], to: [3, 4], height: 'half', openings: [{ at: 2.1, width: 1.2, kind: 'door' }] },
    { id: 'dining-entry', from: [3, 4], to: [8, 4], height: 'half', openings: [{ at: 6.1, width: 1.35, kind: 'open' }] },
  ],
  furniture: [
    { id: 'porch-plant-west', model: 'flower_redA', logic: 'plant@3,0', at: [0.5, 3.45] },
    { id: 'porch-plant-east', model: 'flower_purpleA', logic: 'plant@3,2', at: [2.5, 3.1] },
    { id: 'porch-chair', model: 'chair', logic: 'chair@2,2', at: [2.4, 2.4], facing: 'W' },
    { id: 'porch-reading-chair', model: 'loungeChair', logic: 'chair@1,1', at: [1.35, 1.45], facing: 'E' },

    { id: 'dining-rug', model: 'rugRectangle', logic: 'rug@0,4', at: [4.5, 0.6], facing: 'S' },
    { id: 'dining-table', model: 'tableCloth', logic: 'table@0,6', at: [6.65, 0.7], facing: 'N' },
    { id: 'dining-chair', model: 'chair', logic: 'chair@1,3', at: [3.75, 1.55], facing: 'E' },
    // A reading corner on the rug: the chair now has a table to sit at.
    { id: 'dining-reading-table', model: 'tableCoffee', at: [4.5, 1.2], facing: 'E' },
    { id: 'dining-lamp', model: 'lampRoundFloor', logic: 'lamp@3,6', at: [6.5, 3.25] },

    { id: 'kitchen-table', model: 'table', logic: 'table@4,0', at: [0.6, 4.55], facing: 'N' },
    { id: 'kitchen-fridge', model: 'kitchenFridge', logic: 'fridge@4,3', at: [3.45, 4.6], facing: 'S' },
    { id: 'kitchen-stove', model: 'kitchenStove', logic: 'stove@6,3', at: [3.45, 6.5], facing: 'S' },
    { id: 'kitchen-counter-a', model: 'kitchenCabinet', logic: 'counter@6,0', at: [0.4, 6.45], facing: 'N' },
    { id: 'kitchen-counter-b', model: 'kitchenCabinetDrawer', logic: 'counter@6,0', at: [0.95, 6.45], facing: 'N' },
    { id: 'kitchen-sink', model: 'kitchenSink', at: [1.5, 6.45], facing: 'N' },

    { id: 'entry-shrub-west', model: 'plant_bushSmall', logic: 'shrub@6,4', at: [4.45, 6.45] },
    { id: 'entry-shrub-north', model: 'plant_bushSmall', logic: 'shrub@5,4', at: [4.8, 5.45] },
    { id: 'entry-plant', model: 'pottedPlant', logic: 'plant@4,7', at: [7.45, 4.5] },
  ],
}
