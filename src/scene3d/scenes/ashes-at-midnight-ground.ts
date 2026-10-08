import type { SceneSpec } from '../schema'

// Moradia de dois pisos: alpendre fechado de entrada a noroeste, sala de estar
// e de jantar a nordeste com a escada, cozinha em U a sudoeste e jardim frontal
// com caminho de pedra a partir da sala.
export const ashesAtMidnightGround: SceneSpec = {
  puzzleId: 'hard-2',
  floor: 0,
  storeyFootprint: { kind: 'full' },
  entry: { wall: 'west', at: 1.5 },
  shell: { features: [
    { wall: 'north', at: 1.6, kind: 'window' },
    { wall: 'north', at: 6.7, kind: 'window' },
    { wall: 'west', at: 6.5, kind: 'window' },
  ] },
  stairs: { model: 'stairsOpen', at: [5.8, 2.6], facing: 'E' },
  floors: [
    { id: 'covered-porch', cells: [0, 0, 2, 3], material: 'stone' },
    { id: 'dining-room', cells: [3, 0, 7, 3], material: 'wood' },
    { id: 'kitchen', cells: [0, 4, 3, 7], material: 'tile' },
    { id: 'front-yard', cells: [4, 4, 7, 7], material: 'grass', kind: 'exterior' },
  ],
  walls: [
    { id: 'north-porch-dining', from: [3, 0], to: [3, 4], height: 'half', openings: [{ at: 2.4, width: 1.2, kind: 'open' }] },
    { id: 'south-kitchen-entry', from: [4, 4], to: [4, 8], height: 'half' },
    { id: 'porch-kitchen', from: [0, 4], to: [3, 4], height: 'half', openings: [{ at: 1.9, kind: 'door' }] },
    { id: 'dining-entry', from: [3, 4], to: [8, 4], height: 'half', openings: [{ at: 5.5, width: 1.2, kind: 'open' }] },
  ],
  furniture: [
    // Alpendre: cabide e consola junto à entrada, cadeirão e cadeira em volta de
    // uma mesa baixa, plantas em vaso nos cantos.
    { id: 'porch-coat-stand', model: 'coatRackStanding', at: [0.3, 0.4] },
    { id: 'porch-console', model: 'sideTableDrawers', against: { wall: 'north', at: 1.6 } },
    { id: 'porch-reading-chair', model: 'loungeChair', logic: 'chair@1,1', at: [1.5, 1.4], facing: 'S' },
    { id: 'porch-table', model: 'tableCoffeeSquare', at: [1.85, 2.2] },
    { id: 'porch-chair', model: 'chair', logic: 'chair@2,2', at: [2.3, 2.3], facing: 'W' },
    { id: 'porch-plant-west', model: 'pottedPlant', logic: 'plant@3,0', at: [0.3, 3.65] },
    { id: 'porch-plant-east', model: 'pottedPlant', logic: 'plant@3,2', at: [2.7, 3.3] },
    // Sala: móvel de televisão na parede norte, sofá de costas para a escada,
    // cadeirão virado para a mesa de centro sobre o tapete.
    { id: 'living-tv-unit', model: 'cabinetTelevision', against: { wall: 'north', at: 5.0 } },
    { id: 'living-tv', model: 'televisionVintage', on: { parent: 'living-tv-unit' } },
    { id: 'dining-rug', model: 'rugRectangle', logic: 'rug@0,4', at: [5.0, 1.05], facing: 'S' },
    { id: 'living-coffee-table', model: 'tableCoffee', at: [5.0, 1.05] },
    { id: 'living-sofa', model: 'loungeSofa', at: [5.0, 1.78], facing: 'N' },
    { id: 'dining-chair', model: 'loungeChair', logic: 'chair@1,3', at: [3.72, 1.2], facing: 'E' },
    // Recanto de refeições: mesa com banco estofado encostado à parede este.
    { id: 'dining-table', model: 'tableCloth', logic: 'table@0,6', at: [6.95, 0.75], facing: 'E' },
    { id: 'dining-banquette', model: 'loungeSofa', against: { wall: 'east', at: 0.75 }, facing: 'W' },
    { id: 'dining-sideboard', model: 'sideTableDrawers', against: { wall: 'east', at: 2.6 }, facing: 'W' },
    { id: 'dining-sideboard-plant', model: 'plantSmall2', on: { parent: 'dining-sideboard' } },
    { id: 'dining-lamp', model: 'lampRoundFloor', logic: 'lamp@3,6', at: [6.5, 3.6] },
    // Cozinha em U: bancada oeste, lava-loiça a sul, fogão na parede este e
    // frigorífico no canto; aparador junto à porta do alpendre.
    { id: 'kitchen-table', model: 'cabinetTelevisionDoors', logic: 'table@4,0', against: { wall: 'porch-kitchen', at: 0.85, side: 'S' } },
    { id: 'kitchen-fridge', model: 'kitchenFridge', logic: 'fridge@4,3', against: { wall: 'dining-entry', at: 3.45, side: 'S' } },
    { id: 'kitchen-counter-a', model: 'kitchenCabinet', logic: 'counter@6,0', against: { wall: 'west', at: 6.45 }, facing: 'E' },
    { id: 'kitchen-counter-b', model: 'kitchenCabinetDrawer', logic: 'counter@6,0', against: { wall: 'west', at: 7.0 }, facing: 'E' },
    { id: 'kitchen-cabinet-south', model: 'kitchenCabinet', against: { wall: 'south', at: 1.05 } },
    { id: 'kitchen-sink', model: 'kitchenSink', against: { wall: 'south', at: 1.6 } },
    { id: 'kitchen-cabinet-south-2', model: 'kitchenCabinetDrawer', against: { wall: 'south', at: 2.15 } },
    { id: 'kitchen-stove', model: 'kitchenStove', logic: 'stove@6,3', against: { wall: 'south-kitchen-entry', at: 6.55, side: 'W' } },
    { id: 'kitchen-cabinet-east', model: 'kitchenCabinet', against: { wall: 'south-kitchen-entry', at: 7.1, side: 'W' } },
    { id: 'kitchen-microwave', model: 'kitchenMicrowave', on: { parent: 'kitchen-cabinet-east' } },
    // Jardim: canteiro de arbustos junto à cozinha, vaso no canto nordeste,
    // caminho de pedra desde a sala, pedras e um cepo.
    { id: 'entry-shrub-west', model: 'plant_bushDetailed', logic: 'shrub@6,4', at: [4.45, 6.55] },
    { id: 'entry-shrub-north', model: 'plant_bushDetailed', logic: 'shrub@5,4', at: [4.45, 5.4] },
    { id: 'entry-plant', model: 'pottedPlant', logic: 'plant@4,7', at: [7.75, 4.25] },
    { id: 'yard-rock', model: 'rock_smallA', at: [4.35, 7.6] },
    { id: 'yard-stump', model: 'stump_round', at: [7.6, 7.55] },
  ],
  rugs: [
    { id: 'porch-mat', model: 'rugDoormat', at: [0.35, 1.5], facing: 'E' },
    { id: 'yard-path-a', model: 'path_stone', at: [5.5, 4.5], facing: 'S' },
    { id: 'yard-path-b', model: 'path_stone', at: [5.5, 5.3], facing: 'S' },
    { id: 'yard-path-c', model: 'path_stone', at: [5.6, 6.1], facing: 'S' },
  ],
}
