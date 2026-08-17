import { useEffect, useMemo, useRef, useState } from 'react'
import type { Puzzle, Cell, CellMark, Furniture, FurnitureType } from '../core/types'
import { furnitureCells } from '../core/types'
import { KENNEY_FILE } from '../core/kenneyIcons'
import { SPRITE_DIMS, TILE_W, TILE_H, TILE_THICK } from '../core/kenneySprites'
import Avatar from './Avatar'

// ============================================================================
// ISOMETRIC DOLLHOUSE BOARD
//
// This is a PROJECTION of the existing Murdoku grid, never a replacement for
// it. Every cell, row, column, clue and solution is untouched; `row` and `col`
// keep their exact meaning and are simply drawn on two diagonal screen axes:
//
//     screenX = (col - row) * TILE_W/2
//     screenY = (col + row) * TILE_H/2
//
// Rooms, walls and props are decoration hung on that grid. They may span or
// subdivide the house however they like — they can never change which cells
// belong to a row or a column.
//
// The cost of the projection is that a row is no longer a horizontal line the
// eye can follow, so the grid has to be TAUGHT on interaction rather than
// assumed. That is what the lane system below is for: touch any cell and its
// full row lane and column lane light up along their diagonals, in two
// different hues, so the player reads the topology off the board instead of
// counting diamonds.
// ============================================================================

interface ClueTarget { roomId?: string; furniture?: FurnitureType; cells?: Cell[] }

interface Props {
  puzzle: Puzzle
  marks: CellMark[][]
  conflicts: Set<string>
  onCellClick: (row: number, col: number) => void
  highlight?: ClueTarget | ClueTarget[] | null
  highlightLabel?: string
  ghostMarks?: CellMark[][] | null
  /** Rows/cols consumed on the OTHER storey — the cross-floor lock. */
  blockedRows?: ReadonlySet<number>
  blockedCols?: ReadonlySet<number>
  floor?: 0 | 1
  /** Lanes that JUST locked elsewhere, for the one-shot cross-storey reveal. */
  flashRows?: ReadonlySet<number>
  flashCols?: ReadonlySet<number>
}

/** Floor sprite per room, so a kitchen reads different from a lawn. */
const ROOM_FLOOR: Record<string, string> = {
  Kitchen: 'floorFull_SE',
  Bathroom: 'floorFull_NE',
  Pantry: 'floorHalf_SE',
  'Living Room': 'floorFull_SW',
  'Dining Room': 'floorFull_NW',
  Study: 'floorFull_SE',
  Office: 'floorFull_NE',
  Bedroom: 'floorFull_SW',
  Hallway: 'floorHalf_NE',
  'Front Yard': 'floorFull_NW',
  Garden: 'floorFull_NW',
  Porch: 'floorHalf_SW',
}

/** A quiet per-room tint over the floor art so rooms stay distinguishable. */
const ROOM_TINT: Record<string, string> = {
  Kitchen: 'rgba(255,214,140,0.20)',
  Bathroom: 'rgba(150,215,235,0.20)',
  Pantry: 'rgba(226,180,120,0.20)',
  'Living Room': 'rgba(255,176,120,0.18)',
  'Dining Room': 'rgba(190,170,255,0.18)',
  Study: 'rgba(160,220,175,0.18)',
  Office: 'rgba(170,195,255,0.18)',
  Bedroom: 'rgba(255,190,205,0.18)',
  Hallway: 'rgba(210,210,210,0.16)',
  'Front Yard': 'rgba(150,225,140,0.22)',
  Garden: 'rgba(130,215,125,0.24)',
  Porch: 'rgba(220,200,150,0.20)',
}

/**
 * DOLLHOUSE PALETTE — the daylight direction, declared in one place.
 *
 * DESIGN.md still documents the noire board (espresso floors, bone marks, brass
 * accents), and none of these values belong to it. That is a real divergence,
 * not a false positive: this branch deliberately replaces the art direction to
 * suit artwork lit for bright rooms, so DESIGN.md needs rewriting before this
 * merges anywhere. Collecting the values here rather than scattering literals
 * through the component keeps that rewrite to a single reviewable surface.
 */
const SKIN = {
  /** Token plate — white so a portrait reads against any floor. */
  tokenPlate: '#FFFFFF',
  tokenPlateConflict: '#E14B4B',
  tokenShadow: 'rgba(20,15,10,0.45)',
  contactShadow: 'rgba(20,15,10,0.35)',
  /** Marks are DARK now: the floors are light, inverting the noire treatment. */
  markInk: '#3A2A18',
  markHalo: 'rgba(255,255,255,0.8)',
  draftPlate: '#FFF8E6',
  draftInk: '#2A1D10',
  ghostRing: 'rgba(80,60,40,0.55)',
  seam: 'rgba(60,45,30,0.22)',
}

/** Lane palette. Selection is the loudest thing on the board, by design. */
// MEASURED against the artwork, not picked by eye. A 50%-alpha amber wash over
// Kenney's orange floorboards is very nearly invisible, and a cyan wash over the
// lawn is no better — the lane data was correct on the first pass and still
// unreadable on screen. Two things fix it, and both are needed:
//   1. everything OUTSIDE the two lanes is dimmed, so the lanes are defined by
//      contrast against their surroundings rather than by their own tint;
//   2. each lane carries a saturated STROKE along the diamond edges, which
//      survives any floor colour underneath because it is a line, not a wash.
const LANE = {
  row: 'rgba(255,168,20,0.62)',       // amber — the row lane
  rowEdge: '#B25E00',
  col: 'rgba(40,170,255,0.62)',       // cyan — the column lane
  colEdge: '#0A5C99',
  cross: 'rgba(255,255,255,0.92)',    // their intersection: the selected cell
  crossEdge: '#1B1206',
  locked: 'rgba(90,215,130,0.34)',    // completed, persistent and quiet
  lockedEdge: 'rgba(28,110,60,0.55)',
  blocked: 'rgba(150,120,255,0.38)',  // locked from the OTHER storey
  blockedEdge: 'rgba(70,40,160,0.6)',
  conflict: 'rgba(255,60,60,0.62)',
  conflictEdge: '#8E0000',
  dim: 'rgba(24,18,10,0.46)',         // everything off-lane
}

export default function IsoBoard({
  puzzle, marks, conflicts, onCellClick,
  highlight = null, highlightLabel,
  ghostMarks = null, blockedRows, blockedCols, floor = 0,
  flashRows, flashCols,
}: Props) {
  const N = puzzle.size
  const [active, setActive] = useState<{ row: number; col: number } | null>(null)

  // The scene is authored at native sprite pixels and scaled to fit as ONE
  // unit. The scale factor has to be a unitless NUMBER, which CSS cannot derive
  // from a container width on its own — `calc(100cqw / 1248)` is a length, not
  // a ratio, and silently invalidates the whole transform. Measured here
  // instead, so the house always fits its column exactly.
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const [scale, setScale] = useState(1)

  const roomOf = puzzle.roomOfByFloor?.[floor] ?? puzzle.roomOf
  const roomName = (r: number, c: number) =>
    puzzle.rooms.find(rm => rm.id === roomOf[r]?.[c])?.name ?? ''
  const personById = (id: string) => puzzle.people.find(p => p.id === id)

  const boardW = N * TILE_W
  const HEAD = 220 // headroom above the back corner for tall sprites
  const boardH = (N - 1) * TILE_H + TILE_H + TILE_THICK + HEAD + 80

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const fit = () => setScale((el.clientWidth || boardW) / boardW)
    fit()
    // ResizeObserver is absent in jsdom and in older embedded webviews. The
    // board must still render at a sane scale there rather than throwing on
    // mount, so fall back to a window listener.
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', fit)
      return () => window.removeEventListener('resize', fit)
    }
    const ro = new ResizeObserver(fit)
    ro.observe(el)
    return () => ro.disconnect()
  }, [boardW])

  /** Grid -> screen. The single source of truth for the projection. */
  const project = (row: number, col: number) => ({
    left: (col - row) * (TILE_W / 2) + (N - 1) * (TILE_W / 2),
    top: (col + row) * (TILE_H / 2) + HEAD,
  })

  const diamond = (row: number, col: number) => {
    const { left, top } = project(row, col)
    const hw = TILE_W / 2, hh = TILE_H / 2
    return `${left + hw},${top} ${left + TILE_W},${top + hh} ${left + hw},${top + TILE_H} ${left},${top + hh}`
  }

  // ---- Lane state, derived from the SAME marks the logical game uses -------
  const lockedRows = new Set<number>()
  const lockedCols = new Set<number>()
  const conflictRows = new Set<number>()
  const conflictCols = new Set<number>()
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      const m = marks[r][c]
      if (m.kind === 'person') {
        lockedRows.add(r); lockedCols.add(c)
        if (conflicts.has(m.person)) { conflictRows.add(r); conflictCols.add(c) }
      }
    }
  }

  const targets: ClueTarget[] = highlight ? (Array.isArray(highlight) ? highlight : [highlight]) : []
  const clueCells = new Set(targets.flatMap(t => (t.cells ?? []).map(c => `${c.row},${c.col}`)))
  const clueRooms = new Set(targets.map(t => t.roomId).filter(Boolean))
  const clueFurn = new Set(targets.map(t => t.furniture).filter(Boolean))

  const furniture: Furniture[] = useMemo(
    () => puzzle.furniture.filter(f => (f.floor ?? 0) === floor),
    [puzzle.furniture, floor],
  )

  // ---- Occlusion -----------------------------------------------------------
  // A piece nearer the viewer than the cell being inspected, and overlapping it
  // on screen, fades rather than moves. Gameplay outranks decoration, and the
  // player must never have to rotate the camera to look behind a wardrobe.
  const occludes = (f: Furniture, target: { row: number; col: number } | null) => {
    if (!target) return false
    const depth = f.row + f.col
    const targetDepth = target.row + target.col
    if (depth <= targetDepth) return false
    const dx = Math.abs((f.col - f.row) - (target.col - target.row))
    return dx <= 1 && depth - targetDepth <= 3
  }

  const cellsWithToken = new Set<string>()
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
    if (marks[r][c].kind === 'person') cellsWithToken.add(`${r},${c}`)
  }

  return (
    <div
      data-testid="board"
      data-iso-board=""
      className="relative w-full select-none"
      style={{ aspectRatio: `${boardW} / ${boardH}` }}
      role="grid"
      aria-label={`Isometric house, ${N} by ${N} grid, floor ${floor + 1}`}
    >
      {/* The scene is authored at native sprite resolution and scaled as ONE
          unit, so every asset stays pixel-exact relative to every other. */}
      <div ref={wrapRef} style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <div
          style={{
            position: 'absolute',
            width: boardW,
            height: boardH,
            transformOrigin: 'top left',
            transform: `scale(${scale})`,
          }}
        >
          {/* ---------------- FLOOR ---------------- */}
          {Array.from({ length: N }, (_, r) =>
            Array.from({ length: N }, (_, c) => {
              const { left, top } = project(r, c)
              const file = ROOM_FLOOR[roomName(r, c)] ?? 'floorFull_SE'
              const [fw, fh] = SPRITE_DIMS[file] ?? [TILE_W, 152]
              return (
                <img
                  key={`f${r}-${c}`}
                  src={`/kenney/${file}.png`}
                  alt=""
                  aria-hidden
                  draggable={false}
                  style={{
                    position: 'absolute',
                    left: left + (TILE_W - fw) / 2,
                    // Kenney's floor sprite carries slab thickness below the
                    // diamond face; align the FACE to the cell, not the sprite.
                    top: top + TILE_H - (fh - TILE_THICK),
                    width: fw,
                    height: fh,
                    zIndex: r + c,
                  }}
                />
              )
            }),
          )}

          {/* Room tint + a hairline seam: cell boundaries communicated by the
              flooring itself rather than by a grid drawn over the house. */}
          <svg
            width={boardW} height={boardH}
            style={{ position: 'absolute', inset: 0, zIndex: 200, pointerEvents: 'none' }}
          >
            {Array.from({ length: N }, (_, r) =>
              Array.from({ length: N }, (_, c) => (
                <polygon
                  key={`t${r}-${c}`}
                  points={diamond(r, c)}
                  fill={ROOM_TINT[roomName(r, c)] ?? 'transparent'}
                  stroke={SKIN.seam}
                  strokeWidth={1}
                />
              )),
            )}
          </svg>

          {/* ---------------- LANES ----------------
              Above the floor, below the furniture, so a lane reads as light
              falling on floorboards rather than an overlay on the whole scene.
              Order: completed < cross-storey < conflict < clue < lane < cell. */}
          <svg
            width={boardW} height={boardH}
            style={{ position: 'absolute', inset: 0, zIndex: 210, pointerEvents: 'none' }}
          >
            {[...lockedRows].map(r => Array.from({ length: N }, (_, c) => (
              <polygon key={`lr${r}-${c}`} points={diamond(r, c)} fill={LANE.locked} stroke={LANE.lockedEdge} strokeWidth={1.5} />
            )))}
            {[...lockedCols].map(c => Array.from({ length: N }, (_, r) => (
              <polygon key={`lc${c}-${r}`} points={diamond(r, c)} fill={LANE.locked} stroke={LANE.lockedEdge} strokeWidth={1.5} />
            )))}

            {/* locked from the other storey — a distinct hue, because the
                player did not do this on the floor they are looking at */}
            {[...(blockedRows ?? [])].map(r => Array.from({ length: N }, (_, c) => (
              <polygon key={`br${r}-${c}`} points={diamond(r, c)} fill={LANE.blocked} stroke={LANE.blockedEdge} strokeWidth={1.5} />
            )))}
            {[...(blockedCols ?? [])].map(c => Array.from({ length: N }, (_, r) => (
              <polygon key={`bc${c}-${r}`} points={diamond(r, c)} fill={LANE.blocked} stroke={LANE.blockedEdge} strokeWidth={1.5} />
            )))}

            {/* the cross-storey reveal: a lane that just locked on the other
                floor pulses here, so the player never has to switch floors to
                discover that it happened */}
            {[...(flashRows ?? [])].map(r => Array.from({ length: N }, (_, c) => (
              <polygon key={`fr${r}-${c}`} points={diamond(r, c)} fill={LANE.blocked}>
                <animate attributeName="opacity" values="0;1;0.2;1;0.55" dur="1.4s" fill="freeze" />
              </polygon>
            )))}
            {[...(flashCols ?? [])].map(c => Array.from({ length: N }, (_, r) => (
              <polygon key={`fc${c}-${r}`} points={diamond(r, c)} fill={LANE.blocked}>
                <animate attributeName="opacity" values="0;1;0.2;1;0.55" dur="1.4s" fill="freeze" />
              </polygon>
            )))}

            {[...conflictRows].map(r => Array.from({ length: N }, (_, c) => (
              <polygon key={`cr${r}-${c}`} points={diamond(r, c)} fill={LANE.conflict} stroke={LANE.conflictEdge} strokeWidth={2} />
            )))}
            {[...conflictCols].map(c => Array.from({ length: N }, (_, r) => (
              <polygon key={`cc${c}-${r}`} points={diamond(r, c)} fill={LANE.conflict} stroke={LANE.conflictEdge} strokeWidth={2} />
            )))}

            {Array.from({ length: N }, (_, r) =>
              Array.from({ length: N }, (_, c) => {
                const hit = clueCells.has(`${r},${c}`)
                  || clueRooms.has(roomOf[r]?.[c])
                  || furniture.some(f => clueFurn.has(f.type)
                      && furnitureCells(f).some(x => x.row === r && x.col === c))
                return hit
                  ? <polygon key={`cl${r}-${c}`} points={diamond(r, c)} fill="rgba(255,255,255,0.26)" />
                  : null
              }),
            )}

            {/* THE LANES — the whole point. Row and column in two different
                hues so each diagonal direction is nameable at a glance. */}
            {/* Everything off-lane is dimmed FIRST. This is what makes the two
                lanes legible over any floor: they are the only cells left at
                full brightness, so the diagonals read even where the amber sits
                on orange boards or the cyan sits on grass. */}
            {active && Array.from({ length: N }, (_, r) =>
              Array.from({ length: N }, (_, c) => (
                (r === active.row || c === active.col) ? null : (
                  <polygon key={`dim${r}-${c}`} points={diamond(r, c)} fill={LANE.dim} />
                )
              )),
            )}
            {active && Array.from({ length: N }, (_, c) => (
              <polygon key={`ar${c}`} points={diamond(active.row, c)}
                fill={LANE.row} stroke={LANE.rowEdge} strokeWidth={2.5} />
            ))}
            {active && Array.from({ length: N }, (_, r) => (
              <polygon key={`ac${r}`} points={diamond(r, active.col)}
                fill={LANE.col} stroke={LANE.colEdge} strokeWidth={2.5} />
            ))}
            {active && (
              <polygon
                points={diamond(active.row, active.col)}
                fill={LANE.cross}
                stroke={LANE.crossEdge}
                strokeWidth={4}
              />
            )}
          </svg>

          {/* ---------------- FURNITURE ----------------
              Native resolution, bottom-anchored on the diamond's centre, depth
              sorted by (row + col) so nearer pieces occlude farther ones. */}
          {furniture.map((f, i) => {
            const rot = f.rotation ?? 0
            const file = `${KENNEY_FILE[f.type]}_${rot === 90 || rot === 270 ? 'SW' : 'SE'}`
            const [nw, nh] = SPRITE_DIMS[file] ?? [92, 92]
            const { left, top } = project(f.row, f.col)
            const faded = occludes(f, active) || cellsWithToken.has(`${f.row},${f.col}`)
            return (
              <img
                key={`${f.type}-${f.row}-${f.col}-${i}`}
                src={`/kenney/${file}.png`}
                alt=""
                aria-hidden
                draggable={false}
                data-furniture-icon={f.type}
                style={{
                  position: 'absolute',
                  left: left + TILE_W / 2 - nw / 2,
                  top: top + TILE_H / 2 - nh + 22,
                  width: nw,
                  height: nh,
                  zIndex: 300 + (f.row + f.col) * 2,
                  opacity: faded ? 0.26 : 1,
                  transition: 'opacity 160ms ease',
                  pointerEvents: 'none',
                }}
              />
            )
          })}

          {/* ---------------- TOKENS ----------------
              Above everything decorative: suspects are gameplay. */}
          {Array.from({ length: N }, (_, r) =>
            Array.from({ length: N }, (_, c) => {
              const m = marks[r][c]
              const { left, top } = project(r, c)
              const cx = left + TILE_W / 2
              const cy = top + TILE_H / 2

              if (m.kind === 'person') {
                const p = personById(m.person)
                if (!p) return null
                const bad = conflicts.has(p.id)
                return (
                  <div
                    key={`p${r}-${c}`}
                    style={{
                      position: 'absolute', left: cx - 50, top: cy - 140,
                      zIndex: 900 + (r + c) * 2, pointerEvents: 'none',
                    }}
                  >
                    <div style={{
                      position: 'absolute', left: 18, top: 116, width: 64, height: 22,
                      borderRadius: '50%', background: SKIN.contactShadow, filter: 'blur(3px)',
                    }} />
                    <div style={{
                      width: 100, borderRadius: 12, padding: 5,
                      background: bad ? SKIN.tokenPlateConflict : SKIN.tokenPlate,
                      boxShadow: `0 8px 16px ${SKIN.tokenShadow}`,
                    }}>
                      <Avatar seed={p.avatarSeed} accent={p.accent} size={90} dead={p.isVictim} name={p.name} />
                    </div>
                  </div>
                )
              }

              if (m.kind === 'x') {
                return (
                  <div
                    key={`x${r}-${c}`}
                    style={{
                      position: 'absolute', left: cx - 18, top: cy - 22,
                      zIndex: 880 + (r + c) * 2, pointerEvents: 'none',
                      fontSize: 38, fontWeight: 800, lineHeight: 1,
                      color: SKIN.markInk, textShadow: `0 1px 0 ${SKIN.markHalo}`,
                    }}
                  >×</div>
                )
              }

              if (m.kind === 'draft' && m.persons.length) {
                return (
                  <div
                    key={`d${r}-${c}`}
                    style={{
                      position: 'absolute', left: cx - 42, top: cy - 24, width: 84,
                      display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'center',
                      zIndex: 870 + (r + c) * 2, pointerEvents: 'none',
                    }}
                  >
                    {m.persons.slice(0, 4).map(pid => {
                      const p = personById(pid)
                      return p ? (
                        <span key={pid} style={{
                          width: 24, height: 24, borderRadius: 5, background: SKIN.draftPlate,
                          border: `2px solid ${p.accent}`, color: SKIN.draftInk,
                          fontSize: 13, fontWeight: 800, display: 'grid', placeItems: 'center',
                        }}>{p.name[0]}</span>
                      ) : null
                    })}
                  </div>
                )
              }

              if (ghostMarks?.[r]?.[c]?.kind === 'person') {
                return (
                  <div
                    key={`g${r}-${c}`}
                    style={{
                      position: 'absolute', left: cx - 18, top: cy - 18,
                      width: 36, height: 36, borderRadius: '50%',
                      border: `2px dashed ${SKIN.ghostRing}`,
                      zIndex: 860 + (r + c) * 2, pointerEvents: 'none',
                    }}
                  />
                )
              }
              return null
            }),
          )}

          {/* ---------------- HIT LAYER ----------------
              Precise diamond hit areas above everything, so a click always
              lands on the cell the player aimed at and never on a sprite that
              happens to overhang it. */}
          <svg
            width={boardW} height={boardH}
            style={{ position: 'absolute', inset: 0, zIndex: 1000 }}
          >
            {Array.from({ length: N }, (_, r) =>
              Array.from({ length: N }, (_, c) => (
                <polygon
                  key={`h${r}-${c}`}
                  points={diamond(r, c)}
                  fill="transparent"
                  data-cell={`${r}-${c}`}
                  style={{ cursor: 'pointer', pointerEvents: 'all' }}
                  onMouseEnter={() => setActive({ row: r, col: c })}
                  onMouseLeave={() => setActive(a => (a && a.row === r && a.col === c ? null : a))}
                  onClick={() => { setActive({ row: r, col: c }); onCellClick(r, c) }}
                  aria-label={`Row ${r + 1}, column ${c + 1}${roomName(r, c) ? `, ${roomName(r, c)}` : ''}`}
                />
              )),
            )}
          </svg>
        </div>
      </div>

      {highlightLabel && <span className="sr-only">Clue highlight: {highlightLabel}</span>}
    </div>
  )
}
