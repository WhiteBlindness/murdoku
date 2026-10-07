import type { SceneSpec } from '../schema'

export const theOpenWindowUpper: SceneSpec = {
  puzzleId: 'expert-1',
  floor: 1,
  storeyFootprint: { kind: 'full' },
  stairwellBounds: [6.10625, 2.360625, 7.09375, 4.639375],
  circulation: {
    // A escada chega a sul, no escritório; a sala de jantar distribui para o quarto e a casa de banho.
    landing: [6.10625, 4.639375, 7.09375, 5.6],
    halls: [
      { id: 'study-west-link', bounds: [5.05, 4.75, 6.10625, 5.6] },
      { id: 'garden-gallery', bounds: [0.05, 4.15, 6, 4.95] },
      { id: 'dining-west-lane', bounds: [0.75, 2.3, 1.75, 4.95] },
    ],
    roomAccessTargets: [
      { id: 'bedroom-approach', bounds: [0.8, 2.3, 1.7, 3.0] },
      { id: 'study-approach', bounds: [5.05, 4.15, 5.8, 4.9] },
      { id: 'dining-approach', bounds: [4.2, 4.15, 4.95, 4.9] },
      { id: 'bathroom-approach', bounds: [1.95, 4.15, 2.85, 5.6] },
    ],
  },
  shell: {
    features: [
      { wall: 'north', at: 4.4, kind: 'window' },
      { wall: 'north', at: 7.2, kind: 'window' },
      { wall: 'west', at: 1.2, kind: 'window' },
    ],
  },
  floors: [
    { id: 'bedroom-wood', cells: [0, 0, 7, 2], material: 'wood' },
    { id: 'dining-wood', cells: [0, 3, 4, 4], material: 'wood' },
    { id: 'study-wood', cells: [5, 3, 7, 7], material: 'wood' },
    { id: 'bathroom-tile', cells: [0, 5, 4, 7], material: 'tile' },
  ],
  walls: [
    { id: 'bedroom-dining', from: [0, 3], to: [5, 3], height: 'cutaway', openings: [{ at: 1.25, width: 1.0, kind: 'door' }] },
    { id: 'bedroom-study-west', from: [5, 3], to: [6.10625, 3], height: 'cutaway', freeEnds: ['to'] },
    { id: 'bedroom-study-east', from: [7.09375, 3], to: [8, 3], height: 'cutaway', freeEnds: ['from'] },
    {
      id: 'study-dining',
      from: [5, 3],
      to: [5, 5],
      height: 'half',
      openings: [{ at: 4.5, width: 1.0, kind: 'open' }],
    },
    {
      id: 'bathroom-north',
      from: [0, 5],
      to: [5, 5],
      height: 'room-cutaway',
      openings: [{ at: 2.4, width: 1.2, kind: 'door' }],
    },
    { id: 'bathroom-east', from: [5, 5], to: [5, 8], height: 'room-cutaway' },

    // As guardas acompanham o vão; a extremidade norte fica aberta para a chegada.
    { id: 'stairwell-west', from: [6.05, 2.3], to: [6.05, 4.64], height: 'half', treatment: 'railing', freeEnds: ['to'] },
    { id: 'stairwell-east', from: [7.15, 2.3], to: [7.15, 4.64], height: 'half', treatment: 'railing', freeEnds: ['to'] },
    { id: 'stairwell-north', from: [6.05, 2.3], to: [7.15, 2.3], height: 'half', treatment: 'railing' },
  ],
  furniture: [
    // Quarto: cama de cabeceira contra a parede norte sobre o tapete, candeeiro de leitura e recanto de música.
    { id: 'bedroom-bed', model: 'bedDouble', against: { wall: 'north', at: 2.0 } },
    { id: 'bedroom-rug', model: 'rugRectangle', logic: 'rug@0,1', at: [2, 1], facing: 'E' },
    { id: 'bedroom-lamp-east', model: 'lampRoundFloor', logic: 'lamp@0,3', at: [3.5, 0.5], facing: 'S' },
    { id: 'bedroom-lamp-west', model: 'lampRoundFloor', logic: 'lamp@2,0', at: [0.5, 2.5], facing: 'S' },
    { id: 'bedroom-sofa', model: 'loungeSofa', against: { wall: 'north', at: 6.4 } },
    { id: 'bedroom-clock-east', model: 'speaker', logic: 'clock@0,7', at: [7.5, 0.5], facing: 'S' },
    { id: 'bedroom-clock-spine', model: 'speaker', logic: 'clock@2,5', at: [5.5, 2.5], facing: 'S' },
    // Escritório: secretária com cadeira em cada canto de trabalho e estantes na parede nascente.
    { id: 'study-box', model: 'cardboardBoxClosed', logic: 'box@3,5', at: [5.5, 3.5], facing: 'S' },
    { id: 'study-desk-north', model: 'desk', logic: 'desk@3,7', against: { wall: 'east', at: 3.5 }, facing: 'W' },
    { id: 'study-lamp', model: 'lampRoundFloor', logic: 'lamp@4,7', at: [7.5, 4.6], facing: 'S' },
    { id: 'study-desk-south', model: 'desk', logic: 'desk@7,6', at: [6.5, 7.6], facing: 'N' },
    { id: 'study-desk-south-chair', model: 'chairDesk', at: [6.5, 6.95], facing: 'S' },
    { id: 'study-bookcase', model: 'bookcaseOpenLow', logic: 'bookshelf@6,7', against: { wall: 'east', at: 6.5 }, facing: 'W' },
    { id: 'study-bookcase-books', model: 'books', on: { parent: 'study-bookcase' } },
    { id: 'study-bookcase-south', model: 'bookcaseOpenLow', logic: 'bookshelf@6,7', against: { wall: 'east', at: 7.4 }, facing: 'W' },
    // Sala de jantar: duas mesas unidas formam uma mesa comprida com as cadeiras do lado norte.
    { id: 'dining-table', model: 'table', logic: 'table@3,1', at: [2.3, 3.85], facing: 'N' },
    { id: 'dining-table-extension', model: 'table', at: [3.85, 3.85], facing: 'N' },
    { id: 'dining-chair-a', model: 'chair', at: [2.0, 3.3], facing: 'S' },
    { id: 'dining-chair-b', model: 'chair', at: [2.65, 3.3], facing: 'S' },
    { id: 'dining-chair-west', model: 'chair', logic: 'chair@3,3', at: [3.5, 3.3], facing: 'S' },
    { id: 'dining-chair-east', model: 'chair', logic: 'chair@3,4', at: [4.2, 3.3], facing: 'S' },
    // Casa de banho: louças encostadas às paredes.
    { id: 'bathroom-toilet-north', model: 'toilet', logic: 'toilet@5,3', against: { wall: 'bathroom-north', side: 'S', at: 3.5 }, facing: 'S' },
    { id: 'bathroom-sink', model: 'bathroomSink', against: { wall: 'bathroom-north', side: 'S', at: 0.6 }, facing: 'S' },
    { id: 'bathroom-shower', model: 'showerRound', logic: 'shower@7,2', at: [2.5, 7.5], facing: 'S' },
    { id: 'bathroom-bathtub', model: 'bathtub', logic: 'bathtub@7,3', at: [4, 7.5], facing: 'N' },
    { id: 'bathroom-toilet-south', model: 'toilet', logic: 'toilet@7,1', against: { wall: 'south', at: 1.5 }, facing: 'N' },
  ],
}
