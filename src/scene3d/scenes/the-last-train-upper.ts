import type { SceneSpec } from '../schema'

// O piso superior reúne um quarto compacto, uma galeria central e duas divisões de serviço.
export const theLastTrainUpper: SceneSpec = {
  puzzleId: 'hard-3',
  floor: 1,
  storeyFootprint: { kind: 'full' },
  stairwellBounds: [5.25625, 0.860625, 6.24375, 3.139375],
  circulation: {
    landing: [5.25625, 3.139375, 6.24375, 3.889375],
    halls: [
      { id: 'study-link', bounds: [3.1, 3.139375, 6.02, 3.95] },
      { id: 'hall-north', bounds: [3.75, 0.5, 4.5, 1.7] },
      { id: 'clock-bypass', bounds: [3.75, 1.7, 4.5, 3.95] },
      { id: 'hall-south', bounds: [3.0, 3.2, 3.9, 7.1] },
      { id: 'kitchen-transfer', bounds: [3.1, 0.5, 4.8, 1.4] },
      { id: 'kitchen-branch', bounds: [4.0, 0.1, 5.9, 0.85] },
      { id: 'bedroom-branch', bounds: [3.0, 5.3, 4.57, 6.1] },
      { id: 'bathroom-branch', bounds: [3.1, 5.1, 5.9, 5.85] },
    ],
    roomAccessTargets: [
      { id: 'study-door', bounds: [5.05, 3.2, 5.9, 3.95] },
      { id: 'hall-door', bounds: [3.1, 3.95, 3.85, 4.7] },
      { id: 'kitchen-door', bounds: [5.05, 0.1, 5.8, 0.85] },
      { id: 'bedroom-door', bounds: [3.0, 5.3, 3.85, 6.1] },
      { id: 'bathroom-door', bounds: [5.05, 5.1, 5.9, 5.85] },
    ],
  },
  shell: { features: [
    { wall: 'north', at: 1.5, kind: 'window' },
    { wall: 'north', at: 6.7, kind: 'window' },
    { wall: 'west', at: 6.5, kind: 'window' },
  ] },
  floors: [
    { id: 'bedroom-floor', cells: [0, 0, 2, 7], material: 'wood' },
    { id: 'upper-hall-floor', cells: [3, 0, 4, 7], material: 'wood' },
    { id: 'study-floor', cells: [5, 0, 7, 3], material: 'wood' },
    { id: 'bathroom-floor', cells: [5, 4, 7, 7], material: 'tile' },
  ],
  walls: [
    { id: 'bedroom-hall', from: [3, 0], to: [3, 8], height: 'half', openings: [
      { at: 5.7, width: 1.2, kind: 'door' },
    ] },
    { id: 'hall-east-north', from: [5, 0], to: [5, 2.4], height: 'half', openings: [{ at: 0.65, width: 1.2, kind: 'door' }], freeEnds: ['to'] },
    { id: 'hall-east-south', from: [5, 4.0], to: [5, 8], height: 'half', freeEnds: ['from'], openings: [
      { at: 5.4, width: 1.2, kind: 'door' },
    ] },
    { id: 'study-bathroom', from: [5, 4], to: [8, 4], height: 'half' },
    { id: 'stairwell-west-guard', from: [5.25625, 0.95], to: [5.25625, 2.95], height: 'half', treatment: 'railing', freeEnds: ['from', 'to'] },
    { id: 'stairwell-east-guard', from: [6.24375, 0.95], to: [6.24375, 2.95], height: 'half', treatment: 'railing', freeEnds: ['from', 'to'] },
    { id: 'stairwell-north-guard', from: [6.1, 0.780625], to: [6.24375, 0.780625], height: 'half', treatment: 'railing', freeEnds: ['from', 'to'] },
  ],
  furniture: [
    { id: 'bedroom-bed', model: 'bedDouble', against: { wall: 'west', at: 4.45 } },
    { id: 'bedroom-nightstand', model: 'cabinetBedDrawerTable', against: { wall: 'west', at: 3.4 } },
    { id: 'bedroom-bedside-lamp', model: 'lampRoundTable', on: { parent: 'bedroom-nightstand' } },
    { id: 'bedroom-rug', model: 'rugRectangle', logic: 'rug@2,0', at: [0.65, 2.5], facing: 'E' },
    { id: 'bedroom-lamp', model: 'lampRoundFloor', logic: 'lamp@0,0', at: [0.35, 0.45] },
    { id: 'bedroom-clock-west-table', model: 'sideTable', at: [0.55, 7.35] },
    { id: 'bedroom-clock-west', model: 'radio', logic: 'clock@7,0', on: { parent: 'bedroom-clock-west-table' } },
    { id: 'bedroom-clock-east-table', model: 'sideTable', at: [2.45, 7.35] },
    { id: 'bedroom-clock-east', model: 'radio', logic: 'clock@7,2', on: { parent: 'bedroom-clock-east-table' } },
    { id: 'bedroom-lamp-south', model: 'lampRoundFloor', logic: 'lamp@7,1', at: [1.5, 7.35] },

    { id: 'hall-plant-north', model: 'flower_yellowA', logic: 'plant@0,3', at: [3.2, 0.3] },
    { id: 'hall-plant-east', model: 'flower_purpleA', logic: 'plant@1,4', at: [4.65, 1.6] },
    { id: 'hall-clock-west-table', model: 'sideTable', at: [3.4, 2.05] },
    { id: 'hall-clock-west', model: 'radio', logic: 'clock@2,3', on: { parent: 'hall-clock-west-table' } },
    { id: 'hall-clock-east-table', model: 'sideTable', at: [4.8, 2.2], facing: 'E' },
    { id: 'hall-clock-east', model: 'radio', logic: 'clock@2,4', on: { parent: 'hall-clock-east-table' } },
    { id: 'hall-plant-south', model: 'flower_redA', logic: 'plant@6,4', at: [4.25, 6.6] },

    { id: 'study-desk', model: 'desk', logic: 'desk@0,7', at: [7.4, 0.5], facing: 'W' },
    { id: 'study-box', model: 'cardboardBoxClosed', logic: 'box@3,7', at: [7.35, 3.5] },
    { id: 'bathroom-bathtub', model: 'bathtub', logic: 'bathtub@7,6', at: [6.4, 7.35], facing: 'N' },
    { id: 'bathroom-toilet', model: 'toilet', logic: 'toilet@5,7', at: [7.35, 5.45], facing: 'W' },
    { id: 'bathroom-washbasin', model: 'bathroomSink', against: { wall: 'study-bathroom', side: 'S', at: 6.2 } },
  ],
}
