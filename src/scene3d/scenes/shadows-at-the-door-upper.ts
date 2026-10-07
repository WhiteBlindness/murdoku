import type { SceneSpec } from '../schema'
import { shadowsAtTheDoorStairwellBounds } from './shadows-at-the-door-ground'

const well = shadowsAtTheDoorStairwellBounds
const guardOffset = 0.065

export const shadowsAtTheDoorUpper: SceneSpec = {
  puzzleId: 'master-2',
  floor: 1,
  storeyFootprint: { kind: 'full' },
  stairwellBounds: well,
  circulation: {
    landing: [well[0], well[3], well[2], well[3] + 0.83],
    halls: [
      { id: 'study-south-gallery', bounds: [1.1, well[3] + 0.07, 3.1, 7.93] },
      { id: 'study-east-gallery', bounds: [2.35, 6.3, 3.2, 7.93] },
      { id: 'study-hall-entry', bounds: [2.35, 5.8, 4.1, 6.8] },
      { id: 'hallway-west-lane', bounds: [4.05, 4, 4.9, 6.8] },
      { id: 'hallway-turn', bounds: [4.1, 3.25, 5.9, 4.1] },
      { id: 'hallway-east-lane', bounds: [4.9, 1.2, 5.9, 4] },
    ],
    roomAccessTargets: [
      { id: 'bedroom-entry', bounds: [3.65, 2, 4.9, 2.85] },
      { id: 'study-entry', bounds: [3.5, 5.85, 4.8, 6.8] },
      { id: 'bathroom-entry', bounds: [5.2, 1.3, 6.8, 2.3] },
      { id: 'bathroom-south-entry', bounds: [4.9, 5.85, 5.95, 6.75] },
    ],
  },
  shell: { features: [
    { wall: 'north', at: 1.5, kind: 'window' },
    { wall: 'north', at: 7, kind: 'window' },
  ] },
  floors: [
    { id: 'bedroom-floor', cells: [0, 0, 3, 3], material: 'wood', kind: 'interior' },
    { id: 'study-floor', cells: [0, 4, 3, 7], material: 'wood', kind: 'interior' },
    { id: 'hallway-floor', cells: [4, 0, 5, 7], material: 'wood', kind: 'interior' },
    { id: 'bathroom-floor', cells: [6, 0, 7, 7], material: 'tile', kind: 'interior' },
  ],
  walls: [
    { id: 'bedroom-study-partition', from: [0, 4], to: [4, 4], height: 'half', openings: [{ at: 2.5, width: 1.2, kind: 'door' }] },
    { id: 'bedroom-hallway-partition', from: [4, 0], to: [4, 4], height: 'half', openings: [{ at: 2.5, width: 1.2, kind: 'door' }] },
    { id: 'study-hallway-partition', from: [4, 4], to: [4, 8], height: 'half', openings: [{ at: 6.3, width: 1.2, kind: 'door' }] },
    { id: 'hallway-bathroom-partition', from: [6, 0], to: [6, 8], height: 'half', openings: [{ at: 1.8, width: 1, kind: 'door' }, { at: 6.3, width: 1, kind: 'door' }] },
    // A faixa de serviço divide-se em duas casas de banho, cada uma com porta para o corredor.
    { id: 'bathroom-split', from: [6, 4.6], to: [8, 4.6], height: 'half' },
    { id: 'stairwell-west-guard', from: [well[0] - guardOffset, well[1] - guardOffset], to: [well[0] - guardOffset, well[3]], height: 'half', treatment: 'railing', freeEnds: ['to'] },
    { id: 'stairwell-east-guard', from: [well[2] + guardOffset, well[1] - guardOffset], to: [well[2] + guardOffset, well[3]], height: 'half', treatment: 'railing', freeEnds: ['to'] },
    { id: 'stairwell-north-guard', from: [well[0] - guardOffset, well[1] - guardOffset], to: [well[2] + guardOffset, well[1] - guardOffset], height: 'half', treatment: 'railing' },
  ],
  furniture: [
    { id: 'bedroom-bed', model: 'bedDouble', against: { wall: 'bedroom-hallway-partition', side: 'W', at: 1.3 }, facing: 'W' },
    { id: 'bedroom-clock-east', model: 'speaker', logic: 'clock@2,3', at: [3.15, 2.2], facing: 'S' },
    { id: 'bedroom-lamp', model: 'lampRoundFloor', logic: 'lamp@0,3', at: [3.5, 0.5], facing: 'S' },
    { id: 'bedroom-clock-south', model: 'speaker', logic: 'clock@3,1', at: [1.5, 3.5], facing: 'S' },

    { id: 'study-box', model: 'cardboardBoxClosed', logic: 'box@4,0', at: [0.5, 4.5], facing: 'S' },
    { id: 'study-desk', model: 'desk', logic: 'desk@7,0', at: [0.53, 7.47], facing: 'N' },
    { id: 'study-chair', model: 'chairDesk', at: [0.55, 6.55], facing: 'S' },
    { id: 'study-lamp', model: 'lampRoundFloor', logic: 'lamp@7,3', at: [3.5, 7.5], facing: 'S' },

    { id: 'hallway-rug', model: 'rugRectangle', logic: 'rug@0,4', at: [5, 0.8], facing: 'S' },
    { id: 'hallway-clock', model: 'speaker', logic: 'clock@5,5', at: [5.5, 5.5], facing: 'S' },
    { id: 'hallway-plant', model: 'pottedPlant', logic: 'plant@3,4', at: [4.75, 3.1], facing: 'S' },
    { id: 'hallway-south-plant', model: 'pottedPlant', logic: 'plant@7,5', at: [5.5, 7.5], facing: 'S' },

    { id: 'bathroom-toilet-north', model: 'toilet', logic: 'toilet@0,7', at: [7.5, 0.5], facing: 'S' },
    { id: 'bathroom-shower-north', model: 'showerRound', logic: 'shower@1,7', at: [7.5, 1.6], facing: 'S' },
    { id: 'bathroom-sink-north', model: 'bathroomSink', against: { wall: 'hallway-bathroom-partition', side: 'E', at: 0.6 }, facing: 'E' },
    { id: 'bathroom-toilet-clue', model: 'toilet', logic: 'toilet@5,7', at: [7.5, 5.5], facing: 'W' },
    { id: 'bathroom-shower-south', model: 'showerRound', logic: 'shower@7,7', at: [7.5, 7.5], facing: 'S' },
    { id: 'bathroom-sink-south', model: 'bathroomSink', against: { wall: 'south', at: 6.5 }, facing: 'N' },
    { id: 'bathroom-bathtub-west', model: 'bathtub', logic: 'bathtub@3,6', at: [6.5, 3.2], facing: 'E' },
    { id: 'bathroom-bathtub-east', model: 'bathtub', logic: 'bathtub@3,7', at: [7.5, 3.2], facing: 'W' },
  ],
}
