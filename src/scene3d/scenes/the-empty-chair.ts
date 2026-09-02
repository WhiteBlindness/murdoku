import type { SceneSpec } from '../schema'

// ============================================================================
// THE EMPTY CHAIR (very-easy-2) — transfer pilot #1.
//
// Same 6×6 as the golden master, but half the house is a GARDEN: a walled
// courtyard on the camera side, entered from the living room through wide
// patio doors. Tests the recipe on an outdoor floor material, a pony wall
// carrying furniture on its camera side, and a desk that must back onto the
// cut-away east shell.
//
//     z=0 ┌──── north shell ────┬────────┐
//         │ LIVING              ║ OFFICE │
//     z=3 ├─ pony wall / patio ─╫─ pony ─┤
//         │        GARDEN (grass)        │
//     z=6 └──────────────────────────────┘
//                             x=4
// ============================================================================

export const theEmptyChair: SceneSpec = {
  puzzleId: 'very-easy-2',
  floor: 0,
  entry: { wall: 'west', at: 0.7 },
  shell: {
    features: [
      { wall: 'north', at: 2.6, kind: 'window' },
      { wall: 'north', at: 4.9, kind: 'window' },
      { wall: 'west', at: 2.0, kind: 'window' },
    ],
  },
  floors: [{ id: 'courtyard', cells: [0, 3, 5, 5], material: 'grass' }],
  walls: [
    // living | office, door near the middle
    { id: 'spine', from: [4, 0], to: [4, 3], openings: [{ at: 1.9, kind: 'door' }] },
    // living | garden: waist-high wall with wide patio opening
    { id: 'patio', from: [0, 3], to: [4, 3], height: 'half', openings: [{ at: 2.6, width: 1.3, kind: 'open' }] },
    // office | garden: waist-high wall the low bookcases back onto
    { id: 'office-garden', from: [4, 3], to: [6, 3], height: 'half' },
  ],
  furniture: [
    // ---- living room ---------------------------------------------------------
    { id: 'sofa', model: 'loungeSofa', logic: 'sofa@1,0', against: { wall: 'west', at: 2.0 } },
    { id: 'coffee-table', model: 'tableCoffee', at: [1.35, 2.0], facing: 'E' },
    { id: 'tv-stand', model: 'cabinetTelevision', logic: 'tv@0,1', against: { wall: 'north', at: 1.45 } },
    { id: 'tv', model: 'televisionVintage', logic: 'tv@0,1', on: { parent: 'tv-stand' } },
    { id: 'console', model: 'sideTable', logic: 'clock@0,3', against: { wall: 'north', at: 3.4 } },
    { id: 'clock-radio', model: 'radio', logic: 'clock@0,3', on: { parent: 'console' } },
    { id: 'armchair', model: 'loungeChair', at: [2.9, 1.15], facing: 'W' },
    // ---- office ----------------------------------------------------------------
    { id: 'desk', model: 'desk', logic: 'desk@0,5', against: { wall: 'east', at: 0.55 } },
    { id: 'laptop', model: 'laptop', on: { parent: 'desk' } },
    { id: 'desk-chair', model: 'chairDesk', at: [5.15, 0.55], facing: 'E' },
    { id: 'shelf-a', model: 'bookcaseOpenLow', logic: 'bookshelf@2,4', against: { wall: 'office-garden', side: 'N', at: 4.3 } },
    { id: 'shelf-b', model: 'bookcaseOpenLow', logic: 'bookshelf@2,4', against: { wall: 'office-garden', side: 'N', at: 4.8 } },
    { id: 'books', model: 'books', on: { parent: 'shelf-a' } },
    { id: 'office-plant', model: 'pottedPlant', at: [5.55, 2.4] },
    // ---- garden ------------------------------------------------------------------
    { id: 'plant-1', model: 'pottedPlant', logic: 'plant@3,1', at: [1.5, 3.55] },
    { id: 'shrub-1', model: 'pottedPlant', logic: 'shrub@4,2', at: [2.45, 4.55] },
    { id: 'plant-2', model: 'pottedPlant', logic: 'plant@5,3', at: [3.5, 5.5] },
    { id: 'shrub-2', model: 'pottedPlant', logic: 'shrub@3,4', at: [4.55, 3.55] },
    { id: 'garden-bench', model: 'bench', against: { wall: 'west', at: 4.6 } },
    { id: 'garden-chair', model: 'chair', at: [0.9, 5.4], facing: 'N' },
  ],
  rugs: [
    { id: 'living-rug', model: 'rugRound', at: [1.5, 2.0] },
    { id: 'patio-mat', model: 'rugDoormat', at: [2.6, 3.4] },
  ],
}
