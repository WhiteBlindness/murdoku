import type { SceneSpec } from '../schema'

// Casa térrea com alpendre em loggia, galeria central e sala a nascente.
export const aQuietAlibi: SceneSpec = {
  puzzleId: 'medium-12',
  floor: 0,
  entry: { wall: 'west', at: 1.55 },
  shell: { features: [
    { wall: 'north', at: 6.5, kind: 'window' },
    { wall: 'west', at: 5.4, kind: 'window' },
  ] },
  floors: [
    { id: 'north-loggia', cells: [0, 0, 2, 3], material: 'stone', kind: 'courtyard' },
    { id: 'south-office', cells: [0, 4, 2, 7], material: 'wood' },
    { id: 'central-gallery', cells: [3, 0, 4, 7], material: 'tile' },
    { id: 'east-living-room', cells: [5, 0, 7, 7], material: 'wood' },
  ],
  walls: [
    { id: 'loggia-gallery', from: [3, 0], to: [3, 8], height: 'half', openings: [
      { at: 1.6, width: 1.2, kind: 'open' },
      { at: 5.9, width: 1.2, kind: 'door' },
    ] },
    { id: 'gallery-living', from: [5, 0], to: [5, 8], height: 'half', openings: [
      { at: 2.5, width: 1.2, kind: 'open' },
      { at: 5.8, width: 1.2, kind: 'open' },
    ] },
    { id: 'loggia-office', from: [0, 4], to: [3, 4], height: 'half', openings: [{ at: 1.55, width: 1.1, kind: 'open' }] },
  ],
  furniture: [
    { id: 'loggia-chair-north', model: 'loungeChair', logic: 'chair@0,0', at: [0.85, 0.85], facing: 'E' },
    { id: 'loggia-chair-south', model: 'chair', logic: 'chair@3,1', at: [1.35, 3.1], facing: 'N' },
    { id: 'gallery-plant-north', model: 'flower_yellowA', logic: 'plant@0,3', at: [3.5, 0.55] },
    { id: 'office-plant', model: 'pottedPlant', logic: 'plant@2,2', at: [2.4, 2.5] },
    { id: 'gallery-plant-south', model: 'flower_redA', logic: 'plant@3,4', at: [4.5, 3.5] },

    { id: 'office-bookcase-west', model: 'bookcaseOpenLow', logic: 'bookshelf@5,0', at: [0.45, 5.65], facing: 'E' },
    { id: 'office-bookcase-east', model: 'bookcaseOpenLow', logic: 'bookshelf@6,2', at: [2.05, 6.45], facing: 'W' },
    { id: 'office-desk-lena', model: 'desk', logic: 'desk@7,0', at: [0.5, 7.45], facing: 'N' },
    { id: 'office-desk-idris', model: 'desk', logic: 'desk@7,1', at: [1.5, 7.45], facing: 'N' },

    { id: 'hall-clock-table-north', model: 'sideTable', at: [4.35, 0.55] },
    { id: 'hall-clock-north', model: 'radio', logic: 'clock@0,4', on: { parent: 'hall-clock-table-north' } },
    { id: 'hall-clock-table-middle', model: 'sideTable', at: [3.85, 2.5] },
    { id: 'hall-clock-middle', model: 'radio', logic: 'clock@2,4', on: { parent: 'hall-clock-table-middle' } },
    { id: 'living-clock-table', model: 'sideTable', at: [5.5, 3.55] },
    { id: 'living-clock', model: 'radio', logic: 'clock@3,5', on: { parent: 'living-clock-table' } },

    { id: 'living-television-north', model: 'cabinetTelevision', logic: 'tv@2,7', at: [7.5, 2.5], facing: 'W' },
    { id: 'living-television-south', model: 'cabinetTelevision', logic: 'tv@3,7', at: [7.5, 3.5], facing: 'W' },
    // Screens on the media wall, and a sofa that actually faces them.
    { id: 'living-screen-north', model: 'televisionModern', logic: 'tv@2,7', on: { parent: 'living-television-north' } },
    { id: 'living-screen-south', model: 'televisionModern', logic: 'tv@3,7', on: { parent: 'living-television-south' } },
    { id: 'living-media-sofa', model: 'loungeSofa', at: [6.15, 2.75], facing: 'E' },
    { id: 'living-sofa', model: 'loungeSofa', logic: 'sofa@6,5', at: [6.4, 6.5], facing: 'N' },
    { id: 'living-rug-north', model: 'rugRectangle', logic: 'rug@0,6', at: [6.5, 1], facing: 'E' },
    { id: 'living-rug-south', model: 'rugRectangle', logic: 'rug@4,5', at: [5.8, 4.55], facing: 'E' },
  ],
}
