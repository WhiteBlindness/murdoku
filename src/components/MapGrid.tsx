import { useState } from 'react'
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

type Material = 'tile' | 'wood' | 'grass' | 'carpet' | 'stone'

function roomMaterial(name: string): Material {
  const n = name.toLowerCase()
  if (n.includes('bath') || n.includes('kitchen') || n.includes('pantry')) return 'tile'
  if (n.includes('yard') || n.includes('garden') || n.includes('porch')) return 'grass'
  if (n.includes('bed') || n.includes('living') || n.includes('dining')) return 'carpet'
  if (n.includes('hall')) return 'stone'
  return 'wood'
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

function floorStyle(hue: number, material: Material): React.CSSProperties {
  if (material === 'grass') {
    return { backgroundColor: '#9CB478', backgroundImage: GRASS_TILE, backgroundSize: '80px 80px' }
  }
  if (material === 'tile') {
    return { backgroundColor: '#DE8B7B', backgroundImage: CHECKER_TILE, backgroundSize: '128px 128px' }
  }
  if (material === 'stone') {
    return { backgroundColor: '#F0E8C8', backgroundImage: LOBBY_TILE, backgroundSize: '48px 48px' }
  }
  // carpet + wood + default → pale-oak floorboards
  void hue
  return { backgroundColor: '#E0C48E', backgroundImage: WOOD_TILE, backgroundSize: '320px 75px' }
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
    return { name: rm.name, row: anchor.row, col: anchor.col, span }
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
          border: `3px solid ${WALL}`,
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
                  ...floorStyle(hue, material),
                  borderRight: wallR
                    ? `3px solid ${WALL}`
                    : isOutdoor
                      ? `1px dashed rgba(0,0,0,0.22)`
                      : `1px solid rgba(0,0,0,0.08)`,
                  borderBottom: wallB
                    ? `3px solid ${WALL}`
                    : isOutdoor
                      ? `1px dashed rgba(0,0,0,0.22)`
                      : `1px solid rgba(0,0,0,0.08)`,
                  cursor: isPlacing ? 'crosshair' : 'pointer',
                  ...(showPreview ? {
                    filter: 'brightness(1.14)',
                    outline: '2px dashed rgba(255,255,255,0.65)',
                    outlineOffset: '-4px',
                  } : {}),
                }}
              >
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
                  <span
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
                  </span>
                )}
              </button>
            )
          })
        )}
      </div>

      {/* label overlay — same grid tracks, anchored corner tags */}
      <div
        className="absolute inset-0 pointer-events-none p-[3px]"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${N}, 1fr)`,
          gridTemplateRows: `repeat(${N}, 1fr)`,
        }}
      >
        {labelAnchors.map((l, i) => (
          <span
            key={i}
            className="font-sans font-black uppercase whitespace-nowrap self-start justify-self-start"
            style={{
              gridColumnStart: l.col + 1,
              gridColumnEnd: `span ${l.span}`,
              gridRowStart: l.row + 1,
              color: '#fff',
              fontSize: `clamp(7px, ${Math.round(110 / N)}px, 11px)`,
              background: '#000',
              boxShadow: '0 0 0 2px #fff, 0 0 0 3.5px #000',
              borderRadius: 9999,
              padding: '2px 7px',
              letterSpacing: '0.11em',
              margin: '4px',
            }}
          >
            {l.name}
          </span>
        ))}
      </div>
    </div>
  )
}
