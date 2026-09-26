import type { SceneSpec } from '../schema'

// O portão oeste abre para um caminho de pedra que atravessa o recinto e chega
// ao pequeno adro do jazigo. Arbustos e flores baixos formam canteiros soltos.
// As campas e o jazigo são cenário; só os móveis identificados têm lógica.
export const pilotCemetery: SceneSpec = {
  puzzleId: 'pilot-cemetery',
  floor: 0,
  entry: { wall: 'west', at: 4.5 },
  floors: [
    { id: 'cemetery-ground', cells: [0, 0, 5, 5], material: 'dirt', kind: 'courtyard' },

    // O limiar e o adro são manchas pequenas de pedra sobre a terra contínua.
    { id: 'gate-vestibule', cells: [0, 4, 0, 4], material: 'stone', kind: 'interior' },
    { id: 'crypt-forecourt', cells: [3, 2, 4, 2], material: 'stone', kind: 'courtyard' },
  ],
  walls: [
    { id: 'gatehouse-north', from: [0, 4], to: [1, 4], height: 'half' },
    { id: 'gatehouse-south', from: [0, 5], to: [1, 5], height: 'half' },
    {
      id: 'gatehouse-east',
      from: [1, 4],
      to: [1, 5],
      height: 'half',
      openings: [{ at: 4.5, width: 1, kind: 'open' }],
    },
  ],
  furniture: [
    // Móveis lógicos do caso, com modelos que representam o tipo indicado.
    { id: 'graveyard-shrub-west', model: 'plant_bushDetailed', logic: 'shrub@0,0', at: [0.55, 0.55] },
    { id: 'gate-lantern', model: 'lampRoundFloor', logic: 'lamp@2,0', at: [0.5, 2.5] },
    { id: 'chapel-chair', model: 'chair', logic: 'chair@0,3', at: [3.5, 0.5], facing: 'E' },
    { id: 'chapel-flowers', model: 'flower_purpleA', logic: 'plant@1,5', at: [5.5, 1.5] },
    { id: 'grounds-box', model: 'cardboardBoxClosed', logic: 'box@3,0', at: [0.5, 3.5] },
    { id: 'gate-shrub', model: 'plant_bushDetailed', logic: 'shrub@5,2', at: [2.9, 5.5] },
    { id: 'orchard-flowers', model: 'flower_redA', logic: 'plant@3,3', at: [3.95, 3.95] },
    { id: 'orchard-chair', model: 'chair', logic: 'chair@5,5', at: [5.5, 5.5], facing: 'W' },

    // Duas campas e uma cruz formam um conjunto secundário junto ao pomar.
    { id: 'north-grave', model: 'graveyard_grave', at: [1.75, 0.55], facing: 'E' },
    { id: 'north-cross', model: 'graveyard_gravestoneCross', at: [2.9, 0.25], facing: 'S' },
    { id: 'south-grave', model: 'graveyard_grave', at: [1, 5.5], facing: 'E' },
    { id: 'south-cross', model: 'graveyard_gravestoneCross', at: [2.1, 5.5], facing: 'S' },
    { id: 'chapel-crypt', model: 'graveyard_cryptSmall', at: [4.25, 2.25], facing: 'S' },

    // Plantas baixas acompanham as campas e a orla do pomar.
    { id: 'graveyard-border-bush', model: 'plant_bushSmall', at: [0.5, 1.5] },
    { id: 'graveyard-border-flowers', model: 'flower_yellowA', at: [2.9, 1.25] },
    { id: 'orchard-bush', model: 'plant_bushSmall', at: [4.4, 5.35] },
    { id: 'orchard-bloom-1', model: 'flower_yellowA', at: [3.7, 5.55] },
    { id: 'orchard-bloom-2', model: 'flower_purpleA', at: [4, 5.55] },
    { id: 'crypt-border-bush', model: 'plant_bushSmall', at: [5.2, 3.8] },
  ],
  rugs: [
    // Lajes sobrepostas em sequência tornam o percurso legível e contínuo.
    { id: 'gate-path-1', model: 'path_stone', at: [0.75, 4.5] },
    { id: 'gate-path-2', model: 'path_stone', at: [1.5, 4.5] },
    { id: 'gate-path-3', model: 'path_stone', at: [2.25, 4.5] },
    { id: 'gate-path-4', model: 'path_stone', at: [3, 4.5] },
    { id: 'crypt-path-1', model: 'path_stone', at: [3.3, 3.75], facing: 'E' },
    { id: 'crypt-path-2', model: 'path_stone', at: [3.3, 3], facing: 'E' },
    { id: 'crypt-path-3', model: 'path_stone', at: [3.3, 2.5], facing: 'E' },
  ],
}
