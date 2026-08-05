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

type Material = 'tile' | 'wood' | 'darkwood' | 'grass' | 'carpet' | 'stone'

// One distinct floor per room type so adjacent rooms never blend together.
function roomMaterial(name: string): Material {
  const n = name.toLowerCase()
  if (n.includes('bath') || n.includes('kitchen') || n.includes('pantry')) return 'tile'
  if (n.includes('yard') || n.includes('garden') || n.includes('porch')) return 'grass'
  if (n.includes('bed')) return 'carpet'
  if (n.includes('study') || n.includes('office') || n.includes('library')) return 'darkwood'
  if (n.includes('hall') || n.includes('lobby') || n.includes('foyer') || n.includes('corridor')) return 'stone'
  return 'wood' // living room, dining room, default — light oak planks
}

// Board-game floors: large-scale SVG pattern tiles, every shape outlined in
// thick solid black — comic-book / Cluedo board look.
const svgTile = (w: number, h: number, body: string) =>
  `url("data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body}</svg>`
  )}")`

// Long, narrow floorboards (plank ≈ 160×25 — 6.4:1), pale oak, irregular
// seam offsets per row. Wrapped planks are drawn as two edge-clipped rects
// so no false seam appears at the tile border.
const WOOD_TILE = svgTile(320, 75,
  `<rect width="320" height="75" fill="#E0C48E"/>` +
  // row 1 — seams at 0 / 160
  `<rect x="0" y="0" width="160" height="25" fill="#E0C48E" stroke="#000" stroke-width="3"/>` +
  `<rect x="160" y="0" width="160" height="25" fill="#D6B87E" stroke="#000" stroke-width="3"/>` +
  // row 2 — seams at 96 / 256 (plank wraps the tile edge)
  `<rect x="96" y="25" width="160" height="25" fill="#DABC84" stroke="#000" stroke-width="3"/>` +
  `<rect x="256" y="25" width="170" height="25" fill="#E4C892" stroke="#000" stroke-width="3"/>` +
  `<rect x="-74" y="25" width="170" height="25" fill="#E4C892" stroke="#000" stroke-width="3"/>` +
  // row 3 — seams at 48 / 208 (plank wraps the tile edge)
  `<rect x="48" y="50" width="160" height="25" fill="#DCC088" stroke="#000" stroke-width="3"/>` +
  `<rect x="208" y="50" width="170" height="25" fill="#D2B478" stroke="#000" stroke-width="3"/>` +
  `<rect x="-62" y="50" width="110" height="25" fill="#D2B478" stroke="#000" stroke-width="3"/>`
)

// Big two-tone checkerboard, muted coral + pale blush, thick black dividers.
const CHECKER_TILE = svgTile(128, 128,
  `<rect x="0" y="0" width="64" height="64" fill="#DE8B7B" stroke="#000" stroke-width="3"/>` +
  `<rect x="64" y="0" width="64" height="64" fill="#F2D5CC" stroke="#000" stroke-width="3"/>` +
  `<rect x="0" y="64" width="64" height="64" fill="#F2D5CC" stroke="#000" stroke-width="3"/>` +
  `<rect x="64" y="64" width="64" height="64" fill="#DE8B7B" stroke="#000" stroke-width="3"/>`
)

// Sage lawn with scattered organic blade clusters — curved stroke-only paths
// in darker green, positions deliberately off-grid.
const GRASS_TILE = svgTile(80, 80,
  `<rect width="80" height="80" fill="#9CB478"/>` +
  // cluster 1 (left, mid-height)
  `<path d="M10 34 Q8 26 12 19" fill="none" stroke="#4E6E38" stroke-width="3" stroke-linecap="round"/>` +
  `<path d="M15 35 Q16 27 14 21" fill="none" stroke="#5C7C42" stroke-width="3" stroke-linecap="round"/>` +
  `<path d="M20 34 Q23 28 21 22" fill="none" stroke="#4E6E38" stroke-width="3" stroke-linecap="round"/>` +
  // cluster 2 (upper right)
  `<path d="M52 22 Q50 14 54 8" fill="none" stroke="#5C7C42" stroke-width="3" stroke-linecap="round"/>` +
  `<path d="M57 23 Q58 15 56 9" fill="none" stroke="#4E6E38" stroke-width="3" stroke-linecap="round"/>` +
  `<path d="M62 22 Q65 16 63 10" fill="none" stroke="#5C7C42" stroke-width="3" stroke-linecap="round"/>` +
  // cluster 3 (lower right, offset)
  `<path d="M44 70 Q42 62 46 55" fill="none" stroke="#4E6E38" stroke-width="3" stroke-linecap="round"/>` +
  `<path d="M49 71 Q50 63 48 57" fill="none" stroke="#5C7C42" stroke-width="3" stroke-linecap="round"/>` +
  `<path d="M54 70 Q57 64 55 58" fill="none" stroke="#4E6E38" stroke-width="3" stroke-linecap="round"/>`
)

// Lobby: off-white/yellow tiles, diamond intersections, central accent dots.
const LOBBY_TILE = svgTile(48, 48,
  `<rect width="48" height="48" fill="#F0E8C8"/>` +
  `<path d="M24 2 L46 24 L24 46 L2 24 Z" fill="none" stroke="#000" stroke-width="3"/>` +
  `<circle cx="24" cy="24" r="4" fill="#A08A50" stroke="#000" stroke-width="2"/>`
)

// Bedroom carpet: solid warm beige with a subtle scattered stipple — no planks.
const CARPET_TILE = svgTile(44, 44,
  `<rect width="44" height="44" fill="#D9C8A8"/>` +
  `<circle cx="7" cy="9" r="1.6" fill="#B5A382"/>` +
  `<circle cx="24" cy="5" r="1.6" fill="#C2B08E"/>` +
  `<circle cx="37" cy="14" r="1.6" fill="#B5A382"/>` +
  `<circle cx="14" cy="22" r="1.6" fill="#C2B08E"/>` +
  `<circle cx="31" cy="27" r="1.6" fill="#B5A382"/>` +
  `<circle cx="5" cy="33" r="1.6" fill="#C2B08E"/>` +
  `<circle cx="21" cy="39" r="1.6" fill="#B5A382"/>` +
  `<circle cx="39" cy="38" r="1.6" fill="#C2B08E"/>`
)

// Office/study: narrower, darker mahogany planks — rich contrast to light oak.
const DARKWOOD_TILE = svgTile(320, 48,
  `<rect width="320" height="48" fill="#7A4A2E"/>` +
  // row 1 — seams at 0 / 160
  `<rect x="0" y="0" width="160" height="16" fill="#7A4A2E" stroke="#000" stroke-width="3"/>` +
  `<rect x="160" y="0" width="160" height="16" fill="#6E4228" stroke="#000" stroke-width="3"/>` +
  // row 2 — seams at 104 / 264 (plank wraps the tile edge)
  `<rect x="104" y="16" width="160" height="16" fill="#82502F" stroke="#000" stroke-width="3"/>` +
  `<rect x="264" y="16" width="160" height="16" fill="#744629" stroke="#000" stroke-width="3"/>` +
  `<rect x="-56" y="16" width="160" height="16" fill="#744629" stroke="#000" stroke-width="3"/>` +
  // row 3 — seams at 56 / 216 (plank wraps the tile edge)
  `<rect x="56" y="32" width="160" height="16" fill="#6E4228" stroke="#000" stroke-width="3"/>` +
  `<rect x="216" y="32" width="160" height="16" fill="#7E4C2C" stroke="#000" stroke-width="3"/>` +
  `<rect x="-104" y="32" width="160" height="16" fill="#7E4C2C" stroke="#000" stroke-width="3"/>`
)

// backgroundSize is a percentage of the CELL, not a fixed px size, so every
// pattern keeps the same visual scale from N=4 down to N=7 (a 48px cell on a
// phone). Fixed px used to mean the 128px checker tile was larger than a 48px
// Expert cell, so kitchens rendered as one flat coral block.
//
// Scale is chosen for BOLDNESS, not density: the board-game look depends on
// each shape's 3px black stroke staying visible. Shrink a tile far below one
// cell and those strokes render sub-pixel — the pattern turns to grey noise.
// So tiles that already contain their own repeat (checker = 2×2 squares,
// planks = 3 rows) map to a FULL cell rather than a fraction of one.
function floorStyle(hue: number, material: Material): React.CSSProperties {
  if (material === 'grass') {
    return { backgroundColor: '#9CB478', backgroundImage: GRASS_TILE, backgroundSize: '100% 100%' }
  }
  if (material === 'tile') {
    // Tile already holds a 2×2 checker → one tile per cell = 2×2 bold squares.
    return { backgroundColor: '#DE8B7B', backgroundImage: CHECKER_TILE, backgroundSize: '100% 100%' }
  }
  if (material === 'stone') {
    // Single diamond per tile → 50% gives a 2×2 diamond grid per cell.
    return { backgroundColor: '#F0E8C8', backgroundImage: LOBBY_TILE, backgroundSize: '50% 50%' }
  }
  if (material === 'carpet') {
    // carpet stipple fills the cell; dots scatter naturally at any size
    return { backgroundColor: '#D9C8A8', backgroundImage: CARPET_TILE, backgroundSize: '100% 100%' }
  }
  if (material === 'darkwood') {
    // Tile is 3 plank rows, each plank half the tile wide. 200% wide × 100%
    // tall ⇒ a plank spans a full cell across 3 rows — boards, not pinstripes.
    return { backgroundColor: '#7A4A2E', backgroundImage: DARKWOOD_TILE, backgroundSize: '200% 100%' }
  }
  // wood + default → pale-oak floorboards
  void hue
  return { backgroundColor: '#E0C48E', backgroundImage: WOOD_TILE, backgroundSize: '200% 100%' }
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
    // Abbreviation: multi-word → initials (FRONT YARD → FY), single-word → first 3 chars (KITCHEN → KIT)
    const words = rm.name.trim().toUpperCase().split(/\s+/)
    const abbr = words.length > 1
      ? words.map(w => w[0]).join('')
      : words[0].slice(0, 3)
    return { name: rm.name, abbr, row: anchor.row, col: anchor.col, span }
  })

  const isPlacing = !!placingFurniture && !!onPlaceFurniture

  return (
    <div className="relative w-full max-w-[580px] mx-auto select-none" style={{ aspectRatio: '1 / 1' }}>
      {/* interactive cell grid */}
      <div
        data-grid=""
        className="w-full h-full rounded-xl overflow-hidden"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${N}, 1fr)`,
          gridTemplateRows: `repeat(${N}, 1fr)`,
          border: `6px solid ${WALL}`,
          boxShadow: `0 14px 44px rgba(0,0,0,0.52), 0 0 0 1px rgba(255,255,255,0.04)`,
          background: WALL,
          gap: '0',
        }}
      >
        {Array.from({ length: N }, (_, r) =>
          Array.from({ length: N }, (_, c) => {
            const id = roomOf[r][c]
            const hue = room(id)?.hue ?? 35
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
            const draftNames = mark.kind === 'draft'
              ? mark.persons.map(pid => personById(pid)?.name).filter(Boolean).join(', ')
              : ''
            const furnNames = furn.map(f => FURNITURE_NAME[f.type]).join(', ')
            const cellKey = `${r},${c}`
            const isHovered = hoverCell === cellKey
            const showPreview = isPlacing && isHovered && !!placingFurniture

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
                className="relative flex items-center justify-center focus:outline-none focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] transition-transform active:scale-[0.97]"
                style={{
                  // Floor colours/pattern live on the dedicated child span below so
                  // the theme dim-filter only touches the floor, not avatars/marks.
                  borderRight: wallR
                    ? `6px solid ${WALL}`
                    : isOutdoor
                      ? `1px dashed rgba(0,0,0,0.22)`
                      : `1px solid rgba(0,0,0,0.08)`,
                  borderBottom: wallB
                    ? `6px solid ${WALL}`
                    : isOutdoor
                      ? `1px dashed rgba(0,0,0,0.22)`
                      : `1px solid rgba(0,0,0,0.08)`,
                  cursor: isPlacing ? 'crosshair' : 'pointer',
                  ...(showPreview ? {
                    outline: '2px dashed rgba(255,255,255,0.65)',
                    outlineOffset: '-4px',
                  } : {}),
                }}
              >
                {/* floor layer — filtered as a unit for dark-theme dimming.
                    Rendered first so it sits behind all marks/avatars without
                    z-index fiddling.  The preview brightness lives here only
                    when placing furniture so it affects the floor, not tokens. */}
                <span
                  aria-hidden
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    ...floorStyle(hue, material),
                    filter: [
                      'brightness(var(--board-floor-brightness, 1))',
                      'saturate(var(--board-floor-saturate, 1))',
                      showPreview ? 'brightness(1.14)' : '',
                    ].filter(Boolean).join(' '),
                  }}
                />
                {/* furniture layer — SVGs fill the cell flush, outline defines the object */}
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

                {/* mark: x */}
                {mark.kind === 'x' && (
                  <span className="relative flex items-center justify-center" style={{ color: 'var(--color-text-muted)' }}>
                    <X
                      size={Math.max(16, 150 / N)}
                      strokeWidth={isAutoX ? 2.4 : 2.8}
                      style={{ opacity: isAutoX ? 0.55 : 0.85 }}
                    />
                  </span>
                )}

                {/* mark: draft */}
                {mark.kind === 'draft' && (
                  <span className="absolute inset-[8%] flex flex-wrap items-center justify-center gap-1 content-center">
                    {mark.persons.slice(0, 4).map(pid => {
                      const p = personById(pid)!
                      const sz = Math.max(18, 130 / N)
                      return (
                        <span
                          key={pid}
                          title={p.name}
                          className="flex items-center justify-center rounded-md font-display font-bold leading-none"
                          style={{
                            width: sz, height: sz,
                            fontSize: Math.max(10, sz * 0.55),
                            border: `2px dashed ${p.accent}`,
                            color: p.accent,
                            background: `color-mix(in srgb, ${p.accent} 22%, var(--color-bg-elevated))`,
                          }}
                        >{p.name[0]}</span>
                      )
                    })}
                  </span>
                )}

                {/* mark: person */}
                {person && (
                  <motion.span
                    key={person.id}
                    {...snapIn}
                    className={`relative rounded-xl ${conflicted ? 'animate-pulse' : ''}`}
                    style={{
                      boxShadow: conflicted
                        ? '0 0 0 2px var(--color-bg-elevated), 0 0 0 4px var(--color-danger), 0 0 12px var(--color-danger)'
                        : `0 0 0 2px ${person.accent}`,
                      borderRadius: 12,
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.35))',
                    }}
                  >
                    <Avatar seed={person.avatarSeed} accent={person.accent} size={tokenSize} dead={person.isVictim} />
                    {conflicted && (
                      <span
                        className="absolute -top-1.5 -left-1.5 w-4 h-4 rounded-full flex items-center justify-center font-bold text-[11px] leading-none"
                        title="Two suspects share this row or column"
                        style={{ background: 'var(--color-danger)', color: 'var(--color-on-accent)' }}
                      >!</span>
                    )}
                    {locked && !conflicted && (
                      <span
                        className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full flex items-center justify-center"
                        style={{ background: 'var(--color-accent)', color: 'var(--color-on-accent)' }}
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

      {/* label overlay — same grid tracks, anchored corner tags.
          At N≥6 (≤48px cells) the full name is too wide to fit without
          occluding playable area, so we render initials/short-code instead.
          The full name is always present via `title` (DOM attribute) and via
          a visually-hidden <span> so screen readers announce it in full. */}
      <div
        className="absolute inset-0 pointer-events-none p-[6px]"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${N}, 1fr)`,
          gridTemplateRows: `repeat(${N}, 1fr)`,
        }}
      >
        {labelAnchors.map((l, i) => {
          const compact = N >= 6
          return (
            <span
              key={i}
              title={l.name}
              // Pill sits flush against the top-left wall junction (margin: 2px)
              // so it overlaps the 6px black wall line rather than cell interior.
              className="font-sans font-black uppercase self-start justify-self-start"
              style={{
                gridColumnStart: l.col + 1,
                // Compact mode spans only 1 column — the abbreviated label fits
                // in a single cell corner without spreading into neighbours.
                gridColumnEnd: compact ? 'span 1' : `span ${l.span}`,
                gridRowStart: l.row + 1,
                color: '#fff',
                // min 9px floor; compact path doesn't need to scale up
                fontSize: compact ? '9px' : `clamp(9px, ${Math.round(110 / N)}px, 11px)`,
                background: '#000',
                boxShadow: '0 0 0 2px #fff, 0 0 0 3.5px #000',
                borderRadius: 9999,
                padding: compact ? '1px 4px' : '2px 7px',
                letterSpacing: compact ? '0.04em' : '0.11em',
                // Hug the wall corner: 2px margin so the pill rides the 6px wall
                margin: compact ? '2px' : '4px',
                maxWidth: '100%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                display: 'block',
              }}
            >
              {/* Visible text: abbreviation in compact mode, full name otherwise */}
              <span aria-hidden={compact || undefined}>{compact ? l.abbr : l.name}</span>
              {/* SR-only full name in compact mode so screen readers hear it */}
              {compact && <span className="sr-only">{l.name}</span>}
            </span>
          )
        })}
      </div>
    </div>
  )
}
