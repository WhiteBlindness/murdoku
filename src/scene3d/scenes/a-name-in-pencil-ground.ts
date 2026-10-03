import type { SceneSpec } from '../schema'

// Casa urbana organizada em torno de uma sala a nascente e de um jardim baixo.
export const aNameInPencilGround: SceneSpec = {
  puzzleId: 'hard-6',
  floor: 0,
  storeyFootprint: { kind: 'full' },
  entry: { wall: 'north', at: 4.5 },
  shell: { features: [
    { wall: 'north', at: 1.4, kind: 'window' },
    { wall: 'west', at: 2.2, kind: 'window' },
  ] },
  stairs: { model: 'stairsOpen', at: [3.8, 2.0], facing: 'S' },
  exteriorSupportBays: [
    { id: 'front-yard-west', cells: [0, 5, 2, 7] },
    { id: 'front-yard-east', cells: [3, 5, 4, 7] },
  ],
  floors: [
    { id: 'dining-room', cells: [0, 0, 2, 4], material: 'wood' },
    { id: 'central-hall', cells: [3, 0, 4, 4], material: 'stone' },
    { id: 'living-room', cells: [5, 0, 7, 7], material: 'wood' },
    { id: 'front-yard', cells: [0, 5, 4, 7], material: 'grass', kind: 'exterior' },
  ],
  walls: [
    { id: 'dining-hall', from: [3, 0], to: [3, 5], openings: [{ at: 3.8, width: 1.2, kind: 'door' }] },
    { id: 'hall-living', from: [5, 0], to: [5, 5], height: 'half', openings: [{ at: 3.8, width: 1.2, kind: 'open' }] },
    { id: 'front-yard-facade', from: [0, 5], to: [5, 5], height: 'half', openings: [
      { at: 3.8, width: 1.2, kind: 'open' },
    ] },
    { id: 'yard-living-facade', from: [5, 5], to: [5, 8], height: 'half', openings: [
      { at: 6.5, width: 1.2, kind: 'open' },
    ] },
  ],
  furniture: [
    { id: 'living-sofa-south', model: 'loungeSofaLong', logic: 'sofa@5,5', at: [5.75, 5.2], facing: 'N' },
    { id: 'living-tv-north', model: 'cabinetTelevision', logic: 'tv@0,6', at: [6.5, 0.5], facing: 'N' },
    { id: 'living-clock-north', model: 'speaker', logic: 'clock@1,7', at: [7.5, 1.5] },
    { id: 'living-clock-south', model: 'speaker', logic: 'clock@7,5', at: [5.5, 7.5] },
    { id: 'living-tv-south', model: 'cabinetTelevision', logic: 'tv@4,5', at: [6.1, 4.3], facing: 'N' },
    { id: 'yard-shrub-southwest', model: 'plant_bushSmall', logic: 'shrub@6,0', at: [0.5, 6.5] },
    { id: 'yard-plant-west', model: 'flower_purpleA', logic: 'plant@5,4', at: [4.5, 5.5] },
    { id: 'yard-shrub-northwest', model: 'plant_bushSmall', logic: 'shrub@5,0', at: [0.5, 5.5] },
    { id: 'yard-plant-south', model: 'flower_yellowA', logic: 'plant@7,4', at: [4.5, 7.5] },
    { id: 'dining-chair', model: 'chair', logic: 'chair@3,0', at: [0.5, 3.5], facing: 'N' },
    { id: 'dining-lamp-north', model: 'lampRoundFloor', logic: 'lamp@1,2', at: [2.5, 1.5] },
    { id: 'dining-lamp-south', model: 'lampRoundFloor', logic: 'lamp@2,2', at: [2.5, 2.5] },
    { id: 'hall-plant', model: 'flower_redA', logic: 'plant@3,4', at: [4.5, 3.05] },
    { id: 'hall-clock', model: 'speaker', logic: 'clock@4,4', at: [4.7, 4.6] },
    { id: 'living-sofa-east', model: 'loungeSofaLong', logic: 'sofa@4,6', at: [7.2, 4.5], facing: 'W' },
  ],
}
