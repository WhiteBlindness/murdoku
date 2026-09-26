import type { SceneSpec } from '../schema'

/**
 * Cena de desenvolvimento para o piloto 6×6 do café. A sala e a cozinha
 * ocupam o lado norte; o pátio e o balcão de serviço ficam a sul. As paredes
 * baixas e as passagens largas preservam a leitura na câmara do tabuleiro.
 */
export const pilotCafe: SceneSpec = {
  puzzleId: 'pilot-cafe',
  floor: 0,
  entry: { wall: 'west', at: 1.6 },
  shell: {
    features: [
      { wall: 'north', at: 1.35, kind: 'window' },
      { wall: 'north', at: 4.15, kind: 'window' },
    ],
  },
  floors: [
    { id: 'dining-room', cells: [0, 0, 2, 2], material: 'wood' },
    { id: 'kitchen', cells: [3, 0, 5, 2], material: 'tile' },
    { id: 'patio', cells: [0, 3, 2, 5], material: 'stone', kind: 'exterior' },
    { id: 'counter-service', cells: [3, 3, 5, 5], material: 'tile' },
  ],
  walls: [
    {
      id: 'dining-kitchen',
      from: [3, 0],
      to: [3, 3],
      openings: [{ at: 1.25, width: 1, kind: 'door' }],
    },
    {
      id: 'dining-patio',
      from: [0, 3],
      to: [3, 3],
      height: 'half',
      openings: [{ at: 1.25, width: 1.1, kind: 'door' }],
    },
    {
      id: 'patio-service',
      from: [3, 3],
      to: [3, 6],
      height: 'half',
      openings: [{ at: 5.4, width: 1, kind: 'door' }],
    },
  ],
  furniture: [
    // Sala de refeições: mesa junto às janelas e passagem livre até ao pátio.
    { id: 'dining-plant', model: 'pottedPlant', logic: 'plant@0,0', at: [0.45, 0.45] },
    { id: 'dining-bench', model: 'bench', against: { wall: 'north', at: 1.4 } },
    { id: 'dining-lamp', model: 'lampRoundFloor', logic: 'lamp@2,0', at: [0.45, 2.5] },
    { id: 'dining-chair', model: 'chair', logic: 'chair@2,2', at: [2.25, 2.15], facing: 'N' },
    { id: 'window-table', model: 'tableRound', at: [1.65, 1.8], facing: 'S' },
    { id: 'window-table-chair', model: 'chair', at: [0.95, 1.8], facing: 'E' },
    { id: 'dining-cake', model: 'food_cake', on: { parent: 'window-table', offset: [-0.16, -0.13] } },
    { id: 'dining-plate', model: 'food_plateDinner', on: { parent: 'window-table', offset: [0.18, 0.02] } },
    { id: 'dining-coffee', model: 'food_cupCoffee', on: { parent: 'window-table', offset: [-0.12, 0.22] } },

    // Cozinha: bancada de preparação, lava-loiça, fogão e frigorífico.
    // A chávena assenta na superfície medida da bancada.
    { id: 'kitchen-prep-counter', model: 'kitchenCabinet', against: { wall: 'north', at: 3.5 } },
    { id: 'kitchen-sink', model: 'kitchenSink', against: { wall: 'north', at: 4.1 } },
    { id: 'kitchen-coffee-counter', model: 'kitchenCabinetDrawer', against: { wall: 'north', at: 4.7 } },
    { id: 'coffee-machine', model: 'kitchenCoffeeMachine', on: { parent: 'kitchen-coffee-counter' } },
    { id: 'kitchen-coffee', model: 'food_cupCoffee', on: { parent: 'kitchen-prep-counter', offset: [0.02, 0.08] } },
    { id: 'kitchen-stove', model: 'kitchenStove', logic: 'stove@0,5', against: { wall: 'east', at: 0.55 } },
    { id: 'kitchen-fridge', model: 'kitchenFridge', at: [5.45, 1.55], facing: 'S' },

    // O balcão e os lugares de espera ficam voltados para a cozinha.
    { id: 'service-table', model: 'table', logic: 'table@3,3', at: [3.7, 4] },
    { id: 'service-chair', model: 'chair', logic: 'chair@4,3', at: [3.9, 4.55], facing: 'N' },
    { id: 'service-counter', model: 'kitchenBar', logic: 'counter@3,4', at: [4.5, 3.5], facing: 'S' },
    { id: 'service-counter-return', model: 'kitchenBar', logic: 'counter@3,4', at: [5.1, 3.5], facing: 'S' },
    { id: 'counter-stool-a', model: 'stoolBar', at: [4.5, 4.35], facing: 'N' },
    { id: 'counter-stool-b', model: 'stoolBar', at: [5.1, 4.35], facing: 'N' },
    { id: 'service-wine', model: 'food_glassWine', on: { parent: 'service-counter', offset: [0.02, 0] } },
    { id: 'delivery-box', model: 'cardboardBoxOpen', logic: 'box@5,4', at: [4.75, 5.1] },

    // No pátio, o caminho de pedra conduz à mesa entre bancos e vegetação.
    { id: 'patio-bench', model: 'bench', at: [0.55, 4.9], facing: 'N' },
    { id: 'patio-table', model: 'tableRound', at: [1.25, 4.3], facing: 'E' },
    { id: 'patio-chair', model: 'chair', at: [1.9, 5.05], facing: 'N' },
    { id: 'patio-shrub', model: 'plant_bushSmall', at: [0.4, 5.6], yaw: 12 },
    { id: 'patio-flower', model: 'flower_yellowA', at: [0.95, 5.6], yaw: -8 },
  ],
  rugs: [
    { id: 'entry-mat', model: 'rugDoormat', at: [1.25, 0.75] },
    { id: 'patio-path-stone-a', model: 'path_stone', at: [2.55, 4.65] },
    { id: 'patio-path-stone-b', model: 'path_stone', at: [2.55, 5.4] },
  ],
}
