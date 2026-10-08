import type { SceneSpec } from '../schema'

// Casa com jardim de inverno envidraçado a noroeste, sala com a escada e a
// entrada a nordeste, escritório a sudoeste e alpendre fechado a sudeste.
// O piso superior cobre toda a planta, pelo que o jardim e o alpendre são
// interiores e dispensam a estrutura de pilares e vigas.
export const theColdKettleGround: SceneSpec = {
  puzzleId: 'hard-5',
  floor: 0,
  storeyFootprint: { kind: 'full' },
  entry: { wall: 'north', at: 7.2 },
  shell: { features: [
    { wall: 'north', at: 1.0, kind: 'window' },
    { wall: 'north', at: 2.9, kind: 'window' },
    { wall: 'north', at: 4.8, kind: 'window' },
    { wall: 'west', at: 1.5, kind: 'window' },
    { wall: 'west', at: 3.5, kind: 'window' },
    { wall: 'west', at: 6.5, kind: 'window' },
  ] },
  stairs: { model: 'stairsOpen', at: [6.1, 2.0], facing: 'S' },
  floors: [
    { id: 'front-yard', cells: [0, 0, 3, 4], material: 'stone' },
    { id: 'garden-bed-north', cells: [0, 0, 3, 0], material: 'grass', kind: 'interior' },
    { id: 'garden-bed-east', cells: [3, 1, 3, 2], material: 'grass', kind: 'interior' },
    { id: 'living-room', cells: [4, 0, 7, 4], material: 'wood' },
    { id: 'office', cells: [0, 5, 4, 7], material: 'wood' },
    { id: 'covered-porch', cells: [5, 5, 7, 7], material: 'stone' },
  ],
  walls: [
    { id: 'garden-living', from: [4, 0], to: [4, 5], height: 'half', openings: [{ at: 4.35, width: 1.1, kind: 'door' }] },
    { id: 'south-wing-front', from: [0, 5], to: [8, 5], height: 'half', openings: [
      { at: 2.75, kind: 'door' },
      { at: 7.3, width: 1.0, kind: 'open' },
    ] },
    { id: 'office-porch', from: [5, 5], to: [5, 8], height: 'half', openings: [{ at: 6.5, width: 1.0, kind: 'door' }] },
  ],
  furniture: [
    // Jardim de inverno: canteiros relvados a norte e junto à sala, mesa redonda
    // com três cadeiras ao centro e pedras nos canteiros.
    { id: 'garden-shrub-north', model: 'plant_bushSmall', logic: 'shrub@0,1', at: [1.5, 0.45] },
    { id: 'garden-plant-north', model: 'pottedPlant', logic: 'plant@0,2', at: [2.6, 0.4] },
    { id: 'garden-plant-south', model: 'pottedPlant', logic: 'plant@1,3', at: [3.75, 1.25] },
    { id: 'garden-shrub-south', model: 'plant_bushSmall', logic: 'shrub@2,3', at: [3.6, 2.5] },
    { id: 'garden-rock', model: 'rock_smallA', at: [0.45, 0.45] },
    { id: 'garden-table', model: 'tableRound', at: [1.6, 2.6] },
    { id: 'garden-chair-west', model: 'chairCushion', at: [0.95, 2.6], facing: 'E' },
    { id: 'garden-chair-east', model: 'chairCushion', at: [2.3, 2.6], facing: 'W' },
    { id: 'garden-chair-south', model: 'chairCushion', at: [1.6, 3.3], facing: 'N' },
    { id: 'garden-bench', model: 'benchCushion', against: { wall: 'west', at: 4.2 }, facing: 'E' },
    // Sala: sofá comprido na parede este, televisão na parede do jardim com um
    // cadeirão virado para ela a sul da escada, relógio de pé e candeeiro.
    { id: 'living-sofa', model: 'loungeSofaLong', logic: 'sofa@1,7', at: [7.35, 2.0], facing: 'W' },
    { id: 'living-side-table', model: 'sideTableDrawers', against: { wall: 'east', at: 3.45 }, facing: 'W' },
    { id: 'living-side-lamp', model: 'lampRoundTable', on: { parent: 'living-side-table' } },
    { id: 'living-tv', model: 'cabinetTelevision', logic: 'tv@3,4', against: { wall: 'garden-living', side: 'E', at: 3.3 }, facing: 'E' },
    { id: 'living-tv-set', model: 'televisionModern', on: { parent: 'living-tv' } },
    { id: 'living-armchair', model: 'loungeChair', at: [5.6, 3.6], facing: 'W' },
    { id: 'living-coffee-table', model: 'tableCoffeeSquare', at: [6.55, 3.75] },
    { id: 'living-rug', model: 'rugRectangle', logic: 'rug@0,5', at: [5.2, 1.5], facing: 'N' },
    { id: 'living-clock', model: 'speaker', logic: 'clock@4,4', at: [4.8, 4.25] },
    { id: 'living-floor-lamp', model: 'lampRoundFloor', at: [4.3, 0.3] },
    // Escritório: estante larga e secretária com cadeira na parede norte,
    // cadeirão de leitura com candeeiro, cómoda de arquivo junto à janela.
    { id: 'office-chair-west', model: 'loungeChair', logic: 'chair@5,0', at: [0.55, 5.45], facing: 'E' },
    { id: 'office-reading-lamp', model: 'lampSquareFloor', at: [0.2, 5.95] },
    { id: 'office-bookcase', model: 'bookcaseClosedWide', logic: 'bookshelf@5,1', against: { wall: 'south-wing-front', side: 'S', at: 1.75 }, facing: 'S' },
    { id: 'office-desk', model: 'desk', logic: 'desk@5,3', against: { wall: 'south-wing-front', side: 'S', at: 3.7 }, facing: 'S' },
    { id: 'office-laptop', model: 'laptop', on: { parent: 'office-desk' } },
    { id: 'office-desk-chair', model: 'chairDesk', at: [3.7, 6.05], facing: 'N' },
    { id: 'office-cabinet', model: 'sideTableDrawers', against: { wall: 'west', at: 7.2 }, facing: 'E' },
    { id: 'office-cabinet-books', model: 'books', on: { parent: 'office-cabinet' } },
    // Alpendre fechado: duas cadeiras com mesa de apoio e vaso no canto.
    { id: 'porch-chair-north', model: 'chair', logic: 'chair@5,6', at: [6.5, 5.45], facing: 'S' },
    { id: 'porch-side-table', model: 'tableRound', at: [6.45, 6.25] },
    { id: 'porch-plant', model: 'pottedPlant', logic: 'plant@7,6', at: [6.25, 7.7] },
    { id: 'porch-chair-south', model: 'chair', logic: 'chair@7,7', at: [7.5, 7.55], facing: 'N' },
  ],
  rugs: [
    { id: 'entry-mat', model: 'rugDoormat', at: [7.2, 0.35] },
    { id: 'office-rug', model: 'rugRectangle', at: [2.6, 6.6] },
    { id: 'garden-rug', model: 'rugRound', at: [1.6, 2.7] },
  ],
}
