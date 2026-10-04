import type { SceneSpec } from '../schema'

export const theOpenWindowUpper: SceneSpec = {
  puzzleId: 'expert-1',
  floor: 1,
  storeyFootprint: { kind: 'full' },
  stairwellBounds: [6.10625, 2.360625, 7.09375, 4.639375],
  circulation: {
    landing: [6.10625, 1.5, 7.09375, 2.360625],
    halls: [
      { id: 'bedroom-run', bounds: [4.2, 1.5, 6.95, 2.25] },
      { id: 'bedroom-dining-route', bounds: [4.2, 1.5, 4.95, 4.95] },
      { id: 'garden-gallery', bounds: [0.05, 4.15, 6, 4.95] },
    ],
    roomAccessTargets: [
      { id: 'bedroom-approach', bounds: [6.15, 1.5, 6.95, 2.25] },
      { id: 'study-approach', bounds: [5.05, 4.15, 5.8, 4.9] },
      { id: 'dining-approach', bounds: [4.2, 4.15, 4.95, 4.9] },
      { id: 'bathroom-approach', bounds: [3.05, 4.15, 3.8, 5.6] },
    ],
  },
  shell: {
    features: [
      { wall: 'north', at: 2.8, kind: 'window' },
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
    { id: 'bedroom-dining', from: [0, 3], to: [5, 3], height: 'cutaway', openings: [{ at: 4.5, width: 1.0, kind: 'open' }] },
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
      height: 'full',
      openings: [{ at: 3.4, width: 1.2, kind: 'open' }],
    },
    { id: 'bathroom-east', from: [5, 5], to: [5, 8], height: 'full' },

    // As guardas acompanham o vão; a extremidade norte fica aberta para a chegada.
    { id: 'stairwell-west', from: [6.05, 2.3], to: [6.05, 4.7], height: 'half', treatment: 'railing', freeEnds: ['from'] },
    { id: 'stairwell-east', from: [7.15, 2.3], to: [7.15, 4.7], height: 'half', treatment: 'railing', freeEnds: ['from'] },
    { id: 'stairwell-south', from: [6.05, 4.7], to: [7.15, 4.7], height: 'half', treatment: 'railing' },
  ],
  furniture: [
    { id: 'bedroom-bed', model: 'bedDouble', at: [2.5, 2], facing: 'E' },
    { id: 'bedroom-rug', model: 'rugRectangle', logic: 'rug@0,1', at: [2, 1], facing: 'E' },
    { id: 'bedroom-lamp-east', model: 'lampRoundFloor', logic: 'lamp@0,3', at: [3.5, 0.5], facing: 'S' },
    { id: 'bedroom-lamp-west', model: 'lampRoundFloor', logic: 'lamp@2,0', at: [0.5, 2.5], facing: 'S' },
    { id: 'bedroom-clock-east', model: 'speaker', logic: 'clock@0,7', at: [7.5, 0.5], facing: 'S' },
    { id: 'bedroom-clock-spine', model: 'speaker', logic: 'clock@2,5', at: [5.5, 2.5], facing: 'S' },

    { id: 'study-box', model: 'cardboardBoxClosed', logic: 'box@3,5', at: [5.5, 3.5], facing: 'S' },
    { id: 'study-desk-north', model: 'desk', logic: 'desk@3,7', at: [7.5, 3.5], facing: 'E' },
    { id: 'study-lamp', model: 'lampRoundFloor', logic: 'lamp@4,7', at: [7.5, 4.5], facing: 'S' },
    { id: 'dining-chair-west', model: 'chair', logic: 'chair@3,3', at: [3.5, 3.5], facing: 'W' },
    { id: 'dining-table', model: 'table', logic: 'table@3,1', at: [2, 3.6], facing: 'E' },
    { id: 'dining-chair-east', model: 'chair', logic: 'chair@3,4', at: [4.05, 3.8], facing: 'W' },

    { id: 'bathroom-toilet-north', model: 'toilet', logic: 'toilet@5,3', at: [3.5, 5.9], facing: 'S' },
    { id: 'bathroom-shower', model: 'showerRound', logic: 'shower@7,2', at: [2.5, 7.5], facing: 'S' },
    { id: 'bathroom-bathtub', model: 'bathtub', logic: 'bathtub@7,3', at: [4, 7.5], facing: 'N' },
    { id: 'bathroom-toilet-south', model: 'toilet', logic: 'toilet@7,1', at: [1.5, 7.5], facing: 'S' },
    { id: 'study-desk-south', model: 'desk', logic: 'desk@7,6', at: [6.5, 7.5], facing: 'E' },
    { id: 'study-bookcase', model: 'bookcaseOpenLow', logic: 'bookshelf@6,7', at: [7.5, 7], facing: 'S' },
  ],
}
