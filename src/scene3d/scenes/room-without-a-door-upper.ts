import type { SceneSpec } from '../schema'

// A escada chega ao patamar; um corredor de serviço liga as restantes divisões.
export const roomWithoutADoorUpper: SceneSpec = {
  puzzleId: 'hard-4',
  floor: 1,
  storeyFootprint: { kind: 'full' },
  stairwellBounds: [1.660625, 6.10625, 3.939375, 7.09375],
  circulation: {
    landing: [3.939375, 6.10625, 4.689375, 7.09375],
    halls: [
      { id: 'bedroom-east-run', bounds: [4.4, 3.1, 5.2, 6.95] },
      { id: 'study-service-link', bounds: [1.1, 3.1, 5.2, 3.9] },
      { id: 'study-corridor', bounds: [1.1, 0.8, 1.85, 4.0] },
      { id: 'kitchen-link', bounds: [1.1, 0.25, 3.9, 1.05] },
    ],
    roomAccessTargets: [
      { id: 'bedroom-door', bounds: [4.4, 6.1, 5.089375, 6.85] },
      { id: 'study-door', bounds: [1.1, 3.1, 1.85, 3.9] },
      { id: 'kitchen-door', bounds: [3.05, 0.25, 3.9, 1.05] },
      { id: 'bathroom-door', bounds: [3.05, 3.1, 3.9, 3.9] },
    ],
  },
  shell: { features: [
    { wall: 'north', at: 1.4, kind: 'window' },
    { wall: 'north', at: 6.8, kind: 'window' },
  ] },
  floors: [
    { id: 'study-floor', cells: [0, 0, 2, 4], material: 'wood' },
    { id: 'kitchen-floor', cells: [3, 0, 7, 1], material: 'tile' },
    { id: 'bathroom-floor', cells: [3, 2, 7, 4], material: 'tile' },
    { id: 'bedroom-floor', cells: [0, 5, 7, 7], material: 'wood' },
  ],
  walls: [
    { id: 'study-service-wall', from: [3, 0], to: [3, 5], height: 'half', openings: [
      { at: 0.7, width: 1.2, kind: 'door' },
      { at: 3.5, width: 1.2, kind: 'door' },
    ] },
    { id: 'kitchen-bathroom-wall', from: [3, 2], to: [8, 2], height: 'half' },
    { id: 'bedroom-north-wall', from: [0, 5], to: [8, 5], height: 'half', openings: [
      { at: 2.5, width: 1.2, kind: 'open' },
      { at: 4.7, width: 1.2, kind: 'door' },
      { at: 6.0, width: 1.2, kind: 'open' },
    ] },
    { id: 'stairwell-west-guard', from: [1.660625, 6.10625], to: [1.660625, 7.09375], height: 'half', treatment: 'railing', freeEnds: ['from', 'to'] },
    { id: 'stairwell-north-guard', from: [1.660625, 6.02625], to: [3.939375, 6.02625], height: 'half', treatment: 'railing', freeEnds: ['from', 'to'] },
    { id: 'stairwell-south-guard', from: [1.660625, 7.17375], to: [3.939375, 7.17375], height: 'half', treatment: 'railing', freeEnds: ['from', 'to'] },
  ],
  furniture: [
    { id: 'study-box', model: 'cardboardBoxClosed', logic: 'box@0,0', at: [0.5, 0.5] },
    { id: 'study-bookcase', model: 'bookcaseOpenLow', logic: 'bookshelf@1,2', at: [2.5, 1.7], facing: 'W' },
    { id: 'study-desk-north', model: 'desk', logic: 'desk@2,0', at: [0.5, 2.5], facing: 'E' },
    { id: 'study-desk-south', model: 'desk', logic: 'desk@3,0', at: [0.5, 3.5], facing: 'E' },

    { id: 'kitchen-stove-north', model: 'kitchenStove', logic: 'stove@0,6', at: [6.5, 0.5], facing: 'S' },
    { id: 'kitchen-stove-south', model: 'kitchenStove', logic: 'stove@1,4', at: [4.5, 1.0], facing: 'S' },
    { id: 'kitchen-fridge', model: 'kitchenFridge', logic: 'fridge@1,5', at: [5.5, 1.0], facing: 'E' },

    { id: 'bathroom-toilet-west', model: 'toilet', logic: 'toilet@2,4', at: [4.7, 2.5], facing: 'E' },
    { id: 'bathroom-toilet-east', model: 'toilet', logic: 'toilet@2,6', at: [6.2, 2.4], facing: 'W' },
    { id: 'bathroom-shower-north', model: 'shower', logic: 'shower@2,7', at: [7.3, 2.5], facing: 'E' },
    { id: 'bathroom-shower-south', model: 'shower', logic: 'shower@4,6', at: [6.5, 3.8], facing: 'E' },
    { id: 'study-lamp-south', model: 'lampRoundFloor', logic: 'lamp@4,1', at: [1.5, 4.5] },

    { id: 'bedroom-rug', model: 'rugRectangle', logic: 'rug@5,3', at: [3.6, 5.0], facing: 'E' },
    { id: 'bedroom-clock-west-table', model: 'sideTable', at: [1.5, 7.4] },
    { id: 'bedroom-clock-west', model: 'radio', logic: 'clock@7,1', on: { parent: 'bedroom-clock-west-table' } },
    { id: 'bedroom-clock-east-table', model: 'sideTable', at: [7.5, 7.4] },
    { id: 'bedroom-clock-east', model: 'radio', logic: 'clock@7,7', on: { parent: 'bedroom-clock-east-table' } },
    { id: 'bedroom-lamp-east', model: 'lampRoundFloor', logic: 'lamp@7,6', at: [6.5, 7.4] },
    { id: 'bedroom-lamp-south', model: 'lampRoundFloor', logic: 'lamp@6,7', at: [7.5, 6.5] },
  ],
}
