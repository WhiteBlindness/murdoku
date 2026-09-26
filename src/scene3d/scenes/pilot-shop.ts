import type { SceneSpec } from '../schema'

/**
 * Cena de desenvolvimento para o piloto da mercearia.
 * A zona de venda fica aberta entre a entrada oeste e o fundo norte. O balcão
 * acompanha a fachada norte; uma porta conduz ao armazém e um vão largo abre
 * para a zona de trabalho. A divisão interior separa o armazém do escritório.
 */
export const pilotShop: SceneSpec = {
  puzzleId: 'pilot-shop',
  entry: { wall: 'west', at: 1.4 },
  shell: {
    features: [{ wall: 'west', at: 2.3, kind: 'window' }],
  },
  floors: [
    { id: 'sales-floor', cells: [0, 0, 5, 2], material: 'tile' },
    { id: 'stockroom', cells: [0, 3, 2, 5], material: 'stone' },
    { id: 'office', cells: [3, 3, 5, 5], material: 'wood' },
  ],
  walls: [
    {
      id: 'back-of-house',
      from: [0, 3],
      to: [6, 3],
      openings: [
        { at: 1.8, kind: 'door' },
        { at: 3.5, kind: 'open', width: 2 },
      ],
    },
    { id: 'stockroom-office', from: [3, 3], to: [3, 6] },
  ],
  furniture: [
    // Três módulos formam um balcão de caixa contínuo. A caixa fica no módulo
    // central, apoiada no topo declarado para kitchenCabinet. O modelo da caixa
    // usa a transformação medida de 0,50, sem ajuste de altura na cena.
    { id: 'checkout-left', model: 'kitchenCabinet', logic: 'counter@0,0', against: { wall: 'north', at: 0.45 } },
    { id: 'checkout-centre', model: 'kitchenCabinetDrawer', logic: 'counter@0,0', against: { wall: 'north', at: 1.0 } },
    { id: 'checkout-right', model: 'kitchenCabinet', logic: 'counter@0,0', against: { wall: 'north', at: 1.55 } },
    {
      id: 'cash-register',
      model: 'miniMarket_cashRegister',
      on: { parent: 'checkout-centre', surface: 'top' },
    },
    { id: 'logical-fridge', model: 'kitchenFridge', logic: 'fridge@0,5', against: { wall: 'north', at: 5.5 } },
    { id: 'north-display', model: 'miniMarket_shelfBoxes', against: { wall: 'north', at: 2.75 } },
    { id: 'aisle-display', model: 'miniMarket_shelfBoxes', at: [2.8, 1.7], facing: 'E' },
    { id: 'east-endcap', model: 'kitchenCabinet', against: { wall: 'east', at: 1.9 } },
    { id: 'aisle-freezer', model: 'miniMarket_freezer', at: [5.3, 1.25] },
    { id: 'checkout-pastry', model: 'food_cake', on: { parent: 'checkout-left' } },
    { id: 'checkout-plate', model: 'food_plateDinner', on: { parent: 'checkout-right' } },
    { id: 'endcap-cake', model: 'food_cake', on: { parent: 'east-endcap' } },
    { id: 'endcap-coffee', model: 'food_cupCoffee', on: { parent: 'east-endcap', offset: [0.12, 0.15] } },
    { id: 'stock-shelf', model: 'bookcaseOpenLow', logic: 'bookshelf@3,0', against: { wall: 'west', at: 4.0 } },
    { id: 'backstock-box', model: 'cardboardBoxClosed', logic: 'box@4,2', at: [2.15, 4.45] },
    { id: 'backstock-carton-one', model: 'cardboardBoxClosed', at: [0.4, 5.35] },
    { id: 'backstock-carton-two', model: 'cardboardBoxClosed', at: [0.78, 5.35] },
    { id: 'backstock-carton-three', model: 'cardboardBoxOpen', at: [1.2, 5.35] },
    { id: 'backstock-carton-four', model: 'cardboardBoxClosed', at: [0.55, 5.72] },
    { id: 'shop-plant', model: 'pottedPlant', logic: 'plant@2,4', at: [4.5, 2.2] },
    { id: 'office-table', model: 'table', logic: 'table@3,3', at: [3.6, 3.9] },
    { id: 'office-chair', model: 'chair', logic: 'chair@4,3', at: [3.6, 4.4], facing: 'N' },
    { id: 'office-laptop', model: 'laptop', on: { parent: 'office-table' } },
    { id: 'office-lamp', model: 'lampRoundTable', on: { parent: 'office-table', offset: [0.2, 0.08] } },
    { id: 'office-storage', model: 'sideTableDrawers', at: [5.35, 5.45] },
    { id: 'office-books', model: 'books', on: { parent: 'office-storage' } },
    // Folhagem baixa junto à extremidade do corredor, fora do percurso central.
    { id: 'shop-greenery', model: 'plant_bushSmall', at: [1.0, 2.35] },
  ],
  rugs: [
    { id: 'entry-mat', model: 'rugDoormat', at: [0.7, 1.4], facing: 'E' },
  ],
}
