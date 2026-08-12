import React from 'react'
import type { FurnitureType } from './types'

/**
 * Top-down case-file miniatures.
 *
 * The board is an investigation surface, not a children's board game. Every
 * object is built from layered surfaces, material highlights, and quiet tonal
 * seams. The 100×100 viewBox keeps the details legible from 4×4 through 7×7
 * puzzles while preserving the public icon registry used by the picker.
 */
export interface FurnitureIconProps { size?: number }
export type FurnitureIcon = (props: FurnitureIconProps) => React.ReactElement

const S = (size?: number) => size
  ? { width: size, height: size }
  : { width: '100%', height: '100%' }

const SvgDefs = ({ prefix }: { prefix: string }) => (
  <defs>
    <linearGradient id={`${prefix}-wood`} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#b68155" />
      <stop offset="0.45" stopColor="#7d4d37" />
      <stop offset="1" stopColor="#41262a" />
    </linearGradient>
    <linearGradient id={`${prefix}-wood-deep`} x1="0" y1="0" x2="0.9" y2="1">
      <stop offset="0" stopColor="#7c4a34" />
      <stop offset="0.5" stopColor="#4e2c2d" />
      <stop offset="1" stopColor="#281b24" />
    </linearGradient>
    <linearGradient id={`${prefix}-fabric`} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#a97268" />
      <stop offset="0.55" stopColor="#754753" />
      <stop offset="1" stopColor="#3b2939" />
    </linearGradient>
    <linearGradient id={`${prefix}-fabric-light`} x1="0" y1="0" x2="0.9" y2="1">
      <stop offset="0" stopColor="#c3927d" />
      <stop offset="0.55" stopColor="#8a5b66" />
      <stop offset="1" stopColor="#563d50" />
    </linearGradient>
    <linearGradient id={`${prefix}-brass`} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#f0d59b" />
      <stop offset="0.38" stopColor="#b88b4b" />
      <stop offset="0.72" stopColor="#70502f" />
      <stop offset="1" stopColor="#d7b46e" />
    </linearGradient>
    <linearGradient id={`${prefix}-metal`} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#e3dfd2" />
      <stop offset="0.35" stopColor="#8c9291" />
      <stop offset="0.65" stopColor="#3d4a51" />
      <stop offset="1" stopColor="#bfc0b5" />
    </linearGradient>
    <linearGradient id={`${prefix}-porcelain`} x1="0" y1="0" x2="0.9" y2="1">
      <stop offset="0" stopColor="#fff9e9" />
      <stop offset="0.45" stopColor="#d8d8cc" />
      <stop offset="1" stopColor="#879398" />
    </linearGradient>
    <linearGradient id={`${prefix}-glass`} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#d8ede5" stopOpacity="0.78" />
      <stop offset="0.45" stopColor="#6e9ca0" stopOpacity="0.52" />
      <stop offset="1" stopColor="#293e4c" stopOpacity="0.84" />
    </linearGradient>
    <linearGradient id={`${prefix}-paper`} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#fbf0d2" />
      <stop offset="1" stopColor="#c6a98a" />
    </linearGradient>
    <radialGradient id={`${prefix}-glow`} cx="50%" cy="50%" r="50%">
      <stop offset="0" stopColor="#fff2b5" stopOpacity="0.8" />
      <stop offset="0.45" stopColor="#e6b76e" stopOpacity="0.25" />
      <stop offset="1" stopColor="#c27d51" stopOpacity="0" />
    </radialGradient>
    <radialGradient id={`${prefix}-metal-glint`} cx="35%" cy="28%" r="80%">
      <stop offset="0" stopColor="#fff5cc" />
      <stop offset="0.3" stopColor="#cab887" />
      <stop offset="1" stopColor="#4d4438" />
    </radialGradient>
    <filter id={`${prefix}-shadow`} x="-20%" y="-20%" width="140%" height="145%">
      <feDropShadow dx="0" dy="2" stdDeviation="2.3" floodColor="#160f15" floodOpacity="0.48" />
    </filter>
  </defs>
)

function Frame({ prefix, size, children }: {
  prefix: string
  size?: number
  children: React.ReactNode
}) {
  return (
    <svg {...S(size)} viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <SvgDefs prefix={prefix} />
      <g filter={`url(#${prefix}-shadow)`}>{children}</g>
    </svg>
  )
}

const SofaIcon: FurnitureIcon = ({ size }) => (
  <Frame prefix="sofa" size={size}>
    <rect x="7" y="12" width="86" height="75" rx="18" fill="url(#sofa-fabric)" />
    <path d="M15 19c16-8 54-8 70 0v17H15Z" fill="#4a3040" opacity="0.52" />
    <rect x="14" y="27" width="72" height="54" rx="12" fill="url(#sofa-fabric-light)" />
    <rect x="18" y="31" width="30" height="45" rx="9" fill="#9b6c72" opacity="0.76" />
    <rect x="52" y="31" width="30" height="45" rx="9" fill="#825561" opacity="0.84" />
    <path d="M50 33v42M18 78c16 4 48 4 64 0" fill="none" stroke="#503544" strokeWidth="0.95" />
    <path d="M20 37c6-4 18-5 25-1M55 36c7-4 17-4 24 1" fill="none" stroke="#d7a891" strokeOpacity="0.5" strokeWidth="1" strokeLinecap="round" />
    <path d="M9 54c3 0 5 2 5 6v16c-2 6-5 9-9 8V28c4-1 7 2 7 8v13c0 3-1 4-3 5ZM91 54c-3 0-5 2-5 6v16c2 6 5 9 9 8V28c-4-1-7 2-7 8v13c0 3 1 4 3 5Z" fill="#633f4c" opacity="0.84" />
    <path d="M10 82c21 6 59 6 80 0" fill="none" stroke="#cf957f" strokeOpacity="0.45" strokeWidth="1.05" />
  </Frame>
)

const ArmchairIcon: FurnitureIcon = ({ size }) => (
  <Frame prefix="chair" size={size}>
    <path d="M14 15c12-6 60-6 72 0 6 4 9 13 8 24l-3 42c-1 7-6 10-14 10H23c-8 0-13-3-14-10L6 39c-1-11 2-20 8-24Z" fill="url(#chair-fabric)" />
    <path d="M17 18c9-5 57-5 66 0 4 4 6 11 5 21l-2 10c-6-5-13-7-21-7H35c-8 0-15 2-21 7l-2-10c-1-10 1-17 5-21Z" fill="#5b3d4b" opacity="0.88" />
    <path d="M18 46c4-6 10-9 18-9h28c8 0 14 3 18 9v31c-6 7-16 10-32 10s-26-3-32-10Z" fill="url(#chair-fabric-light)" />
    <path d="M21 47c5-3 10-4 15-4h28c5 0 10 1 15 4M19 77c8 5 19 7 31 7s23-2 31-7" fill="none" stroke="#d5a088" strokeOpacity="0.55" strokeWidth="1.05" strokeLinecap="round" />
    <path d="M15 45c-4 6-5 17-4 29 1 8 5 12 11 13l8-11-4-28c-4-4-7-5-11-3ZM85 45c4 6 5 17 4 29-1 8-5 12-11 13l-8-11 4-28c4-4 7-5 11-3Z" fill="#704855" />
    <path d="M22 49c-2 9-1 19 1 29M78 49c2 9 1 19-1 29" fill="none" stroke="#4b3040" strokeWidth="1.1" strokeLinecap="round" />
    <path d="M24 19c5-2 11-3 18-3M76 19c-5-2-11-3-18-3" fill="none" stroke="#ecc0a1" strokeOpacity="0.52" strokeWidth="1" strokeLinecap="round" />
  </Frame>
)

const BedIcon: FurnitureIcon = ({ size }) => (
  <Frame prefix="bed" size={size}>
    <rect x="10" y="6" width="80" height="88" rx="9" fill="url(#bed-wood-deep)" />
    <rect x="14" y="10" width="72" height="18" rx="6" fill="#82503a" />
    <path d="M18 17c13-4 51-4 64 0M24 21c12-3 40-3 52 0" fill="none" stroke="#c18a5e" strokeOpacity="0.55" strokeWidth="0.85" />
    <rect x="17" y="24" width="66" height="64" rx="6" fill="url(#bed-paper)" />
    <rect x="21" y="28" width="25" height="17" rx="6" fill="#f8ebcf" />
    <rect x="54" y="28" width="25" height="17" rx="6" fill="#e8d9bd" />
    <path d="M18 48c18-5 46-5 64 0v31c-17 8-47 8-64 0Z" fill="#7d5963" opacity="0.9" />
    <path d="M50 49c-3 11-3 22 0 30M23 64c8 3 17 4 25 4s17-1 25-4" fill="none" stroke="#d5a88d" strokeOpacity="0.58" strokeWidth="1" strokeLinecap="round" />
    <path d="M21 86h58M17 31h66" stroke="#54312d" strokeOpacity="0.58" strokeWidth="1" />
    <circle cx="18" cy="12" r="2" fill="#d2a269" /><circle cx="82" cy="12" r="2" fill="#d2a269" />
  </Frame>
)

const TableIcon: FurnitureIcon = ({ size }) => (
  <Frame prefix="table" size={size}>
    <ellipse cx="50" cy="53" rx="39" ry="34" fill="#2d1d24" opacity="0.42" />
    <ellipse cx="50" cy="49" rx="39" ry="34" fill="url(#table-wood)" />
    <ellipse cx="50" cy="48" rx="29" ry="24" fill="#96643f" opacity="0.42" />
    <path d="M20 47c16-9 45-10 61-1M23 58c15 8 39 10 55 2M35 25c9 6 18 8 31 7M34 72c10-5 22-6 34-2" fill="none" stroke="#d3a06c" strokeOpacity="0.5" strokeWidth="0.9" strokeLinecap="round" />
    <path d="M35 42h30l-3 12H38Z" fill="url(#table-paper)" opacity="0.88" />
    <path d="m38 45 19-1M40 49h15" stroke="#7b4b40" strokeWidth="0.75" strokeLinecap="round" />
    <circle cx="26" cy="38" r="3" fill="#c3a46f" /><circle cx="74" cy="61" r="3" fill="#5b3440" />
  </Frame>
)

const BoxIcon: FurnitureIcon = ({ size }) => (
  <Frame prefix="box" size={size}>
    {/* Directly overhead: four folded flaps surround the dark packing cavity. */}
    <rect x="10" y="12" width="80" height="76" rx="6" fill="url(#box-wood-deep)" />
    <path d="M20 22 26 12h48l6 10Z" fill="#b1784c" />
    <path d="M20 78 26 88h48l6-10Z" fill="#8e5b40" />
    <path d="M20 22 10 28v44l10 6Z" fill="#9c6849" />
    <path d="M80 22 90 28v44l-10 6Z" fill="#754733" />
    <rect x="20" y="22" width="60" height="56" rx="3" fill="#2d2226" />
    <path d="M22 24h56v52H22Z" fill="#443136" opacity="0.72" />
    <path d="M22 24 78 76M78 24 22 76" fill="none" stroke="#c29a5f" strokeOpacity="0.68" strokeWidth="0.9" />
    <path d="m28 30 19 8-5 18-19-8Z" fill="url(#box-paper)" />
    <path d="m55 31 17 6-5 18-17-6Z" fill="#66807b" opacity="0.9" />
    <path d="M30 35 43 40M28 41l13 5M57 36l11 4M54 42l11 4" stroke="#f0d9ae" strokeOpacity="0.62" strokeWidth="0.8" strokeLinecap="round" />
    <path d="M47 23h6v54h-6Z" fill="#c29a5f" opacity="0.74" />
    <path d="M23 20h54M23 80h54" stroke="#e2b67d" strokeOpacity="0.54" strokeWidth="0.9" />
  </Frame>
)

const RugIcon: FurnitureIcon = ({ size }) => (
  <Frame prefix="rug" size={size}>
    <rect x="8" y="8" width="84" height="84" rx="6" fill="#3e252f" />
    <rect x="12" y="12" width="76" height="76" rx="4" fill="#73434b" />
    <rect x="17" y="17" width="66" height="66" rx="3" fill="#a36d5c" />
    <rect x="21" y="21" width="58" height="58" rx="2" fill="#6f4151" />
    <path d="M50 25 70 50 50 75 30 50Z" fill="#b28162" opacity="0.86" />
    <path d="M50 32 63 50 50 68 37 50Z" fill="#553247" />
    <path d="M25 27c7 5 9 12 6 20M75 27c-7 5-9 12-6 20M25 73c7-5 9-12 6-20M75 73c-7-5-9-12-6-20" fill="none" stroke="#d7a17d" strokeOpacity="0.6" strokeWidth="1" strokeLinecap="round" />
    <path d="M14 16h72M14 84h72M16 14v72M84 14v72" fill="none" stroke="#ddaf87" strokeOpacity="0.52" strokeWidth="0.85" />
  </Frame>
)

const PlantIcon: FurnitureIcon = ({ size }) => (
  <Frame prefix="plant" size={size}>
    <ellipse cx="50" cy="58" rx="34" ry="29" fill="#21342d" opacity="0.48" />
    <circle cx="33" cy="44" r="18" fill="#486d4d" />
    <circle cx="61" cy="39" r="21" fill="#587e55" />
    <circle cx="70" cy="58" r="17" fill="#3d6548" />
    <circle cx="40" cy="61" r="20" fill="#5e8457" />
    <path d="M27 43c7-5 13-6 19-2M51 32c8 3 12 8 14 15M37 61c7-7 13-8 20-4M59 60c4-3 9-3 14 0" fill="none" stroke="#a4b57b" strokeOpacity="0.62" strokeWidth="1" strokeLinecap="round" />
    <path d="M34 67h32l-6 25H40Z" fill="#984e3f" />
    <path d="M30 65h40l-3 8H33Z" fill="#c17355" />
    <path d="M40 75 43 89M50 75v15M60 75l-3 14" stroke="#e09a6c" strokeOpacity="0.52" strokeWidth="1" strokeLinecap="round" />
  </Frame>
)

const ShrubIcon: FurnitureIcon = ({ size }) => (
  <Frame prefix="shrub" size={size}>
    <ellipse cx="51" cy="57" rx="40" ry="29" fill="#203b30" opacity="0.48" />
    <circle cx="26" cy="50" r="19" fill="#416743" />
    <circle cx="50" cy="38" r="23" fill="#5c8151" />
    <circle cx="76" cy="50" r="20" fill="#3c6341" />
    <circle cx="35" cy="67" r="18" fill="#52764a" />
    <circle cx="64" cy="68" r="19" fill="#4a7147" />
    <path d="M21 50c6-6 12-7 18-4M42 37c7-6 14-7 22-2M58 62c7-4 13-4 19 1M31 68c5-4 10-5 15-2" fill="none" stroke="#a8b777" strokeOpacity="0.62" strokeWidth="1" strokeLinecap="round" />
    <circle cx="51" cy="52" r="4" fill="#b68b56" opacity="0.76" />
  </Frame>
)

const LampIcon: FurnitureIcon = ({ size }) => (
  <Frame prefix="lamp" size={size}>
    <circle cx="57" cy="55" r="43" fill="url(#lamp-glow)" opacity="0.72" />
    <ellipse cx="51" cy="57" rx="25" ry="18" fill="#ddb267" opacity="0.25" />
    <path d="M29 24c10-7 28-7 39 0l-4 16c-9 5-21 5-31 0Z" fill="url(#lamp-brass)" />
    <ellipse cx="48.5" cy="40" rx="17" ry="6" fill="#f0d58e" opacity="0.78" />
    <ellipse cx="48.5" cy="40" rx="11" ry="3.3" fill="#fff2b0" opacity="0.88" />
    <path d="M47 43c4 6 10 9 18 12l13 6" fill="none" stroke="#886337" strokeWidth="1.4" strokeLinecap="round" />
    <path d="M47 43c4 6 10 9 18 12l13 6" fill="none" stroke="#d5ae68" strokeWidth="0.8" strokeLinecap="round" />
    <circle cx="48" cy="43" r="4.3" fill="url(#lamp-metal-glint)" />
    <circle cx="65" cy="55" r="4.1" fill="url(#lamp-metal-glint)" />
    <ellipse cx="79" cy="63" rx="14" ry="8" fill="url(#lamp-brass)" />
    <ellipse cx="79" cy="61" rx="9" ry="4" fill="#e2c27d" opacity="0.7" />
    <path d="M77 62c3-1 6-1 8 0" fill="none" stroke="#fff1bd" strokeOpacity="0.72" strokeWidth="1" strokeLinecap="round" />
    <path d="M33 26c5-4 10-5 15-5M31 30c5-3 10-4 15-4" fill="none" stroke="#fff0b5" strokeOpacity="0.55" strokeWidth="1" strokeLinecap="round" />
  </Frame>
)

const CounterIcon: FurnitureIcon = ({ size }) => (
  <Frame prefix="counter" size={size}>
    <rect x="7" y="11" width="86" height="78" rx="6" fill="url(#counter-wood-deep)" />
    <path d="M12 16h76M12 23h76M12 82h76" stroke="#bf885c" strokeOpacity="0.46" strokeWidth="0.9" />
    <rect x="52" y="25" width="32" height="42" rx="8" fill="url(#counter-porcelain)" />
    <rect x="56" y="29" width="24" height="34" rx="6" fill="#8ba4a6" opacity="0.72" />
    <ellipse cx="68" cy="46" rx="7" ry="5" fill="#4e7278" opacity="0.86" />
    <path d="M65 22v-8c0-4 3-6 6-6h5" fill="none" stroke="url(#counter-metal)" strokeWidth="1.35" strokeLinecap="round" />
    <circle cx="76" cy="9" r="3" fill="url(#counter-metal)" />
    <rect x="15" y="27" width="25" height="34" rx="4" fill="#b78552" />
    <path d="M19 34c5-3 11-3 17 0M19 42c5-2 11-2 17 0M19 51c5-2 11-2 17 0" fill="none" stroke="#e0b577" strokeOpacity="0.58" strokeWidth="0.85" strokeLinecap="round" />
    <circle cx="27" cy="71" r="3" fill="#d4b177" /><circle cx="36" cy="74" r="2" fill="#8b4f3d" />
  </Frame>
)

const TvIcon: FurnitureIcon = ({ size }) => (
  <Frame prefix="tv" size={size}>
    {/* Low CRT seen from above: a thick cabinet footprint, not a screen-on-stand. */}
    <path d="M13 18c5-6 13-9 23-9h29c10 0 18 3 22 9l5 11v39l-5 12c-4 6-12 9-22 9H36c-10 0-18-3-23-9L8 68V29Z" fill="#25252f" />
    <rect x="16" y="20" width="68" height="42" rx="9" fill="url(#tv-glass)" />
    <path d="M21 26c16-6 40-6 57 0M21 56c16 5 40 5 57 0" fill="none" stroke="#cadad3" strokeOpacity="0.28" strokeWidth="1" />
    <path d="M18 67h64v11H18Z" fill="#33343b" />
    <path d="M24 70h4M32 70h4M40 70h4M48 70h4M56 70h4M64 70h4M72 70h4" stroke="#a9a998" strokeOpacity="0.62" strokeWidth="1.1" strokeLinecap="round" />
    <path d="M20 80c15 5 44 5 60 0" fill="none" stroke="#d0b980" strokeOpacity="0.4" strokeWidth="0.9" />
    <path d="M83 73c8 3 10 9 7 15-3 5-8 7-14 6" fill="none" stroke="#69767b" strokeWidth="1.1" strokeLinecap="round" />
    <rect x="68" y="78" width="13" height="6" rx="2" fill="url(#tv-metal)" transform="rotate(12 74 81)" />
    <circle cx="76" cy="29" r="2" fill="#d4b26c" />
    <path d="M22 24h19" stroke="#e9d4a1" strokeOpacity="0.44" strokeWidth="1" strokeLinecap="round" />
  </Frame>
)

const BathtubIcon: FurnitureIcon = ({ size }) => (
  <Frame prefix="bathtub" size={size}>
    <rect x="8" y="10" width="84" height="80" rx="22" fill="url(#bathtub-porcelain)" />
    <rect x="16" y="18" width="68" height="64" rx="17" fill="url(#bathtub-glass)" />
    <path d="M20 47c16-6 44-6 60 0v17c-17 9-43 9-60 0Z" fill="#8cb8c2" opacity="0.42" />
    <ellipse cx="50" cy="68" rx="7" ry="5" fill="#506e76" />
    <circle cx="50" cy="68" r="2.2" fill="#d8ddd1" />
    <circle cx="31" cy="23" r="5" fill="url(#bathtub-metal-glint)" />
    <circle cx="69" cy="23" r="5" fill="url(#bathtub-metal-glint)" />
    <path d="M31 28v10M69 28v10" stroke="#9fa8a1" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M22 25c9-5 18-6 27-4M22 75c11 6 25 7 39 4" fill="none" stroke="#ffffff" strokeOpacity="0.58" strokeWidth="1.05" strokeLinecap="round" />
  </Frame>
)

const BookshelfIcon: FurnitureIcon = ({ size }) => (
  <Frame prefix="bookshelf" size={size}>
    {/* Overhead footprint: long timber case, shallow shelf depth, book blocks laid in. */}
    <rect x="7" y="27" width="86" height="46" rx="5" fill="url(#bookshelf-wood-deep)" />
    <rect x="12" y="32" width="76" height="36" rx="2" fill="#2d2024" />
    <rect x="12" y="32" width="76" height="6" fill="#b1784e" />
    <rect x="12" y="62" width="76" height="6" fill="#7a4a35" />
    <path d="M14 35h72M14 65h72" stroke="#e0b37b" strokeOpacity="0.52" strokeWidth="0.9" />
    <g>
      <path d="M17 39h9v19l-2 2h-7Z" fill="#9a4f45" /><path d="M26 40h7v20h-7Z" fill="#c18c55" />
      <path d="M33 38h10v22H33Z" fill="#476575" /><path d="M43 41h8v19h-8Z" fill="#8c5a77" />
      <path d="M51 39h10v21H51Z" fill="#6d865b" /><path d="M61 38h7v22h-7Z" fill="#d0ad69" />
      <path d="M68 40h11v20H68Z" fill="#a05243" /><path d="M79 39h7v21h-7Z" fill="#54758a" />
      <path d="M19 43h5M35 42h6M53 43h6M70 44h7" stroke="#f0cf9b" strokeOpacity="0.56" strokeWidth="0.75" />
    </g>
    <path d="M18 59h68" stroke="#2a1d24" strokeOpacity="0.8" strokeWidth="1.1" />
    <path d="M17 29h66M17 71h66" stroke="#d4a06b" strokeOpacity="0.56" strokeWidth="1.05" />
  </Frame>
)

const StoveIcon: FurnitureIcon = ({ size }) => (
  <Frame prefix="stove" size={size}>
    <rect x="8" y="9" width="84" height="82" rx="8" fill="url(#stove-metal)" />
    <rect x="14" y="15" width="72" height="66" rx="5" fill="#31383c" />
    <g fill="none" stroke="#b8a778" strokeWidth="1.15">
      <circle cx="32" cy="32" r="15" /><circle cx="32" cy="32" r="9" />
      <circle cx="68" cy="32" r="15" /><circle cx="68" cy="32" r="9" />
      <circle cx="32" cy="64" r="15" /><circle cx="32" cy="64" r="9" />
      <circle cx="68" cy="64" r="15" /><circle cx="68" cy="64" r="9" />
    </g>
    <circle cx="32" cy="32" r="4" fill="#a9684f" /><circle cx="68" cy="32" r="4" fill="#a9684f" />
    <circle cx="32" cy="64" r="4" fill="#a9684f" /><circle cx="68" cy="64" r="4" fill="#a9684f" />
    <rect x="26" y="84" width="48" height="5" rx="2.5" fill="#d4c8a7" opacity="0.65" />
  </Frame>
)

const FridgeIcon: FurnitureIcon = ({ size }) => (
  <Frame prefix="fridge" size={size}>
    {/* Overhead appliance footprint: two door planes, central seam and hinge hardware. */}
    <rect x="15" y="8" width="70" height="84" rx="8" fill="url(#fridge-metal)" />
    <rect x="20" y="13" width="30" height="74" rx="5" fill="#b5c0bc" opacity="0.76" />
    <rect x="50" y="13" width="30" height="74" rx="5" fill="#d0d0c6" opacity="0.72" />
    <path d="M50 14v72" stroke="#69767a" strokeOpacity="0.8" strokeWidth="1.15" />
    <path d="M24 18c8-4 16-4 23-1M54 18c8-4 16-4 23-1" fill="none" stroke="#f7efd7" strokeOpacity="0.64" strokeWidth="1" strokeLinecap="round" />
    <path d="M46 24v22M54 24v22M46 55v21M54 55v21" stroke="#58666b" strokeOpacity="0.84" strokeWidth="1.2" strokeLinecap="round" />
    <circle cx="24" cy="19" r="2.2" fill="#d7c49b" /><circle cx="76" cy="19" r="2.2" fill="#b8a77e" />
    <circle cx="24" cy="81" r="2.2" fill="#a55e4b" /><circle cx="76" cy="81" r="2.2" fill="#567d7a" />
    <path d="M22 84h56" stroke="#eef0dc" strokeOpacity="0.4" strokeWidth="0.85" />
  </Frame>
)

const ClockIcon: FurnitureIcon = ({ size }) => (
  <Frame prefix="clock" size={size}>
    {/* Small overhead desk clock footprint: inset dial, winding key and pendulum window. */}
    <path d="M11 31c3-10 12-16 24-18h30c12 2 21 8 24 18v38c-3 10-12 16-24 18H35c-12-2-21-8-24-18Z" fill="url(#clock-wood-deep)" />
    <path d="M17 34c5-8 12-11 22-12h22c10 1 17 4 22 12v30c-5 8-12 11-22 12H39c-10-1-17-4-22-12Z" fill="#704639" opacity="0.78" />
    <ellipse cx="59" cy="49" rx="19" ry="17" fill="#2e2128" />
    <ellipse cx="59" cy="49" rx="14" ry="12" fill="url(#clock-paper)" />
    <ellipse cx="59" cy="49" rx="10" ry="8" fill="#e9dfc5" opacity="0.62" />
    <g stroke="#735246" strokeWidth="0.9" strokeLinecap="round">
      <path d="M59 39v3M59 56v3M49 49h3M66 49h3" />
      <path d="m52 42 2 2M66 42l-2 2M52 56l2-2M66 56l-2-2" />
    </g>
    <path d="M59 49V43M59 49l6 4" fill="none" stroke="#4c3030" strokeWidth="1.15" strokeLinecap="round" />
    <circle cx="59" cy="49" r="2.2" fill="#a6534a" />
    <path d="M25 46h14v17H25Z" fill="#33252b" opacity="0.88" />
    <path d="M29 49v11M35 49v11" stroke="#c59a64" strokeOpacity="0.7" strokeWidth="0.9" />
    <path d="M22 66c8 5 14 7 21 8M22 28c8-5 14-7 21-8" fill="none" stroke="#e7bc7d" strokeOpacity="0.52" strokeWidth="1" strokeLinecap="round" />
    <path d="M18 74h9M73 74h9" stroke="#251820" strokeWidth="1.4" strokeLinecap="round" />
    <path d="M27 51h-7M24 48l-4 3 4 3" fill="none" stroke="#d5ae68" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
  </Frame>
)

const DeskIcon: FurnitureIcon = ({ size }) => (
  <Frame prefix="desk" size={size}>
    <rect x="7" y="12" width="86" height="76" rx="5" fill="url(#desk-wood-deep)" />
    <path d="M12 22c23-7 52 4 76-3M12 31c23-7 54 4 76-3M12 74c23-7 53 4 76-3" fill="none" stroke="#d09a68" strokeOpacity="0.42" strokeWidth="0.9" strokeLinecap="round" />
    <rect x="26" y="28" width="48" height="42" rx="3" fill="#493844" opacity="0.86" />
    <rect x="32" y="34" width="36" height="29" rx="2" fill="#654553" opacity="0.8" />
    <path d="M35 38h24M35 44h18M35 50h26" stroke="#ba8b79" strokeOpacity="0.46" strokeWidth="0.8" strokeLinecap="round" />
    <path d="m17 20 16 5-4 12-16-5Z" fill="url(#desk-paper)" />
    <path d="m72 68 13 4-3 9-13-4Z" fill="#e6d7b9" opacity="0.9" />
    <path d="M20 22 28 24M74 71l7 2" stroke="#7c5547" strokeWidth="0.75" strokeLinecap="round" />
    <path d="M42 76h21" stroke="#c7a168" strokeWidth="1.3" strokeLinecap="round" /><circle cx="65" cy="76" r="2" fill="#d6b474" />
    <path d="M10 84h80" stroke="#2c1d23" strokeOpacity="0.62" strokeWidth="1.1" />
  </Frame>
)

const ToiletIcon: FurnitureIcon = ({ size }) => (
  <Frame prefix="toilet" size={size}>
    <rect x="24" y="7" width="52" height="28" rx="8" fill="url(#toilet-porcelain)" />
    <rect x="30" y="13" width="40" height="16" rx="5" fill="#cbd6ce" opacity="0.74" />
    <circle cx="50" cy="21" r="3.4" fill="url(#toilet-metal-glint)" />
    <path d="M18 49c0-7 7-12 15-12h34c8 0 15 5 15 12v18c0 16-12 26-32 26S18 83 18 67Z" fill="url(#toilet-porcelain)" />
    <ellipse cx="50" cy="62" rx="25" ry="20" fill="#cad7d3" opacity="0.88" />
    <ellipse cx="50" cy="62" rx="17" ry="13" fill="#607f85" opacity="0.72" />
    <ellipse cx="50" cy="61" rx="8" ry="5" fill="#d8eee5" opacity="0.66" />
    <path d="M27 47c8-7 38-7 46 0M29 78c11 9 31 10 42 0" fill="none" stroke="#ffffff" strokeOpacity="0.62" strokeWidth="1.05" strokeLinecap="round" />
  </Frame>
)

const ShowerIcon: FurnitureIcon = ({ size }) => (
  <Frame prefix="shower" size={size}>
    <rect x="8" y="9" width="84" height="82" rx="8" fill="url(#shower-metal)" />
    <rect x="13" y="14" width="74" height="72" rx="5" fill="url(#shower-glass)" />
    <path d="M17 18h66M17 82h66M18 18v64M82 18v64" fill="none" stroke="#f0e6d0" strokeOpacity="0.52" strokeWidth="1.1" />
    <circle cx="50" cy="51" r="9" fill="#475b64" opacity="0.88" />
    <circle cx="50" cy="51" r="5" fill="#b8c8bd" opacity="0.8" />
    <circle cx="50" cy="51" r="2" fill="#36434b" />
    <circle cx="28" cy="29" r="11" fill="url(#shower-metal-glint)" opacity="0.9" />
    <circle cx="28" cy="29" r="7" fill="#c1d8d1" opacity="0.56" />
    <g fill="#deefe5" opacity="0.72">
      <circle cx="24" cy="25" r="1" /><circle cx="29" cy="24" r="1" /><circle cx="33" cy="28" r="1" />
      <circle cx="24" cy="31" r="1" /><circle cx="29" cy="32" r="1" /><circle cx="33" cy="34" r="1" />
    </g>
    <path d="M66 25c3 5 3 10 0 14M72 28c3 4 3 8 0 12M61 58c3 5 3 9 0 13" fill="none" stroke="#d8f0e7" strokeOpacity="0.7" strokeWidth="1.2" strokeLinecap="round" />
    <rect x="68" y="69" width="10" height="6" rx="3" fill="#d9d3be" opacity="0.86" />
    <circle cx="73" cy="72" r="1.3" fill="#866145" />
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
