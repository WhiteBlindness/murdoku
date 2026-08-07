import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { X, Lock } from 'lucide-react'
import type { Puzzle, CellMark, Furniture, FurnitureType } from '../core/types'
import { FURNITURE_ICON, FURNITURE_NAME } from '../core/furniture'
import Avatar from './Avatar'

interface Props {
  puzzle: Puzzle
  marks: CellMark[][]
  conflicts: Set<string>
  onCellClick: (row: number, col: number) => void
  extraFurniture?: Furniture[]
  placingFurniture?: FurnitureType | null
  placingRotation?: 0 | 90 | 180 | 270
  onPlaceFurniture?: (row: number, col: number) => void
}

// ─── Illustrated floor materials — Cluedo board-game art direction ────────────
// Six distinct SVG-tile textures, one per room type. Each tile is repeated as
// a percentage of the CELL, so it scales from N=4 (large cells) to N=7 (small)
// without losing its 3px black outlines to sub-pixel blur.
// ─────────────────────────────────────────────────────────────────────────────

// 12 distinct materials — one per room type in ROOM_NAMES.
// No two materials may share a visual signature so any two rooms
// placed in the same house are distinguishable by floor alone.
type Material =
  | 'tile'      // Kitchen  — coral/blush checkerboard
  | 'bathtile'  // Bathroom — small blue/white grid
  | 'terracotta'// Pantry   — warm terracotta herringbone
  | 'wood'      // Living Room — pale oak planks
  | 'parquet'   // Dining Room — darker herringbone parquet
  | 'darkwood'  // Study    — mahogany planks
  | 'office'    // Office   — grey slate tiles
  | 'carpet'    // Bedroom  — warm beige carpet
  | 'stone'     // Hallway  — diamond lobby tiles
  | 'grass'     // Front Yard — sage lawn
  | 'garden'    // Garden   — planted/soil patches
  | 'deck'      // Porch    — grey deck planks

// One distinct floor per room type so adjacent rooms never share a material.
// Every name in ROOM_NAMES is mapped to a unique material.
function roomMaterial(name: string): Material {
  const n = name.toLowerCase()
  if (n === 'kitchen') return 'tile'
  if (n === 'bathroom') return 'bathtile'
  if (n === 'pantry') return 'terracotta'
  if (n === 'living room') return 'wood'
  if (n === 'dining room') return 'parquet'
  if (n === 'study') return 'darkwood'
  if (n === 'office') return 'office'
  if (n === 'bedroom') return 'carpet'
  if (n === 'hallway') return 'stone'
  if (n.includes('yard')) return 'grass'
  if (n === 'garden') return 'garden'
  if (n === 'porch') return 'deck'
  // fallback — living room oak
  return 'wood'
}

// Board-game floors: large-scale SVG pattern tiles, every shape outlined in
// thick solid black — comic-book / Cluedo board look.
// backgroundSize is expressed as a percentage of the CELL so the pattern
// scales correctly from N=4 (large cells) to N=7 (~48px cells on a phone)
// without the 3px strokes going sub-pixel and turning to grey mush.
const svgTile = (w: number, h: number, body: string) =>
  `url("data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body}</svg>`
  )}")`

// Kitchen — coral/blush 2×2 checkerboard. One tile = one full cell (2×2 squares).
const CHECKER_TILE = svgTile(128, 128,
  `<rect x="0" y="0" width="64" height="64" fill="#DE8B7B" stroke="#000" stroke-width="3"/>` +
  `<rect x="64" y="0" width="64" height="64" fill="#F2D5CC" stroke="#000" stroke-width="3"/>` +
  `<rect x="0" y="64" width="64" height="64" fill="#F2D5CC" stroke="#000" stroke-width="3"/>` +
  `<rect x="64" y="64" width="64" height="64" fill="#DE8B7B" stroke="#000" stroke-width="3"/>`
)

// Bathroom — small blue/white square tiles (4×4 grid per cell tile).
// At 50% backgroundSize one tile = one cell → 4×4 grid of crisp bold squares.
const BATHTILE_TILE = svgTile(64, 64,
  `<rect width="64" height="64" fill="#C8E0F0"/>` +
  `<rect x="0"  y="0"  width="30" height="30" fill="#D8EEF8" stroke="#000" stroke-width="2.5"/>` +
  `<rect x="34" y="0"  width="30" height="30" fill="#BDD8EE" stroke="#000" stroke-width="2.5"/>` +
  `<rect x="0"  y="34" width="30" height="30" fill="#BDD8EE" stroke="#000" stroke-width="2.5"/>` +
  `<rect x="34" y="34" width="30" height="30" fill="#D8EEF8" stroke="#000" stroke-width="2.5"/>`
)

// Pantry — terracotta herringbone. Each tile = 2 bricks at 45° in a 2×1 grid.
// Two bricks per tile, tile repeated at 100% = one fat herringbone pair per cell.
const TERRACOTTA_TILE = svgTile(80, 40,
  `<rect width="80" height="40" fill="#C2714A"/>` +
  `<rect x="2"  y="2"  width="36" height="16" rx="2" fill="#CC7A52" stroke="#000" stroke-width="2.5" transform="rotate(0 20 10)"/>` +
  `<rect x="42" y="2"  width="36" height="16" rx="2" fill="#BA6B44" stroke="#000" stroke-width="2.5"/>` +
  `<rect x="22" y="22" width="36" height="16" rx="2" fill="#CC7A52" stroke="#000" stroke-width="2.5"/>` +
  `<rect x="-18" y="22" width="36" height="16" rx="2" fill="#BA6B44" stroke="#000" stroke-width="2.5"/>` +
  `<rect x="62" y="22" width="36" height="16" rx="2" fill="#BA6B44" stroke="#000" stroke-width="2.5"/>`
)

// Living Room — pale oak planks. 3-row tile, seams staggered.
const WOOD_TILE = svgTile(320, 75,
  `<rect width="320" height="75" fill="#E0C48E"/>` +
  `<rect x="0"   y="0"  width="160" height="25" fill="#E0C48E" stroke="#000" stroke-width="3"/>` +
  `<rect x="160" y="0"  width="160" height="25" fill="#D6B87E" stroke="#000" stroke-width="3"/>` +
  `<rect x="96"  y="25" width="160" height="25" fill="#DABC84" stroke="#000" stroke-width="3"/>` +
  `<rect x="256" y="25" width="170" height="25" fill="#E4C892" stroke="#000" stroke-width="3"/>` +
  `<rect x="-74" y="25" width="170" height="25" fill="#E4C892" stroke="#000" stroke-width="3"/>` +
  `<rect x="48"  y="50" width="160" height="25" fill="#DCC088" stroke="#000" stroke-width="3"/>` +
  `<rect x="208" y="50" width="170" height="25" fill="#D2B478" stroke="#000" stroke-width="3"/>` +
  `<rect x="-62" y="50" width="110" height="25" fill="#D2B478" stroke="#000" stroke-width="3"/>`
)

// Dining Room — darker herringbone parquet (warm amber, diagonal bricks).
// Tile is 80×80; at 100% per cell the two-brick herringbone is bold and clear.
const PARQUET_TILE = svgTile(80, 80,
  `<rect width="80" height="80" fill="#A8762A"/>` +
  // top-left brick (NW→SE diagonal)
  `<rect x="2" y="2" width="36" height="16" rx="2" fill="#B8843A" stroke="#000" stroke-width="2.5" transform="rotate(45 20 10)"/>` +
  // top-right brick (NE→SW diagonal)
  `<rect x="42" y="2" width="36" height="16" rx="2" fill="#9C6A22" stroke="#000" stroke-width="2.5" transform="rotate(-45 60 10)"/>` +
  // bottom-left brick
  `<rect x="2" y="42" width="36" height="16" rx="2" fill="#9C6A22" stroke="#000" stroke-width="2.5" transform="rotate(-45 20 50)"/>` +
  // bottom-right brick
  `<rect x="42" y="42" width="36" height="16" rx="2" fill="#B8843A" stroke="#000" stroke-width="2.5" transform="rotate(45 60 50)"/>`
)

// Study — mahogany planks. 3 narrow rows, rich dark fill.
const DARKWOOD_TILE = svgTile(320, 48,
  `<rect width="320" height="48" fill="#7A4A2E"/>` +
  `<rect x="0"    y="0"  width="160" height="16" fill="#7A4A2E" stroke="#000" stroke-width="3"/>` +
  `<rect x="160"  y="0"  width="160" height="16" fill="#6E4228" stroke="#000" stroke-width="3"/>` +
  `<rect x="104"  y="16" width="160" height="16" fill="#82502F" stroke="#000" stroke-width="3"/>` +
  `<rect x="264"  y="16" width="160" height="16" fill="#744629" stroke="#000" stroke-width="3"/>` +
  `<rect x="-56"  y="16" width="160" height="16" fill="#744629" stroke="#000" stroke-width="3"/>` +
  `<rect x="56"   y="32" width="160" height="16" fill="#6E4228" stroke="#000" stroke-width="3"/>` +
  `<rect x="216"  y="32" width="160" height="16" fill="#7E4C2C" stroke="#000" stroke-width="3"/>` +
  `<rect x="-104" y="32" width="160" height="16" fill="#7E4C2C" stroke="#000" stroke-width="3"/>`
)

// Office — cool grey slate squares. 2×2 grid per cell, blue-grey, distinct from mahogany.
// At 50% backgroundSize one tile gives a 2×2 grid per cell.
const OFFICE_TILE = svgTile(64, 64,
  `<rect width="64" height="64" fill="#8A96A0"/>` +
  `<rect x="0"  y="0"  width="30" height="30" fill="#96A2AE" stroke="#000" stroke-width="2.5"/>` +
  `<rect x="34" y="0"  width="30" height="30" fill="#808C96" stroke="#000" stroke-width="2.5"/>` +
  `<rect x="0"  y="34" width="30" height="30" fill="#808C96" stroke="#000" stroke-width="2.5"/>` +
  `<rect x="34" y="34" width="30" height="30" fill="#96A2AE" stroke="#000" stroke-width="2.5"/>`
)

// Bedroom — warm beige carpet with scattered stipple dots.
const CARPET_TILE = svgTile(44, 44,
  `<rect width="44" height="44" fill="#D9C8A8"/>` +
  `<circle cx="7"  cy="9"  r="1.6" fill="#B5A382"/>` +
  `<circle cx="24" cy="5"  r="1.6" fill="#C2B08E"/>` +
  `<circle cx="37" cy="14" r="1.6" fill="#B5A382"/>` +
  `<circle cx="14" cy="22" r="1.6" fill="#C2B08E"/>` +
  `<circle cx="31" cy="27" r="1.6" fill="#B5A382"/>` +
  `<circle cx="5"  cy="33" r="1.6" fill="#C2B08E"/>` +
  `<circle cx="21" cy="39" r="1.6" fill="#B5A382"/>` +
  `<circle cx="39" cy="38" r="1.6" fill="#C2B08E"/>`
)

// Hallway — cream diamond / lobby tiles.
// At 50% backgroundSize one tile gives a 2×2 diamond grid per cell.
const LOBBY_TILE = svgTile(48, 48,
  `<rect width="48" height="48" fill="#F0E8C8"/>` +
  `<path d="M24 2 L46 24 L24 46 L2 24 Z" fill="none" stroke="#000" stroke-width="3"/>` +
  `<circle cx="24" cy="24" r="4" fill="#A08A50" stroke="#000" stroke-width="2"/>`
)

// Front Yard — sage lawn with grass blade clusters.
const GRASS_TILE = svgTile(80, 80,
  `<rect width="80" height="80" fill="#9CB478"/>` +
  `<path d="M10 34 Q8 26 12 19"  fill="none" stroke="#4E6E38" stroke-width="3" stroke-linecap="round"/>` +
  `<path d="M15 35 Q16 27 14 21" fill="none" stroke="#5C7C42" stroke-width="3" stroke-linecap="round"/>` +
  `<path d="M20 34 Q23 28 21 22" fill="none" stroke="#4E6E38" stroke-width="3" stroke-linecap="round"/>` +
  `<path d="M52 22 Q50 14 54 8"  fill="none" stroke="#5C7C42" stroke-width="3" stroke-linecap="round"/>` +
  `<path d="M57 23 Q58 15 56 9"  fill="none" stroke="#4E6E38" stroke-width="3" stroke-linecap="round"/>` +
  `<path d="M62 22 Q65 16 63 10" fill="none" stroke="#5C7C42" stroke-width="3" stroke-linecap="round"/>` +
  `<path d="M44 70 Q42 62 46 55" fill="none" stroke="#4E6E38" stroke-width="3" stroke-linecap="round"/>` +
  `<path d="M49 71 Q50 63 48 57" fill="none" stroke="#5C7C42" stroke-width="3" stroke-linecap="round"/>` +
  `<path d="M54 70 Q57 64 55 58" fill="none" stroke="#4E6E38" stroke-width="3" stroke-linecap="round"/>`
)

// Garden — darker olive green with soil patches (filled brown circles).
// Visually distinct from sage Front Yard: darker base, earth patches vs. blades.
const GARDEN_TILE = svgTile(80, 80,
  `<rect width="80" height="80" fill="#5C7840"/>` +
  // soil patch top-left
  `<ellipse cx="18" cy="20" rx="10" ry="7" fill="#6B4828" stroke="#000" stroke-width="2.5"/>` +
  // soil patch bottom-right
  `<ellipse cx="60" cy="58" rx="12" ry="8" fill="#7A5230" stroke="#000" stroke-width="2.5"/>` +
  // small soil patch mid
  `<ellipse cx="44" cy="34" rx="7" ry="5" fill="#6B4828" stroke="#000" stroke-width="2"/>` +
  // grass tufts
  `<path d="M32 60 Q30 52 34 46" fill="none" stroke="#3A5428" stroke-width="3" stroke-linecap="round"/>` +
  `<path d="M37 61 Q38 53 36 48" fill="none" stroke="#4A6434" stroke-width="3" stroke-linecap="round"/>` +
  `<path d="M6 44 Q4 36 8 30"   fill="none" stroke="#3A5428" stroke-width="3" stroke-linecap="round"/>` +
  `<path d="M66 14 Q64 6 68 0"  fill="none" stroke="#4A6434" stroke-width="3" stroke-linecap="round"/>`
)

// Porch — grey weathered deck planks, cooler than oak.
// 3-row tile at 200% wide × 100% tall = full-cell planks, not pinstripes.
const DECK_TILE = svgTile(320, 75,
  `<rect width="320" height="75" fill="#9EA89A"/>` +
  `<rect x="0"   y="0"  width="160" height="25" fill="#A4AEA0" stroke="#000" stroke-width="3"/>` +
  `<rect x="160" y="0"  width="160" height="25" fill="#98A294" stroke="#000" stroke-width="3"/>` +
  `<rect x="80"  y="25" width="160" height="25" fill="#9CA6A2" stroke="#000" stroke-width="3"/>` +
  `<rect x="240" y="25" width="160" height="25" fill="#A2AC9E" stroke="#000" stroke-width="3"/>` +
  `<rect x="-80" y="25" width="160" height="25" fill="#A2AC9E" stroke="#000" stroke-width="3"/>` +
  `<rect x="40"  y="50" width="160" height="25" fill="#98A296" stroke="#000" stroke-width="3"/>` +
  `<rect x="200" y="50" width="160" height="25" fill="#A0AA9C" stroke="#000" stroke-width="3"/>` +
  `<rect x="-120" y="50" width="160" height="25" fill="#A0AA9C" stroke="#000" stroke-width="3"/>`
)

// backgroundSize as % of cell — see header comment.
// Each tile's internal repeat count determines the divisor:
//   - 2×2 repeat tiles (checker, bathtile, office) → 100% = one full tile per cell (crisp 2×2)
//   - plank tiles (3 rows) → 200% wide × 100% tall = full-width planks per cell
//   - diamond lobby → 50% = 2×2 diamond grid per cell
//   - single-cell tiles (grass, garden, carpet, terracotta, parquet) → 100%
function floorStyle(material: Material): React.CSSProperties {
  switch (material) {
    case 'tile':
      return { backgroundColor: '#DE8B7B', backgroundImage: CHECKER_TILE, backgroundSize: '100% 100%' }
    case 'bathtile':
      return { backgroundColor: '#C8E0F0', backgroundImage: BATHTILE_TILE, backgroundSize: '100% 100%' }
    case 'terracotta':
      return { backgroundColor: '#C2714A', backgroundImage: TERRACOTTA_TILE, backgroundSize: '100% 100%' }
    case 'wood':
      return { backgroundColor: '#E0C48E', backgroundImage: WOOD_TILE, backgroundSize: '200% 100%' }
    case 'parquet':
      return { backgroundColor: '#A8762A', backgroundImage: PARQUET_TILE, backgroundSize: '100% 100%' }
    case 'darkwood':
      return { backgroundColor: '#7A4A2E', backgroundImage: DARKWOOD_TILE, backgroundSize: '200% 100%' }
    case 'office':
      return { backgroundColor: '#8A96A0', backgroundImage: OFFICE_TILE, backgroundSize: '100% 100%' }
    case 'carpet':
      return { backgroundColor: '#D9C8A8', backgroundImage: CARPET_TILE, backgroundSize: '100% 100%' }
    case 'stone':
      return { backgroundColor: '#F0E8C8', backgroundImage: LOBBY_TILE, backgroundSize: '50% 50%' }
    case 'grass':
      return { backgroundColor: '#9CB478', backgroundImage: GRASS_TILE, backgroundSize: '100% 100%' }
    case 'garden':
      return { backgroundColor: '#5C7840', backgroundImage: GARDEN_TILE, backgroundSize: '100% 100%' }
    case 'deck':
      return { backgroundColor: '#9EA89A', backgroundImage: DECK_TILE, backgroundSize: '200% 100%' }
  }
}

// Dark/saturated floors where X-marks and draft chips need LIGHT styling.
// All others get DARK styling (dark ink reads on light floors).
// Includes: mahogany study, both green outdoor floors, grey office slate.
function isDarkFloor(material: Material): boolean {
  return material === 'darkwood' || material === 'grass' || material === 'garden' || material === 'office'
}

function handleCellKey(e: React.KeyboardEvent, r: number, c: number, N: number) {
  const dirs: Record<string, [number, number]> = {
    ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1],
  }
  const d = dirs[e.key]
  if (!d) return
  e.preventDefault()
  const nr = Math.max(0, Math.min(N - 1, r + d[0]))
  const nc = Math.max(0, Math.min(N - 1, c + d[1]))
  if (nr === r && nc === c) return
  const grid = (e.currentTarget as HTMLElement).closest('[data-grid]')
  ;(grid?.querySelector(`[data-cell="${nr}-${nc}"]`) as HTMLElement)?.focus()
}

const WALL = '#000000'

export default function MapGrid({
  puzzle, marks, conflicts, onCellClick,
  extraFurniture = [], placingFurniture, placingRotation = 0, onPlaceFurniture,
}: Props) {
  const N = puzzle.size
  const roomOf = puzzle.roomOf
  const room = (id: string) => puzzle.rooms.find(r => r.id === id)
  const personById = (id: string) => puzzle.people.find(p => p.id === id)
  const [hoverCell, setHoverCell] = useState<string | null>(null)
  const reduceMotion = useReducedMotion()

  // Placing a suspect is a committing, physical action, so the token lands with
  // a little overshoot (bounce) rather than a flat fade. The global
  // prefers-reduced-motion CSS only covers CSS animations, never Framer's
  // JS-driven springs — so opt out here explicitly.
  const snapIn = reduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.15 } }
    : {
        initial: { scale: 0.55, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        transition: { type: 'spring' as const, bounce: 0.35, duration: 0.42 },
      }

  const allFurniture: Furniture[] = [...puzzle.furniture, ...extraFurniture]
  const furnByCell: Record<string, Furniture[]> = {}
  for (const f of allFurniture) (furnByCell[`${f.row},${f.col}`] ||= []).push(f)
  const furnitureCells = new Set(allFurniture.map(f => `${f.row},${f.col}`))

  const labelAnchors = puzzle.rooms.map(rm => {
    const sorted = [...rm.cells].sort((a, b) => a.row - b.row || a.col - b.col)
    const anchor = sorted.find(c => !furnitureCells.has(`${c.row},${c.col}`)) ?? sorted[0]
    let span = 1
    while (span < N
      && rm.cells.some(c => c.row === anchor.row && c.col === anchor.col + span)
      && !furnitureCells.has(`${anchor.row},${anchor.col + span}`)) span++
    // Abbreviation ladder (used only as a last resort):
    //   multi-word → initials (FRONT YARD → FY), single-word → first 3 chars (KITCHEN → KIT)
    // Prefer wrapping or font-shrink over initials — see label render below.
    const words = rm.name.trim().toUpperCase().split(/\s+/)
    const abbr = words.length > 1
      ? words.map(w => w[0]).join('')
      : words[0].slice(0, 3)
    return { name: rm.name, abbr, row: anchor.row, col: anchor.col, span }
  })

  const isPlacing = !!placingFurniture && !!onPlaceFurniture

  return (
    /*
      The board fills whatever box the layout gives it. The old
      `max-w-[580px] mx-auto` pinned it to 580px on any monitor.
      `aspect-ratio: 1/1` STAYS: this is an N×N grid of square cells.
      Sizing is the parent's job (GameScreen's centre column).
    */
    <div className="relative w-full h-full select-none" style={{ aspectRatio: '1 / 1' }}>
      {/* interactive cell grid */}
      <div
        data-grid=""
        className="w-full h-full rounded-xl overflow-hidden"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${N}, 1fr)`,
          gridTemplateRows: `repeat(${N}, 1fr)`,
          // Bold black board-game frame — physical object sitting on the desk.
          border: `6px solid ${WALL}`,
          // Directional shadow: lifts the board off the dark desk like a physical object.
          boxShadow: `
            0 20px 60px rgba(0,0,0,0.70),
            0 8px 24px rgba(0,0,0,0.50),
            0 2px 0 0 rgba(255,255,255,0.06),
            inset 0 0 0 2px rgba(255,255,255,0.08)
          `,
          background: WALL,
          gap: '0',
        }}
      >
        {Array.from({ length: N }, (_, r) =>
          Array.from({ length: N }, (_, c) => {
            const id = roomOf[r][c]
            const mark = marks[r][c]
            const furn = furnByCell[`${r},${c}`] ?? []
            const wallR = c < N - 1 && roomOf[r][c + 1] !== id
            const wallB = r < N - 1 && roomOf[r + 1][c] !== id
            const person = mark.kind === 'person' ? personById(mark.person) : null
            const conflicted = person ? conflicts.has(person.id) : false
            const locked = mark.kind === 'person' && mark.locked
            const isAutoX = mark.kind === 'x' && mark.auto
            const tokenSize = Math.max(26, 340 / N)
            const material = roomMaterial(room(id)?.name ?? '')
            const isOutdoor = material === 'grass'
            const darkFloor = isDarkFloor(material)
            const draftNames = mark.kind === 'draft'
              ? mark.persons.map(pid => personById(pid)?.name).filter(Boolean).join(', ')
              : ''
            const furnNames = furn.map(f => FURNITURE_NAME[f.type]).join(', ')
            const cellKey = `${r},${c}`
            const isHovered = hoverCell === cellKey
            const showPreview = isPlacing && isHovered && !!placingFurniture

            // X mark colour: dark on light floors, white on dark floors.
            // Plus a contrasting text-shadow so neither extreme washes it out.
            const xColor = darkFloor ? '#FFFFFF' : '#1A1008'
            const xShadow = darkFloor
              ? '0 0 3px rgba(0,0,0,0.9), 0 1px 4px rgba(0,0,0,0.7)'
              : '0 0 3px rgba(255,255,255,0.9), 0 1px 3px rgba(255,255,255,0.6)'

            return (
              <button
                key={cellKey}
                data-cell={`${r}-${c}`}
                onClick={() => isPlacing ? onPlaceFurniture!(r, c) : onCellClick(r, c)}
                onMouseEnter={() => isPlacing && setHoverCell(cellKey)}
                onMouseLeave={() => isPlacing && setHoverCell(null)}
                onKeyDown={(e) => handleCellKey(e, r, c, N)}
                title={draftNames ? `Maybe: ${draftNames}` : furnNames || undefined}
                aria-label={`Row ${r + 1}, column ${c + 1}${person ? `, ${person.name}` : draftNames ? `, drafts: ${draftNames}` : furnNames ? `, ${furnNames}` : ''}`}
                /* Focus ring: SOLID var(--color-accent-strong), never --board-glow.
                   The glow variant is 50% alpha and composites to ~1.8:1 on light
                   floors — fails WCAG 2.4.11. This is the only focus indicator. */
                className="relative flex items-center justify-center focus:outline-none focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-[var(--color-accent-strong)] transition-transform active:scale-[0.97]"
                style={{
                  // Floor pattern lives on a dedicated child span so marks/tokens
                  // are unaffected by any filter applied to the floor layer.
                  borderRight: wallR
                    ? `6px solid ${WALL}`
                    : isOutdoor
                      ? `1px dashed rgba(0,0,0,0.22)`
                      : `1px solid rgba(0,0,0,0.10)`,
                  borderBottom: wallB
                    ? `6px solid ${WALL}`
                    : isOutdoor
                      ? `1px dashed rgba(0,0,0,0.22)`
                      : `1px solid rgba(0,0,0,0.10)`,
                  cursor: isPlacing ? 'crosshair' : 'pointer',
                  ...(showPreview ? {
                    outline: '2px dashed rgba(255,255,255,0.65)',
                    outlineOffset: '-4px',
                  } : {}),
                }}
              >
                {/* floor layer — SVG material tile, behind all marks and avatars.
                    Rendered first so it sits behind everything without z-index tricks.
                    The preview brightness boost only touches the floor, not tokens. */}
                <span
                  aria-hidden
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    ...floorStyle(material),
                    filter: [
                      'brightness(var(--board-floor-brightness, 1))',
                      'saturate(var(--board-floor-saturate, 1))',
                      showPreview ? 'brightness(1.12)' : '',
                    ].filter(Boolean).join(' '),
                  }}
                />

                {/* furniture layer — illustrated SVGs fill the cell flush.
                    Full opacity so furniture.tsx's 92 colour fills show clearly. */}
                {furn.length > 0 && !person && (
                  <span
                    className="absolute inset-0 flex items-stretch"
                    style={{ opacity: mark.kind === 'x' ? 0.18 : 1 }}
                  >
                    {furn.slice(0, 2).map((f, i) => {
                      const Icon = FURNITURE_ICON[f.type]
                      const rot = f.rotation ?? 0
                      return (
                        <span
                          key={i}
                          className="flex-1 min-w-0"
                          style={{ transform: rot ? `rotate(${rot}deg)` : undefined }}
                        >
                          <Icon />
                        </span>
                      )
                    })}
                  </span>
                )}

                {/* placement ghost preview */}
                {showPreview && (() => {
                  const Icon = FURNITURE_ICON[placingFurniture!]
                  return (
                    <span
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        transform: placingRotation ? `rotate(${placingRotation}deg)` : undefined,
                        opacity: 0.65,
                      }}
                    >
                      <Icon />
                    </span>
                  )
                })()}

                {/* mark: x — reads on both light and dark floors via dual-tone treatment */}
                {mark.kind === 'x' && (
                  <span
                    className="relative flex items-center justify-center"
                    style={{ color: xColor, filter: `drop-shadow(${xShadow})` }}
                  >
                    <X
                      size={Math.max(16, 150 / N)}
                      strokeWidth={isAutoX ? 2.0 : 2.5}
                      style={{ opacity: isAutoX ? 0.55 : 0.88 }}
                    />
                  </span>
                )}

                {/* mark: draft — dossier initial chips with opaque plates */}
                {mark.kind === 'draft' && (
                  <span className="absolute inset-[8%] flex flex-wrap items-center justify-center gap-1 content-center">
                    {mark.persons.slice(0, 4).map(pid => {
                      const p = personById(pid)!
                      const sz = Math.max(18, 130 / N)
                      return (
                        <span
                          key={pid}
                          title={p.name}
                          className="flex items-center justify-center font-display font-bold leading-none"
                          style={{
                            width: sz, height: sz,
                            fontSize: Math.max(10, sz * 0.55),
                            borderRadius: 2,
                            border: `1.5px solid ${p.accent}`,
                            color: p.accent,
                            // Opaque cream plate so chips are legible on any floor
                            background: '#F5EED8',
                            boxShadow: '0 1px 4px rgba(0,0,0,0.35)',
                          }}
                        >{p.name[0]}</span>
                      )
                    })}
                  </span>
                )}

                {/* mark: person — suspect token with accent or danger ring */}
                {person && (
                  <motion.span
                    key={person.id}
                    {...snapIn}
                    className={`relative ${conflicted ? 'animate-pulse' : ''}`}
                    style={{
                      boxShadow: conflicted
                        ? '0 0 0 2px #fff, 0 0 0 4px var(--color-danger), 0 0 10px var(--color-danger)'
                        : `0 0 0 2px ${person.accent}, 0 0 0 3px rgba(0,0,0,0.5)`,
                      borderRadius: 6,
                      // Two-layer drop-shadow so token reads on light AND dark floors
                      filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.7)) drop-shadow(0 0 2px rgba(0,0,0,0.5))',
                    }}
                  >
                    <Avatar seed={person.avatarSeed} accent={person.accent} size={tokenSize} dead={person.isVictim} />
                    {conflicted && (
                      <span
                        className="absolute -top-1.5 -left-1.5 w-4 h-4 flex items-center justify-center font-bold text-[11px] leading-none"
                        title="Two suspects share this row or column"
                        style={{
                          background: 'var(--color-danger)',
                          color: '#fff',
                          borderRadius: 2,
                          // White halo so the badge reads on the mahogany floor too
                          boxShadow: '0 0 0 1.5px #fff',
                        }}
                      >!</span>
                    )}
                    {locked && !conflicted && (
                      <span
                        className="absolute -top-1.5 -right-1.5 w-4 h-4 flex items-center justify-center"
                        style={{
                          background: 'var(--color-accent)',
                          color: 'var(--color-on-accent)',
                          borderRadius: 2,
                          // Same halo treatment for lock badge
                          boxShadow: '0 0 0 1.5px rgba(0,0,0,0.6)',
                        }}
                      >
                        <Lock size={9} strokeWidth={3} />
                      </span>
                    )}
                  </motion.span>
                )}
              </button>
            )
          })
        )}
      </div>

      {/* label overlay — same grid tracks, anchored corner stamps.
          At N≥6 (≤48px cells) the full name is too wide to fit without
          occluding playable area, so we render initials/short-code instead.
          The full name is always present via `title` (DOM attribute) and via
          a visually-hidden <span> so screen readers announce it in full.

          Design: Cluedo-style room labels — black plate, white text, bold.
          Hugs the top-left corner of the anchor cell over the black wall line. */}
      <div
        className="absolute inset-0 pointer-events-none p-[2px]"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${N}, 1fr)`,
          gridTemplateRows: `repeat(${N}, 1fr)`,
        }}
      >
        {labelAnchors.map((l, i) => {
          // Label strategy — ranked by readability, initials only as true last resort:
          //
          //   1. FULL NAME, wrapping to 2 lines. Always tried first for multi-word
          //      names. Even a 1-cell-wide room has ~80–160px width and can show
          //      "LIVING / ROOM" across two lines at 9px.
          //
          //   2. FULL NAME single-line with ellipsis for short single-word names
          //      that fit without wrapping.
          //
          //   3. INITIALS — only when the name is a single word longer than 6 chars
          //      AND the cell span is 1. (e.g. hypothetical "Conservatory" span=1).
          //      Visible abbr is aria-hidden; full name in title + sr-only span.
          //
          // "Living Room" span=1 → multi-word → strategy 1: wraps to 2 lines ✓
          // "Bathroom"    span=2 → single word, short → strategy 2 ✓
          // "Pantry"      span=1 → single word, ≤6 chars → strategy 2 ✓

          const words = l.name.trim().split(/\s+/)
          const isMultiWord = words.length > 1
          // Only fall to initials for genuinely unbreakable single-word long names
          const useInitials = !isMultiWord && l.span < 2 && l.name.length > 6
          // Wrap multi-word names regardless of span
          const wrapLabel = isMultiWord && !useInitials

          return (
            <span
              key={i}
              title={l.name}
              className="font-mono uppercase self-start justify-self-start"
              style={{
                gridColumnStart: l.col + 1,
                // Initials fit in 1 col; wrapping names span their room width.
                gridColumnEnd: useInitials ? 'span 1' : `span ${l.span}`,
                gridRowStart: l.row + 1,
                color: '#FFFFFF',
                // Font: 9px floor always. Scale up to 11px at N≤5, shrink at N=7.
                fontSize: useInitials ? '9px' : `clamp(9px, ${Math.round(110 / N)}px, 11px)`,
                background: 'rgba(0,0,0,0.82)',
                borderRadius: 2,
                padding: useInitials ? '1px 3px' : '2px 6px',
                letterSpacing: useInitials ? '0.06em' : '0.12em',
                margin: useInitials ? '2px' : '4px',
                // Allow wrapping for multi-word names with ≥2 span; clamp single-line otherwise.
                whiteSpace: wrapLabel ? 'normal' : 'nowrap',
                wordBreak: wrapLabel ? 'normal' : undefined,
                maxWidth: '100%',
                overflow: 'hidden',
                // textOverflow only applies when nowrap
                textOverflow: wrapLabel ? undefined : 'ellipsis',
                display: 'block',
                fontWeight: 700,
                // Prevent the label growing beyond 2 lines even if name is very long.
                WebkitLineClamp: wrapLabel ? 2 : undefined,
                WebkitBoxOrient: wrapLabel ? 'vertical' as const : undefined,
              }}
            >
              {/* Visible text: initials when compact, full name otherwise */}
              <span aria-hidden={useInitials || undefined}>{useInitials ? l.abbr : l.name}</span>
              {/* SR-only full name when visible text is abbreviated */}
              {useInitials && <span className="sr-only">{l.name}</span>}
            </span>
          )
        })}
      </div>
    </div>
  )
}
