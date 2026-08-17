import type { FurnitureType } from './types'
import type { FurnitureIcon } from './furniture'

// ============================================================================
// EVALUATION BRANCH ONLY — Kenney Furniture Kit (CC0) swapped in for the
// hand-drawn noire miniatures, so the two directions can be compared on the
// real board instead of argued about.
//
// Kenney's kit ships every object in four pre-rendered facings
// (NE/NW/SE/SW), which is the one thing it does better than hand-drawn art
// here: a turned piece never has to be rotated by CSS, because the turned
// view already exists. SE is used face-on and SW as the side view, feeding
// the FURNITURE_ICON_SIDE mechanism already in the renderer.
//
// KNOWN GAP: the kit has no clock, which is one of the game's 19 types and
// is referenced by clue text ("Beside the clock"). `radio` stands in for it
// here so the board renders; it would need resolving before this could ship.
// ============================================================================

const FILE: Record<FurnitureType, string> = {
  chair: 'chair',
  sofa: 'loungeSofa',
  bed: 'bedDouble',
  table: 'tableRound',
  box: 'cardboardBoxClosed',
  rug: 'rugRectangle',
  plant: 'pottedPlant',
  shrub: 'plantSmall1',
  lamp: 'lampSquareFloor',
  counter: 'kitchenCabinet',
  tv: 'televisionVintage',
  bathtub: 'bathtub',
  bookshelf: 'bookcaseOpen',
  stove: 'kitchenStove',
  fridge: 'kitchenFridge',
  clock: 'radio', // no clock in the kit — see KNOWN GAP above
  desk: 'desk',
  toilet: 'toilet',
  shower: 'shower',
}

const sprite = (name: string): FurnitureIcon => ({ size }: { size?: number }) => (
  <img
    src={`/kenney/${name}.png`}
    alt=""
    aria-hidden="true"
    style={{
      width: size ?? '100%',
      height: size ?? '100%',
      objectFit: 'contain',
      // The sprites are lit from above-left and sit on transparent ground;
      // a soft drop shadow keeps them from floating on the floor material.
      filter: 'drop-shadow(0 2px 3px rgba(18,14,10,0.55))',
    }}
  />
)

export const FURNITURE_ICON: Record<FurnitureType, FurnitureIcon> = Object.fromEntries(
  (Object.keys(FILE) as FurnitureType[]).map(t => [t, sprite(`${FILE[t]}_SE`)]),
) as Record<FurnitureType, FurnitureIcon>

/** SW is the same object seen from the side — used for 90/270 rotations. */
export const FURNITURE_ICON_SIDE: Partial<Record<FurnitureType, FurnitureIcon>> = Object.fromEntries(
  (Object.keys(FILE) as FurnitureType[]).map(t => [t, sprite(`${FILE[t]}_SW`)]),
) as Partial<Record<FurnitureType, FurnitureIcon>>
