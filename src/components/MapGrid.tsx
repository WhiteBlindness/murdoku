import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { X, Lock } from 'lucide-react'
import type { Puzzle, Cell, CellMark, Furniture, FurnitureType } from '../core/types'
import { FURNITURE_ICON, FURNITURE_NAME } from '../core/furniture'
import { floorStyle, isDarkFloor, roomMaterial } from '../core/roomMaterials'
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
  highlight?: { roomId?: string; furniture?: FurnitureType; cells?: Cell[] } | null
  highlightLabel?: string
}

// Room finishes are authored in core/roomMaterials.ts so every room has a
// distinct, quiet material signature without data-URI tile seams.

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

// Aubergine architecture frames the board without competing with its miniatures.
const WALL = '#2b1b2f'
const ESPRESSO = '#241820'

export default function MapGrid({
  puzzle, marks, conflicts, onCellClick,
  extraFurniture = [], placingFurniture, placingRotation = 0, onPlaceFurniture,
  highlight = null, highlightLabel,
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
  // JS-driven springs â€” so opt out here explicitly.
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
    //   multi-word â†’ initials (FRONT YARD â†’ FY), single-word â†’ first 3 chars (KITCHEN â†’ KIT)
    // Prefer wrapping or font-shrink over initials â€” see label render below.
    const words = rm.name.trim().toUpperCase().split(/\s+/)
    const abbr = words.length > 1
      ? words.map(w => w[0]).join('')
      : words[0].slice(0, 3)
    return { name: rm.name, abbr, row: anchor.row, col: anchor.col, span }
  })

  const isPlacing = !!placingFurniture && !!onPlaceFurniture
  const highlightedCells = new Set((highlight?.cells ?? []).map(cell => `${cell.row},${cell.col}`))
  const highlightDescriptionId = highlight && highlightLabel ? `clue-target-${puzzle.id}` : undefined

  return (
    /*
      The board fills whatever box the layout gives it. The old
      `max-w-[580px] mx-auto` pinned it to 580px on any monitor.
      `aspect-ratio: 1/1` STAYS: this is an NÃ—N grid of square cells.
      Sizing is the parent's job (GameScreen's centre column).
    */
    <div
      data-testid="board"
      className="relative w-full h-full select-none"
      style={{ aspectRatio: '1 / 1' }}
      aria-describedby={highlightDescriptionId}
    >
      {highlightDescriptionId && (
        <span id={highlightDescriptionId} className="sr-only">
          Projector highlight for the selected clue: {highlightLabel}
        </span>
      )}
      {/* interactive cell grid */}
      <div
        data-grid=""
        data-board-frame="noire"
        className="continuity-board w-full h-full overflow-hidden"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${N}, 1fr)`,
          gridTemplateRows: `repeat(${N}, 1fr)`,
          // Bold black board-game frame â€” physical object sitting on the desk.
          border: `3px solid ${WALL}`,
          // Directional shadow: lifts the board off the dark desk like a physical object.
          boxShadow: `
            0 20px 48px rgba(26,18,22,0.72),
            0 7px 17px rgba(36,24,32,0.62),
            0 1px 0 0 rgba(221,195,145,0.18),
            inset 0 0 0 1px rgba(214,180,125,0.22)
          `,
          background: ESPRESSO,
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
            const isOutdoor = material === 'front-yard' || material === 'garden'
            const darkFloor = isDarkFloor(material)
            const draftNames = mark.kind === 'draft'
              ? mark.persons.map(pid => personById(pid)?.name).filter(Boolean).join(', ')
              : ''
            const furnNames = furn.map(f => FURNITURE_NAME[f.type]).join(', ')
            const cellKey = `${r},${c}`
            const isHovered = hoverCell === cellKey
            const showPreview = isPlacing && isHovered && !!placingFurniture
            const isClueTarget = Boolean(
              highlight && (
                highlight.roomId === id
                || (highlight.furniture && furn.some(item => item.type === highlight.furniture))
                || highlightedCells.has(`${r},${c}`)
              )
            )

            // X mark colour: dark on light floors, white on dark floors.
            // Plus a contrasting text-shadow so neither extreme washes it out.
            const xColor = darkFloor ? '#FFFFFF' : '#1A1008'
            const xShadow = darkFloor
              ? '0 0 3px rgba(26,26,26,0.9), 0 1px 4px rgba(26,26,26,0.72)'
              : '0 0 3px rgba(244,233,208,0.9), 0 1px 3px rgba(244,233,208,0.6)'

            return (
              <button
                key={cellKey}
                data-cell={`${r}-${c}`}
                onClick={() => isPlacing ? onPlaceFurniture!(r, c) : onCellClick(r, c)}
                onMouseEnter={() => isPlacing && setHoverCell(cellKey)}
                onMouseLeave={() => isPlacing && setHoverCell(null)}
                onKeyDown={(e) => handleCellKey(e, r, c, N)}
                title={draftNames ? `Maybe: ${draftNames}` : furnNames || undefined}
                aria-label={`Row ${r + 1}, column ${c + 1}${person ? `, ${person.name}` : draftNames ? `, drafts: ${draftNames}` : furnNames ? `, ${furnNames}` : ''}${isClueTarget && highlightLabel ? `, matches clue: ${highlightLabel}` : ''}`}
                data-clue-target={isClueTarget ? 'true' : undefined}
                /* Focus ring: SOLID var(--color-accent-strong), never --board-glow.
                   The glow variant is 50% alpha and composites to ~1.8:1 on light
                   floors â€” fails WCAG 2.4.11. This is the only focus indicator. */
                className="relative flex items-center justify-center focus:outline-none focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-[var(--color-accent-strong)] transition-transform active:scale-[0.97]"
                style={{
                  // Floor pattern lives on a dedicated child span so marks/tokens
                  // are unaffected by any filter applied to the floor layer.
                  borderRight: wallR
                    ? `2px solid ${WALL}`
                    : isOutdoor
                      ? `1px dashed rgba(91, 105, 72, 0.4)`
                      : `1px solid rgba(96, 65, 71, 0.34)`,
                  borderBottom: wallB
                    ? `2px solid ${WALL}`
                    : isOutdoor
                      ? `1px dashed rgba(91, 105, 72, 0.4)`
                      : `1px solid rgba(96, 65, 71, 0.34)`,
                  cursor: isPlacing ? 'crosshair' : 'pointer',
                  ...(showPreview ? {
                    outline: '2px dashed rgba(255,255,255,0.65)',
                    outlineOffset: '-4px',
                  } : {}),
                }}
              >
                {isClueTarget && (
                  <span aria-hidden className="clue-projector-trace absolute inset-[3px] z-[2] pointer-events-none" />
                )}
                {/* floor layer â€” SVG material tile, behind all marks and avatars.
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

                {/* furniture layer â€” illustrated SVGs fill the cell flush.
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

                {/* mark: x â€” reads on both light and dark floors via dual-tone treatment */}
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

                {/* mark: draft â€” dossier initial chips with opaque plates */}
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
                            boxShadow: '0 1px 4px rgba(36,24,32,0.45)',
                          }}
                        >{p.name[0]}</span>
                      )
                    })}
                  </span>
                )}

                {/* mark: person â€” suspect token with accent or danger ring */}
                {person && (
                  <motion.span
                    key={person.id}
                    {...snapIn}
                    className={`relative ${conflicted ? 'animate-pulse' : ''}`}
                    style={{
                      boxShadow: conflicted
                        ? '0 0 0 2px #fff, 0 0 0 4px var(--color-danger), 0 0 10px var(--color-danger)'
                        : `0 0 0 2px ${person.accent}, 0 0 0 3px rgba(36,24,32,0.66)`,
                      borderRadius: 6,
                      // Two-layer drop-shadow so token reads on light AND dark floors
                      filter: 'drop-shadow(0 2px 5px rgba(36,24,32,0.76)) drop-shadow(0 0 2px rgba(36,24,32,0.5))',
                    }}
                  >
                    <Avatar seed={person.avatarSeed} accent={person.accent} size={tokenSize} dead={person.isVictim} name={person.name} />
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
                          boxShadow: '0 0 0 1.5px rgba(36,24,32,0.78)',
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

      {/* label overlay â€” same grid tracks, anchored corner stamps.
          At Nâ‰¥6 (â‰¤48px cells) the full name is too wide to fit without
          occluding playable area, so we render initials/short-code instead.
          The full name is always present via `title` (DOM attribute) and via
          a visually-hidden <span> so screen readers announce it in full.

          Design: evidence-tab room labels â€” dark plate, white text, bold.
          Hugs the top-left corner of the anchor cell over the wall line. */}
      <div
        className="absolute inset-0 pointer-events-none p-[2px]"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${N}, 1fr)`,
          gridTemplateRows: `repeat(${N}, 1fr)`,
        }}
      >
        {labelAnchors.map((l, i) => {
          // Label strategy â€” ranked by readability, initials only as true last resort:
          //
          //   1. FULL NAME, wrapping to 2 lines. Always tried first for multi-word
          //      names. Even a 1-cell-wide room has ~80â€“160px width and can show
          //      "LIVING / ROOM" across two lines at 9px.
          //
          //   2. FULL NAME single-line with ellipsis for short single-word names
          //      that fit without wrapping.
          //
          //   3. INITIALS â€” only when the name is a single word longer than 6 chars
          //      AND the cell span is 1. (e.g. hypothetical "Conservatory" span=1).
          //      Visible abbr is aria-hidden; full name in title + sr-only span.
          //
          // "Living Room" span=1 â†’ multi-word â†’ strategy 1: wraps to 2 lines âœ“
          // "Bathroom"    span=2 â†’ single word, short â†’ strategy 2 âœ“
          // "Pantry"      span=1 â†’ single word, â‰¤6 chars â†’ strategy 2 âœ“

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
                color: '#F4E9D0',
                // Font: 9px floor always. Scale up to 11px at Nâ‰¤5, shrink at N=7.
                fontSize: useInitials ? '9px' : `clamp(9px, ${Math.round(110 / N)}px, 11px)`,
                background: 'rgba(36,24,32,0.9)',
                borderRadius: 2,
                padding: useInitials ? '1px 3px' : '2px 6px',
                letterSpacing: useInitials ? '0.06em' : '0.12em',
                margin: useInitials ? '2px' : '4px',
                // Allow wrapping for multi-word names with â‰¥2 span; clamp single-line otherwise.
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
