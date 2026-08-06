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

// ─── Deleted: Cluedo art direction ───────────────────────────────────────────
// Removed: WOOD_TILE, CHECKER_TILE, GRASS_TILE, LOBBY_TILE, CARPET_TILE,
// DARKWOOD_TILE — six SVG data-URI floor tiles with 1950s fills and thick
// black outlines. Removed: svgTile() helper, floorStyle() image approach,
// Material type, roomMaterial() mapping. Rooms no longer use painted textures.
// ─────────────────────────────────────────────────────────────────────────────

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

export default function MapGrid({
  puzzle, marks, conflicts, onCellClick,
  extraFurniture = [], placingFurniture, placingRotation = 0, onPlaceFurniture,
}: Props) {
  const N = puzzle.size
  const roomOf = puzzle.roomOf
  // (the old `room()` lookup existed only to read a room's `hue` for the
  // painted-floor materials — the blueprint derives room tint from index
  // parity instead, so the lookup is dead)
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

  // Each room TYPE owns a tone, so a Pantry never looks like a Study. The
  // previous A/B parity alternation gave every room one of two near-identical
  // darks and the whole board read as a single slab — you could not tell which
  // room you were looking at, which the clues ("In the Pantry") require.
  // Tones differ in hue rather than brightness, so the noir mood survives.
  const roomTone = (name: string) => {
    const n = name.toLowerCase()
    if (n.includes('bed')) return 'var(--room-bedroom)'
    if (n.includes('kitchen')) return 'var(--room-kitchen)'
    if (n.includes('pantry')) return 'var(--room-pantry)'
    if (n.includes('bath')) return 'var(--room-bath)'
    if (n.includes('dining')) return 'var(--room-dining)'
    if (n.includes('living')) return 'var(--room-living)'
    if (n.includes('yard') || n.includes('garden') || n.includes('porch')) return 'var(--room-outdoor)'
    if (n.includes('study') || n.includes('office') || n.includes('library')) return 'var(--room-study)'
    if (n.includes('hall') || n.includes('lobby') || n.includes('foyer') || n.includes('corridor')) return 'var(--room-hall)'
    return 'var(--board-room-tint)'
  }
  // Two rooms of the SAME type in one house would otherwise be indistinguishable
  // neighbours, so a repeat of a tone falls back to the alternate tint.
  const roomBgOf: Record<string, string> = {}
  const usedTones = new Set<string>()
  for (const rm of puzzle.rooms) {
    let tone = roomTone(rm.name)
    if (usedTones.has(tone)) tone = 'var(--board-room-tint-2)'
    usedTones.add(tone)
    roomBgOf[rm.id] = tone
  }

  const isPlacing = !!placingFurniture && !!onPlaceFurniture

  return (
    <div className="relative w-full max-w-[580px] mx-auto select-none" style={{ aspectRatio: '1 / 1' }}>
      {/* interactive cell grid */}
      <div
        data-grid=""
        className="w-full h-full overflow-hidden"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${N}, 1fr)`,
          gridTemplateRows: `repeat(${N}, 1fr)`,
          // Blueprint outer frame: 2px drawn line in board-wall, no rounding.
          border: `2px solid var(--board-wall)`,
          boxShadow: `0 0 0 1px var(--board-ink), var(--shadow-elevated)`,
          background: 'var(--board-ground)',
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
            const draftNames = mark.kind === 'draft'
              ? mark.persons.map(pid => personById(pid)?.name).filter(Boolean).join(', ')
              : ''
            const furnNames = furn.map(f => FURNITURE_NAME[f.type]).join(', ')
            const cellKey = `${r},${c}`
            const isHovered = hoverCell === cellKey
            const showPreview = isPlacing && isHovered && !!placingFurniture
            const roomBg = roomBgOf[id] ?? 'var(--board-room-tint)'

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
                /* Focus ring uses the SOLID accent, not --board-glow: that glow
                   is a 50%-alpha brass which composites to ~1.8:1 over the
                   light-theme room tint, failing WCAG 2.4.11 — and this is the
                   only focus indicator on every cell of the main game surface. */
                className="relative flex items-center justify-center focus:outline-none focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-[var(--color-accent-strong)] transition-transform active:scale-[0.97]"
                style={{
                  // Room fill comes from a floor child span (below), keeping marks
                  // unaffected by any future filter on the floor layer.
                  // Room boundaries: 2px solid board-wall (the drawn line).
                  // Interior cell divisions: 1px dashed board-ink (drafting hairlines).
                  borderRight: wallR
                    ? `2px solid var(--board-wall)`
                    : `1px dashed var(--board-ink)`,
                  borderBottom: wallB
                    ? `2px solid var(--board-wall)`
                    : `1px dashed var(--board-ink)`,
                  cursor: isPlacing ? 'crosshair' : 'pointer',
                  ...(showPreview ? {
                    outline: '2px dashed var(--board-chalk)',
                    outlineOffset: '-4px',
                  } : {}),
                }}
              >
                {/* floor layer — room tint, behind all marks and tokens.
                    No texture, no image: a barely-lifted tint over the ground.
                    Rendered first so it sits behind all marks/avatars. */}
                <span
                  aria-hidden
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: roomBg,
                    opacity: showPreview ? 0.7 : 1,
                  }}
                />
                {/* furniture layer — blueprint evidence icons, fill the cell flush */}
                {furn.length > 0 && !person && (
                  <span
                    className="absolute inset-0 flex items-stretch"
                    style={{
                      opacity: mark.kind === 'x' ? 0.18 : 0.82,
                      color: 'var(--board-chalk)',
                    }}
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
                        opacity: 0.55,
                        color: 'var(--board-chalk)',
                      }}
                    >
                      <Icon />
                    </span>
                  )
                })()}

                {/* mark: x — chalk scratch mark */}
                {mark.kind === 'x' && (
                  <span
                    className="relative flex items-center justify-center"
                    style={{ color: 'var(--board-chalk)' }}
                  >
                    <X
                      size={Math.max(16, 150 / N)}
                      strokeWidth={isAutoX ? 2.0 : 2.5}
                      style={{ opacity: isAutoX ? 0.50 : 0.80 }}
                    />
                  </span>
                )}

                {/* mark: draft — dossier initial chips */}
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
                            // Sharp corners: dossier chip, not bubble
                            borderRadius: 2,
                            border: `1.5px solid ${p.accent}`,
                            color: p.accent,
                            background: `color-mix(in srgb, ${p.accent} 18%, var(--board-room-tint))`,
                          }}
                        >{p.name[0]}</span>
                      )
                    })}
                  </span>
                )}

                {/* mark: person — suspect token with brass or danger ring */}
                {person && (
                  <motion.span
                    key={person.id}
                    {...snapIn}
                    className={`relative ${conflicted ? 'animate-pulse' : ''}`}
                    style={{
                      boxShadow: conflicted
                        ? '0 0 0 2px var(--board-ground), 0 0 0 4px var(--color-danger), 0 0 10px var(--color-danger)'
                        : `0 0 0 2px ${person.accent}, 0 0 6px var(--board-glow)`,
                      borderRadius: 6,
                      filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.55))',
                    }}
                  >
                    <Avatar seed={person.avatarSeed} accent={person.accent} size={tokenSize} dead={person.isVictim} />
                    {conflicted && (
                      <span
                        className="absolute -top-1.5 -left-1.5 w-4 h-4 flex items-center justify-center font-bold text-[11px] leading-none"
                        title="Two suspects share this row or column"
                        style={{
                          background: 'var(--color-danger)',
                          color: 'var(--color-on-accent)',
                          borderRadius: 2,
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

          Design: stamped/stencilled dossier label — square corners, letter-
          spaced uppercase, board-ink text. No rounded pill. No white-on-black. */}
      <div
        className="absolute inset-0 pointer-events-none p-[2px]"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${N}, 1fr)`,
          gridTemplateRows: `repeat(${N}, 1fr)`,
        }}
      >
        {labelAnchors.map((l, i) => {
          // Abbreviate only when the room is genuinely too narrow to hold its
          // name. Keying this off N alone hid every label behind "KIT"/"STU"
          // on a 7x7 even where the room spanned three cells and had room to
          // spare — the board should name its rooms wherever it can, the way a
          // floor plan does. A 2-cell span is enough for a short name; long
          // names still need three.
          const compact = l.span < 2 || (l.name.length > 9 && l.span < 3)
          return (
            <span
              key={i}
              title={l.name}
              // Stamp hugs the top-left corner of the room's anchor cell.
              className="font-mono uppercase self-start justify-self-start"
              style={{
                gridColumnStart: l.col + 1,
                gridColumnEnd: compact ? 'span 1' : `span ${l.span}`,
                gridRowStart: l.row + 1,
                // Ink-coloured text on the room tint — readable in both themes.
                color: 'var(--board-wall)',
                // min 9px floor per the hard requirement
                fontSize: compact ? '9px' : `clamp(9px, ${Math.round(110 / N)}px, 11px)`,
                // Squared stamp border — blueprint annotation style, not a pill.
                background: 'var(--board-room-tint)',
                border: '1px solid var(--board-ink)',
                borderRadius: 1,
                padding: compact ? '1px 3px' : '2px 6px',
                letterSpacing: compact ? '0.06em' : '0.14em',
                margin: compact ? '2px' : '4px',
                maxWidth: '100%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                display: 'block',
                fontWeight: 700,
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
