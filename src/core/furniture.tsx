import React from 'react'
import type { FurnitureType } from './types'

/**
 * Noire Illustration board miniatures.
 *
 * Drawing rules, in the order they matter:
 *
 *  1. Nameable silhouette first. Every piece is a literal, top-down or
 *     three-quarter object — a bed has a pillow and a turned-down sheet, a lamp
 *     has a drawn shade and a weighted base, a plant has individual leaves. The
 *     board is part of the clue vocabulary, so "what is that?" must never be a
 *     question a player has to ask.
 *  2. Confident contours. One deep-espresso outer line (`#1a1a1a`, ~3.2px in a
 *     100x100 viewBox) carries the shape; interior construction lines are thin
 *     and quiet so they never fight the silhouette at 40px cells.
 *  3. Flat noire colour. Fills are broad and flat — parchment, brass, mahogany,
 *     oxblood, desaturated olive, porcelain, charcoal. The only gradient per
 *     piece is a near-flat body tone that keeps the token from reading as paper.
 *  4. Cast shadow. Each token drops a small directional shadow so it sits on the
 *     floor like a physical cardboard piece on a dark dossier.
 */
export interface FurnitureIconProps { size?: number }
export type FurnitureIcon = (props: FurnitureIconProps) => React.ReactElement

const S = (size?: number) => size
  ? { width: size, height: size }
  : { width: '100%', height: '100%' }

/** Deep espresso, never pure black: keeps the board warm under the amber key light. */
const INK = '#1a1a1a'

// Noire palette — the whole board is painted from this shelf and nothing else.
const WOOD_L = '#8A5A32'
const WOOD = '#6B4325'
const WOOD_D = '#3E2614'
const BONE = '#EFE3C2'
const BONE_D = '#CDBB92'
const LINEN = '#E0D0A6'
const BRASS = '#C9922E'
const BRASS_L = '#E7C070'
const BRASS_D = '#8A6220'
const OLIVE = '#63744A'
const OLIVE_L = '#87975F'
const OLIVE_D = '#3F4C2E'
const BLOOD = '#8C2D24'
const BLOOD_D = '#5E1E19'
const SLATE = '#6E7368'
const SLATE_L = '#8F9488'
const SLATE_D = '#474C43'
const PORC = '#CFCCB8'
const PORC_D = '#A5A492'
const CHAR = '#2E2E29'
const CHAR_L = '#45453D'
const GLASS = '#46564F'
const CLAY = '#A4573A'
const CLAY_D = '#743823'
const LEATHER = '#B08A55'
const LEATHER_L = '#CDA96D'

/** The one confident outer line every silhouette is built on. */
const OUT = {
  'data-furniture-contour': 'true',
  stroke: INK,
  strokeWidth: 3.2,
  strokeLinejoin: 'round' as const,
  strokeLinecap: 'round' as const,
}

/** Secondary contour for parts that sit inside the silhouette. */
const OUT_IN = {
  stroke: INK,
  strokeWidth: 2.2,
  strokeLinejoin: 'round' as const,
  strokeLinecap: 'round' as const,
}

/** Construction lines: seams, planks, grain. Quiet on purpose. */
const SEAM = {
  fill: 'none',
  stroke: INK,
  strokeOpacity: 0.5,
  strokeWidth: 1.6,
  strokeLinejoin: 'round' as const,
  strokeLinecap: 'round' as const,
}

/** Single warm catch-light, as if from the board's amber key. */
const SHEEN = {
  fill: 'none',
  stroke: '#D8B777', // DESIGN.md: miniature-highlight
  strokeOpacity: 0.3,
  strokeWidth: 1.8,
  strokeLinejoin: 'round' as const,
  strokeLinecap: 'round' as const,
}

const FOOT = { stroke: INK, strokeWidth: 3, strokeLinecap: 'round' as const }

/**
 * One near-flat body tone per piece plus the cast shadow. Two close stops, not a
 * showy ramp: enough to read as a moulded object, never enough to muddy the
 * flat-illustration language.
 */
function Frame({ prefix, size, tone, children }: {
  prefix: string
  size?: number
  tone: [string, string]
  children: React.ReactNode
}) {
  return (
    <svg
      {...S(size)}
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      data-furniture-icon={prefix}
    >
      <defs>
        <linearGradient id={`${prefix}-tone`} x1="0" y1="0" x2="0.25" y2="1">
          <stop offset="0" stopColor={tone[0]} />
          <stop offset="1" stopColor={tone[1]} />
        </linearGradient>
        <filter id={`${prefix}-shadow`} x="-25%" y="-25%" width="155%" height="155%">
          <feDropShadow dx="1.6" dy="2.6" stdDeviation="1.5" floodColor="#120E0A" floodOpacity="0.55" />
        </filter>
      </defs>
      <g filter={`url(#${prefix}-shadow)`}>{children}</g>
    </svg>
  )
}

/* ------------------------------------------------------------------ seating */

const ArmchairIcon: FurnitureIcon = ({ size }) => (
  <Frame prefix="chair" size={size} tone={[LEATHER_L, '#8E6B3E']}>
    {/* backrest and both arms carved as one horseshoe, seen from above */}
    <path d="M13 92V38c0-14 10-25 25-25h24c15 0 25 11 25 25v54H73V48H27v44Z" fill="url(#chair-tone)" {...OUT} />
    {/* back pillow */}
    <rect x="27" y="20" width="46" height="25" rx="9" fill={LEATHER_L} {...OUT_IN} />
    {/* seat cushion */}
    <rect x="26" y="48" width="48" height="42" rx="8" fill={LEATHER_L} {...OUT_IN} />
    {/* arm caps */}
    <rect x="15" y="42" width="11" height="46" rx="5" fill={LEATHER} {...OUT_IN} />
    <rect x="74" y="42" width="11" height="46" rx="5" fill={LEATHER} {...OUT_IN} />
    <path d="M50 52v34M32 70h36" {...SEAM} />
    <path d="M33 26h34" {...SHEEN} />
    <path d="M19 92v5M81 92v5" {...FOOT} />
  </Frame>
)

const SofaIcon: FurnitureIcon = ({ size }) => (
  <Frame prefix="sofa" size={size} tone={[LEATHER_L, '#8A6739']}>
    <path d="M5 90V36c0-13 9-22 22-22h46c13 0 22 9 22 22v54H85V46H15v44Z" fill="url(#sofa-tone)" {...OUT} />
    {/* two back pillows */}
    <rect x="17" y="19" width="31" height="24" rx="7" fill={LEATHER_L} {...OUT_IN} />
    <rect x="52" y="19" width="31" height="24" rx="7" fill={LEATHER_L} {...OUT_IN} />
    {/* two seat cushions */}
    <rect x="16" y="47" width="32" height="41" rx="6" fill={LEATHER_L} {...OUT_IN} />
    <rect x="52" y="47" width="32" height="41" rx="6" fill={LEATHER_L} {...OUT_IN} />
    {/* arm caps */}
    <rect x="6" y="40" width="10" height="48" rx="5" fill={LEATHER} {...OUT_IN} />
    <rect x="84" y="40" width="10" height="48" rx="5" fill={LEATHER} {...OUT_IN} />
    <path d="M22 68h20M58 68h20" {...SEAM} />
    <path d="M22 25h20M58 25h20" {...SHEEN} />
    <path d="M12 90v6M88 90v6" {...FOOT} />
  </Frame>
)

/* -------------------------------------------------------------- bedroom set */

const BedIcon: FurnitureIcon = ({ size }) => (
  <Frame prefix="bed" size={size} tone={[WOOD_L, WOOD_D]}>
    {/* frame with a headboard at the top of the cell */}
    <rect x="9" y="5" width="82" height="90" rx="6" fill="url(#bed-tone)" {...OUT} />
    <rect x="13" y="8" width="74" height="16" rx="4" fill={WOOD_L} {...OUT_IN} />
    <path d="M20 12h60" {...SHEEN} />
    {/* mattress */}
    <rect x="14" y="26" width="72" height="65" rx="4" fill={BONE_D} {...OUT_IN} />
    {/* pillow */}
    <rect x="20" y="30" width="60" height="19" rx="7" fill={BONE} {...OUT_IN} />
    <path d="M50 32v15" {...SEAM} />
    {/* blanket with its sheet turned down */}
    <path d="M14 53h72v34a4 4 0 0 1-4 4H18a4 4 0 0 1-4-4Z" fill={BLOOD_D} {...OUT_IN} />
    <rect x="14" y="53" width="72" height="10" rx="2" fill={LINEN} {...OUT_IN} />
    <path d="M22 72v16M50 70v20M78 72v16" {...SEAM} />
    <path d="M20 58h58" {...SHEEN} />
  </Frame>
)

const TableIcon: FurnitureIcon = ({ size }) => (
  <Frame prefix="table" size={size} tone={[WOOD_L, WOOD]}>
    {/* legs peek out at the corners so the top reads as a raised slab */}
    <rect x="12" y="12" width="12" height="76" rx="3" fill={WOOD_D} {...OUT_IN} />
    <rect x="76" y="12" width="12" height="76" rx="3" fill={WOOD_D} {...OUT_IN} />
    {/* top */}
    <rect x="7" y="17" width="86" height="66" rx="9" fill="url(#table-tone)" {...OUT} />
    <rect x="15" y="25" width="70" height="50" rx="5" fill={WOOD_L} {...OUT_IN} />
    <path d="M22 34h56M22 50h56M22 66h56" {...SEAM} />
    {/* a laid place setting: plate, glass, folded napkin */}
    <ellipse cx="38" cy="50" rx="10" ry="8" fill={PORC} {...OUT_IN} />
    <ellipse cx="38" cy="50" rx="5" ry="4" fill={PORC_D} />
    <circle cx="64" cy="43" r="5" fill={BRASS_L} {...OUT_IN} />
    <path d="M58 60h14l-2 8H60Z" fill={LINEN} {...OUT_IN} />
  </Frame>
)

const BoxIcon: FurnitureIcon = ({ size }) => (
  <Frame prefix="box" size={size} tone={[WOOD_L, WOOD]}>
    {/* a nailed crate, lid slightly proud of the body */}
    <rect x="12" y="20" width="76" height="70" rx="4" fill="url(#box-tone)" {...OUT} />
    <rect x="8" y="10" width="84" height="16" rx="4" fill={WOOD_D} {...OUT} />
    <rect x="17" y="30" width="66" height="16" rx="2" fill={WOOD_L} {...OUT_IN} />
    <rect x="17" y="52" width="66" height="16" rx="2" fill={WOOD_L} {...OUT_IN} />
    <rect x="17" y="74" width="66" height="11" rx="2" fill={WOOD_L} {...OUT_IN} />
    <path d="M18 30 82 85M82 30 18 85" {...SEAM} />
    <circle cx="20" cy="16" r="2.4" fill={BRASS} />
    <circle cx="80" cy="16" r="2.4" fill={BRASS} />
    <path d="M16 15h68" {...SHEEN} />
  </Frame>
)

const RugIcon: FurnitureIcon = ({ size }) => (
  <Frame prefix="rug" size={size} tone={[BLOOD, BLOOD_D]}>
    <rect x="8" y="12" width="84" height="76" rx="3" fill="url(#rug-tone)" {...OUT} />
    <rect x="15" y="19" width="70" height="62" rx="2" fill={WOOD_D} {...OUT_IN} />
    <rect x="22" y="26" width="56" height="48" rx="2" fill={BLOOD_D} stroke={BRASS_D} strokeWidth="1.6" />
    {/* woven medallion */}
    <path d="M50 30 74 50 50 70 26 50Z" fill={BRASS_D} {...OUT_IN} />
    <path d="M50 38 64 50 50 62 36 50Z" fill={LINEN} {...OUT_IN} />
    <path d="M28 32h8M64 32h8M28 68h8M64 68h8" stroke={BRASS} strokeWidth="2" strokeLinecap="round" />
    {/* knotted fringe, top and bottom */}
    <path d="M13 12V6M23 12V6M33 12V6M43 12V6M53 12V6M63 12V6M73 12V6M83 12V6" stroke={INK} strokeWidth="2.4" strokeLinecap="round" />
    <path d="M13 88v6M23 88v6M33 88v6M43 88v6M53 88v6M63 88v6M73 88v6M83 88v6" stroke={INK} strokeWidth="2.4" strokeLinecap="round" />
  </Frame>
)

/* ----------------------------------------------------------------- greenery */

const PlantIcon: FurnitureIcon = ({ size }) => (
  <Frame prefix="plant" size={size} tone={[CLAY, CLAY_D]}>
    <ellipse cx="50" cy="90" rx="26" ry="5" fill="#12140F" opacity="0.45" />
    {/* eight drawn leaves, each with its own midrib */}
    <path d="M48 58C34 50 24 36 22 20c16 4 27 18 30 36Z" fill={OLIVE} {...OUT} />
    <path d="M52 56c-2-19 3-34 14-44 5 17 1 33-10 46Z" fill={OLIVE_L} {...OUT} />
    <path d="M55 58c8-16 21-26 37-29-4 17-17 29-34 34Z" fill={OLIVE} {...OUT} />
    <path d="M45 62C31 60 18 62 8 68c13 9 27 8 39-1Z" fill={OLIVE_D} {...OUT} />
    <path d="M56 63c14-4 27-3 37 3-12 10-26 10-38 2Z" fill={OLIVE_D} {...OUT} />
    <path d="M46 55C40 43 30 34 17 30c3 14 13 24 28 30Z" fill={OLIVE_L} {...OUT} />
    <path d="M54 54c6-13 15-22 27-25-2 14-11 24-25 30Z" fill={OLIVE} {...OUT} />
    <path d="M50 60c-1-14-6-25-14-33 10 6 16 19 17 33Z" fill={OLIVE_D} {...OUT} />
    <path d="M27 26 46 57M64 20 52 55M85 32 57 56M14 68l30-4M88 68l-31-3" {...SEAM} />
    {/* terracotta pot */}
    <path d="M31 68h38l-6 24H37Z" fill="url(#plant-tone)" {...OUT} />
    <rect x="27" y="62" width="46" height="10" rx="3" fill={CLAY} {...OUT} />
    <path d="M33 67h34" {...SHEEN} />
    <path d="M42 76l2 12M58 76l-2 12" {...SEAM} />
  </Frame>
)

const ShrubIcon: FurnitureIcon = ({ size }) => (
  <Frame prefix="shrub" size={size} tone={[OLIVE, OLIVE_D]}>
    <ellipse cx="50" cy="88" rx="30" ry="6" fill="#12140F" opacity="0.45" />
    {/* a low succulent rosette: outer ring of blades, then an inner ring */}
    <path d="M50 84C30 82 14 70 10 52c20-2 35 10 40 32Z" fill="url(#shrub-tone)" {...OUT} />
    <path d="M50 84c20-2 36-14 40-32-20-2-35 10-40 32Z" fill={OLIVE_D} {...OUT} />
    <path d="M48 74C34 66 26 50 28 32c15 8 21 25 20 42Z" fill={OLIVE} {...OUT} />
    <path d="M52 74c14-8 22-24 20-42-15 8-21 25-20 42Z" fill={OLIVE_L} {...OUT} />
    <path d="M50 70c-8-14-8-30 0-44 8 14 8 30 0 44Z" fill={OLIVE} {...OUT} />
    <path d="M46 78C30 76 18 68 12 58c14-4 27 2 34 20Z" fill={OLIVE_L} {...OUT} />
    <path d="M54 78c16-2 28-10 34-20-14-4-27 2-34 20Z" fill={OLIVE} {...OUT} />
    <path d="M50 76c-6-10-6-22 0-32 6 10 6 22 0 32Z" fill={OLIVE_D} {...OUT} />
    <path d="M20 56 47 76M80 56 53 76M34 40l13 30M66 40 53 70" {...SEAM} />
    <circle cx="50" cy="66" r="4" fill={BRASS} {...OUT_IN} />
  </Frame>
)

/* -------------------------------------------------------------- light & set */

const LampIcon: FurnitureIcon = ({ size }) => (
  <Frame prefix="lamp" size={size} tone={[BRASS_L, BRASS_D]}>
    {/* pooled light under the shade */}
    <ellipse cx="50" cy="48" rx="42" ry="32" fill={BRASS_L} opacity="0.16" />
    {/* drawn shade: tapered drum with a bright lower rim */}
    <path d="M25 52 34 14h32l9 38Z" fill="url(#lamp-tone)" {...OUT} />
    <ellipse cx="50" cy="52" rx="25" ry="7" fill={BRASS} {...OUT} />
    <ellipse cx="50" cy="14" rx="16" ry="4.5" fill={BRASS_D} {...OUT_IN} />
    <ellipse cx="50" cy="51" rx="17" ry="4" fill={LINEN} />
    <path d="M36 18h28M31 44c11 3 27 3 38 0" {...SHEEN} />
    {/* stem, weighted base, pull chain */}
    <path d="M50 56v22" stroke={INK} strokeWidth="6" strokeLinecap="round" />
    <path d="M50 56v22" stroke={BRASS} strokeWidth="3" strokeLinecap="round" />
    <path d="M32 88h36l-4-10H36Z" fill={BRASS_D} {...OUT} />
    <ellipse cx="50" cy="88" rx="18" ry="5" fill={BRASS} {...OUT} />
    <path d="M62 54v8" stroke={INK} strokeWidth="1.6" />
    <circle cx="62" cy="64" r="2.6" fill={BRASS_L} {...OUT_IN} />
  </Frame>
)

/* ------------------------------------------------------------------ kitchen */

const CounterIcon: FurnitureIcon = ({ size }) => (
  <Frame prefix="counter" size={size} tone={[WOOD_L, WOOD_D]}>
    <rect x="8" y="14" width="84" height="76" rx="4" fill="url(#counter-tone)" {...OUT} />
    {/* stone worktop */}
    <rect x="8" y="14" width="84" height="18" rx="4" fill={SLATE} {...OUT} />
    <path d="M14 20h72" {...SHEEN} />
    {/* sunk sink with a drain and mixer tap */}
    <rect x="47" y="38" width="38" height="30" rx="4" fill={SLATE_D} {...OUT_IN} />
    <rect x="52" y="43" width="28" height="20" rx="3" fill={GLASS} {...OUT_IN} />
    <circle cx="66" cy="53" r="4" fill={SLATE_L} {...OUT_IN} />
    <path d="M66 38V28c0-4 4-6 8-6h6" fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round" />
    <path d="M66 38V28c0-4 4-6 8-6h6" fill="none" stroke={BRASS} strokeWidth="2.4" strokeLinecap="round" />
    {/* drawer stack */}
    <rect x="15" y="38" width="26" height="20" rx="3" fill={WOOD_L} {...OUT_IN} />
    <rect x="15" y="63" width="26" height="20" rx="3" fill={WOOD_L} {...OUT_IN} />
    <path d="M21 48h14M21 73h14" stroke={BRASS_L} strokeWidth="2.6" strokeLinecap="round" />
  </Frame>
)

const StoveIcon: FurnitureIcon = ({ size }) => (
  <Frame prefix="stove" size={size} tone={[SLATE_L, SLATE_D]}>
    <rect x="8" y="8" width="84" height="84" rx="6" fill="url(#stove-tone)" {...OUT} />
    <rect x="13" y="13" width="74" height="52" rx="4" fill={CHAR} {...OUT_IN} />
    {/* four drawn burners with cast rings */}
    <circle cx="33" cy="28" r="12" fill={CHAR_L} {...OUT_IN} /><circle cx="33" cy="28" r="6" fill="none" stroke={BRASS} strokeWidth="2" />
    <circle cx="67" cy="28" r="12" fill={CHAR_L} {...OUT_IN} /><circle cx="67" cy="28" r="6" fill="none" stroke={BRASS} strokeWidth="2" />
    <circle cx="33" cy="52" r="12" fill={CHAR_L} {...OUT_IN} /><circle cx="33" cy="52" r="6" fill="none" stroke={BRASS} strokeWidth="2" />
    <circle cx="67" cy="52" r="12" fill={CHAR_L} {...OUT_IN} /><circle cx="67" cy="52" r="6" fill="none" stroke={BRASS} strokeWidth="2" />
    {/* oven door, handle and control knobs */}
    <rect x="13" y="70" width="74" height="18" rx="3" fill={SLATE_D} {...OUT_IN} />
    <path d="M20 76h60" stroke={BRASS_L} strokeWidth="3" strokeLinecap="round" />
    <circle cx="26" cy="84" r="2.6" fill={BRASS} /><circle cx="50" cy="84" r="2.6" fill={BRASS} /><circle cx="74" cy="84" r="2.6" fill={BRASS} />
  </Frame>
)

const FridgeIcon: FurnitureIcon = ({ size }) => (
  <Frame prefix="fridge" size={size} tone={[PORC, PORC_D]}>
    <rect x="17" y="6" width="66" height="88" rx="6" fill="url(#fridge-tone)" {...OUT} />
    <rect x="22" y="11" width="56" height="26" rx="3" fill={PORC} {...OUT_IN} />
    <rect x="22" y="42" width="56" height="47" rx="3" fill={PORC} {...OUT_IN} />
    <path d="M19 39h62" stroke={INK} strokeWidth="3" strokeLinecap="round" />
    {/* long pull handles */}
    <path d="M69 17v14M69 48v22" stroke={INK} strokeWidth="5" strokeLinecap="round" />
    <path d="M69 17v14M69 48v22" stroke={BRASS} strokeWidth="2.4" strokeLinecap="round" />
    <rect x="28" y="76" width="16" height="8" rx="2" fill={BRASS_D} {...OUT_IN} />
    <path d="M26 15h34" {...SHEEN} />
  </Frame>
)

/* ----------------------------------------------------------- study & living */

const TvIcon: FurnitureIcon = ({ size }) => (
  <Frame prefix="tv" size={size} tone={[CHAR_L, CHAR]}>
    {/* valve set: deep cabinet, rounded tube, speaker grille */}
    <rect x="8" y="12" width="84" height="60" rx="10" fill="url(#tv-tone)" {...OUT} />
    <path d="M17 22c11-5 55-5 66 0 4 12 4 26 0 38-11 5-55 5-66 0-4-12-4-26 0-38Z" fill={GLASS} {...OUT_IN} />
    <path d="M24 28c14-4 38-4 52 0M24 58c14 4 38 4 52 0" {...SHEEN} />
    <rect x="18" y="76" width="44" height="12" rx="3" fill={CHAR} {...OUT_IN} />
    <path d="M24 82h32" stroke={BRASS_D} strokeWidth="2" strokeLinecap="round" />
    <circle cx="74" cy="82" r="5" fill={BRASS} {...OUT_IN} />
    <circle cx="84" cy="82" r="3.4" fill={BRASS_D} {...OUT_IN} />
    <path d="M22 90h56" stroke={INK} strokeWidth="3" strokeLinecap="round" />
  </Frame>
)

const BookshelfIcon: FurnitureIcon = ({ size }) => (
  <Frame prefix="bookshelf" size={size} tone={[WOOD_L, WOOD_D]}>
    <rect x="7" y="7" width="86" height="86" rx="4" fill="url(#bookshelf-tone)" {...OUT} />
    <rect x="14" y="14" width="72" height="72" rx="2" fill={WOOD_D} {...OUT_IN} />
    {/* three shelf boards */}
    <path d="M14 38h72M14 62h72" stroke={WOOD_L} strokeWidth="4" strokeLinecap="round" />
    <path d="M14 38h72M14 62h72" stroke={INK} strokeWidth="1.4" strokeLinecap="round" />
    {/* upper row of spines */}
    <rect x="18" y="18" width="8" height="19" fill={BLOOD} {...OUT_IN} />
    <rect x="28" y="16" width="7" height="21" fill={BRASS} {...OUT_IN} />
    <rect x="37" y="19" width="9" height="18" fill={OLIVE} {...OUT_IN} />
    <rect x="48" y="17" width="8" height="20" fill={LINEN} {...OUT_IN} />
    <rect x="58" y="18" width="9" height="19" fill={BLOOD_D} {...OUT_IN} />
    <rect x="69" y="16" width="7" height="21" fill={BRASS_L} {...OUT_IN} />
    {/* lower row of spines */}
    <rect x="18" y="43" width="9" height="18" fill={OLIVE_L} {...OUT_IN} />
    <rect x="29" y="41" width="7" height="20" fill={BLOOD} {...OUT_IN} />
    <rect x="38" y="44" width="9" height="17" fill={BRASS} {...OUT_IN} />
    <rect x="49" y="42" width="8" height="19" fill={LINEN} {...OUT_IN} />
    <rect x="59" y="43" width="9" height="18" fill={OLIVE} {...OUT_IN} />
    <rect x="70" y="41" width="7" height="20" fill={BLOOD_D} {...OUT_IN} />
    {/* bottom shelf: stacked flat books and a globe */}
    <rect x="18" y="72" width="34" height="7" rx="1.5" fill={BRASS_D} {...OUT_IN} />
    <rect x="21" y="79" width="30" height="6" rx="1.5" fill={LINEN} {...OUT_IN} />
    <circle cx="70" cy="76" r="9" fill={GLASS} {...OUT_IN} />
    <path d="M62 76h16M70 67v18" {...SEAM} />
  </Frame>
)

const DeskIcon: FurnitureIcon = ({ size }) => (
  <Frame prefix="desk" size={size} tone={[WOOD_L, WOOD]}>
    {/* pedestal desk seen from above: top, blotter, drawers, case file */}
    <rect x="6" y="16" width="88" height="68" rx="5" fill="url(#desk-tone)" {...OUT} />
    <rect x="12" y="22" width="46" height="40" rx="3" fill={OLIVE_D} {...OUT_IN} />
    <rect x="17" y="27" width="36" height="30" rx="2" fill={LINEN} {...OUT_IN} />
    <path d="M23 35h24M23 42h20M23 49h15" stroke={WOOD} strokeWidth="1.6" strokeLinecap="round" />
    {/* drawer bank */}
    <rect x="64" y="22" width="24" height="17" rx="2" fill={WOOD_D} {...OUT_IN} />
    <rect x="64" y="43" width="24" height="17" rx="2" fill={WOOD_D} {...OUT_IN} />
    <path d="M70 31h12M70 52h12" stroke={BRASS_L} strokeWidth="2.6" strokeLinecap="round" />
    {/* pen, inkwell, telephone cradle */}
    <path d="M14 70l26 6" stroke={INK} strokeWidth="3" strokeLinecap="round" />
    <circle cx="52" cy="72" r="6" fill={CHAR} {...OUT_IN} />
    <rect x="64" y="66" width="24" height="12" rx="3" fill={CHAR_L} {...OUT_IN} />
  </Frame>
)

const ClockIcon: FurnitureIcon = ({ size }) => (
  <Frame prefix="clock" size={size} tone={[WOOD_L, WOOD_D]}>
    {/* longcase clock: hood, dial, trunk and swinging bob */}
    <path d="M22 22c0-9 6-14 14-16h28c8 2 14 7 14 16v60c0 8-6 12-14 12H36c-8 0-14-4-14-12Z" fill="url(#clock-tone)" {...OUT} />
    <path d="M30 12h40l-6-8H36Z" fill={WOOD_D} {...OUT} />
    <circle cx="50" cy="38" r="22" fill={WOOD_D} {...OUT_IN} />
    <circle cx="50" cy="38" r="17" fill={LINEN} {...OUT_IN} />
    <path d="M50 24v4M50 48v4M36 38h4M60 38h4M40 28l3 3M60 28l-3 3M40 48l3-3M60 48l-3-3" stroke={WOOD} strokeWidth="1.6" strokeLinecap="round" />
    <path d="M50 38V27M50 38l8 6" stroke={INK} strokeWidth="2.6" strokeLinecap="round" />
    <circle cx="50" cy="38" r="2.6" fill={BLOOD} />
    <rect x="34" y="64" width="32" height="26" rx="3" fill={GLASS} {...OUT_IN} />
    <path d="M50 64v16" stroke={BRASS_D} strokeWidth="2" />
    <circle cx="50" cy="82" r="6" fill={BRASS} {...OUT_IN} />
  </Frame>
)

/* ----------------------------------------------------------------- bathroom */

const BathtubIcon: FurnitureIcon = ({ size }) => (
  <Frame prefix="bathtub" size={size} tone={[PORC, PORC_D]}>
    <rect x="8" y="16" width="84" height="74" rx="22" fill="url(#bathtub-tone)" {...OUT} />
    <rect x="16" y="24" width="68" height="58" rx="16" fill={PORC_D} {...OUT_IN} />
    <rect x="21" y="29" width="58" height="48" rx="13" fill={GLASS} {...OUT_IN} />
    <path d="M28 40c12-5 32-5 44 0" {...SHEEN} />
    {/* mixer tap and two taps at the head end */}
    <path d="M50 16V8c0-3 3-5 6-5h6" fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round" />
    <path d="M50 16V8c0-3 3-5 6-5h6" fill="none" stroke={BRASS} strokeWidth="2.4" strokeLinecap="round" />
    <circle cx="34" cy="10" r="4.5" fill={BRASS_L} {...OUT_IN} />
    <circle cx="70" cy="10" r="4.5" fill={BRASS_L} {...OUT_IN} />
    <ellipse cx="50" cy="70" rx="6" ry="4" fill={SLATE_D} {...OUT_IN} />
    <path d="M20 88h60" stroke={INK} strokeWidth="3" strokeLinecap="round" />
  </Frame>
)

const ToiletIcon: FurnitureIcon = ({ size }) => (
  <Frame prefix="toilet" size={size} tone={[PORC, PORC_D]}>
    {/* cistern with a lever, then the bowl and seat */}
    <rect x="24" y="6" width="52" height="26" rx="5" fill="url(#toilet-tone)" {...OUT} />
    <rect x="30" y="12" width="40" height="14" rx="3" fill={PORC_D} {...OUT_IN} />
    <path d="M76 16h7" stroke={INK} strokeWidth="4" strokeLinecap="round" />
    <path d="M76 16h7" stroke={BRASS} strokeWidth="2" strokeLinecap="round" />
    <path d="M20 48c0-8 7-13 15-13h30c8 0 15 5 15 13v14c0 18-13 30-30 30S20 80 20 62Z" fill="url(#toilet-tone)" {...OUT} />
    <ellipse cx="50" cy="62" rx="26" ry="22" fill={PORC_D} {...OUT_IN} />
    <ellipse cx="50" cy="62" rx="18" ry="15" fill={GLASS} {...OUT_IN} />
    <ellipse cx="50" cy="59" rx="8" ry="4" fill={PORC} opacity="0.7" />
    <path d="M28 46c12-6 32-6 44 0" {...SHEEN} />
    <path d="M34 90h32" stroke={INK} strokeWidth="3" strokeLinecap="round" />
  </Frame>
)

const ShowerIcon: FurnitureIcon = ({ size }) => (
  <Frame prefix="shower" size={size} tone={[PORC, PORC_D]}>
    {/* glass screen behind the tray */}
    <rect x="10" y="10" width="80" height="66" rx="3" fill={GLASS} opacity="0.5" {...OUT_IN} />
    <path d="M18 16v54M32 16v54" stroke={PORC} strokeOpacity="0.35" strokeWidth="2" />
    {/* tray */}
    <rect x="8" y="72" width="84" height="20" rx="4" fill="url(#shower-tone)" {...OUT} />
    <rect x="14" y="76" width="72" height="12" rx="2" fill={PORC_D} {...OUT_IN} />
    <circle cx="50" cy="82" r="4.5" fill={SLATE_D} {...OUT_IN} />
    {/* riser and drawn rose head */}
    <path d="M78 70V22c0-6-4-10-10-10H56" fill="none" stroke={INK} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M78 70V22c0-6-4-10-10-10H56" fill="none" stroke={BRASS} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    <ellipse cx="48" cy="14" rx="15" ry="7" fill={BRASS} {...OUT} />
    <ellipse cx="48" cy="13" rx="9" ry="3.4" fill={BRASS_L} {...OUT_IN} />
    <circle cx="42" cy="18" r="1.4" fill={INK} /><circle cx="48" cy="19" r="1.4" fill={INK} /><circle cx="54" cy="18" r="1.4" fill={INK} />
    {/* falling water */}
    <path d="M40 26c-2 12-3 22-3 34M48 26c0 14-1 24-1 36M56 26c2 12 3 22 4 32" stroke="#BFD3C6" strokeOpacity="0.7" strokeWidth="2.4" strokeLinecap="round" />
    <rect x="16" y="58" width="14" height="10" rx="2" fill={LINEN} {...OUT_IN} />
  </Frame>
)

export const FURNITURE_ICON: Record<FurnitureType, FurnitureIcon> = {
  chair: ArmchairIcon,
  sofa: SofaIcon,
  bed: BedIcon,
  table: TableIcon,
  box: BoxIcon,
  rug: RugIcon,
  plant: PlantIcon,
  shrub: ShrubIcon,
  lamp: LampIcon,
  counter: CounterIcon,
  tv: TvIcon,
  bathtub: BathtubIcon,
  bookshelf: BookshelfIcon,
  stove: StoveIcon,
  fridge: FridgeIcon,
  clock: ClockIcon,
  desk: DeskIcon,
  toilet: ToiletIcon,
  shower: ShowerIcon,
}

export const FURNITURE_NAME: Record<FurnitureType, string> = {
  chair: 'Chair',
  sofa: 'Sofa',
  bed: 'Bed',
  table: 'Table',
  box: 'Box',
  rug: 'Rug',
  plant: 'Plant',
  shrub: 'Shrub',
  lamp: 'Lamp',
  counter: 'Counter',
  tv: 'TV',
  bathtub: 'Bathtub',
  bookshelf: 'Bookshelf',
  stove: 'Stove',
  fridge: 'Fridge',
  clock: 'Clock',
  desk: 'Desk',
  toilet: 'Toilet',
  shower: 'Shower',
}
