import type { SceneSpec } from '../schema'

// Moradia de dois pisos com átrio central, pátio ajardinado e escada aberta.
export const roomWithoutADoorGround: SceneSpec = {
  puzzleId: 'hard-4',
  floor: 0,
  storeyFootprint: { kind: 'full' },
  entry: { wall: 'west', at: 7.0 },
  shell: { features: [
    { wall: 'north', at: 1.5, kind: 'window' },
    { wall: 'north', at: 6.6, kind: 'window' },
    { wall: 'west', at: 1.4, kind: 'window' },
  ] },
  stairs: { model: 'stairsOpen', at: [2.8, 6.6], facing: 'E' },
  floors: [
    { id: 'living-room', cells: [0, 0, 7, 2], material: 'wood' },
    { id: 'central-hall', cells: [0, 3, 7, 4], material: 'wood' },
    { id: 'planted-arrival-court', cells: [0, 5, 4, 7], material: 'stone' },
    { id: 'ground-office', cells: [5, 5, 7, 7], material: 'wood' },
  ],
  walls: [
    { id: 'living-hall-west', from: [0, 3], to: [5.3, 3], height: 'half', freeEnds: ['to'], openings: [
      { at: 2.5, width: 1.2, kind: 'open' },
    ] },
    { id: 'living-hall-east', from: [6.7, 3], to: [8, 3], height: 'half', freeEnds: ['from'] },
    { id: 'hall-south-west', from: [0, 5], to: [5.3, 5], height: 'half', freeEnds: ['to'], openings: [
      { at: 2.5, width: 1.2, kind: 'door' },
    ] },
    { id: 'hall-south-east', from: [6.7, 5], to: [8, 5], height: 'half', freeEnds: ['from'], openings: [
      { at: 7.4, width: 1.2, kind: 'door' },
    ] },
    { id: 'court-office', from: [5, 5], to: [5, 8], height: 'half', openings: [
      { at: 6.5, width: 1.2, kind: 'door' },
    ] },
  ],
  furniture: [
    { id: 'living-sofa', model: 'loungeSofaLong', logic: 'sofa@1,0', at: [1.1, 1.5], facing: 'E' },
    { id: 'living-rug-north', model: 'rugRectangle', logic: 'rug@0,1', at: [1.5, 0.99], facing: 'E' },
    { id: 'living-clock-east-table', model: 'sideTable', at: [7.5, 0.55] },
    { id: 'living-clock-east', model: 'radio', logic: 'clock@0,7', on: { parent: 'living-clock-east-table' } },
    { id: 'living-television', model: 'cabinetTelevision', logic: 'tv@2,5', at: [5.5, 2.0], facing: 'W' },
    { id: 'living-television-set', model: 'televisionModern', on: { parent: 'living-television' } },
    { id: 'living-coffee-table', model: 'tableCoffee', at: [2.4, 1.6], facing: 'E' },
    { id: 'living-clock-south-table', model: 'sideTable', at: [7.5, 2.45] },
    { id: 'living-clock-south', model: 'radio', logic: 'clock@2,7', on: { parent: 'living-clock-south-table' } },
    { id: 'living-chair', model: 'loungeChair', at: [3.8, 1.2], facing: 'S' },
    { id: 'living-rug-south', model: 'rugRectangle', logic: 'rug@3,1', at: [0.8, 3.45], facing: 'E' },

    { id: 'hall-clock-table', model: 'sideTable', at: [6.9, 4.2] },
    { id: 'hall-clock', model: 'radio', logic: 'clock@4,6', on: { parent: 'hall-clock-table' } },
    { id: 'hall-plant-west', model: 'flower_redA', logic: 'plant@3,3', at: [3.5, 3.5] },
    { id: 'hall-plant-east', model: 'flower_yellowA', logic: 'plant@3,7', at: [7.5, 3.5] },

    { id: 'court-plant', model: 'flower_purpleA', logic: 'plant@5,1', at: [1.05, 5.5] },
    { id: 'court-shrub-west', model: 'plant_bushSmall', logic: 'shrub@6,0', at: [0.55, 6.45] },
    { id: 'court-shrub-middle', model: 'plant_bushDetailed', logic: 'shrub@7,2', at: [2.5, 7.5] },
    { id: 'court-shrub-east', model: 'plant_bushSmall', logic: 'shrub@7,3', at: [3.5, 7.5] },

    { id: 'office-chair', model: 'chair', logic: 'chair@7,7', at: [7.5, 7.5], facing: 'W' },
    { id: 'office-bookcase', model: 'bookcaseOpenLow', logic: 'bookshelf@5,5', at: [5.25, 5.45], facing: 'E' },
  ],
}
