import type { SceneSpec } from '../schema'

// ============================================================================
// THE LAST NIGHTCAP (easy-1) — transfer pilot #2.
//
// A generated 7×7 case with a two-cell-wide hall running the full depth of
// the house, a galley kitchen along the cut-away east side, a dining room and
// a garden on the west. The hall is treated as an entrance hall + gallery, not
// a corridor: one door into the dining room, waist-high walls to the kitchen
// (a breakfast bar) and the garden, and the front door at its head.
//
//     z=0 ┌── north shell (front door at x=3.8) ───────┐
//         │ DINING   ║ door  HALL   ┆ pony   KITCHEN   │
//     z=4 ├─ pony ───╫──────────────┆───────────────────┤
//         │ GARDEN   ┆ pass         ┆ pass              │
//     z=7 └──────────────────────────────────────────────┘
//                   x=3           x=5
// ============================================================================

export const theLastNightcap: SceneSpec = {
  puzzleId: 'easy-1',
  floor: 0,
  entry: { wall: 'north', at: 3.8 },
  shell: {
    features: [
      { wall: 'north', at: 1.5, kind: 'window' },
      { wall: 'north', at: 6.0, kind: 'window' },
      { wall: 'west', at: 1.5, kind: 'window' },
    ],
  },
  floors: [{ id: 'garden', cells: [0, 4, 2, 6], material: 'grass', kind: 'exterior' }],
  walls: [
    { id: 'dining-hall', from: [3, 0], to: [3, 4], openings: [{ at: 1.2, kind: 'door' }] },
    // facade to the garden: a pony wall whose front opening runs to the plinth (no stub)
    { id: 'garden-hall', from: [3, 4], to: [3, 7], height: 'half', openings: [{ at: 6.4, width: 1.2, kind: 'open' }] },
    { id: 'dining-garden', from: [0, 4], to: [3, 4], height: 'half', openings: [{ at: 1.5, width: 1.0, kind: 'open' }] },
    // breakfast-bar wall; stops at z=4.9 so the front of the kitchen is open (no isolated end piece)
    { id: 'hall-kitchen', from: [5, 0], to: [5, 4.9], height: 'half', openings: [{ at: 1.5, width: 1.0, kind: 'open' }], freeEnds: ['to'] },
  ],
  furniture: [
    // ---- hall -------------------------------------------------------------------
    { id: 'hall-plant', model: 'pottedPlant', logic: 'plant@1,4', at: [4.15, 1.4] },
    { id: 'hall-console', model: 'sideTable', logic: 'clock@3,4', against: { wall: 'hall-kitchen', side: 'W', at: 2.8 } },
    { id: 'hall-clock', model: 'radio', logic: 'clock@3,4', on: { parent: 'hall-console' } },
    { id: 'hall-speaker', model: 'speaker', logic: 'clock@4,4', against: { wall: 'hall-kitchen', side: 'W', at: 4.5 } },
    // décor never stands south-east of a cell centre it does not occupy: it would hide the standee there
    { id: 'hall-plant-2', model: 'pottedPlant', logic: 'plant@5,3', at: [3.3, 5.05] },
    // ---- kitchen (galley along the cut-away east edge) ----------------------------
    { id: 'sink', model: 'kitchenSink', logic: 'counter@1,6', against: { wall: 'east', at: 1.35 } },
    { id: 'counter', model: 'kitchenCabinet', logic: 'counter@1,6', against: { wall: 'east', at: 1.9 } },
    { id: 'stove', model: 'kitchenStove', logic: 'stove@2,5', against: { wall: 'hall-kitchen', side: 'E', at: 2.3 } },
    { id: 'counter-2', model: 'kitchenCabinetDrawer', against: { wall: 'hall-kitchen', side: 'E', at: 2.85 } },
    { id: 'microwave', model: 'kitchenMicrowave', on: { parent: 'counter-2' } },
    { id: 'fridge', model: 'kitchenFridge', logic: 'fridge@6,6', at: [6.5, 6.5] },
    { id: 'kitchen-table', model: 'tableCoffeeSquare', at: [5.9, 4.3] },
    // ---- dining room ---------------------------------------------------------------
    { id: 'dining-table', model: 'table', logic: 'table@2,0', at: [1.0, 2.5] },
    { id: 'dining-chair', model: 'chair', logic: 'chair@1,0', at: [0.7, 1.75], facing: 'S' },
    { id: 'dining-chair-2', model: 'chair', at: [1.3, 3.2], facing: 'N' },
    { id: 'floor-lamp', model: 'lampRoundFloor', logic: 'lamp@3,0', at: [0.35, 2.85] },
    { id: 'sideboard', model: 'cabinetTelevisionDoors', against: { wall: 'north', at: 1.5 } },
    { id: 'sideboard-plant', model: 'plantSmall2', on: { parent: 'sideboard', offset: [0.25, 0] } },
    // ---- garden ---------------------------------------------------------------------
    { id: 'shrub', model: 'plant_bushDetailed', logic: 'shrub@5,2', at: [2.1, 5.3], yaw: 15 },
    { id: 'garden-plant', model: 'flower_redA', logic: 'plant@6,2', at: [2.1, 6.45], yaw: -10 },
    // the tree stands in the front-west corner: a tall object there hides no cell centre
    { id: 'garden-tree', model: 'tree_oak', at: [0.55, 6.45] },
    { id: 'garden-flowers', model: 'flower_yellowA', at: [1.3, 6.3], yaw: 20 },
    { id: 'garden-bench', model: 'bench', at: [0.5, 5.5], facing: 'E' },
    { id: 'fence-a', model: 'fence_simple', at: [0.07, 4.7], facing: 'E' },
    { id: 'fence-b', model: 'fence_simple', at: [0.07, 5.95], facing: 'E' },
  ],
  rugs: [
    { id: 'doormat', model: 'rugDoormat', at: [3.8, 0.35] },
    { id: 'hall-runner', model: 'rugRectangle', at: [4.0, 3.5], facing: 'E' },
  ],
}
