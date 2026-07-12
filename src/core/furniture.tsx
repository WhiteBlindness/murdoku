import React from 'react'
import type { FurnitureType } from './types'

// Board-game furniture: top-down, 100×100 viewBox, muted vintage fills,
// every shape carries a bold black outline (strokeWidth 3–4).
// With no `size`, icons stretch to fill their grid cell (width/height 100%).

export interface FurnitureIconProps { size?: number }
type FIcon = (props: FurnitureIconProps) => React.ReactElement

const S = (size?: number) =>
  size ? { width: size, height: size } : { width: '100%', height: '100%' }

const O = { stroke: 'black', strokeWidth: 3, strokeLinejoin: 'round' as const }
const O4 = { stroke: 'black', strokeWidth: 4, strokeLinejoin: 'round' as const }

const SofaIcon: FIcon = ({ size }) => (
  <svg {...S(size)} viewBox="0 0 100 100" fill="none">
    {/* backrest */}
    <rect x="6" y="6" width="88" height="24" rx="12" fill="#C4838E" {...O4} />
    {/* armrests */}
    <rect x="4" y="24" width="18" height="62" rx="9" fill="#D49AA4" {...O4} />
    <rect x="78" y="24" width="18" height="62" rx="9" fill="#D49AA4" {...O4} />
    {/* seat cushions */}
    <rect x="22" y="28" width="56" height="52" rx="8" fill="#E4B8BE" {...O4} />
    <line x1="50" y1="30" x2="50" y2="78" stroke="black" strokeWidth="3" />
    {/* front edge */}
    <rect x="22" y="80" width="56" height="14" rx="6" fill="#C4838E" {...O4} />
  </svg>
)

// Rounded seat, thick curved backrest, rounded armrests hugging the sides.
const ArmchairIcon: FIcon = ({ size }) => (
  <svg {...S(size)} viewBox="0 0 100 100" fill="none">
    {/* one-piece curved backrest + arms wrapping the seat */}
    <path
      d="M12 88 L12 38 Q12 10 40 10 L60 10 Q88 10 88 38 L88 88
         L72 88 L72 42 Q72 30 60 30 L40 30 Q28 30 28 42 L28 88 Z"
      fill="#8FA9BE" {...O4}
    />
    {/* seat cushion */}
    <rect x="28" y="34" width="44" height="56" rx="12" fill="#BCCFDD" {...O4} />
    <line x1="30" y1="68" x2="70" y2="68" stroke="black" strokeWidth="3" />
  </svg>
)

const BedIcon: FIcon = ({ size }) => (
  <svg {...S(size)} viewBox="0 0 100 100" fill="none">
    {/* frame */}
    <rect x="8" y="4" width="84" height="92" rx="6" fill="#B49468" {...O4} />
    {/* headboard */}
    <rect x="8" y="4" width="84" height="18" rx="6" fill="#8A6C44" {...O4} />
    {/* mattress */}
    <rect x="14" y="22" width="72" height="68" rx="4" fill="#F2EDDF" {...O} />
    {/* pillows */}
    <rect x="18" y="26" width="28" height="18" rx="7" fill="#FBF8F0" {...O} />
    <rect x="54" y="26" width="28" height="18" rx="7" fill="#FBF8F0" {...O} />
    {/* blanket */}
    <rect x="14" y="48" width="72" height="42" rx="4" fill="#7D98B4" {...O4} />
    <line x1="14" y1="58" x2="86" y2="58" stroke="black" strokeWidth="3" />
  </svg>
)

const TableIcon: FIcon = ({ size }) => (
  <svg {...S(size)} viewBox="0 0 100 100" fill="none">
    <rect x="6" y="14" width="88" height="72" rx="8" fill="#BC9A66" {...O4} />
    <rect x="16" y="24" width="68" height="52" rx="5" fill="#CCAC78" {...O} />
    <line x1="16" y1="40" x2="84" y2="40" stroke="black" strokeWidth="3" />
    <line x1="16" y1="58" x2="84" y2="58" stroke="black" strokeWidth="3" />
  </svg>
)

// Cardboard box seen from above: folded flaps make a corner-to-corner X.
const BoxIcon: FIcon = ({ size }) => (
  <svg {...S(size)} viewBox="0 0 100 100" fill="none">
    <rect x="14" y="14" width="72" height="72" rx="4" fill="#D2B384" {...O4} />
    <line x1="14" y1="14" x2="86" y2="86" stroke="black" strokeWidth="4" />
    <line x1="86" y1="14" x2="14" y2="86" stroke="black" strokeWidth="4" />
  </svg>
)

// Burgundy area rug: nested border pattern, dashed fringe on top/bottom edges.
const RugIcon: FIcon = ({ size }) => (
  <svg {...S(size)} viewBox="0 0 100 100" fill="none">
    <rect x="10" y="10" width="80" height="80" rx="5" fill="#8E3A3A" {...O4} />
    <rect x="20" y="20" width="60" height="60" rx="3" fill="#A85555" {...O} />
    {/* fringe */}
    <line x1="14" y1="5" x2="86" y2="5" stroke="black" strokeWidth="4" strokeDasharray="4 6" strokeLinecap="round" />
    <line x1="14" y1="95" x2="86" y2="95" stroke="black" strokeWidth="4" strokeDasharray="4 6" strokeLinecap="round" />
  </svg>
)

// Terracotta pot centered, sharp leaf polygons radiating outward over the rim.
const PlantIcon: FIcon = ({ size }) => (
  <svg {...S(size)} viewBox="0 0 100 100" fill="none">
    {/* pot */}
    <circle cx="50" cy="50" r="26" fill="#BE7050" {...O4} />
    <circle cx="50" cy="50" r="16" fill="#A85C40" {...O} />
    {/* leaves — sharp spikes pointing outward, overlapping the pot */}
    <path d="M50 50 L36 6 L54 22 Z" fill="#5C8C3C" {...O} />
    <path d="M50 50 L78 12 L74 36 Z" fill="#4E7C34" {...O} />
    <path d="M50 50 L96 40 L74 54 Z" fill="#6C9C48" {...O} />
    <path d="M50 50 L90 78 L64 74 Z" fill="#5C8C3C" {...O} />
    <path d="M50 50 L56 96 L40 76 Z" fill="#4E7C34" {...O} />
    <path d="M50 50 L14 88 L26 62 Z" fill="#6C9C48" {...O} />
    <path d="M50 50 L4 54 L24 38 Z" fill="#5C8C3C" {...O} />
    <path d="M50 50 L14 16 L36 26 Z" fill="#4E7C34" {...O} />
    {/* center crown */}
    <circle cx="50" cy="50" r="9" fill="#7CAC54" {...O} />
  </svg>
)

const ShrubIcon: FIcon = ({ size }) => (
  <svg {...S(size)} viewBox="0 0 100 100" fill="none">
    <circle cx="50" cy="52" r="40" fill="#4E7434" {...O4} />
    <circle cx="30" cy="42" r="20" fill="#5C8440" {...O} />
    <circle cx="70" cy="42" r="20" fill="#5C8440" {...O} />
    <circle cx="50" cy="30" r="18" fill="#6C944C" {...O} />
    <circle cx="36" cy="62" r="16" fill="#6C944C" {...O} />
    <circle cx="66" cy="64" r="15" fill="#5C8440" {...O} />
    <circle cx="50" cy="50" r="12" fill="#7CA458" {...O} />
  </svg>
)

// Top-down floor lamp: big glowing shade circle.
const LampIcon: FIcon = ({ size }) => (
  <svg {...S(size)} viewBox="0 0 100 100" fill="none">
    <circle cx="50" cy="50" r="38" fill="#D8B860" {...O4} />
    <circle cx="50" cy="50" r="26" fill="#E8D492" {...O} />
    <circle cx="50" cy="50" r="12" fill="#F6ECC2" {...O} />
    <circle cx="50" cy="50" r="4" fill="#6A5030" {...O} />
  </svg>
)

const CounterIcon: FIcon = ({ size }) => (
  <svg {...S(size)} viewBox="0 0 100 100" fill="none">
    <rect x="4" y="10" width="92" height="80" rx="6" fill="#E6E0D2" {...O4} />
    <line x1="50" y1="10" x2="50" y2="90" stroke="black" strokeWidth="3" />
    {/* sink */}
    <rect x="58" y="22" width="30" height="34" rx="7" fill="#A4C2D2" {...O} />
    <circle cx="73" cy="39" r="5" fill="#68828E" {...O} />
    {/* faucet */}
    <rect x="68" y="14" width="10" height="8" rx="3" fill="#ACACA8" {...O} />
    {/* chopping board */}
    <rect x="12" y="26" width="28" height="40" rx="5" fill="#C4A470" {...O} />
    <circle cx="26" cy="34" r="3" fill="#8A6C44" {...O} />
  </svg>
)

// Media console from above: wooden TV stand, flat-screen TV as a thin black bar.
const TvIcon: FIcon = ({ size }) => (
  <svg {...S(size)} viewBox="0 0 100 100" fill="none">
    {/* wooden stand */}
    <rect x="10" y="10" width="80" height="25" rx="3" fill="#AE8656" {...O4} />
    {/* flat-screen seen edge-on from above */}
    <rect x="20" y="15" width="60" height="10" rx="2" fill="#1A1A1A" {...O} />
  </svg>
)

const BathtubIcon: FIcon = ({ size }) => (
  <svg {...S(size)} viewBox="0 0 100 100" fill="none">
    <rect x="6" y="8" width="88" height="84" rx="20" fill="#F0ECE2" {...O4} />
    <rect x="16" y="18" width="68" height="64" rx="14" fill="#A8CCDE" {...O4} />
    {/* taps */}
    <circle cx="34" cy="22" r="7" fill="#B8B8B4" {...O} />
    <circle cx="66" cy="22" r="7" fill="#B8B8B4" {...O} />
    {/* drain */}
    <circle cx="50" cy="70" r="7" fill="#7A94A0" {...O} />
    <circle cx="50" cy="70" r="3" fill="#586870" {...O} />
  </svg>
)

// Shelf pushed against a wall: thin brown frame, books packed edge to edge.
const BookshelfIcon: FIcon = ({ size }) => (
  <svg {...S(size)} viewBox="0 0 100 100" fill="none">
    <rect x="10" y="10" width="80" height="35" rx="3" fill="#96744A" {...O4} />
    {/* books packed tightly, varying widths, no gaps */}
    <rect x="14" y="14" width="9" height="27" fill="#8E3A3A" {...O} />
    <rect x="23" y="14" width="7" height="27" fill="#34506E" {...O} />
    <rect x="30" y="14" width="10" height="27" fill="#3E6648" {...O} />
    <rect x="40" y="14" width="6" height="27" fill="#A08434" {...O} />
    <rect x="46" y="14" width="9" height="27" fill="#6E4468" {...O} />
    <rect x="55" y="14" width="7" height="27" fill="#3E7070" {...O} />
    <rect x="62" y="14" width="10" height="27" fill="#8E3A3A" {...O} />
    <rect x="72" y="14" width="6" height="27" fill="#34506E" {...O} />
    <rect x="78" y="14" width="8" height="27" fill="#3E6648" {...O} />
  </svg>
)

const StoveIcon: FIcon = ({ size }) => (
  <svg {...S(size)} viewBox="0 0 100 100" fill="none">
    <rect x="8" y="8" width="84" height="84" rx="7" fill="#5A5C62" {...O4} />
    <circle cx="32" cy="32" r="14" fill="#3A3C42" {...O4} />
    <circle cx="32" cy="32" r="6" fill="#C06848" {...O} />
    <circle cx="68" cy="32" r="14" fill="#3A3C42" {...O4} />
    <circle cx="68" cy="32" r="6" fill="#C06848" {...O} />
    <circle cx="32" cy="68" r="14" fill="#3A3C42" {...O4} />
    <circle cx="32" cy="68" r="6" fill="#C06848" {...O} />
    <circle cx="68" cy="68" r="14" fill="#3A3C42" {...O4} />
    <circle cx="68" cy="68" r="6" fill="#C06848" {...O} />
  </svg>
)

const FridgeIcon: FIcon = ({ size }) => (
  <svg {...S(size)} viewBox="0 0 100 100" fill="none">
    <rect x="18" y="6" width="64" height="88" rx="9" fill="#DCE0E2" {...O4} />
    <line x1="18" y1="38" x2="82" y2="38" stroke="black" strokeWidth="4" />
    <rect x="68" y="14" width="8" height="16" rx="4" fill="#98A0A8" {...O} />
    <rect x="68" y="46" width="8" height="28" rx="4" fill="#98A0A8" {...O} />
  </svg>
)

const ClockIcon: FIcon = ({ size }) => (
  <svg {...S(size)} viewBox="0 0 100 100" fill="none">
    <circle cx="50" cy="50" r="42" fill="#7A5C34" {...O4} />
    <circle cx="50" cy="50" r="34" fill="#F6F2E4" {...O} />
    {[0, 90, 180, 270].map(deg => {
      const rad = deg * Math.PI / 180
      return <line key={deg}
        x1={50 + Math.sin(rad) * 24} y1={50 - Math.cos(rad) * 24}
        x2={50 + Math.sin(rad) * 30} y2={50 - Math.cos(rad) * 30}
        stroke="black" strokeWidth="4" strokeLinecap="round" />
    })}
    <line x1="50" y1="50" x2="50" y2="26" stroke="black" strokeWidth="4" strokeLinecap="round" />
    <line x1="50" y1="50" x2="66" y2="58" stroke="black" strokeWidth="4" strokeLinecap="round" />
    <circle cx="50" cy="50" r="5" fill="#A84848" {...O} />
  </svg>
)

// Classic wooden desk from above; office chair tucked under the front edge.
const DeskIcon: FIcon = ({ size }) => (
  <svg {...S(size)} viewBox="0 0 100 100" fill="none">
    {/* office chair (drawn first — desk edge overlaps it) */}
    <rect x="35" y="45" width="30" height="35" rx="10" fill="#5E666E" {...O4} />
    {/* backrest */}
    <rect x="31" y="74" width="38" height="12" rx="6" fill="#464E56" {...O4} />
    {/* desk surface */}
    <rect x="10" y="10" width="80" height="40" rx="2" fill="#AE8656" {...O4} />
    {/* laptop */}
    <rect x="40" y="20" width="20" height="15" rx="2" fill="#7A828C" {...O} />
  </svg>
)

const ToiletIcon: FIcon = ({ size }) => (
  <svg {...S(size)} viewBox="0 0 100 100" fill="none">
    {/* tank */}
    <rect x="22" y="6" width="56" height="26" rx="8" fill="#F0ECE2" {...O4} />
    <circle cx="50" cy="19" r="5" fill="#B8B8B4" {...O} />
    {/* bowl */}
    <ellipse cx="50" cy="62" rx="34" ry="30" fill="#F0ECE2" {...O4} />
    <ellipse cx="50" cy="64" rx="24" ry="21" fill="#B4D0E0" {...O} />
  </svg>
)

const ShowerIcon: FIcon = ({ size }) => (
  <svg {...S(size)} viewBox="0 0 100 100" fill="none">
    <rect x="8" y="8" width="84" height="84" rx="9" fill="#F0ECE4" {...O4} />
    {/* shower head */}
    <circle cx="50" cy="50" r="20" fill="#B8B8B4" {...O4} />
    <circle cx="50" cy="50" r="12" fill="#D8D8D4" {...O} />
    {[[42, 44], [58, 44], [42, 56], [58, 56], [50, 50]].map(([x, y], i) => (
      <circle key={i} cx={x} cy={y} r="3" fill="#586870" {...O} />
    ))}
    {/* water drops */}
    {[[22, 24], [78, 24], [22, 76], [78, 76]].map(([x, y], i) => (
      <circle key={i} cx={x} cy={y} r="5" fill="#A8CCE0" {...O} />
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
