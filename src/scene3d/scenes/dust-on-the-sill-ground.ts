import type { SceneSpec } from '../schema'

// The west garden remains open ground; two measured bays carry the bedroom
// above it. Entry arrives at the east hall, with the stair reserved in dining.
export const dustOnTheSillGround: SceneSpec = {
  puzzleId: 'expert-4',
  floor: 0,
  storeyFootprint: { kind: 'full' },
  entry: { wall: 'north', at: 6.8 },
  shell: { features: [
    { wall: 'north', at: 4.5, kind: 'window' },
  ] },
  stairs: { model: 'stairsOpen', at: [2.8, 6.5], facing: 'E' },
  exteriorSupportBays: [
    { id: 'front-yard-north', cells: [0, 0, 2, 2] },
    { id: 'front-yard-south', cells: [0, 3, 2, 4] },
  ],
  floors: [
    { id: 'front-yard-ground', cells: [0, 0, 2, 4], material: 'grass', kind: 'exterior' },
    { id: 'living-room-floor', cells: [3, 0, 5, 4], material: 'wood' },
    { id: 'entry-hall-floor', cells: [6, 0, 7, 4], material: 'stone' },
    { id: 'dining-room-floor', cells: [0, 5, 7, 7], material: 'wood' },
  ],
  walls: [
    { id: 'yard-living-facade', from: [3, 0], to: [3, 5], height: 'half', openings: [{ at: 1.5, width: 1, kind: 'door' }] },
    { id: 'yard-dining-facade', from: [0, 5], to: [3, 5], height: 'half', openings: [{ at: 2.4, width: 0.8, kind: 'door' }] },
    { id: 'living-dining', from: [3, 5], to: [6, 5], height: 'half', openings: [{ at: 4, width: 0.8, kind: 'open' }] },
    { id: 'hall-dining', from: [6, 5], to: [8, 5], openings: [{ at: 6.6, width: 0.8, kind: 'door' }] },
  ],
  furniture: [
    { id: 'yard-shrub-south-west', model: 'plant_bushSmall', logic: 'shrub@4,0', at: [0.5, 4.5] },
    { id: 'yard-shrub-south-centre', model: 'plant_bushSmall', logic: 'shrub@4,1', at: [1.5, 4.5] },
    { id: 'yard-shrub-clue', model: 'plant_bushSmall', logic: 'shrub@0,1', at: [1.5, 0.5] },
    { id: 'yard-plant-west', model: 'pottedPlant', logic: 'plant@1,0', at: [0.5, 1.5] },
    { id: 'yard-plant-north-west', model: 'pottedPlant', logic: 'plant@0,0', at: [0.5, 0.5] },

    { id: 'living-tv-north-stand', model: 'cabinetTelevision', at: [4.5, 0.55], facing: 'S' },
    { id: 'living-tv-north', model: 'televisionModern', logic: 'tv@0,4', on: { parent: 'living-tv-north-stand' } },
    { id: 'living-sofa-north', model: 'loungeSofa', logic: 'sofa@1,4', at: [5, 1.65], facing: 'N' },
    { id: 'living-clock', model: 'speaker', logic: 'clock@2,3', at: [3.5, 2.5] },
    { id: 'living-tv-west-stand', model: 'cabinetTelevision', against: { wall: 'yard-living-facade', at: 4.25, side: 'E' } },
    { id: 'living-tv-west', model: 'televisionVintage', logic: 'tv@4,3', on: { parent: 'living-tv-west-stand' } },
    { id: 'living-sofa-south', model: 'loungeSofa', logic: 'sofa@4,4', at: [5, 4.3], facing: 'W' },

    { id: 'entry-hall-clock-west', model: 'speaker', logic: 'clock@1,6', at: [6.5, 1.5] },
    { id: 'entry-hall-clock-east', model: 'speaker', logic: 'clock@1,7', at: [7.5, 1.5] },
    { id: 'entry-hall-plant', model: 'pottedPlant', logic: 'plant@3,7', at: [7.5, 3.5] },

    { id: 'dining-table', model: 'table', logic: 'table@5,3', at: [4.5, 6.25], facing: 'N' },
    { id: 'dining-chair-north', model: 'chairCushion', at: [4.65, 5.68], facing: 'S' },
    { id: 'dining-chair-south-west', model: 'chairCushion', at: [4.2, 6.85], facing: 'N' },
    { id: 'dining-chair-south-east', model: 'chairCushion', at: [4.8, 6.85], facing: 'N' },
    { id: 'dining-chair-east', model: 'chairCushion', at: [5.4, 6.25], facing: 'W' },
    // Cozinha em linha na parede poente da sala de jantar, ao lado do pé da escada.
    { id: 'kitchen-fridge', model: 'kitchenFridge', against: { wall: 'west', at: 5.4 }, facing: 'E' },
    { id: 'kitchen-cabinet-north', model: 'kitchenCabinet', against: { wall: 'west', at: 5.94 }, facing: 'E' },
    { id: 'kitchen-stove', model: 'kitchenStove', against: { wall: 'west', at: 6.48 }, facing: 'E' },
    { id: 'kitchen-sink', model: 'kitchenSink', against: { wall: 'west', at: 7.02 }, facing: 'E' },
    { id: 'kitchen-cabinet-south', model: 'kitchenCabinetDrawer', against: { wall: 'west', at: 7.56 }, facing: 'E' },
    { id: 'dining-chair', model: 'chair', logic: 'chair@7,2', at: [2.5, 7.5], facing: 'W' },
    { id: 'dining-lamp-south', model: 'lampRoundFloor', logic: 'lamp@7,6', at: [6.5, 7.5] },
    { id: 'dining-lamp-clue', model: 'lampRoundFloor', logic: 'lamp@5,7', at: [7.5, 5.5] },
  ],
}
