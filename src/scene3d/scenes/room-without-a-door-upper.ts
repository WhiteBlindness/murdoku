import type { SceneSpec } from '../schema'

// A escada chega a uma galeria a sul que contorna o vão. Dela partem o
// escritório (a noroeste), o quarto (a sudeste) e um corredor de serviço que
// leva à casa de banho fechada e, ao fundo, à cozinha em galé a norte.
export const roomWithoutADoorUpper: SceneSpec = {
  puzzleId: 'hard-4',
  floor: 1,
  storeyFootprint: { kind: 'full' },
  stairwellBounds: [1.660625, 6.10625, 3.939375, 7.09375],
  circulation: {
    landing: [3.939375, 6.10625, 4.689375, 7.09375],
    halls: [
      { id: 'landing-hall', bounds: [4.0, 5.05, 4.92, 7.95] },
      { id: 'gallery-north', bounds: [0.05, 5.05, 4.92, 5.98] },
      { id: 'service-corridor', bounds: [3.05, 2.05, 3.9, 5.05] },
    ],
    roomAccessTargets: [
      { id: 'study-door', bounds: [1.95, 4.4, 2.75, 5.6] },
      { id: 'kitchen-door', bounds: [3.1, 1.45, 3.85, 2.4] },
      { id: 'bathroom-door', bounds: [3.3, 3.95, 4.55, 4.75] },
      { id: 'bedroom-door', bounds: [4.4, 7.05, 5.6, 7.85] },
    ],
  },
  shell: { features: [
    { wall: 'north', at: 1.4, kind: 'window' },
    { wall: 'north', at: 5.6, kind: 'window' },
    { wall: 'west', at: 6.9, kind: 'window' },
  ] },
  floors: [
    { id: 'study-floor', cells: [0, 0, 2, 4], material: 'wood' },
    { id: 'kitchen-floor', cells: [3, 0, 7, 1], material: 'tile' },
    { id: 'bathroom-floor', cells: [4, 2, 7, 4], material: 'tile' },
    { id: 'service-corridor-floor', cells: [3, 2, 3, 4], material: 'wood' },
    { id: 'bedroom-floor', cells: [0, 5, 7, 7], material: 'wood' },
  ],
  walls: [
    { id: 'study-service-wall', from: [3, 0], to: [3, 5], height: 'half' },
    { id: 'kitchen-bathroom-wall', from: [3, 2], to: [8, 2], height: 'half', openings: [{ at: 3.475, width: 0.85, kind: 'door' }] },
    { id: 'corridor-bathroom', from: [3.95, 2], to: [3.95, 5], height: 'half', openings: [{ at: 4.35, width: 1.0, kind: 'door' }] },
    { id: 'bedroom-north-wall', from: [0, 5], to: [8, 5], height: 'half', openings: [
      { at: 2.35, width: 1.0, kind: 'door' },
      { at: 3.475, width: 0.85, kind: 'open' },
    ] },
    { id: 'bedroom-west', from: [5, 5], to: [5, 8], height: 'half', openings: [{ at: 7.45, width: 0.9, kind: 'door' }] },
    // Divisória entre as duas sanitas.
    { id: 'wc-divider', from: [5.45, 2], to: [5.45, 3.0], height: 'half', freeEnds: ['to'] },
    { id: 'stairwell-west-guard', from: [1.660625, 6.10625], to: [1.660625, 7.09375], height: 'half', treatment: 'railing', freeEnds: ['from', 'to'] },
    { id: 'stairwell-north-guard', from: [1.660625, 6.02625], to: [3.939375, 6.02625], height: 'half', treatment: 'railing', freeEnds: ['from', 'to'] },
    { id: 'stairwell-south-guard', from: [1.660625, 7.17375], to: [3.939375, 7.17375], height: 'half', treatment: 'railing', freeEnds: ['from', 'to'] },
  ],
  furniture: [
    // Escritório: duas secretárias lado a lado na parede oeste com as cadeiras,
    // estante alta a separar o canto de leitura, cadeirão de leitura sob a janela.
    { id: 'study-box', model: 'cardboardBoxClosed', logic: 'box@0,0', at: [0.4, 0.4] },
    { id: 'study-bookcase', model: 'bookcaseOpen', logic: 'bookshelf@1,2', at: [2.45, 1.2], facing: 'S' },
    { id: 'study-bookcase-books', model: 'books', on: { parent: 'study-bookcase', surface: 'shelf2' } },
    { id: 'study-desk-north', model: 'desk', logic: 'desk@2,0', at: [0.5, 2.5], facing: 'E' },
    { id: 'study-desk-south', model: 'desk', logic: 'desk@3,0', at: [0.5, 3.5], facing: 'E' },
    { id: 'study-chair-north', model: 'chairDesk', at: [1.05, 2.5], facing: 'W' },
    { id: 'study-chair-south', model: 'chairDesk', at: [1.05, 3.5], facing: 'W' },
    { id: 'study-reading-chair', model: 'loungeChair', at: [1.45, 0.5], facing: 'S' },
    { id: 'study-lamp-south', model: 'lampRoundFloor', logic: 'lamp@4,1', at: [1.3, 4.6] },
    // Cozinha em galé: lava-loiça, fogão e armários a norte; placa, frigorífico
    // e armário a sul, de costas para a casa de banho.
    { id: 'kitchen-sink', model: 'kitchenSink', against: { wall: 'north', at: 5.3 } },
    { id: 'kitchen-cabinet', model: 'kitchenCabinet', against: { wall: 'north', at: 5.85 } },
    { id: 'kitchen-stove-north', model: 'kitchenStove', logic: 'stove@0,6', against: { wall: 'north', at: 6.5 } },
    { id: 'kitchen-cabinet-east', model: 'kitchenCabinetDrawer', against: { wall: 'north', at: 7.05 } },
    { id: 'kitchen-cabinet-corner', model: 'kitchenCabinet', against: { wall: 'north', at: 7.6 } },
    { id: 'kitchen-stove-south', model: 'kitchenStoveElectric', logic: 'stove@1,4', against: { wall: 'kitchen-bathroom-wall', side: 'N', at: 4.5 }, facing: 'N' },
    { id: 'kitchen-fridge', model: 'kitchenFridgeSmall', logic: 'fridge@1,5', against: { wall: 'kitchen-bathroom-wall', side: 'N', at: 5.3 }, facing: 'N' },
    { id: 'kitchen-cabinet-south', model: 'kitchenCabinetDrawer', against: { wall: 'kitchen-bathroom-wall', side: 'N', at: 6.1 }, facing: 'N' },
    { id: 'kitchen-microwave', model: 'kitchenMicrowave', on: { parent: 'kitchen-cabinet-south' } },
    // Casa de banho: duas sanitas separadas por divisória na parede norte,
    // dois duches, banheira e lavatório junto à porta do corredor.
    { id: 'bathroom-toilet-west', model: 'toilet', logic: 'toilet@2,4', against: { wall: 'kitchen-bathroom-wall', side: 'S', at: 4.7 } },
    { id: 'bathroom-toilet-east', model: 'toilet', logic: 'toilet@2,6', against: { wall: 'kitchen-bathroom-wall', side: 'S', at: 6.2 } },
    { id: 'bathroom-washbasin', model: 'bathroomSink', against: { wall: 'corridor-bathroom', side: 'E', at: 3.2 }, facing: 'E' },
    { id: 'bathroom-shower-north', model: 'shower', logic: 'shower@2,7', at: [7.3, 2.5], facing: 'E' },
    { id: 'bathroom-shower-south', model: 'shower', logic: 'shower@4,6', at: [6.5, 3.8], facing: 'E' },
    { id: 'bathroom-tub', model: 'bathtub', against: { wall: 'bedroom-north-wall', side: 'N', at: 5.35 }, facing: 'N' },
    // Galeria: tapete na chegada, sofá de leitura a oeste do vão e consola com rádio.
    { id: 'bedroom-rug', model: 'rugDoormat', logic: 'rug@5,3', at: [4.45, 5.45] },
    { id: 'gallery-sofa', model: 'loungeSofa', against: { wall: 'west', at: 6.9 }, facing: 'E' },
    { id: 'bedroom-clock-west-table', model: 'sideTable', at: [1.5, 7.65] },
    { id: 'bedroom-clock-west', model: 'radio', logic: 'clock@7,1', on: { parent: 'bedroom-clock-west-table' } },
    // Quarto: cama com cabeceira na parede norte e mesas de cabeceira,
    // candeeiros de pé e cómoda com rádio no canto sudeste.
    { id: 'bedroom-bed', model: 'bedDouble', against: { wall: 'bedroom-north-wall', side: 'S', at: 6.5 } },
    { id: 'bedroom-nightstand', model: 'cabinetBedDrawerTable', against: { wall: 'bedroom-north-wall', side: 'S', at: 5.55 } },
    { id: 'bedroom-bedside-lamp', model: 'lampRoundTable', on: { parent: 'bedroom-nightstand' } },
    { id: 'bedroom-nightstand-east', model: 'cabinetBedDrawerTable', against: { wall: 'bedroom-north-wall', side: 'S', at: 7.45 } },
    { id: 'bedroom-bedside-lamp-east', model: 'lampSquareTable', on: { parent: 'bedroom-nightstand-east' } },
    { id: 'bedroom-lamp-south', model: 'lampRoundFloor', logic: 'lamp@6,7', at: [7.75, 6.25] },
    { id: 'bedroom-lamp-east', model: 'lampRoundFloor', logic: 'lamp@7,6', at: [6.25, 7.75] },
    { id: 'bedroom-clock-east-table', model: 'sideTable', against: { wall: 'east', at: 7.55 }, facing: 'W' },
    { id: 'bedroom-clock-east', model: 'radio', logic: 'clock@7,7', on: { parent: 'bedroom-clock-east-table' } },
  ],
  rugs: [
    { id: 'study-rug', model: 'rugRectangle', at: [1.2, 3.0], facing: 'E' },
    { id: 'bedroom-bed-rug', model: 'rugRectangle', at: [6.5, 6.6] },
  ],
}
