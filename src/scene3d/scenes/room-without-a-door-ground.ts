import type { SceneSpec } from '../schema'

// Moradia de dois pisos: sala comum a norte (conversa a oeste, televisão ao
// centro, refeições a este), átrio de distribuição, pátio de entrada coberto com
// a escada a sudoeste e escritório a sudeste.
export const roomWithoutADoorGround: SceneSpec = {
  puzzleId: 'hard-4',
  floor: 0,
  storeyFootprint: { kind: 'full' },
  entry: { wall: 'west', at: 7.0 },
  shell: { features: [
    { wall: 'north', at: 1.5, kind: 'window' },
    { wall: 'north', at: 4.6, kind: 'window' },
    { wall: 'north', at: 6.6, kind: 'window' },
    { wall: 'west', at: 5.6, kind: 'window' },
  ] },
  stairs: { model: 'stairsOpen', at: [2.8, 6.6], facing: 'E' },
  floors: [
    { id: 'living-room', cells: [0, 0, 7, 2], material: 'wood' },
    { id: 'central-hall', cells: [0, 3, 7, 4], material: 'wood' },
    { id: 'planted-arrival-court', cells: [0, 5, 4, 7], material: 'stone' },
    { id: 'ground-office', cells: [5, 5, 7, 7], material: 'wood' },
  ],
  walls: [
    { id: 'living-hall', from: [0, 3], to: [8, 3], height: 'half', openings: [
      { at: 2.6, width: 1.6, kind: 'open' },
    ] },
    { id: 'hall-south', from: [0, 5], to: [8, 5], height: 'half', openings: [
      { at: 1.0, width: 1.0, kind: 'open' },
      { at: 7.4, kind: 'door' },
    ] },
    { id: 'court-office', from: [5, 5], to: [5, 8], height: 'half' },
  ],
  furniture: [
    // Sala: sofá comprido a oeste com cadeirões e mesa de centro sobre o tapete;
    // televisão encostada à parede do átrio com sofá virado para ela; mesa de
    // refeições a este entre o relógio de pé e o aparador com rádio.
    { id: 'living-sofa', model: 'loungeSofaLong', logic: 'sofa@1,0', against: { wall: 'west', at: 2.0 }, facing: 'E' },
    { id: 'living-rug-north', model: 'rugRectangle', logic: 'rug@0,1', at: [2.0, 1.45], facing: 'E' },
    { id: 'living-coffee-table', model: 'tableCoffee', at: [2.1, 1.55], facing: 'E' },
    { id: 'living-chair', model: 'loungeChair', at: [2.25, 0.45], facing: 'S' },
    { id: 'living-chair-east', model: 'loungeChair', at: [3.1, 1.75], facing: 'W' },
    { id: 'living-floor-lamp', model: 'lampRoundFloor', at: [0.25, 0.3] },
    { id: 'living-television', model: 'cabinetTelevision', logic: 'tv@2,5', against: { wall: 'living-hall', at: 5.5, side: 'N' }, facing: 'N' },
    { id: 'living-television-set', model: 'televisionModern', on: { parent: 'living-television' } },
    { id: 'living-tv-sofa', model: 'loungeSofa', at: [5.5, 1.25], facing: 'S' },
    { id: 'dining-table', model: 'table', at: [7.05, 1.35], facing: 'E' },
    { id: 'dining-chair-nw', model: 'chair', at: [7.05, 0.62], facing: 'S' },
    { id: 'dining-chair-sw', model: 'chair', at: [6.55, 1.35], facing: 'E' },
    { id: 'dining-chair-east', model: 'chair', at: [7.6, 1.35], facing: 'W' },
    { id: 'living-clock-east', model: 'speaker', logic: 'clock@0,7', at: [7.75, 0.25] },
    { id: 'living-clock-south-table', model: 'sideTable', against: { wall: 'east', at: 2.55 }, facing: 'W' },
    { id: 'living-clock-south', model: 'radio', logic: 'clock@2,7', on: { parent: 'living-clock-south-table' } },
    // Átrio: tapete, vasos nas extremidades e consola com rádio junto à porta do escritório.
    { id: 'living-rug-south', model: 'rugRectangle', logic: 'rug@3,1', at: [2.0, 4.0], facing: 'S' },
    { id: 'hall-plant-west', model: 'pottedPlant', logic: 'plant@3,3', at: [3.7, 3.3] },
    { id: 'hall-plant-east', model: 'pottedPlant', logic: 'plant@3,7', at: [7.75, 3.3] },
    { id: 'hall-clock-table', model: 'sideTableDrawers', against: { wall: 'hall-south', at: 6.3, side: 'N' }, facing: 'N' },
    { id: 'hall-clock', model: 'radio', logic: 'clock@4,6', on: { parent: 'hall-clock-table' } },
    // Pátio de entrada coberto: cabide junto à porta, vasos de arbustos nos
    // cantos, banco encostado à parede do escritório.
    { id: 'court-coat-stand', model: 'coatRackStanding', at: [0.3, 7.75] },
    { id: 'court-plant', model: 'pottedPlant', logic: 'plant@5,1', at: [1.75, 5.3] },
    { id: 'court-shrub-west', model: 'pottedPlant', logic: 'shrub@6,0', at: [0.3, 6.25] },
    { id: 'court-shrub-middle', model: 'plant_bushSmall', logic: 'shrub@7,2', at: [2.5, 7.6] },
    { id: 'court-shrub-east', model: 'pottedPlant', logic: 'shrub@7,3', at: [3.75, 7.3] },
    { id: 'court-bench', model: 'benchCushion', against: { wall: 'court-office', at: 6.0, side: 'W' }, facing: 'W' },
    // Escritório: estante larga na parede norte, mesa de trabalho com portátil e
    // a cadeira virada para ela, cadeirão de leitura com candeeiro.
    { id: 'office-bookcase', model: 'bookcaseClosedWide', logic: 'bookshelf@5,5', against: { wall: 'hall-south', at: 6.0, side: 'S' } },
    { id: 'office-table', model: 'table', at: [6.85, 6.75], facing: 'S' },
    { id: 'office-laptop', model: 'laptop', on: { parent: 'office-table' } },
    { id: 'office-chair', model: 'chair', logic: 'chair@7,7', at: [7.25, 7.3], facing: 'N' },
    { id: 'office-armchair', model: 'loungeChair', at: [5.45, 7.3], facing: 'E' },
    { id: 'office-lamp', model: 'lampSquareFloor', at: [5.2, 7.8] },
  ],
  rugs: [
    { id: 'entry-mat', model: 'rugDoormat', at: [0.35, 7.0], facing: 'E' },
    { id: 'office-rug', model: 'rugSquare', at: [6.85, 6.9] },
  ],
}
