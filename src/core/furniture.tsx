import React from 'react'
import type { FurnitureType } from './types'

/**
 * Noire Illustration board miniatures.
 *
 * These are small, literal objects rather than abstract map symbols: the board
 * language is part of the puzzle's clue vocabulary. Every icon has one or more
 * deliberate espresso contours, quieter internal construction lines, material
 * shading, and a small cast shadow. The 100×100 viewBox keeps the illustrated
 * details readable from the 4×4 board through the denser 7×7 cases.
 */
export interface FurnitureIconProps { size?: number }
export type FurnitureIcon = (props: FurnitureIconProps) => React.ReactElement

const S = (size?: number) => size
  ? { width: size, height: size }
  : { width: '100%', height: '100%' }

const OUTER = {
  'data-furniture-contour': 'true',
  stroke: '#241820',
  strokeWidth: 3,
  strokeLinejoin: 'round' as const,
  strokeLinecap: 'round' as const,
}

const OUTER_DARK = {
  'data-furniture-contour': 'true',
  stroke: '#1a1a1a',
  strokeWidth: 3.2,
  strokeLinejoin: 'round' as const,
  strokeLinecap: 'round' as const,
}

const SEAM = {
  fill: 'none',
  stroke: '#654246',
  strokeWidth: 1.15,
  strokeLinejoin: 'round' as const,
  strokeLinecap: 'round' as const,
}

const HIGHLIGHT = {
  fill: 'none',
  stroke: '#d8b777',
  strokeOpacity: 0.58,
  strokeWidth: 0.95,
  strokeLinejoin: 'round' as const,
  strokeLinecap: 'round' as const,
}

const SvgDefs = ({ prefix }: { prefix: string }) => (
  <defs>
    <linearGradient id={`${prefix}-wood`} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#9b6449" />
      <stop offset="0.42" stopColor="#6d4036" />
      <stop offset="1" stopColor="#38232a" />
    </linearGradient>
    <linearGradient id={`${prefix}-wood-deep`} x1="0" y1="0" x2="0.8" y2="1">
      <stop offset="0" stopColor="#704033" />
      <stop offset="0.55" stopColor="#482a2c" />
      <stop offset="1" stopColor="#2b1b25" />
    </linearGradient>
    <linearGradient id={`${prefix}-fabric`} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#9b655f" />
      <stop offset="0.5" stopColor="#6a414d" />
      <stop offset="1" stopColor="#392b3b" />
    </linearGradient>
    <linearGradient id={`${prefix}-fabric-light`} x1="0" y1="0" x2="0.9" y2="1">
      <stop offset="0" stopColor="#b77c6c" />
      <stop offset="0.58" stopColor="#82515b" />
      <stop offset="1" stopColor="#4a3449" />
    </linearGradient>
    <linearGradient id={`${prefix}-brass`} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#e2c384" />
      <stop offset="0.35" stopColor="#bd914c" />
      <stop offset="0.72" stopColor="#725333" />
      <stop offset="1" stopColor="#d5ae68" />
    </linearGradient>
    <linearGradient id={`${prefix}-metal`} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#c8c7b8" />
      <stop offset="0.4" stopColor="#78817c" />
      <stop offset="0.7" stopColor="#3e4a4c" />
      <stop offset="1" stopColor="#a9aaa0" />
    </linearGradient>
    <linearGradient id={`${prefix}-porcelain`} x1="0" y1="0" x2="0.9" y2="1">
      <stop offset="0" stopColor="#dfd8c4" />
      <stop offset="0.46" stopColor="#b8b8aa" />
      <stop offset="1" stopColor="#72807d" />
    </linearGradient>
    <linearGradient id={`${prefix}-glass`} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#b9cbbd" stopOpacity="0.83" />
      <stop offset="0.48" stopColor="#66837e" stopOpacity="0.66" />
      <stop offset="1" stopColor="#31464b" stopOpacity="0.9" />
    </linearGradient>
    <linearGradient id={`${prefix}-paper`} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#ead6a8" />
      <stop offset="1" stopColor="#b89363" />
    </linearGradient>
    <linearGradient id={`${prefix}-olive`} x1="0" y1="0" x2="0.85" y2="1">
      <stop offset="0" stopColor="#819064" />
      <stop offset="0.52" stopColor="#53644a" />
      <stop offset="1" stopColor="#304538" />
    </linearGradient>
    <radialGradient id={`${prefix}-glow`} cx="50%" cy="46%" r="52%">
      <stop offset="0" stopColor="#f3dda0" stopOpacity="0.78" />
      <stop offset="0.38" stopColor="#c99b55" stopOpacity="0.3" />
      <stop offset="1" stopColor="#7d4937" stopOpacity="0" />
    </radialGradient>
    <radialGradient id={`${prefix}-glint`} cx="35%" cy="26%" r="78%">
      <stop offset="0" stopColor="#eee2bb" />
      <stop offset="0.32" stopColor="#c4b47f" />
      <stop offset="1" stopColor="#4c493e" />
    </radialGradient>
    <filter id={`${prefix}-shadow`} x="-20%" y="-20%" width="145%" height="150%">
      <feDropShadow dx="1.8" dy="2.8" stdDeviation="1.75" floodColor="#1a1a1a" floodOpacity="0.54" />
    </filter>
  </defs>
)

function Frame({ prefix, size, children }: {
  prefix: string
  size?: number
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
      <SvgDefs prefix={prefix} />
      <g filter={`url(#${prefix}-shadow)`}>{children}</g>
    </svg>
  )
}

const SofaIcon: FurnitureIcon = ({ size }) => (
  <Frame prefix="sofa" size={size}>
    <path d="M8 34c0-14 9-23 22-23h40c13 0 22 9 22 23v48H8Z" fill="url(#sofa-fabric)" {...OUTER} />
    <path d="M18 18c10-5 54-5 64 0v22H18Z" fill="#573744" {...OUTER} />
    <path d="M18 22c16-5 48-5 64 0" {...HIGHLIGHT} />
    <path d="M8 43c-4 4-5 11-5 23v15c0 7 5 11 12 11h10V52c0-7-6-11-17-9Z" fill="#754751" {...OUTER} />
    <path d="M92 43c4 4 5 11 5 23v15c0 7-5 11-12 11H75V52c0-7 6-11 17-9Z" fill="#754751" {...OUTER} />
    <rect x="22" y="36" width="56" height="43" rx="7" fill="url(#sofa-fabric-light)" {...OUTER} />
    <path d="M50 38v38M24 67c14 4 38 4 52 0" {...SEAM} />
    <path d="M27 43c6-4 12-5 18-2M55 41c7-3 13-2 18 2" {...HIGHLIGHT} />
    <path d="M20 79h60v13c-13 5-47 5-60 0Z" fill="#603a43" {...OUTER} />
    <path d="M28 87c12 2 32 2 44 0" {...HIGHLIGHT} />
    <path d="M14 91v4M86 91v4" stroke="#1a1a1a" strokeWidth="2.4" strokeLinecap="round" />
  </Frame>
)

const ArmchairIcon: FurnitureIcon = ({ size }) => (
  <Frame prefix="chair" size={size}>
    <path d="M13 86V37c0-17 10-27 27-27h20c17 0 27 10 27 27v49H72V44c0-8-5-12-12-12H40c-7 0-12 4-12 12v42Z" fill="url(#chair-fabric)" {...OUTER} />
    <path d="M18 37c2-12 10-18 22-18h20c12 0 20 6 22 18l-4 12H22Z" fill="#543842" {...OUTER} />
    <path d="M23 45c4-7 10-10 18-10h18c8 0 14 3 18 10v32c-7 8-17 11-27 11S30 85 23 77Z" fill="url(#chair-fabric-light)" {...OUTER} />
    <path d="M26 48c8-4 40-4 48 0M27 70c12 5 34 5 46 0" {...SEAM} />
    <path d="M14 47c-6 4-8 13-8 26 0 10 5 16 14 17l10-14-3-28c-4-4-8-5-13-1ZM86 47c6 4 8 13 8 26 0 10-5 16-14 17L70 76l3-28c4-4 8-5 13-1Z" fill="#6f4651" {...OUTER} />
    <path d="M17 57c-1 8 0 15 3 21M83 57c1 8 0 15-3 21" {...HIGHLIGHT} />
    <path d="M24 86v8M76 86v8" stroke="#1a1a1a" strokeWidth="2.4" strokeLinecap="round" />
  </Frame>
)

const BedIcon: FurnitureIcon = ({ size }) => (
  <Frame prefix="bed" size={size}>
    <rect x="8" y="5" width="84" height="90" rx="6" fill="url(#bed-wood-deep)" {...OUTER_DARK} />
    <path d="M10 10c15-7 65-7 80 0v18H10Z" fill="url(#bed-wood)" {...OUTER} />
    <path d="M17 17c17-4 49-4 66 0M20 23c17-3 43-3 60 0" {...HIGHLIGHT} />
    <rect x="15" y="24" width="70" height="63" rx="4" fill="url(#bed-paper)" {...OUTER} />
    <path d="M18 29h64v19H18Z" fill="#d8c59f" stroke="#654246" strokeWidth="1.15" strokeLinejoin="round" />
    <path d="M21 28h25c3 0 5 3 5 7v9H18v-9c0-4 1-7 3-7ZM54 28h25c3 0 4 3 4 7v9H49v-9c0-4 2-7 5-7Z" fill="#e7d5ad" {...OUTER} />
    <path d="M18 49c16-6 48-6 64 0v31c-17 8-47 8-64 0Z" fill="url(#bed-fabric)" {...OUTER} />
    <path d="M50 49c-3 10-3 21 0 31M23 65c13 5 39 5 54 0" {...SEAM} />
    <path d="M18 73c16 4 48 4 64 0v9c-16 7-48 7-64 0Z" fill="#5a3845" stroke="#654246" strokeWidth="1.15" />
    <path d="M16 88h68" {...HIGHLIGHT} />
    <path d="M13 93v4M87 93v4" stroke="#1a1a1a" strokeWidth="2.4" strokeLinecap="round" />
  </Frame>
)

const TableIcon: FurnitureIcon = ({ size }) => (
  <Frame prefix="table" size={size}>
    <path d="M12 59h15v32H13c-4-9-4-22-1-32ZM73 59h15c3 10 3 23-1 32H73Z" fill="url(#table-wood-deep)" {...OUTER} />
    <path d="M16 64h8v20M76 64h8v20" {...HIGHLIGHT} />
    <path d="M8 28c16-10 68-10 84 0v37c-17 10-67 10-84 0Z" fill="url(#table-wood)" {...OUTER_DARK} />
    <path d="M14 34c18-7 54-7 72 0v24c-18 7-54 7-72 0Z" fill="#8b593f" stroke="#654246" strokeWidth="1.15" />
    <path d="M18 41c15-5 47-5 64 0M18 53c16 5 48 5 64 0" {...HIGHLIGHT} />
    <path d="M34 39h31l-4 17H38Z" fill="url(#table-paper)" {...OUTER} />
    <path d="M39 45h19M39 50h15" stroke="#7e5543" strokeWidth="1.05" strokeLinecap="round" />
    <ellipse cx="24" cy="51" rx="4" ry="3" fill="#bb944f" stroke="#654246" strokeWidth="1" />
    <ellipse cx="75" cy="45" rx="4" ry="3" fill="#6f3740" stroke="#654246" strokeWidth="1" />
  </Frame>
)

const BoxIcon: FurnitureIcon = ({ size }) => (
  <Frame prefix="box" size={size}>
    <path d="M15 42 50 25 85 42 50 60Z" fill="#302128" {...OUTER_DARK} />
    <path d="M15 42 5 20 37 7 50 25Z" fill="url(#box-paper)" {...OUTER} />
    <path d="M50 25 64 7 96 22 85 42Z" fill="#c69c5d" {...OUTER} />
    <path d="M15 42 50 60v34L15 78Z" fill="url(#box-wood)" {...OUTER} />
    <path d="M50 60 85 42v36L50 94Z" fill="url(#box-wood-deep)" {...OUTER} />
    <path d="m21 38 15-7 10 5-15 8ZM61 35l14-7 7 4-15 8Z" fill="#e0c28b" stroke="#654246" strokeWidth="1.1" />
    <path d="M44 57h12v33l-12-5Z" fill="#b7864c" stroke="#654246" strokeWidth="1.15" />
    <path d="M17 46 47 62M83 46 53 62M22 72l20 9M78 72l-20 9" {...HIGHLIGHT} />
    <path d="M23 22 34 18M67 19l12 6" {...SEAM} />
  </Frame>
)

const RugIcon: FurnitureIcon = ({ size }) => (
  <Frame prefix="rug" size={size}>
    <rect x="8" y="9" width="84" height="82" rx="4" fill="#4a2634" {...OUTER_DARK} />
    <rect x="13" y="14" width="74" height="72" rx="2" fill="#763f45" stroke="#8e5c54" strokeWidth="1.1" />
    <rect x="19" y="20" width="62" height="60" rx="2" fill="#5b3244" stroke="#c28b67" strokeWidth="1.15" />
    <path d="M50 26 72 50 50 74 28 50Z" fill="#a66a57" {...OUTER} />
    <path d="M50 33 64 50 50 67 36 50Z" fill="#41263a" stroke="#d1a06f" strokeWidth="1" />
    <path d="M24 28c7 5 9 12 7 20M76 28c-7 5-9 12-7 20M24 72c7-5 9-12 7-20M76 72c-7-5-9-12-7-20" {...HIGHLIGHT} />
    <path d="M13 7v-4M21 7v-4M29 7v-4M37 7v-4M45 7v-4M53 7v-4M61 7v-4M69 7v-4M77 7v-4M85 7v-4" stroke="#241820" strokeWidth="2" strokeLinecap="round" />
    <path d="M13 93v4M21 93v4M29 93v4M37 93v4M45 93v4M53 93v4M61 93v4M69 93v4M77 93v4M85 93v4" stroke="#241820" strokeWidth="2" strokeLinecap="round" />
  </Frame>
)

const PlantIcon: FurnitureIcon = ({ size }) => (
  <Frame prefix="plant" size={size}>
    <ellipse cx="50" cy="85" rx="29" ry="7" fill="#1f2c27" opacity="0.52" />
    <path d="M47 63c-8-18-18-28-28-33 0 16 8 28 27 39Z" fill="url(#plant-olive)" {...OUTER} />
    <path d="M49 62c-3-24-1-38 7-50 7 15 6 32-4 52Z" fill="#71805a" {...OUTER} />
    <path d="M53 64c7-21 19-32 31-38-2 18-12 32-29 42Z" fill="url(#plant-olive)" {...OUTER} />
    <path d="M45 67c-16-9-29-11-38-8 9 14 23 19 40 13Z" fill="#526542" {...OUTER} />
    <path d="M55 67c16-7 28-7 38-2-11 13-25 16-40 8Z" fill="#66754d" {...OUTER} />
    <path d="M49 63c-13-17-23-20-31-19 6 12 16 19 30 25Z" fill="#607348" {...OUTER} />
    <path d="M51 62c8-16 17-22 27-23-4 13-13 22-26 28Z" fill="#7d8a5d" {...OUTER} />
    <path d="M21 35 46 63M56 16 50 63M82 31 54 65M11 60l35 8M89 65 55 68" {...HIGHLIGHT} />
    <path d="M32 68h36l-5 25H37Z" fill="url(#plant-wood)" {...OUTER_DARK} />
    <path d="M28 65h44l-3 9H31Z" fill="#a85d43" {...OUTER} />
    <path d="M40 75 42 88M50 75v16M60 75l-2 13" {...HIGHLIGHT} />
  </Frame>
)

const ShrubIcon: FurnitureIcon = ({ size }) => (
  <Frame prefix="shrub" size={size}>
    <path d="M12 77c-4-16 4-31 19-38 4-16 19-26 34-21 14 4 22 15 23 28 10 7 14 20 9 32-14 12-68 13-85-1Z" fill="#3e573d" {...OUTER_DARK} />
    <path d="M16 62c7-14 17-21 29-23-4 13-12 22-27 29Z" fill="#60734d" {...OUTER} />
    <path d="M30 40c7-15 18-21 30-20-4 14-13 23-28 27Z" fill="#718159" {...OUTER} />
    <path d="M50 37c11-13 23-15 34-10-9 12-20 17-33 16Z" fill="#536b47" {...OUTER} />
    <path d="M57 52c14-9 26-9 35-2-12 10-24 12-36 6Z" fill="#607c52" {...OUTER} />
    <path d="M42 58c-12-6-24-5-34 2 11 9 24 11 36 5Z" fill="#4b6946" {...OUTER} />
    <path d="M31 72c7-10 17-14 28-12-7 12-17 17-29 16Z" fill="#6c7c54" {...OUTER} />
    <path d="M58 72c8-10 18-12 30-7-8 11-19 15-31 12Z" fill="#4a6040" {...OUTER} />
    <path d="M21 63 43 52M35 41l15 19M58 34l-6 25M81 31 59 55M83 53 58 62M20 75l24-8M82 74 59 67" {...HIGHLIGHT} />
    <circle cx="51" cy="58" r="3.5" fill="#b58d52" stroke="#654246" strokeWidth="1.1" />
  </Frame>
)

const LampIcon: FurnitureIcon = ({ size }) => (
  <Frame prefix="lamp" size={size}>
    <ellipse cx="49" cy="37" rx="39" ry="30" fill="url(#lamp-glow)" opacity="0.82" />
    <path d="M22 53 34 15h32l13 38Z" fill="url(#lamp-brass)" {...OUTER_DARK} />
    <ellipse cx="50" cy="53" rx="29" ry="7" fill="#9d733e" {...OUTER} />
    <ellipse cx="50" cy="51" rx="19" ry="4.5" fill="#e6c778" stroke="#654246" strokeWidth="1.15" />
    <ellipse cx="50" cy="40" rx="11" ry="10" fill="#edd897" stroke="#654246" strokeWidth="1.1" />
    <path d="M35 18h30M29 48c10 4 29 4 41 0" {...HIGHLIGHT} />
    <path d="M50 55c2 10 8 15 18 19l9 5" fill="none" stroke="#241820" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M50 55c2 10 8 15 18 19l9 5" fill="none" stroke="url(#lamp-brass)" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="50" cy="55" r="4" fill="url(#lamp-glint)" stroke="#241820" strokeWidth="1.8" />
    <circle cx="68" cy="74" r="4" fill="url(#lamp-glint)" stroke="#241820" strokeWidth="1.8" />
    <ellipse cx="80" cy="83" rx="17" ry="8" fill="url(#lamp-brass)" {...OUTER_DARK} />
    <ellipse cx="80" cy="81" rx="11" ry="4" fill="#d8b66d" stroke="#654246" strokeWidth="1.05" />
  </Frame>
)

const CounterIcon: FurnitureIcon = ({ size }) => (
  <Frame prefix="counter" size={size}>
    <path d="M7 13h86v76H7Z" fill="url(#counter-wood-deep)" {...OUTER_DARK} />
    <path d="M12 18h76v58H12Z" fill="#7b4d39" stroke="#c09362" strokeWidth="1.05" />
    <path d="M14 25h32v42H14Z" fill="#a2734a" {...OUTER} />
    <path d="M18 33h24M18 42h24M18 51h24" {...HIGHLIGHT} />
    <circle cx="29" cy="31" r="2" fill="#d8b674" /><circle cx="29" cy="40" r="2" fill="#d8b674" /><circle cx="29" cy="49" r="2" fill="#d8b674" />
    <rect x="53" y="25" width="31" height="42" rx="7" fill="url(#counter-porcelain)" {...OUTER} />
    <rect x="57" y="30" width="23" height="30" rx="5" fill="url(#counter-glass)" stroke="#654246" strokeWidth="1.15" />
    <ellipse cx="69" cy="48" rx="6" ry="4" fill="#3f605f" stroke="#d1d5c3" strokeWidth="1" />
    <path d="M65 24v-8c0-5 4-8 8-8h7" fill="none" stroke="#241820" strokeWidth="3.2" strokeLinecap="round" />
    <path d="M65 24v-8c0-5 4-8 8-8h7" fill="none" stroke="url(#counter-metal)" strokeWidth="1.6" strokeLinecap="round" />
    <circle cx="80" cy="9" r="3.4" fill="url(#counter-glint)" stroke="#241820" strokeWidth="1.5" />
    <path d="M13 75h75M17 81h67" {...HIGHLIGHT} />
  </Frame>
)

const TvIcon: FurnitureIcon = ({ size }) => (
  <Frame prefix="tv" size={size}>
    <path d="M10 14c6-7 15-10 27-10h28c12 0 21 3 25 10l4 9v44l-5 11c-5 7-13 10-24 10H36c-11 0-20-3-25-10L6 67V23Z" fill="#2b2b32" {...OUTER_DARK} />
    <rect x="14" y="16" width="72" height="46" rx="6" fill="url(#tv-glass)" {...OUTER} />
    <path d="M20 25c18-7 43-7 60 0M20 55c17 5 43 5 60 0" stroke="#c7d0bd" strokeOpacity="0.38" strokeWidth="1.15" fill="none" />
    <path d="M16 67h68v12H16Z" fill="#39363a" {...OUTER} />
    <path d="M24 72h5M34 72h5M44 72h5M54 72h5M64 72h5M74 72h5" stroke="#bcad7c" strokeWidth="1.35" strokeLinecap="round" />
    <path d="M38 79h24l6 13H32Z" fill="#40373b" {...OUTER} />
    <path d="M39 88h22" {...HIGHLIGHT} />
    <circle cx="77" cy="27" r="2.5" fill="#b99250" stroke="#654246" strokeWidth="1" />
  </Frame>
)

const BathtubIcon: FurnitureIcon = ({ size }) => (
  <Frame prefix="bathtub" size={size}>
    <path d="M7 28c0-15 12-24 27-24h32c15 0 27 9 27 24v42c0 16-11 25-26 25H33C18 95 7 86 7 70Z" fill="url(#bathtub-porcelain)" {...OUTER_DARK} />
    <path d="M15 31c0-11 8-17 19-17h32c11 0 19 6 19 17v34c0 13-9 20-21 20H36c-12 0-21-7-21-20Z" fill="url(#bathtub-glass)" {...OUTER} />
    <path d="M20 49c15-6 45-6 60 0v17c-16 8-44 8-60 0Z" fill="#70938d" opacity="0.65" stroke="#654246" strokeWidth="1.1" />
    <circle cx="31" cy="19" r="5" fill="url(#bathtub-glint)" {...OUTER} />
    <circle cx="69" cy="19" r="5" fill="url(#bathtub-glint)" {...OUTER} />
    <path d="M31 24v10M69 24v10" stroke="#3d4a4c" strokeWidth="2" strokeLinecap="round" />
    <ellipse cx="50" cy="69" rx="7" ry="5" fill="#3d5b5b" {...OUTER} />
    <circle cx="50" cy="69" r="2" fill="#d5d5c2" />
    <path d="M21 34c12-6 25-7 36-4M22 78c14 6 32 7 47 3" {...HIGHLIGHT} />
    <path d="M19 89v5M81 89v5" stroke="#241820" strokeWidth="2.4" strokeLinecap="round" />
  </Frame>
)

const BookshelfIcon: FurnitureIcon = ({ size }) => (
  <Frame prefix="bookshelf" size={size}>
    <path d="M7 7h86v87H7Z" fill="url(#bookshelf-wood-deep)" {...OUTER_DARK} />
    <rect x="14" y="14" width="72" height="73" fill="#39272a" stroke="#b77d50" strokeWidth="1.1" />
    <path d="M10 17h80M10 50h80M10 84h80" stroke="#241820" strokeWidth="4" strokeLinecap="round" />
    <path d="M12 16h76M12 49h76M12 83h76" stroke="#c7945e" strokeWidth="1.1" strokeLinecap="round" />
    <rect x="18" y="20" width="8" height="26" fill="#87463f" stroke="#241820" strokeWidth="1.1" /><rect x="27" y="19" width="7" height="27" fill="#b48a4d" stroke="#241820" strokeWidth="1.1" /><rect x="35" y="21" width="9" height="25" fill="#526956" stroke="#241820" strokeWidth="1.1" /><rect x="45" y="18" width="8" height="28" fill="#6d4656" stroke="#241820" strokeWidth="1.1" /><rect x="54" y="20" width="10" height="26" fill="#87463f" stroke="#241820" strokeWidth="1.1" /><rect x="65" y="19" width="7" height="27" fill="#b48a4d" stroke="#241820" strokeWidth="1.1" /><rect x="73" y="22" width="9" height="24" fill="#526956" stroke="#241820" strokeWidth="1.1" />
    <rect x="19" y="54" width="9" height="25" fill="#617355" stroke="#241820" strokeWidth="1.1" /><rect x="29" y="52" width="7" height="27" fill="#aa7646" stroke="#241820" strokeWidth="1.1" /><rect x="37" y="55" width="10" height="24" fill="#7d3f3c" stroke="#241820" strokeWidth="1.1" /><rect x="48" y="53" width="8" height="26" fill="#664455" stroke="#241820" strokeWidth="1.1" /><rect x="57" y="54" width="10" height="25" fill="#617355" stroke="#241820" strokeWidth="1.1" /><rect x="68" y="52" width="7" height="27" fill="#a47748" stroke="#241820" strokeWidth="1.1" /><rect x="76" y="55" width="7" height="24" fill="#7a4540" stroke="#241820" strokeWidth="1.1" />
    <path d="M18 27h8M36 29h7M55 28h8M74 30h7M19 62h8M38 64h8M58 63h8M76 65h7" stroke="#ddbf7c" strokeWidth="1.05" strokeLinecap="round" />
    <path d="M22 19v26M42 18v28M62 20v26M25 53v25M45 53v26M65 54v25" stroke="#d2a66a" strokeOpacity="0.45" strokeWidth="0.75" />
    <path d="M8 91h84" {...HIGHLIGHT} />
  </Frame>
)

const StoveIcon: FurnitureIcon = ({ size }) => (
  <Frame prefix="stove" size={size}>
    <rect x="8" y="8" width="84" height="84" rx="7" fill="url(#stove-metal)" {...OUTER_DARK} />
    <rect x="14" y="15" width="72" height="58" rx="4" fill="#333c3c" {...OUTER} />
    <circle cx="32" cy="31" r="14" fill="#283032" {...OUTER} /><circle cx="32" cy="31" r="8" fill="none" stroke="#ba9658" strokeWidth="1.6" /><circle cx="32" cy="31" r="3" fill="#7f453d" />
    <circle cx="68" cy="31" r="14" fill="#283032" {...OUTER} /><circle cx="68" cy="31" r="8" fill="none" stroke="#ba9658" strokeWidth="1.6" /><circle cx="68" cy="31" r="3" fill="#7f453d" />
    <circle cx="32" cy="57" r="14" fill="#283032" {...OUTER} /><circle cx="32" cy="57" r="8" fill="none" stroke="#ba9658" strokeWidth="1.6" /><circle cx="32" cy="57" r="3" fill="#7f453d" />
    <circle cx="68" cy="57" r="14" fill="#283032" {...OUTER} /><circle cx="68" cy="57" r="8" fill="none" stroke="#ba9658" strokeWidth="1.6" /><circle cx="68" cy="57" r="3" fill="#7f453d" />
    <path d="M16 78h68v10H16Z" fill="#484b46" {...OUTER} />
    <circle cx="32" cy="83" r="2.2" fill="#c8a76d" /><circle cx="50" cy="83" r="2.2" fill="#c8a76d" /><circle cx="68" cy="83" r="2.2" fill="#c8a76d" />
  </Frame>
)

const FridgeIcon: FurnitureIcon = ({ size }) => (
  <Frame prefix="fridge" size={size}>
    <rect x="16" y="7" width="68" height="86" rx="7" fill="url(#fridge-metal)" {...OUTER_DARK} />
    <path d="M21 13h58v25H21ZM21 42h58v45H21Z" fill="#aeb5a9" stroke="#654246" strokeWidth="1.15" />
    <path d="M23 18c12-4 31-4 52 0M23 48c12-4 31-4 52 0" {...HIGHLIGHT} />
    <path d="M20 39h60" stroke="#241820" strokeWidth="3" strokeLinecap="round" />
    <path d="M70 19v13M70 51v27" stroke="#394648" strokeWidth="3" strokeLinecap="round" />
    <path d="M70 19v13M70 51v27" stroke="#d1d0b8" strokeWidth="1.05" strokeLinecap="round" />
    <circle cx="25" cy="84" r="2.4" fill="#ab6b50" /><circle cx="75" cy="84" r="2.4" fill="#7a8d72" />
    <path d="M22 87h56" {...HIGHLIGHT} />
  </Frame>
)

const ClockIcon: FurnitureIcon = ({ size }) => (
  <Frame prefix="clock" size={size}>
    <path d="M13 28c3-11 12-17 25-19h24c13 2 22 8 25 19v41c-3 12-12 19-25 21H38c-13-2-22-9-25-21Z" fill="url(#clock-wood-deep)" {...OUTER_DARK} />
    <path d="M18 32c5-9 12-13 22-14h20c10 1 17 5 22 14v31c-5 9-12 13-22 14H40c-10-1-17-5-22-14Z" fill="#71463a" {...OUTER} />
    <circle cx="58" cy="48" r="20" fill="#2d2327" {...OUTER} />
    <circle cx="58" cy="48" r="15" fill="url(#clock-paper)" stroke="#654246" strokeWidth="1.2" />
    <path d="M58 36v4M58 56v4M46 48h4M66 48h4M49 39l3 3M67 39l-3 3M49 57l3-3M67 57l-3-3" stroke="#6d5141" strokeWidth="1.1" strokeLinecap="round" />
    <path d="M58 48V40M58 48l7 5" stroke="#3c2930" strokeWidth="2.1" strokeLinecap="round" />
    <circle cx="58" cy="48" r="2.6" fill="#934a42" />
    <path d="M25 45h14v20H25Z" fill="#34262a" {...OUTER} />
    <path d="M29 49v12M35 49v12" stroke="#c79b60" strokeWidth="1.2" />
    <path d="M22 72h11M70 72h11" stroke="#241820" strokeWidth="3" strokeLinecap="round" />
    <path d="M26 27 39 23M24 54h-7M21 51l-4 3 4 3" {...HIGHLIGHT} />
  </Frame>
)

const DeskIcon: FurnitureIcon = ({ size }) => (
  <Frame prefix="desk" size={size}>
    <path d="M8 14h84v42H8Z" fill="url(#desk-wood)" {...OUTER_DARK} />
    <path d="M13 21c22-7 50 4 74-3M13 31c22-7 51 4 74-3M13 42c22-7 51 4 74-3" {...HIGHLIGHT} />
    <path d="M14 56h17v34H14ZM69 56h17v34H69Z" fill="url(#desk-wood-deep)" {...OUTER} />
    <path d="M22 60v23M78 60v23" {...HIGHLIGHT} />
    <path d="M29 26h42v24H29Z" fill="#483942" {...OUTER} />
    <path d="M34 31h32v15H34Z" fill="#664650" stroke="#b08472" strokeWidth="1.05" />
    <path d="M38 35h21M38 40h16" stroke="#d0a082" strokeOpacity="0.65" strokeWidth="1" strokeLinecap="round" />
    <path d="m16 18 18 5-4 14-18-5Z" fill="url(#desk-paper)" {...OUTER} />
    <path d="m68 44 16 5-4 13-16-5Z" fill="#dbc8a2" {...OUTER} />
    <path d="M19 22 30 25M71 48l9 3" stroke="#765041" strokeWidth="1" strokeLinecap="round" />
    <path d="M34 79h31" stroke="#c9a363" strokeWidth="2.6" strokeLinecap="round" /><circle cx="67" cy="79" r="2.6" fill="#d5b771" />
  </Frame>
)

const ToiletIcon: FurnitureIcon = ({ size }) => (
  <Frame prefix="toilet" size={size}>
    <rect x="23" y="7" width="54" height="28" rx="7" fill="url(#toilet-porcelain)" {...OUTER_DARK} />
    <rect x="29" y="13" width="42" height="15" rx="4" fill="#b9c3b7" stroke="#654246" strokeWidth="1.05" />
    <circle cx="51" cy="21" r="3.2" fill="url(#toilet-glint)" stroke="#654246" strokeWidth="1" />
    <path d="M18 49c0-8 7-13 16-13h33c9 0 15 5 15 13v18c0 17-12 27-32 27S18 84 18 67Z" fill="url(#toilet-porcelain)" {...OUTER_DARK} />
    <ellipse cx="50" cy="62" rx="25" ry="20" fill="#b5c5ba" {...OUTER} />
    <ellipse cx="50" cy="62" rx="17" ry="13" fill="#587875" stroke="#654246" strokeWidth="1.15" />
    <ellipse cx="50" cy="60" rx="8" ry="4" fill="#cbdacd" opacity="0.82" />
    <path d="M27 47c10-7 37-7 46 0M30 79c11 8 29 9 40 0" {...HIGHLIGHT} />
    <path d="M29 90v4M71 90v4" stroke="#241820" strokeWidth="2.4" strokeLinecap="round" />
  </Frame>
)

const ShowerIcon: FurnitureIcon = ({ size }) => (
  <Frame prefix="shower" size={size}>
    <path d="M10 77h80v16H10Z" fill="url(#shower-porcelain)" {...OUTER_DARK} />
    <path d="M16 80h68v8H16Z" fill="#6e8782" stroke="#654246" strokeWidth="1.1" />
    <circle cx="50" cy="84" r="4" fill="#3e5959" {...OUTER} />
    <path d="M20 75V17c0-6 4-10 10-10h30" fill="none" stroke="#241820" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M20 75V17c0-6 4-10 10-10h30" fill="none" stroke="url(#shower-metal)" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
    <ellipse cx="63" cy="10" rx="14" ry="8" fill="url(#shower-metal)" {...OUTER_DARK} transform="rotate(14 63 10)" />
    <ellipse cx="63" cy="10" rx="8" ry="4" fill="#b7c3b8" stroke="#654246" strokeWidth="1" transform="rotate(14 63 10)" />
    <circle cx="58" cy="9" r="1.2" fill="#526364" /><circle cx="63" cy="10" r="1.2" fill="#526364" /><circle cx="68" cy="11" r="1.2" fill="#526364" />
    <path d="M55 20c-3 11-3 19-5 29M63 20c0 13-1 23-1 34M70 21c3 11 4 19 5 29M58 53c-2 8-2 14-3 20M66 56c2 7 2 12 3 17" stroke="#c3dbcc" strokeWidth="2.2" strokeLinecap="round" />
    <path d="M75 23v48M82 28v38" stroke="#d5dfcc" strokeOpacity="0.55" strokeWidth="1.2" />
    <path d="M13 75V15h74v62" fill="none" stroke="#d0d1b9" strokeOpacity="0.56" strokeWidth="1.25" strokeLinecap="round" />
    <rect x="67" y="67" width="12" height="6" rx="2" fill="#c8c1a6" stroke="#654246" strokeWidth="1" />
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
