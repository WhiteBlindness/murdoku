import type { SceneSpec } from '../schema'

// A escada sobe para poente encostada ao lado norte da cozinha; o pé abre para a
// passagem entre a bancada da Lena e o fogão. O antigo jardim é um jardim de inverno
// envidraçado (interior) sob o piso superior, sem estrutura exterior.
const stairAt: [number, number] = [5.55, 1.4]
export const theFinalAlibiGround: SceneSpec = {
  puzzleId: 'master-7',
  floor: 0,
  storeyFootprint: { kind: 'full' },
  entry: { wall: 'west', at: 3.5 },
  stairs: { model: 'stairsOpen', at: stairAt, facing: 'W' },
  shell: { features: [
    { wall: 'north', at: 7.4, kind: 'window' },
    { wall: 'west', at: 1.4, kind: 'window' },
  ] },
  floors: [
    { id: 'kitchen-floor', cells: [3, 0, 7, 3], material: 'tile' },
    { id: 'garden-ground', cells: [3, 4, 7, 7], material: 'stone', kind: 'interior' },
    { id: 'office-floor', cells: [0, 0, 2, 4], material: 'wood' },
    { id: 'pantry-floor', cells: [0, 5, 2, 7], material: 'stone' },
  ],
  walls: [
    { id: 'office-kitchen', from: [3, 0], to: [3, 4], height: 'half', openings: [{ at: 1.3, width: 1.0, kind: 'door' }] },
    { id: 'kitchen-garden', from: [3, 4], to: [8, 4], height: 'half', openings: [{ at: 4.75, width: 1.0, kind: 'door' }] },
    { id: 'office-pantry', from: [0, 5], to: [3, 5], height: 'half', openings: [{ at: 2.2, width: 1.2, kind: 'door' }] },
    { id: 'garden-west-return', from: [3, 4], to: [3, 5], height: 'half' },
    { id: 'pantry-garden', from: [3, 5], to: [3, 8], height: 'half', openings: [{ at: 6.3, width: 1.2, kind: 'door' }] },
  ],
  furniture: [
    // Cozinha: bancada com lava-loiça encostada à guarda da escada, fogão à parte junto à
    // parede nascente, frigorífico de bancada a sul; mesa da Nadia e mesa de refeição com cadeiras.
    { id: 'kitchen-hutch', model: 'bookcaseClosedWide', against: { wall: 'north', at: 3.7 } },
    { id: 'kitchen-counter-lena', model: 'kitchenCabinet', logic: 'counter@2,5', at: [5.27, 2.3], facing: 'S' },
    { id: 'kitchen-counter-lena-b', model: 'kitchenCabinet', logic: 'counter@2,5', at: [5.81, 2.3], facing: 'S' },
    { id: 'kitchen-sink', model: 'kitchenSink', logic: 'counter@2,5', at: [6.35, 2.3], facing: 'S' },
    { id: 'kitchen-stove', model: 'kitchenStoveElectric', logic: 'stove@2,7', at: [7.68, 2.3], facing: 'S' },
    { id: 'kitchen-fridge', model: 'kitchenFridgeSmall', logic: 'fridge@3,5', against: { wall: 'kitchen-garden', side: 'N', at: 5.7 }, facing: 'N' },
    { id: 'kitchen-table-west', model: 'table', logic: 'table@3,3', at: [3.9, 3.15], facing: 'N' },
    { id: 'kitchen-chair-west-a', model: 'chair', at: [3.6, 2.55], facing: 'S' },
    { id: 'kitchen-chair-west-b', model: 'chair', at: [4.2, 2.55], facing: 'S' },
    { id: 'kitchen-table-nadia', model: 'table', logic: 'table@3,6', at: [6.9, 3.35], facing: 'N' },
    { id: 'kitchen-chair-nadia-west', model: 'chair', at: [6.15, 3.35], facing: 'E' },
    { id: 'kitchen-chair-nadia-east', model: 'chair', at: [7.65, 3.35], facing: 'W' },
    // Jardim de inverno: plantas em vaso, sofá e poltronas sobre um tapete.
    { id: 'garden-plant-north', model: 'pottedPlant', logic: 'plant@4,4', at: [4.12, 4.4] },
    { id: 'garden-shrub-west', model: 'pottedPlant', logic: 'shrub@6,3', at: [3.7, 6.75] },
    { id: 'garden-shrub-east', model: 'pottedPlant', logic: 'shrub@6,7', at: [7.6, 6.4] },
    { id: 'garden-plant-evangeline', model: 'pottedPlant', logic: 'plant@5,7', at: [7.75, 5.25] },
    { id: 'garden-sofa', model: 'loungeSofa', against: { wall: 'south', at: 5.5 }, facing: 'N' },
    { id: 'garden-chair-west', model: 'loungeChair', at: [4.6, 6.4], facing: 'E' },
    { id: 'garden-chair-east', model: 'loungeChair', at: [6.4, 6.4], facing: 'W' },
    // Escritório: estante a norte, secretária com cadeira, poltrona de leitura, candeeiro.
    { id: 'office-bookshelf', model: 'bookcaseOpenLow', logic: 'bookshelf@0,1', against: { wall: 'north', at: 1.5 } },
    { id: 'office-chair', model: 'chair', logic: 'chair@4,0', at: [0.5, 4.5], facing: 'E' },
    { id: 'office-clock', model: 'speaker', logic: 'clock@2,2', at: [2.1, 2.1] },
    { id: 'office-desk', model: 'desk', logic: 'desk@2,0', at: [0.55, 2.5], facing: 'E' },
    { id: 'office-desk-chair', model: 'chairDesk', at: [1.15, 2.5], facing: 'W' },
    { id: 'office-lamp', model: 'lampRoundFloor', at: [0.3, 0.3] },
    // Despensa: armário, caixa, prateleiras e o frigorífico da Bella.
    { id: 'pantry-box', model: 'cardboardBoxClosed', logic: 'box@6,0', at: [0.5, 6.5] },
    { id: 'pantry-counter', model: 'kitchenCabinet', logic: 'counter@5,0', against: { wall: 'office-pantry', side: 'S', at: 0.75 }, facing: 'S' },
    { id: 'pantry-fridge-bella', model: 'kitchenFridge', logic: 'fridge@6,2', at: [2.1, 6.5], facing: 'E' },
    { id: 'pantry-shelves', model: 'bookcaseClosedWide', against: { wall: 'west', at: 7.35 } },
  ],
  rugs: [
    { id: 'garden-rug', model: 'rugRound', at: [5.5, 6.6] },
    { id: 'office-rug', model: 'rugRound', at: [1.2, 4.3] },
  ],
}
