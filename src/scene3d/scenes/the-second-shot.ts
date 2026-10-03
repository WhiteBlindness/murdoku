import type { SceneSpec } from '../schema'

// Casa urbana compacta com corredor central, cozinha de serviço e jantar.
export const theSecondShot: SceneSpec = {
  puzzleId: 'medium-10',
  floor: 0,
  entry: { wall: 'north', at: 4 },
  shell: { features: [
    { wall: 'north', at: 1.5, kind: 'window' },
    { wall: 'north', at: 6.7, kind: 'window' },
    { wall: 'west', at: 5.7, kind: 'window' },
  ] },
  floors: [
    { id: 'office-floor', cells: [0, 0, 2, 2], material: 'wood' },
    { id: 'dining-floor', cells: [0, 3, 2, 7], material: 'wood' },
    { id: 'gallery-floor', cells: [3, 0, 4, 7], material: 'tile' },
    { id: 'kitchen-floor', cells: [5, 0, 7, 7], material: 'tile' },
  ],
  walls: [
    { id: 'office-dining', from: [0, 3], to: [3, 3], openings: [{ at: 1.45, width: 1.1, kind: 'door' }] },
    { id: 'gallery-west', from: [3, 0], to: [3, 8], openings: [
      { at: 1.55, width: 1.2, kind: 'door' },
      { at: 5.7, width: 1.25, kind: 'open' },
    ] },
    { id: 'gallery-kitchen', from: [5, 0], to: [5, 8], height: 'half', openings: [
      { at: 2.25, width: 1.25, kind: 'open' },
      { at: 6.25, width: 1.25, kind: 'open' },
    ] },
  ],
  furniture: [
    { id: 'office-desk', model: 'desk', logic: 'desk@0,2', at: [2.5, 0.4], facing: 'N' },
    { id: 'office-chair', model: 'chairDesk', logic: 'chair@2,2', at: [2.3, 2.35], facing: 'W' },

    { id: 'dining-lamp-west', model: 'lampRoundFloor', logic: 'lamp@5,0', at: [0.5, 5.5] },
    { id: 'dining-lamp-east', model: 'lampRoundFloor', logic: 'lamp@5,2', at: [2.1, 5.45] },
    { id: 'dining-lamp-south', model: 'lampSquareFloor', logic: 'lamp@4,2', at: [2.4, 4.45] },
    { id: 'dining-chair', model: 'chair', logic: 'chair@7,2', at: [2.45, 7.45], facing: 'W' },

    { id: 'hall-clock-table', model: 'sideTable', at: [3.45, 2.5] },
    { id: 'hall-clock', model: 'radio', logic: 'clock@2,3', on: { parent: 'hall-clock-table' } },
    { id: 'hall-rug', model: 'rugRectangle', logic: 'rug@5,3', at: [4, 5.7], facing: 'E' },
    { id: 'hall-plant', model: 'pottedPlant', logic: 'plant@7,4', at: [4.5, 7.45] },

    { id: 'kitchen-counter-run-a', model: 'kitchenCabinet', logic: 'counter@0,5', at: [5.45, 0.65], facing: 'E' },
    { id: 'kitchen-counter-run-b', model: 'kitchenCabinetDrawer', logic: 'counter@0,5', at: [6.35, 0.65], facing: 'E' },
    { id: 'kitchen-fridge', model: 'kitchenFridge', logic: 'fridge@0,7', at: [7.45, 0.6], facing: 'S' },
    { id: 'kitchen-stove', model: 'kitchenStove', logic: 'stove@1,5', at: [5.7, 1.3], facing: 'E' },
    { id: 'kitchen-island-counter', model: 'kitchenCabinet', logic: 'counter@3,7', at: [7.5, 3.75], facing: 'W' },
    { id: 'kitchen-breakfast-table', model: 'table', logic: 'table@7,5', at: [6.1, 7.15], facing: 'N' },
    { id: 'kitchen-breakfast-seat', model: 'chair', at: [6.1, 6.45], facing: 'S' },
  ],
}
