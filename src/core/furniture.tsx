import React from 'react'
import type { FurnitureType } from './types'

// Blueprint / evidence-diagram furniture: top-down, 100×100 viewBox.
// Deleted: thick black outlines, 1950s Cluedo fills (wood browns, terracotta,
// burgundy, coral, slate blue). All strokes now use currentColor so the parent
// wrapper in MapGrid can set color: var(--board-chalk) and icons adapt to both
// themes automatically. Thin drafting weight (strokeWidth 1.5–2).
// Fills are either "none" or a very faint tint at low opacity — just enough to
// read depth on complex objects. Every icon preserves its identifying geometry
// so clue text ("on the box", "the only person on a rug") still resolves.

export interface FurnitureIconProps { size?: number }
type FIcon = (props: FurnitureIconProps) => React.ReactElement

const S = (size?: number) =>
  size ? { width: size, height: size } : { width: '100%', height: '100%' }

// Furniture must read as a SOLID OBJECT at a glance, not as a wireframe. Pure
// outlines (fill: none) left every piece looking like a technical diagram, so at
// cell size a bed and a table were hard to tell apart. Filling with translucent
// currentColor keeps the drafting lines but gives each piece a silhouette, and
// because it is currentColor the pieces still adapt to both themes from the
// parent's `color`.
//   D  = interior detail (cushions, seams) — lighter fill
//   D2 = the defining outline of the piece — heavier fill
const D = {
  stroke: 'currentColor', strokeWidth: 1.5, strokeLinejoin: 'round' as const,
  fill: 'currentColor', fillOpacity: 0.16,
}
const D2 = {
  stroke: 'currentColor', strokeWidth: 2, strokeLinejoin: 'round' as const,
  fill: 'currentColor', fillOpacity: 0.34,
}

// Sofa — top-down plan: backrest bar, two armrests, seat area, front rail.
const SofaIcon: FIcon = ({ size }) => (
  <svg {...S(size)} viewBox="0 0 100 100">
    {/* backrest */}
    <rect x="8" y="8" width="84" height="20" rx="2" {...D2} />
    {/* armrests */}
    <rect x="6" y="26" width="14" height="56" rx="2" {...D2} />
    <rect x="80" y="26" width="14" height="56" rx="2" {...D2} />
    {/* seat — two cushions divided by centre seam */}
    <rect x="20" y="26" width="60" height="50" rx="1" {...D} />
    <line x1="50" y1="28" x2="50" y2="74" {...D} />
    {/* front rail */}
    <rect x="20" y="76" width="60" height="10" rx="1" {...D} />
  </svg>
)

// Armchair — plan: U-shaped frame wrapping seat cushion.
const ArmchairIcon: FIcon = ({ size }) => (
  <svg {...S(size)} viewBox="0 0 100 100">
    {/* U-frame: back + two sides */}
    <path
      d="M14 88 L14 36 Q14 12 50 12 Q86 12 86 36 L86 88"
      {...D2}
    />
    {/* inner seat inset */}
    <rect x="30" y="32" width="40" height="56" rx="2" {...D} />
    {/* seat crease */}
    <line x1="32" y1="68" x2="68" y2="68" {...D} />
  </svg>
)

// Bed — plan: frame, headboard, two pillows, blanket fold line.
const BedIcon: FIcon = ({ size }) => (
  <svg {...S(size)} viewBox="0 0 100 100">
    {/* frame */}
    <rect x="10" y="6" width="80" height="88" rx="2" {...D2} />
    {/* headboard */}
    <rect x="10" y="6" width="80" height="16" rx="2" {...D2} />
    {/* mattress inset */}
    <rect x="16" y="22" width="68" height="66" rx="1" {...D} />
    {/* pillows */}
    <rect x="20" y="26" width="26" height="16" rx="3" {...D} />
    <rect x="54" y="26" width="26" height="16" rx="3" {...D} />
    {/* blanket fold line */}
    <line x1="16" y1="50" x2="84" y2="50" {...D} />
  </svg>
)

// Table — plan: top surface, inner inset, two horizontal dividers.
const TableIcon: FIcon = ({ size }) => (
  <svg {...S(size)} viewBox="0 0 100 100">
    <rect x="8" y="16" width="84" height="68" rx="2" {...D2} />
    <rect x="18" y="26" width="64" height="48" rx="1" {...D} />
    <line x1="18" y1="40" x2="82" y2="40" {...D} />
    <line x1="18" y1="58" x2="82" y2="58" {...D} />
  </svg>
)

// Box — plan: square crate with folded-flap X (identifying geometry preserved).
const BoxIcon: FIcon = ({ size }) => (
  <svg {...S(size)} viewBox="0 0 100 100">
    <rect x="14" y="14" width="72" height="72" rx="2" {...D2} />
    {/* flap cross — the detail that makes "on the box" legible */}
    <line x1="14" y1="14" x2="86" y2="86" {...D} />
    <line x1="86" y1="14" x2="14" y2="86" {...D} />
  </svg>
)

// Rug — plan: nested border pattern + fringe dashes (identifying geometry).
const RugIcon: FIcon = ({ size }) => (
  <svg {...S(size)} viewBox="0 0 100 100">
    <rect x="12" y="12" width="76" height="76" rx="1" {...D2} />
    <rect x="22" y="22" width="56" height="56" rx="1" {...D} />
    {/* fringe — top and bottom edge */}
    <line x1="16" y1="6"  x2="84" y2="6"  {...D} strokeDasharray="4 5" strokeLinecap="round" />
    <line x1="16" y1="94" x2="84" y2="94" {...D} strokeDasharray="4 5" strokeLinecap="round" />
  </svg>
)

// Plant — plan: pot circle + radiating leaf spikes.
const PlantIcon: FIcon = ({ size }) => (
  <svg {...S(size)} viewBox="0 0 100 100">
    {/* pot */}
    <circle cx="50" cy="52" r="22" {...D2} />
    <circle cx="50" cy="52" r="13" {...D} />
    {/* radiating leaves — angular spikes identify a plant from above */}
    <path d="M50 52 L38 8 L52 24 Z"  {...D} />
    <path d="M50 52 L76 14 L72 36 Z" {...D} />
    <path d="M50 52 L94 42 L72 54 Z" {...D} />
    <path d="M50 52 L88 76 L64 72 Z" {...D} />
    <path d="M50 52 L56 94 L40 76 Z" {...D} />
    <path d="M50 52 L16 86 L28 64 Z" {...D} />
    <path d="M50 52 L6 56 L26 40 Z"  {...D} />
    <path d="M50 52 L16 18 L38 28 Z" {...D} />
  </svg>
)

// Shrub — plan: overlapping circles forming a shrub canopy.
const ShrubIcon: FIcon = ({ size }) => (
  <svg {...S(size)} viewBox="0 0 100 100">
    <circle cx="50" cy="52" r="36" {...D2} />
    <circle cx="32" cy="44" r="18" {...D} />
    <circle cx="68" cy="44" r="18" {...D} />
    <circle cx="50" cy="34" r="16" {...D} />
    <circle cx="38" cy="62" r="14" {...D} />
    <circle cx="64" cy="64" r="13" {...D} />
    <circle cx="50" cy="52" r="10" {...D} />
  </svg>
)

// Lamp — plan: concentric rings indicating shade and base.
const LampIcon: FIcon = ({ size }) => (
  <svg {...S(size)} viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="36" {...D2} />
    <circle cx="50" cy="50" r="24" {...D} />
    <circle cx="50" cy="50" r="10" {...D} />
    <circle cx="50" cy="50" r="3"  stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.6" />
  </svg>
)

// Counter — plan: work surface with sink basin and chopping board inset.
const CounterIcon: FIcon = ({ size }) => (
  <svg {...S(size)} viewBox="0 0 100 100">
    <rect x="6" y="12" width="88" height="76" rx="2" {...D2} />
    <line x1="50" y1="12" x2="50" y2="88" {...D} />
    {/* sink: rounded rectangle + drain dot */}
    <rect x="58" y="24" width="28" height="32" rx="5" {...D} />
    <circle cx="72" cy="40" r="4" {...D} />
    {/* faucet stub */}
    <rect x="68" y="16" width="8" height="8" rx="2" {...D} />
    {/* chopping board */}
    <rect x="14" y="28" width="26" height="36" rx="3" {...D} />
  </svg>
)

// TV — plan: media console top-down; stand shelf, screen edge-on.
const TvIcon: FIcon = ({ size }) => (
  <svg {...S(size)} viewBox="0 0 100 100">
    {/* console stand */}
    <rect x="12" y="12" width="76" height="24" rx="2" {...D2} />
    {/* flat-screen seen edge-on from above */}
    <rect x="22" y="16" width="56" height="8" rx="1" {...D} />
  </svg>
)

// Bathtub — plan: outer shell, inner basin, two taps, drain.
const BathtubIcon: FIcon = ({ size }) => (
  <svg {...S(size)} viewBox="0 0 100 100">
    <rect x="8" y="10" width="84" height="80" rx="16" {...D2} />
    <rect x="18" y="20" width="64" height="60" rx="10" {...D} />
    {/* taps */}
    <circle cx="34" cy="24" r="5" {...D} />
    <circle cx="66" cy="24" r="5" {...D} />
    {/* drain */}
    <circle cx="50" cy="68" r="5" {...D} />
    <circle cx="50" cy="68" r="2" stroke="currentColor" strokeWidth="1" fill="currentColor" fillOpacity="0.5" />
  </svg>
)

// Bookshelf — plan: shelf outline + packed book spines (varying widths, no fills).
const BookshelfIcon: FIcon = ({ size }) => (
  <svg {...S(size)} viewBox="0 0 100 100">
    <rect x="10" y="12" width="80" height="32" rx="2" {...D2} />
    {/* book spines — vertical dividers at irregular widths */}
    {[23, 31, 42, 49, 57, 65, 74].map(x => (
      <line key={x} x1={x} y1="14" x2={x} y2="42" {...D} />
    ))}
  </svg>
)

// Stove — plan: four burners (identifying geometry preserved).
const StoveIcon: FIcon = ({ size }) => (
  <svg {...S(size)} viewBox="0 0 100 100">
    <rect x="10" y="10" width="80" height="80" rx="2" {...D2} />
    {/* four burner rings */}
    <circle cx="33" cy="33" r="13" {...D} />
    <circle cx="33" cy="33" r="5"  {...D} />
    <circle cx="67" cy="33" r="13" {...D} />
    <circle cx="67" cy="33" r="5"  {...D} />
    <circle cx="33" cy="67" r="13" {...D} />
    <circle cx="33" cy="67" r="5"  {...D} />
    <circle cx="67" cy="67" r="13" {...D} />
    <circle cx="67" cy="67" r="5"  {...D} />
  </svg>
)

// Fridge — plan: rectangular appliance, freezer line, handle.
const FridgeIcon: FIcon = ({ size }) => (
  <svg {...S(size)} viewBox="0 0 100 100">
    <rect x="20" y="8" width="60" height="84" rx="2" {...D2} />
    {/* freezer compartment line */}
    <line x1="20" y1="38" x2="80" y2="38" {...D2} />
    {/* door handles */}
    <rect x="68" y="14" width="6" height="14" rx="2" {...D} />
    <rect x="68" y="46" width="6" height="24" rx="2" {...D} />
  </svg>
)

// Clock — plan: face, four cardinal tick marks, two hands.
const ClockIcon: FIcon = ({ size }) => (
  <svg {...S(size)} viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="40" {...D2} />
    <circle cx="50" cy="50" r="32" {...D} />
    {/* tick marks at cardinal positions */}
    {[0, 90, 180, 270].map(deg => {
      const rad = deg * Math.PI / 180
      return <line key={deg}
        x1={50 + Math.sin(rad) * 24} y1={50 - Math.cos(rad) * 24}
        x2={50 + Math.sin(rad) * 30} y2={50 - Math.cos(rad) * 30}
        {...D2} strokeLinecap="round" />
    })}
    {/* hands */}
    <line x1="50" y1="50" x2="50" y2="28" {...D2} strokeLinecap="round" />
    <line x1="50" y1="50" x2="64" y2="58" {...D}  strokeLinecap="round" />
    <circle cx="50" cy="50" r="3" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.7" />
  </svg>
)

// Desk — plan: surface + chair tucked underneath.
const DeskIcon: FIcon = ({ size }) => (
  <svg {...S(size)} viewBox="0 0 100 100">
    {/* office chair (drawn first — desk edge overlaps it) */}
    <rect x="36" y="46" width="28" height="32" rx="8" {...D} />
    {/* backrest bar */}
    <rect x="32" y="72" width="36" height="10" rx="4" {...D} />
    {/* desk surface */}
    <rect x="12" y="12" width="76" height="38" rx="2" {...D2} />
    {/* laptop outline */}
    <rect x="42" y="20" width="18" height="14" rx="2" {...D} />
  </svg>
)

// Toilet — plan: cistern + oval bowl.
const ToiletIcon: FIcon = ({ size }) => (
  <svg {...S(size)} viewBox="0 0 100 100">
    {/* cistern */}
    <rect x="24" y="8" width="52" height="24" rx="6" {...D2} />
    <circle cx="50" cy="20" r="4" {...D} />
    {/* bowl */}
    <ellipse cx="50" cy="64" rx="32" ry="28" {...D2} />
    <ellipse cx="50" cy="66" rx="22" ry="19" {...D} />
  </svg>
)

// Shower — plan: tray outline + shower head concentric rings + four corner drops.
const ShowerIcon: FIcon = ({ size }) => (
  <svg {...S(size)} viewBox="0 0 100 100">
    <rect x="10" y="10" width="80" height="80" rx="6" {...D2} />
    {/* shower head */}
    <circle cx="50" cy="50" r="18" {...D2} />
    <circle cx="50" cy="50" r="10" {...D} />
    {/* nozzle dots */}
    {[[43, 44], [57, 44], [43, 56], [57, 56], [50, 50]].map(([x, y], i) => (
      <circle key={i} cx={x} cy={y} r="2" stroke="currentColor" strokeWidth="1" fill="currentColor" fillOpacity="0.6" />
    ))}
    {/* corner water drops */}
    {[[22, 22], [78, 22], [22, 78], [78, 78]].map(([x, y], i) => (
      <circle key={i} cx={x} cy={y} r="4" {...D} />
    ))}
  </svg>
)

export type FurnitureIcon = (props: FurnitureIconProps) => React.ReactElement

export const FURNITURE_ICON: Record<FurnitureType, FurnitureIcon> = {
  chair: ArmchairIcon, sofa: SofaIcon, bed: BedIcon, table: TableIcon,
  box: BoxIcon, rug: RugIcon, plant: PlantIcon, shrub: ShrubIcon,
  lamp: LampIcon, counter: CounterIcon, tv: TvIcon, bathtub: BathtubIcon,
  bookshelf: BookshelfIcon, stove: StoveIcon, fridge: FridgeIcon,
  clock: ClockIcon, desk: DeskIcon, toilet: ToiletIcon, shower: ShowerIcon,
}

export const FURNITURE_NAME: Record<FurnitureType, string> = {
  chair: 'Chair', sofa: 'Sofa', bed: 'Bed', table: 'Table', box: 'Box',
  rug: 'Rug', plant: 'Plant', shrub: 'Shrub', lamp: 'Lamp',
  counter: 'Counter', tv: 'TV', bathtub: 'Bathtub',
  bookshelf: 'Bookshelf', stove: 'Stove', fridge: 'Fridge', clock: 'Clock',
  desk: 'Desk', toilet: 'Toilet', shower: 'Shower',
}
