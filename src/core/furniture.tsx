import React from 'react'
import type { FurnitureType } from './types'

// Board-game furniture: 100×100 viewBox, muted vintage fills,
// every shape carries a bold black outline (strokeWidth 3–4).
// With no `size`, icons stretch to fill their grid cell (width/height 100%).
// Projection is cheated where needed for recognisability — near-elevation
// or 3/4 view for objects that read as noise from directly overhead.

export interface FurnitureIconProps { size?: number }
type FIcon = (props: FurnitureIconProps) => React.ReactElement

const S = (size?: number) =>
  size ? { width: size, height: size } : { width: '100%', height: '100%' }

const O = { stroke: 'black', strokeWidth: 3, strokeLinejoin: 'round' as const }
const O4 = { stroke: 'black', strokeWidth: 4, strokeLinejoin: 'round' as const }

const SofaIcon: FIcon = ({ size }) => (
  <svg {...S(size)} viewBox="0 0 100 100">
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

const ArmchairIcon: FIcon = ({ size }) => (
  <svg {...S(size)} viewBox="0 0 100 100">
    <path
      d="M12 88 L12 38 Q12 10 40 10 L60 10 Q88 10 88 38 L88 88
         L72 88 L72 42 Q72 30 60 30 L40 30 Q28 30 28 42 L28 88 Z"
      fill="#8FA9BE" {...O4}
    />
    <rect x="28" y="34" width="44" height="56" rx="12" fill="#BCCFDD" {...O4} />
    <line x1="30" y1="68" x2="70" y2="68" stroke="black" strokeWidth="3" />
  </svg>
)

const BedIcon: FIcon = ({ size }) => (
  <svg {...S(size)} viewBox="0 0 100 100">
    <rect x="8" y="4" width="84" height="92" rx="6" fill="#B49468" {...O4} />
    <rect x="8" y="4" width="84" height="18" rx="6" fill="#8A6C44" {...O4} />
    <rect x="14" y="22" width="72" height="68" rx="4" fill="#F2EDDF" {...O} />
    <rect x="18" y="26" width="28" height="18" rx="7" fill="#FBF8F0" {...O} />
    <rect x="54" y="26" width="28" height="18" rx="7" fill="#FBF8F0" {...O} />
    <rect x="14" y="48" width="72" height="42" rx="4" fill="#7D98B4" {...O4} />
    <line x1="14" y1="58" x2="86" y2="58" stroke="black" strokeWidth="3" />
  </svg>
)

// Table: near-3/4 view — rectangular top with visible legs at each corner.
// The top-down version (plain rectangle with grid lines) reads as a floor tile,
// not a table. Legs make it unmistakable.
const TableIcon: FIcon = ({ size }) => (
  <svg {...S(size)} viewBox="0 0 100 100">
    {/* legs — drawn first so tabletop sits on them */}
    <rect x="10" y="62" width="12" height="30" rx="3" fill="#8A6230" {...O4} />
    <rect x="78" y="62" width="12" height="30" rx="3" fill="#8A6230" {...O4} />
    <rect x="10" y="62" width="12" height="14" rx="2" fill="#9A7240" {...O} />
    <rect x="78" y="62" width="12" height="14" rx="2" fill="#9A7240" {...O} />
    {/* tabletop — warm oak, clearly a flat surface */}
    <rect x="4" y="30" width="92" height="36" rx="6" fill="#BC9A66" {...O4} />
    <rect x="10" y="36" width="80" height="24" rx="4" fill="#CCAC78" {...O} />
    {/* subtle wood grain lines */}
    <line x1="10" y1="46" x2="90" y2="46" stroke="#B08050" strokeWidth="2" strokeDasharray="8 6" />
  </svg>
)

// Box: cardboard box seen 3/4 from slightly above — open top flaps visible.
// Pure top-down (the X pattern) reads as a target or gift-wrap, not a box.
const BoxIcon: FIcon = ({ size }) => (
  <svg {...S(size)} viewBox="0 0 100 100">
    {/* Dark opening makes this read as an open cardboard box, not a cabinet. */}
    <path d="M14 42 L50 26 L86 42 L50 59 Z" fill="#684728" {...O4} />
    {/* Two raised back flaps establish the open-box silhouette. */}
    <path d="M14 42 L5 22 L38 8 L50 26 Z" fill="#E0C78E" {...O4} />
    <path d="M50 26 L63 7 L96 23 L86 42 Z" fill="#D2AF70" {...O4} />
    {/* Filled front and side faces; the former zero-width side path is gone. */}
    <path d="M14 42 L50 59 L50 94 L14 78 Z" fill="#C8A870" {...O4} />
    <path d="M50 59 L86 42 L86 78 L50 94 Z" fill="#B78F58" {...O4} />
    {/* Packing-tape stripe follows the front face perspective. */}
    <path d="M44 56 L56 56 L56 91 L44 88 Z" fill="#A88750" {...O} />
  </svg>
)

const RugIcon: FIcon = ({ size }) => (
  <svg {...S(size)} viewBox="0 0 100 100">
    <rect x="10" y="10" width="80" height="80" rx="5" fill="#8E3A3A" {...O4} />
    <rect x="20" y="20" width="60" height="60" rx="3" fill="#A85555" {...O} />
    <line x1="14" y1="5" x2="86" y2="5" stroke="black" strokeWidth="4" strokeDasharray="4 6" strokeLinecap="round" />
    <line x1="14" y1="95" x2="86" y2="95" stroke="black" strokeWidth="4" strokeDasharray="4 6" strokeLinecap="round" />
  </svg>
)

// Plant: near-elevation potted plant — terracotta pot with leafy foliage above.
// The old top-down version (radiating spikes from a central dot) read as a
// pinwheel, ninja-star, or abstract design. The pot silhouette is the key
// discriminator: shrub is a round bush with no pot; plant has a visible pot.
const PlantIcon: FIcon = ({ size }) => (
  <svg {...S(size)} viewBox="0 0 100 100">
    {/* foliage — three overlapping circles, lush rounded look */}
    <circle cx="50" cy="30" r="22" fill="#4E7C34" {...O4} />
    <circle cx="34" cy="38" r="18" fill="#5C8C3C" {...O4} />
    <circle cx="66" cy="38" r="18" fill="#5C8C3C" {...O4} />
    <circle cx="50" cy="24" r="16" fill="#6C9C48" {...O} />
    <circle cx="38" cy="32" r="12" fill="#7CAC54" {...O} />
    <circle cx="62" cy="32" r="12" fill="#7CAC54" {...O} />
    {/* stem */}
    <rect x="46" y="52" width="8" height="10" rx="2" fill="#5A7A2E" {...O} />
    {/* terracotta pot — trapezoid body */}
    <path d="M30 62 L36 94 L64 94 L70 62 Z" fill="#C26040" {...O4} />
    {/* pot rim */}
    <rect x="26" y="58" width="48" height="8" rx="4" fill="#D47050" {...O4} />
    {/* pot highlight stripe */}
    <path d="M35 70 L37 90" stroke="#E08060" strokeWidth="3" strokeLinecap="round" />
  </svg>
)

const ShrubIcon: FIcon = ({ size }) => (
  <svg {...S(size)} viewBox="0 0 100 100">
    <circle cx="50" cy="52" r="40" fill="#4E7434" {...O4} />
    <circle cx="30" cy="42" r="20" fill="#5C8440" {...O} />
    <circle cx="70" cy="42" r="20" fill="#5C8440" {...O} />
    <circle cx="50" cy="30" r="18" fill="#6C944C" {...O} />
    <circle cx="36" cy="62" r="16" fill="#6C944C" {...O} />
    <circle cx="66" cy="64" r="15" fill="#5C8440" {...O} />
    <circle cx="50" cy="50" r="12" fill="#7CA458" {...O} />
  </svg>
)

// Lamp: near-elevation / slight-3/4 view — conical shade, vertical stem, base.
// The pure top-down (three concentric gold rings) reads as a coin, target, or
// round rug. A shade + stem silhouette is immediately nameable.
const LampIcon: FIcon = ({ size }) => (
  <svg {...S(size)} viewBox="0 0 100 100">
    {/* warm glow halo behind shade */}
    <ellipse cx="50" cy="38" rx="34" ry="20" fill="#F6ECC2" opacity={0.55} />
    {/* conical shade — wide at bottom, narrow at top */}
    <path d="M22 54 L34 14 L66 14 L78 54 Z" fill="#D8B860" {...O4} />
    {/* shade rim — darker band at the bottom of the shade */}
    <ellipse cx="50" cy="54" rx="28" ry="7" fill="#C8A040" {...O4} />
    {/* shade top cap */}
    <ellipse cx="50" cy="14" rx="16" ry="4" fill="#B89030" {...O} />
    {/* bulb glow inside shade */}
    <ellipse cx="50" cy="38" rx="12" ry="10" fill="#FFF8DC" opacity={0.7} />
    {/* stem */}
    <rect x="46" y="54" width="8" height="28" rx="3" fill="#8A6830" {...O4} />
    {/* base — foreshortened ellipse so it reads as a 3D disc */}
    <ellipse cx="50" cy="84" rx="20" ry="8" fill="#7A5820" {...O4} />
    <ellipse cx="50" cy="82" rx="14" ry="5" fill="#9A7840" {...O} />
  </svg>
)

// Counter: kitchen worktop seen slightly from above — sink basin visible,
// faucet arm rising from the back edge, chopping board to the left.
const CounterIcon: FIcon = ({ size }) => (
  <svg {...S(size)} viewBox="0 0 100 100">
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

// TV: elevation view — screen face-on with stand visible below.
// The old top-down version (wooden slab + thin black edge) read as a dresser
// or cabinet drawer. A face-on screen with bezel and the Netflix-style glow is
// instantly recognisable at 48px.
const TvIcon: FIcon = ({ size }) => (
  <svg {...S(size)} viewBox="0 0 100 100">
    {/* screen bezel */}
    <rect x="8" y="8" width="84" height="62" rx="5" fill="#1A1A28" {...O4} />
    {/* screen glass — dark blue-grey with subtle gradient band */}
    <rect x="14" y="14" width="72" height="50" rx="3" fill="#1C2A3A" {...O} />
    {/* screen glow / content — lighter centre strip */}
    <rect x="20" y="20" width="60" height="38" rx="2" fill="#2A3E56" />
    {/* bright highlight band across top of screen */}
    <rect x="20" y="20" width="60" height="10" rx="2" fill="#3A5270" opacity={0.7} />
    {/* stand neck */}
    <rect x="44" y="70" width="12" height="12" rx="2" fill="#3A3A3A" {...O4} />
    {/* stand base — wide foot */}
    <rect x="28" y="82" width="44" height="10" rx="5" fill="#2A2A2A" {...O4} />
  </svg>
)

const BathtubIcon: FIcon = ({ size }) => (
  <svg {...S(size)} viewBox="0 0 100 100">
    <rect x="6" y="8" width="88" height="84" rx="20" fill="#F0ECE2" {...O4} />
    <rect x="16" y="18" width="68" height="64" rx="14" fill="#A8CCDE" {...O4} />
    <circle cx="34" cy="22" r="7" fill="#B8B8B4" {...O} />
    <circle cx="66" cy="22" r="7" fill="#B8B8B4" {...O} />
    <circle cx="50" cy="70" r="7" fill="#7A94A0" {...O} />
    <circle cx="50" cy="70" r="3" fill="#586870" {...O} />
  </svg>
)

// Bookshelf: near-elevation view — shelf frame with visible book spines packed
// in. Top-down is just a brown rectangle strip; elevation makes spine colours
// and varying widths instantly readable as books on a shelf.
const BookshelfIcon: FIcon = ({ size }) => (
  <svg {...S(size)} viewBox="0 0 100 100">
    {/* shelf side panels */}
    <rect x="6" y="8" width="10" height="84" rx="3" fill="#7A5A30" {...O4} />
    <rect x="84" y="8" width="10" height="84" rx="3" fill="#7A5A30" {...O4} />
    {/* shelf back panel */}
    <rect x="16" y="8" width="68" height="84" rx="2" fill="#96744A" {...O4} />
    {/* shelf boards — two visible shelves */}
    <rect x="6" y="8" width="88" height="8" rx="3" fill="#7A5A30" {...O4} />
    <rect x="6" y="52" width="88" height="7" rx="2" fill="#7A5A30" {...O4} />
    <rect x="6" y="88" width="88" height="8" rx="3" fill="#7A5A30" {...O4} />
    {/* top shelf books */}
    <rect x="18" y="16" width="9" height="34" fill="#8E3A3A" {...O} />
    <rect x="27" y="16" width="7" height="34" fill="#34506E" {...O} />
    <rect x="34" y="16" width="10" height="34" fill="#3E6648" {...O} />
    <rect x="44" y="16" width="6" height="34" fill="#A08434" {...O} />
    <rect x="50" y="16" width="9" height="34" fill="#6E4468" {...O} />
    <rect x="59" y="16" width="7" height="34" fill="#3E7070" {...O} />
    <rect x="66" y="16" width="10" height="34" fill="#8E3A3A" {...O} />
    <rect x="76" y="16" width="7" height="34" fill="#34506E" {...O} />
    {/* bottom shelf books */}
    <rect x="18" y="59" width="11" height="27" fill="#3E6648" {...O} />
    <rect x="29" y="59" width="7" height="27" fill="#A08434" {...O} />
    <rect x="36" y="59" width="9" height="27" fill="#8E3A3A" {...O} />
    <rect x="45" y="59" width="8" height="27" fill="#6E4468" {...O} />
    <rect x="53" y="59" width="11" height="27" fill="#3E7070" {...O} />
    <rect x="64" y="59" width="7" height="27" fill="#34506E" {...O} />
    <rect x="71" y="59" width="12" height="27" fill="#3E6648" {...O} />
  </svg>
)

const StoveIcon: FIcon = ({ size }) => (
  <svg {...S(size)} viewBox="0 0 100 100">
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
  <svg {...S(size)} viewBox="0 0 100 100">
    <rect x="18" y="6" width="64" height="88" rx="9" fill="#DCE0E2" {...O4} />
    <line x1="18" y1="38" x2="82" y2="38" stroke="black" strokeWidth="4" />
    <rect x="68" y="14" width="8" height="16" rx="4" fill="#98A0A8" {...O} />
    <rect x="68" y="46" width="8" height="28" rx="4" fill="#98A0A8" {...O} />
  </svg>
)

const ClockIcon: FIcon = ({ size }) => (
  <svg {...S(size)} viewBox="0 0 100 100">
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

const DeskIcon: FIcon = ({ size }) => (
  <svg {...S(size)} viewBox="0 0 100 100">
    <rect x="35" y="45" width="30" height="35" rx="10" fill="#5E666E" {...O4} />
    <rect x="31" y="74" width="38" height="12" rx="6" fill="#464E56" {...O4} />
    <rect x="10" y="10" width="80" height="40" rx="2" fill="#AE8656" {...O4} />
    <rect x="40" y="20" width="20" height="15" rx="2" fill="#7A828C" {...O} />
  </svg>
)

const ToiletIcon: FIcon = ({ size }) => (
  <svg {...S(size)} viewBox="0 0 100 100">
    <rect x="22" y="6" width="56" height="26" rx="8" fill="#F0ECE2" {...O4} />
    <circle cx="50" cy="19" r="5" fill="#B8B8B4" {...O} />
    <ellipse cx="50" cy="62" rx="34" ry="30" fill="#F0ECE2" {...O4} />
    <ellipse cx="50" cy="64" rx="24" ry="21" fill="#B4D0E0" {...O} />
  </svg>
)

// Shower: elevation / slight-3/4 view — showerhead pipe arm + spray rose +
// water droplets falling. The old top-down (concentric circles + dots at
// corners) was indistinguishable from a drain, camera lens, or speaker grille.
// This version is unmistakable AND distinct from the bathtub (horizontal tub
// silhouette with water) because it shows a vertical pipe + overhead head.
const ShowerIcon: FIcon = ({ size }) => (
  <svg {...S(size)} viewBox="0 0 100 100">
    {/* tray / floor — thin white rectangle at the bottom */}
    <rect x="14" y="78" width="72" height="16" rx="5" fill="#F0ECE4" {...O4} />
    {/* drain in tray */}
    <circle cx="50" cy="86" r="4" fill="#8A9AA0" {...O} />
    {/* vertical pipe rising from wall */}
    <rect x="20" y="10" width="8" height="60" rx="4" fill="#ACACA8" {...O4} />
    {/* horizontal arm — elbow at top */}
    <rect x="24" y="10" width="40" height="8" rx="4" fill="#ACACA8" {...O4} />
    {/* showerhead rose — round disc at end of arm */}
    <circle cx="62" cy="14" r="12" fill="#C8C8C4" {...O4} />
    <circle cx="62" cy="14" r="8" fill="#D8D8D4" {...O} />
    {/* spray holes on rose */}
    {([[57,10],[62,10],[67,10],[57,15],[62,15],[67,15],[57,19],[62,19]]).map(([x,y],i) => (
      <circle key={i} cx={x} cy={y} r="1.5" fill="#7A8A90" />
    ))}
    {/* falling water drops */}
    <line x1="54" y1="28" x2="52" y2="42" stroke="#A8CCE0" strokeWidth="3" strokeLinecap="round" />
    <line x1="62" y1="27" x2="60" y2="44" stroke="#B8D8E8" strokeWidth="3" strokeLinecap="round" />
    <line x1="70" y1="28" x2="68" y2="46" stroke="#A8CCE0" strokeWidth="3" strokeLinecap="round" />
    <line x1="58" y1="48" x2="56" y2="60" stroke="#B8D8E8" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="66" y1="50" x2="64" y2="64" stroke="#A8CCE0" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="54" y1="64" x2="52" y2="74" stroke="#B8D8E8" strokeWidth="2" strokeLinecap="round" />
    <line x1="62" y1="66" x2="61" y2="74" stroke="#A8CCE0" strokeWidth="2" strokeLinecap="round" />
    <line x1="70" y1="64" x2="69" y2="74" stroke="#B8D8E8" strokeWidth="2" strokeLinecap="round" />
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
