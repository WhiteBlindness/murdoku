import type { SceneSpec } from '../schema'

// O patamar desemboca num corredor seco. A casa de banho abre para esse corredor,
// mas não faz parte do percurso entre o quarto e o escritório.
export const theUnlitLampUpper: SceneSpec = {
  puzzleId: 'hard-7',
  floor: 1,
  storeyFootprint: { kind: 'full' },
  stairwellBounds: [2.15625, 0.860625, 3.14375, 3.139375],
  circulation: {
    landing: [2.15625, 3.139375, 3.14375, 3.889375],
    halls: [
      { id: 'study-bedroom-link', bounds: [2.0, 3.14, 4.0, 3.94] },
      { id: 'bedroom-gallery', bounds: [3.0, 3.6, 3.84, 6.08] },
      { id: 'south-service-gallery', bounds: [3.0, 6.08, 8.0, 7.0] },
    ],
    roomAccessTargets: [
      { id: 'study-landing', bounds: [2.0, 3.2, 2.85, 3.85] },
      { id: 'bedroom-door', bounds: [2.4, 5.1, 3.75, 5.9] },
      { id: 'bathroom-door', bounds: [4.35, 6.08, 5.15, 6.9] },
      { id: 'office-door', bounds: [6.6, 6.08, 7.4, 6.8] },
    ],
  },
  shell: { features: [
    { wall: 'north', at: 1.4, kind: 'window' },
    { wall: 'north', at: 5.2, kind: 'window' },
    { wall: 'west', at: 1.4, kind: 'window' },
  ] },
  floors: [
    { id: 'study', cells: [0, 0, 3, 3], material: 'wood' },
    { id: 'bedroom', cells: [0, 4, 2, 7], material: 'wood' },
    { id: 'private-gallery', cells: [3, 4, 3, 7], material: 'stone' },
    { id: 'bathroom', cells: [4, 0, 5, 5], material: 'tile' },
    { id: 'office', cells: [6, 0, 7, 5], material: 'wood' },
    { id: 'south-gallery', cells: [3, 7, 7, 7], material: 'stone' },
  ],
  walls: [
    { id: 'study-bedroom', from: [0, 4], to: [3, 4], openings: [{ at: 2.4, width: 1.2, kind: 'door' }] },
    { id: 'bedroom-hall', from: [3, 4], to: [3, 8], openings: [{ at: 5.5, width: 1.2, kind: 'door' }] },
    { id: 'study-bathroom', from: [4.2, 0], to: [4.2, 6] },
    { id: 'bathroom-office', from: [6, 0], to: [6, 6] },
    { id: 'service-south', from: [4.2, 6], to: [8, 6], openings: [
      { at: 4.8, width: 1.0, kind: 'door' },
      { at: 7.0, width: 1.2, kind: 'door' },
    ] },
    { id: 'stairwell-west-guard', from: [2.15625, 0.860625], to: [2.15625, 3.089375], height: 'half', treatment: 'railing', freeEnds: ['to'] },
    { id: 'stairwell-east-guard', from: [3.14375, 0.860625], to: [3.14375, 3.089375], height: 'half', treatment: 'railing', freeEnds: ['to'] },
    { id: 'stairwell-north-guard', from: [2.15625, 0.860625], to: [3.14375, 0.860625], height: 'half', treatment: 'railing' },
  ],
  furniture: [
    { id: 'study-box-north', model: 'cardboardBoxClosed', logic: 'box@0,0', at: [0.5, 0.5] },
    { id: 'study-box-south', model: 'cardboardBoxClosed', logic: 'box@1,1', at: [1.5, 1.5] },
    { id: 'study-lamp', model: 'lampRoundFloor', logic: 'lamp@2,0', at: [0.55, 2.55] },
    { id: 'study-bookcase', model: 'bookcaseOpenLow', logic: 'bookshelf@2,3', at: [3.45, 2.45], facing: 'W' },

    { id: 'bedroom-bed', model: 'bedDouble', logic: 'bed@4,1', at: [1.6, 5.8], facing: 'N' },
    { id: 'bedroom-clock-table', model: 'sideTable', at: [2.35, 7.35], facing: 'N' },
    { id: 'bedroom-clock', model: 'radio', logic: 'clock@7,2', on: { parent: 'bedroom-clock-table' } },
    { id: 'gallery-lamp', model: 'lampRoundFloor', logic: 'lamp@5,3', at: [3.96, 5.5] },

    { id: 'bathroom-toilet', model: 'toilet', logic: 'toilet@0,5', at: [5.5, 0.5], facing: 'W' },
    { id: 'bathroom-shower', model: 'shower', logic: 'shower@2,5', at: [5.5, 1.8], facing: 'E' },
    { id: 'bathroom-tub-south', model: 'bathtub', logic: 'bathtub@5,4', at: [4.7, 4.65], facing: 'E' },
    { id: 'bathroom-tub-north', model: 'bathtub', logic: 'bathtub@4,5', at: [5.55, 3.5], facing: 'E' },
    { id: 'bathroom-sink', model: 'bathroomSink', against: { wall: 'bathroom-office', at: 5.0, side: 'W' } },

    { id: 'office-chair', model: 'chair', logic: 'chair@1,6', at: [6.35, 1.45], facing: 'E' },
    { id: 'office-desk', model: 'desk', logic: 'desk@1,7', at: [7.35, 1.45], facing: 'W' },
    { id: 'office-bookcase', model: 'bookcaseOpenLow', logic: 'bookshelf@2,7', at: [7.45, 2.55], facing: 'W' },
  ],
  rugs: [
    { id: 'bedroom-rug', model: 'rugRectangle', at: [1.9, 5.1], facing: 'E' },
  ],
}
