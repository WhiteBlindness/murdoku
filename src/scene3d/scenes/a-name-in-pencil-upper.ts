import type { SceneSpec } from '../schema'

// O patamar abre para o quarto; um eixo lateral distribui o piso superior.
export const aNameInPencilUpper: SceneSpec = {
  puzzleId: 'hard-6',
  floor: 1,
  storeyFootprint: { kind: 'full' },
  stairwellBounds: [3.30625, 0.860625, 4.29375, 3.139375],
  circulation: {
    landing: [3.30625, 3.139375, 4.29375, 3.95],
    halls: [
      { id: 'landing-cross-hall', bounds: [2.0, 3.2, 7.5, 3.95] },
      { id: 'west-spine-link', bounds: [1.2, 3.2, 2.8, 3.95] },
      { id: 'west-room-spine', bounds: [1.1, 3.2, 1.9, 6.0] },
      { id: 'bedroom-east-gallery', bounds: [4.2, 3.2, 6.7, 4.9] },
      { id: 'pantry-transfer', bounds: [5.9, 4.2, 6.7, 6.8] },
      { id: 'study-entry', bounds: [2.45, 0.9, 3.3, 3.9] },
    ],
    roomAccessTargets: [
      { id: 'study-access', bounds: [2.45, 0.9, 3.3, 1.8] },
      { id: 'bedroom-access', bounds: [4.2, 3.2, 5.0, 3.95] },
      { id: 'bathroom-access', bounds: [1.1, 5.8, 1.9, 6.45] },
      { id: 'pantry-access', bounds: [5.9, 6.0, 6.7, 6.75] },
    ],
  },
  shell: { features: [
    { wall: 'north', at: 0.8, kind: 'window' },
    { wall: 'north', at: 6.6, kind: 'window' },
    { wall: 'west', at: 6.4, kind: 'window' },
  ] },
  floors: [
    { id: 'study', cells: [0, 0, 7, 1], material: 'wood' },
    { id: 'bedroom', cells: [0, 2, 7, 4], material: 'wood' },
    { id: 'bathroom', cells: [0, 5, 4, 7], material: 'tile' },
    { id: 'pantry', cells: [5, 5, 7, 7], material: 'wood' },
  ],
  walls: [
    { id: 'study-bedroom-west', from: [0, 2], to: [3.30625, 2], height: 'half', openings: [{ at: 2.85, width: 0.9, kind: 'open' }] },
    { id: 'study-bedroom-east', from: [4.29375, 2], to: [8, 2], height: 'half', openings: [] },
    { id: 'bedroom-service', from: [0, 5], to: [8, 5], openings: [
      { at: 1.5, width: 1.2, kind: 'door' },
      { at: 6.5, width: 1.2, kind: 'door' },
    ] },
    { id: 'bathroom-pantry', from: [5, 5], to: [5, 8], openings: [{ at: 6.3, width: 1.2, kind: 'door' }] },
    { id: 'stairwell-west-guard', from: [3.30625, 0.860625], to: [3.30625, 3.0], height: 'half', treatment: 'railing', freeEnds: ['to'] },
    { id: 'stairwell-east-guard', from: [4.29375, 0.860625], to: [4.29375, 3.0], height: 'half', treatment: 'railing', freeEnds: ['to'] },
    { id: 'stairwell-north-guard', from: [3.30625, 0.860625], to: [4.29375, 0.860625], height: 'half', treatment: 'railing' },
  ],
  furniture: [
    { id: 'study-box-north', model: 'cardboardBoxClosed', logic: 'box@0,4', at: [4.5, 0.5] },
    { id: 'study-bookshelf', model: 'bookcaseOpenLow', logic: 'bookshelf@1,5', at: [6.0, 1.5], facing: 'N' },
    { id: 'study-desk-west', model: 'desk', logic: 'desk@1,2', at: [2.0, 1.0], facing: 'S' },
    { id: 'study-chair-west', model: 'chairDesk', at: [2.0, 1.6], facing: 'N' },
    { id: 'study-box-west', model: 'cardboardBoxClosed', logic: 'box@1,1', at: [1.5, 1.5] },
    { id: 'study-lamp-west', model: 'lampRoundFloor', logic: 'lamp@1,0', at: [0.5, 1.5] },
    { id: 'study-desk-east', model: 'desk', logic: 'desk@1,7', against: { wall: 'east', at: 1.5 } },
    { id: 'study-chair-east', model: 'chairDesk', at: [6.95, 1.5], facing: 'E' },

    { id: 'bedroom-lamp-east', model: 'lampRoundFloor', logic: 'lamp@4,3', at: [3.5, 4.5] },
    { id: 'bedroom-clock-west', model: 'speaker', logic: 'clock@4,0', at: [0.5, 4.5] },
    { id: 'bedroom-clock-centre', model: 'speaker', logic: 'clock@4,2', at: [2.5, 4.5] },
    { id: 'bedroom-rug', model: 'rugRectangle', logic: 'rug@2,3', at: [2.6, 2.65], facing: 'E' },
    { id: 'bedroom-lamp-southwest', model: 'lampRoundFloor', logic: 'lamp@3,0', at: [0.5, 3.5] },
    { id: 'bedroom-bed', model: 'bedSingle', against: { wall: 'west', at: 2.62 } },

    { id: 'bathroom-toilet', model: 'toilet', logic: 'toilet@5,2', against: { wall: 'bedroom-service', side: 'S', at: 2.5 } },
    { id: 'bathroom-washbasin', model: 'bathroomSink', against: { wall: 'west', at: 5.5 } },
    { id: 'bathroom-tub', model: 'bathtub', logic: 'bathtub@7,1', at: [2.0, 7.5], facing: 'S' },
    { id: 'bathroom-shower-north', model: 'shower', logic: 'shower@5,4', at: [4.0, 5.5], facing: 'S' },
    { id: 'bathroom-shower-south', model: 'shower', logic: 'shower@7,3', at: [3.5, 7.5], facing: 'S' },

    { id: 'pantry-counter', model: 'kitchenCabinet', logic: 'counter@6,7', at: [7.5, 6.5], facing: 'W' },
    { id: 'pantry-fridge', model: 'kitchenFridgeSmall', logic: 'fridge@5,7', at: [7.5, 5.5], facing: 'W' },
  ],
}
