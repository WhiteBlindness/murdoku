import { useEffect, useMemo, useRef, useState } from 'react'
import type { Puzzle, Cell, CellMark, Furniture, FurnitureType } from '../core/types'
import { furnitureCells, furnitureFootprint } from '../core/types'
import { KENNEY_FILE } from '../core/kenneyIcons'
import { SPRITE_DIMS, TILE_W, TILE_H, TILE_THICK } from '../core/kenneySprites'
import {
  getSceneDecor,
  getSceneFloorAccents,
  getSceneFloorFinishes,
  getSceneFurnitureVisual,
  getSceneWalls,
} from '../core/handScenes'
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
  /** The suspect currently armed for placement, if any — drives the valid/invalid target ring. */
  armedPerson?: string | null
}

// ROOM_FLOOR is gone with the tiled floor. The floor is now one continuous
// polygon (see the FLOOR block below); per-room flooring would reintroduce
// the internal seams that made the house read as disconnected platforms.

// ROOM_TINT (a permanent per-room colour wash) is deliberately gone: it was
// the "pastel checkerboard" that made the board read as a spreadsheet at
// rest. Room identity now comes from floor plank variety (ROOM_FLOOR) plus
// walls (roomLayout.computeWalls) plus furniture — the things a real room
// actually differs by — not a translucent colour laid over every tile.

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
  /** The one continuous floor tone, sampled from Kenney's floorFull top face. */
  floor: '#FFC978',
}

/** Lane palette. Selection stays legible without outshouting the diorama. */
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
  cross: 'rgba(255,255,255,0.92)',    // legacy treatment for scenes not yet art-directed
  crossEdge: '#1B1206',
  locked: 'rgba(90,215,130,0.34)',    // completed, persistent and quiet
  lockedEdge: 'rgba(24,96,52,0.85)',
  // Deliberately barely-there. At 0.17 a single locked lane looked right,
  // but by the end of a puzzle 8 lanes overlap and the whole floor went
  // green — the outline and end-pins carry the signal, the wash only needs
  // to tint the lane enough to group it.
  lockedWash: 'rgba(90,190,125,0.06)',
  blocked: 'rgba(150,120,255,0.38)',  // locked from the OTHER storey
  blockedEdge: 'rgba(70,40,160,0.6)',
  // Conflict is the one state allowed to FILL rather than outline — it is an
  // error, it should be impossible to miss. At 0.62 across every offending
  // row and column it read as "the board broke" rather than "these two
  // clash"; 0.36 behind a hard edge still reads instantly as alarm.
  conflict: 'rgba(255,60,60,0.36)',
  conflictEdge: '#8E0000',
  dim: 'rgba(24,18,10,0.46)',         // everything off-lane
  validTarget: '#3FAE5C',             // legal placement while a suspect is armed
  invalidTarget: '#C94444',           // illegal placement (already occupied)
}

const MIDNIGHT_LANE = {
  row: 'rgba(238,177,75,0.2)',
  rowEdge: 'rgba(145,91,28,0.55)',
  col: 'rgba(86,167,190,0.18)',
  colEdge: 'rgba(33,104,126,0.52)',
  dim: 'rgba(24,18,10,0.18)',
}

export default function IsoBoard({
  puzzle, marks, conflicts, onCellClick,
  highlight = null, highlightLabel,
  ghostMarks = null, blockedRows, blockedCols, floor = 0,
  flashRows, flashCols, armedPerson = null,
}: Props) {
  const N = puzzle.size
  const isMidnightDelivery = puzzle.id === 'very-easy-1' && floor === 0
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
  // Headroom above the back corner for tall sprites. The tallest thing in the
  // scene is a wall (212px) standing on the back edge, which reaches exactly
  // 138px above the first cell's top — 220 was guesswork and left ~30% of the
  // board box as dead space, shrinking the house inside its own frame. 150
  // clears the walls with margin and hands that space back to the scene.
  const HEAD = 150
  const boardH = (N - 1) * TILE_H + TILE_H + TILE_THICK + HEAD + 28

  /**
   * `?env=1` strips every puzzle overlay — placement anchors, lane
   * highlights, suspect tokens, marks — leaving only the environment.
   *
   * This exists so the scene can be judged as architecture on its own terms:
   * if the house only looks acceptable because interaction UI is drawing the
   * eye, it isn't an authored interior yet. Dev affordance, not a game mode.
   */
  const envOnly = typeof window !== 'undefined'
    && new URLSearchParams(window.location.search).has('env')

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

  /**
   * ONE depth scale for every object standing on the floor — walls, furniture,
   * decor and suspects alike.
   *
   * Previously each kind had its own z band (walls ~210, furniture ~300), so
   * furniture always painted over walls no matter which was nearer the camera,
   * and a wall in front of a chair could never occlude it. In an isometric
   * scene the only correct order is by ground depth (row + col), so that is
   * what everything sorts by now. Fractional coords are expected: a wall sits
   * on a cell EDGE (row - 0.5) and a multi-cell piece on its footprint centre.
   */
  const sceneZ = (row: number, col: number, bias = 0) =>
    Math.round((row + col + 2) * 100 + (col - row + N) * 2) + bias
  const overlayZ = (2 * N + 3) * 100
  const gameplayZ = (row: number, col: number, bias = 0) =>
    overlayZ - 80 + Math.round((row + col) * 4 + (col - row + N) * 0.2) + bias

  const diamond = (row: number, col: number) => {
    const { left, top } = project(row, col)
    const hw = TILE_W / 2, hh = TILE_H / 2
    return `${left + hw},${top} ${left + TILE_W},${top + hh} ${left + hw},${top + TILE_H} ${left},${top + hh}`
  }

  const footprintPolygon = (row: number, col: number, h: number, w: number, scale = 1) => {
    const hw = TILE_W / 2, hh = TILE_H / 2
    const T = project(row, col)
    const R = project(row, col + w - 1)
    const B = project(row + h - 1, col + w - 1)
    const L = project(row + h - 1, col)
    const points = [
      [T.left + hw, T.top],
      [R.left + TILE_W, R.top + hh],
      [B.left + hw, B.top + TILE_H],
      [L.left, L.top + hh],
    ]
    const centre = points.reduce((sum, point) => [sum[0] + point[0] / 4, sum[1] + point[1] / 4], [0, 0])
    return points
      .map(([x, y]) => `${centre[0] + (x - centre[0]) * scale},${centre[1] + (y - centre[1]) * scale}`)
      .join(' ')
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

  // Hand-authored wall plan for this ONE scene — see handScenes.ts. Every
  // other puzzle gets an empty list (no walls) until this scene's art
  // direction is approved; this is deliberately not derived from room data.
  const walls = useMemo(
    () => isMidnightDelivery ? getSceneWalls(puzzle.id) : [],
    [isMidnightDelivery, puzzle.id],
  )
  const decor = useMemo(
    () => isMidnightDelivery ? getSceneDecor(puzzle.id) : [],
    [isMidnightDelivery, puzzle.id],
  )
  const floorFinishes = useMemo(
    () => isMidnightDelivery ? getSceneFloorFinishes(puzzle.id) : [],
    [isMidnightDelivery, puzzle.id],
  )
  const floorAccents = useMemo(
    () => isMidnightDelivery ? getSceneFloorAccents(puzzle.id) : [],
    [isMidnightDelivery, puzzle.id],
  )

  // ---- Occlusion -----------------------------------------------------------
  // A piece nearer the viewer than the cell being inspected, and overlapping it
  // on screen, fades rather than moves. Gameplay outranks decoration, and the
  // player must never have to rotate the camera to look behind a wardrobe.
  const occludes = (f: Furniture, target: { row: number; col: number } | null) => {
    if (!target) return false
    const cells = furnitureCells(f)
    if (cells.some(cell => cell.row === target.row && cell.col === target.col)) return true
    const { w, h } = furnitureFootprint(f)
    const depth = f.row + h - 1 + f.col + w - 1
    const targetDepth = target.row + target.col
    if (depth <= targetDepth) return false
    const targetAxis = target.col - target.row
    const axes = cells.map(cell => cell.col - cell.row)
    return targetAxis >= Math.min(...axes) - 1
      && targetAxis <= Math.max(...axes) + 1
      && depth - targetDepth <= 3
  }

  // A piece anywhere along the CURRENTLY ACTIVE row/col lane fades partway,
  // even when it isn't directly occluding the hovered cell — so the lane
  // trace (below) is never fully hidden behind a sofa three cells down the
  // same row. Weaker than `occludes`, which stays reserved for the piece
  // directly blocking the inspected cell.
  const inActiveLane = (f: Furniture) =>
    !!active && furnitureCells(f).some(cell => cell.row === active.row || cell.col === active.col)

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
          {/* ---------------- PLINTH ----------------
              Two camera-facing foundation faces keep the miniature grounded
              without turning the floor into one thick orange game slab. */}
          {(() => {
            const hw = TILE_W / 2, hh = TILE_H / 2, th = TILE_THICK
            const R = project(0, N - 1)
            const B = project(N - 1, N - 1), L = project(N - 1, 0)
            const right = [R.left + TILE_W, R.top + hh]
            const bottom = [B.left + hw, B.top + TILE_H]
            const leftPt = [L.left, L.top + hh]
            const pointList = (points: number[][]) => points.map(point => point.join(',')).join(' ')
            return (
              <svg
                width={boardW} height={boardH}
                style={{ position: 'absolute', inset: 0, zIndex: 20, pointerEvents: 'none' }}
              >
                <polygon
                  data-plinth-face="right"
                  points={pointList([right, bottom, [bottom[0], bottom[1] + th], [right[0], right[1] + th]])}
                  fill="#B86C35"
                />
                <polygon
                  data-plinth-face="left"
                  points={pointList([bottom, leftPt, [leftPt[0], leftPt[1] + th], [bottom[0], bottom[1] + th]])}
                  fill="#955128"
                />
                <polyline
                  points={pointList([right, bottom, leftPt])}
                  fill="none"
                  stroke="rgba(255,225,179,0.68)"
                  strokeWidth={2}
                />
                <polyline
                  points={pointList([[right[0], right[1] + th], [bottom[0], bottom[1] + th], [leftPt[0], leftPt[1] + th]])}
                  fill="none"
                  stroke="rgba(83,42,23,0.55)"
                  strokeWidth={2}
                />
              </svg>
            )
          })()}

          {/* ---------------- FLOOR ----------------
              One unbroken house surface with room-scale material fields.
              There are no cell polygons and no permanent room labels. */}
          {(() => {
            const hw = TILE_W / 2, hh = TILE_H / 2
            const T = project(0, 0), R = project(0, N - 1)
            const B = project(N - 1, N - 1), L = project(N - 1, 0)
            const pts = [
              [T.left + hw, T.top],
              [R.left + TILE_W, R.top + hh],
              [B.left + hw, B.top + TILE_H],
              [L.left, L.top + hh],
            ].map(point => point.join(',')).join(' ')
            return (
              <svg
                width={boardW} height={boardH}
                style={{ position: 'absolute', inset: 0, zIndex: 10, pointerEvents: 'none' }}
              >
                <defs>
                  {floorFinishes.map(finish => (
                    <pattern
                      key={finish.material}
                      id={'room-material-' + finish.material}
                      patternUnits="userSpaceOnUse"
                      width={finish.material === 'oak' ? 48 : 56}
                      height={finish.material === 'oak' ? 24 : 56}
                    >
                      <rect width="100%" height="100%" fill={finish.fill} />
                      {finish.material === 'oak' && (
                        <path d="M0 1 H48 M0 23 H48 M24 1 V23" stroke={finish.detail} strokeWidth="1.4" opacity="0.34" />
                      )}
                      {finish.material === 'slate' && (
                        <path d="M0 50 L56 6" stroke={finish.detail} strokeWidth="2" opacity="0.18" />
                      )}
                      {finish.material === 'terrazzo' && (
                        <path d="M12 14 l5 2 M39 38 l4 -3 M24 48 l3 1" stroke={finish.detail} strokeWidth="3" strokeLinecap="round" opacity="0.32" />
                      )}
                      {finish.material === 'carpet' && (
                        <path d="M4 14 H52 M4 42 H52" stroke={finish.detail} strokeWidth="1.4" strokeDasharray="2 7" opacity="0.23" />
                      )}
                      {finish.material === 'tile' && (
                        <path d="M0 28 H56 M28 0 V56" stroke={finish.detail} strokeWidth="1.3" opacity="0.22" />
                      )}
                    </pattern>
                  ))}
                </defs>
                <polygon
                  data-floor-surface=""
                  points={pts}
                  fill={SKIN.floor}
                  stroke="#7D5233"
                  strokeWidth={3}
                />
                {floorFinishes.map(finish => {
                  const room = puzzle.rooms.find(candidate =>
                    candidate.name === finish.room && (candidate.floor ?? 0) === floor)
                  if (!room?.cells.length) return null
                  const rows = room.cells.map(cell => cell.row)
                  const cols = room.cells.map(cell => cell.col)
                  const r0 = Math.min(...rows), r1 = Math.max(...rows)
                  const c0 = Math.min(...cols), c1 = Math.max(...cols)
                  return (
                    <polygon
                      key={finish.room}
                      data-room-floor={finish.room}
                      data-floor-material={finish.material}
                      points={footprintPolygon(r0, c0, r1 - r0 + 1, c1 - c0 + 1)}
                      fill={'url(#room-material-' + finish.material + ')'}
                      stroke="rgba(69,49,31,0.16)"
                      strokeWidth={1.5}
                    />
                  )
                })}
                {floorAccents.map(accent => (
                  <g key={accent.id}>
                    <polygon
                      data-floor-accent={accent.id}
                      points={footprintPolygon(accent.row, accent.col, accent.h, accent.w, accent.scale)}
                      fill={accent.fill}
                      stroke={accent.stroke}
                      strokeWidth={3}
                      opacity={0.92}
                    />
                    <polygon
                      data-floor-accent-detail={accent.id}
                      points={footprintPolygon(accent.row, accent.col, accent.h, accent.w, accent.scale * 0.82)}
                      fill="none"
                      stroke="rgba(255,232,205,0.72)"
                      strokeWidth={2}
                    />
                  </g>
                ))}
              </svg>
            )
          })()}
          {/* Idle reads as a room, not a grid — no seam lines, no boundary
              cue at all here. Placement anchors (below) only appear once a
              suspect is armed, per the hidden-grid interaction model. A
              first render of this (rx/ry at 0.16 of a tile, 22% opacity)
              covered enough of every empty cell that a blind art review
              called it "a dot-grid... the biggest offender" — a tenth the
              area and half the opacity is a mark you notice when looking
              for a landing spot, not one that reads as a board pattern. */}
          {!envOnly && armedPerson && (
            <svg
              width={boardW} height={boardH}
              style={{ position: 'absolute', inset: 0, zIndex: 200, pointerEvents: 'none' }}
            >
              {Array.from({ length: N }, (_, r) =>
                Array.from({ length: N }, (_, c) => {
                  if (!roomOf[r]?.[c] || marks[r][c].kind !== 'empty') return null
                  const { left, top } = project(r, c)
                  return (
                    <circle
                      key={`cs${r}-${c}`}
                      data-placement-cue=""
                      cx={left + TILE_W / 2} cy={top + TILE_H / 2}
                      r={isMidnightDelivery ? 3 : 3.5}
                      fill={isMidnightDelivery ? 'rgba(70,45,20,0.14)' : 'rgba(70,45,20,0.32)'}
                    />
                  )
                }),
              )}
            </svg>
          )}

          {/* ---------------- WALLS ----------------
              Full-height Kenney sprites frame the camera-facing dollhouse.
              Interior partitions use low cutaway geometry: their bases stay
              exact, their widths remain continuous and their doorways are
              actual gaps rather than compressed raster panels. */}
          {walls.map((w, i) => {
            const wallSpan = w.span ?? 1
            if (w.render === 'native') {
              const wRow = w.kind === 'corner'
                ? w.row - 0.5
                : w.edge === 'A' ? w.row - 0.5 : w.row
              const wCol = w.kind === 'corner'
                ? w.col - 0.5
                : w.edge === 'A' ? w.col : w.col - 0.5
              const z = sceneZ(wRow, wCol)
              const [ww, wh] = SPRITE_DIMS[w.file] ?? [109, 212]
              const virtual = w.kind === 'corner'
                ? project(w.row - 0.5, w.col - 0.5)
                : w.edge === 'A'
                  ? project(w.row - 0.5, w.col)
                  : project(w.row, w.col - 0.5)
              const baseX = virtual.left + TILE_W / 2
              const baseY = virtual.top + TILE_H / 2
              const wallLeft = Math.max(0, Math.min(boardW - ww, baseX - ww / 2))
              return (
                <div key={'w' + i}>
                  <div style={{
                    position: 'absolute', left: baseX - ww * 0.22, top: baseY - wh * 0.05,
                    width: ww * 0.44, height: wh * 0.1, borderRadius: '50%',
                    background: SKIN.contactShadow, filter: 'blur(3px)', zIndex: z - 1,
                  }} />
                  <img
                    src={'/kenney/' + w.file + '.png'}
                    alt=""
                    aria-hidden
                    draggable={false}
                    data-scene-object="wall"
                    data-wall-render="native"
                    data-wall-axis={w.kind === 'corner' ? 'corner' : w.edge}
                    style={{
                      position: 'absolute',
                      left: wallLeft,
                      top: baseY - wh + TILE_H / 4,
                      width: ww,
                      height: wh,
                      zIndex: z,
                      opacity: 1,
                      pointerEvents: 'none',
                    }}
                  />
                </div>
              )
            }

            const wallId = w.id ?? 'cutaway-' + i
            const origin = project(w.row, w.col)
            const startPoint: [number, number] = [origin.left + TILE_W / 2, origin.top]
            const endPoint: [number, number] = w.edge === 'A'
              ? [
                  startPoint[0] + (TILE_W / 2) * wallSpan,
                  startPoint[1] + (TILE_H / 2) * wallSpan,
                ]
              : [
                  startPoint[0] - (TILE_W / 2) * wallSpan,
                  startPoint[1] + (TILE_H / 2) * wallSpan,
                ]
            const height = w.height ?? 86
            const thickness = 14
            const along = (t: number): [number, number] => [
              startPoint[0] + (endPoint[0] - startPoint[0]) * t,
              startPoint[1] + (endPoint[1] - startPoint[1]) * t,
            ]
            const contactAt = (t: number) => w.edge === 'A'
              ? { row: w.row - 0.5, col: w.col + t * wallSpan }
              : { row: w.row + t * wallSpan, col: w.col - 0.5 }
            const points = (values: Array<[number, number]>) =>
              values.map(point => point.join(',')).join(' ')
            const openingRanges = [...(w.openings ?? [])]
              .sort((a, b) => a.index - b.index)
              .map(opening => {
                const centre = (opening.index + 0.5) / wallSpan
                const half = opening.width / (2 * wallSpan)
                return {
                  opening,
                  from: Math.max(0, centre - half),
                  to: Math.min(1, centre + half),
                }
              })
            const boundaries = [
              0,
              ...openingRanges.flatMap(range => [range.from, range.to]),
              1,
            ]
            const wallRanges = boundaries.reduce<Array<[number, number]>>((result, value, index) => {
              if (index % 2 !== 0 || index + 1 >= boundaries.length) return result
              const next = boundaries[index + 1]
              return next - value > 0.001 ? [...result, [value, next]] : result
            }, [])
            // One visual run must still sort at LOCAL contact depth. Splitting
            // only at invisible cell boundaries prevents a six-cell face from
            // borrowing the midpoint depth of its far end and painting over
            // nearby furniture. The slices overlap by a sub-pixel amount, so
            // this adds no panel rhythm or anti-alias seam to the wall.
            const ranges = wallRanges.flatMap(([from, to]) => {
              const cellCuts = Array.from(
                { length: Math.max(0, wallSpan - 1) },
                (_, boundaryIndex) => (boundaryIndex + 1) / wallSpan,
              ).filter(cut => cut > from && cut < to)
              const sliceBounds = [from, ...cellCuts, to]
              return sliceBounds.slice(0, -1).map((sliceFrom, sliceIndex) => (
                [sliceFrom, sliceBounds[sliceIndex + 1]] as [number, number]
              ))
            })
            const shellTone = w.tone === 'shell'
            const face = shellTone
              ? (w.edge === 'A' ? '#819489' : '#6F857A')
              : (w.edge === 'A' ? '#CBB89B' : '#B7A188')
            const cap = shellTone
              ? (w.edge === 'A' ? '#ACB9AF' : '#9EADA2')
              : (w.edge === 'A' ? '#E0CFB1' : '#D0BDA0')
            const revealFace = shellTone
              ? (w.edge === 'A' ? '#71857A' : '#5E756B')
              : (w.edge === 'A' ? '#BCA68B' : '#A9947D')
            const capInset: [number, number] = w.edge === 'A'
              ? [-thickness, thickness / 2]
              : [thickness, thickness / 2]

            return (
              <div
                key={'w' + i}
                data-scene-object="wall"
                data-wall-render="cutaway"
                data-wall-id={wallId}
                data-wall-axis={w.edge}
                data-wall-height={height}
                data-wall-thickness={thickness}
                data-wall-tone={w.tone ?? 'interior'}
                style={{
                  position: 'absolute', left: 0, top: 0,
                  width: boardW, height: boardH, pointerEvents: 'none',
                }}
              >
                {ranges.map(([from, to], segmentIndex) => {
                  const seamOverlap = 0.00035
                  const a = along(Math.max(0, from - seamOverlap))
                  const b = along(Math.min(1, to + seamOverlap))
                  const topA: [number, number] = [a[0], a[1] - height]
                  const topB: [number, number] = [b[0], b[1] - height]
                  const innerTopA: [number, number] = [
                    topA[0] + capInset[0], topA[1] + capInset[1],
                  ]
                  const innerTopB: [number, number] = [
                    topB[0] + capInset[0], topB[1] + capInset[1],
                  ]
                  const contact = contactAt((from + to) / 2)
                  return (
                    <svg
                      key={'segment-' + segmentIndex}
                      width={boardW}
                      height={boardH}
                      data-cutaway-segment=""
                      data-wall-depth-slice=""
                      style={{
                        position: 'absolute', inset: 0,
                        zIndex: sceneZ(contact.row, contact.col),
                        pointerEvents: 'none', overflow: 'visible',
                      }}
                    >
                      <line
                        x1={a[0]} y1={a[1] + 2} x2={b[0]} y2={b[1] + 2}
                        stroke={SKIN.contactShadow} strokeWidth={4} strokeLinecap="round" opacity={0.22}
                      />
                      <polygon data-cutaway-face="" points={points([a, b, topB, topA])} fill={face} />
                      <polygon
                        data-cutaway-cap=""
                        points={points([topA, topB, innerTopB, innerTopA])}
                        fill={cap}
                      />
                      <line
                        x1={topA[0]} y1={topA[1]} x2={topB[0]} y2={topB[1]}
                        stroke={face} strokeWidth={1} opacity={0.42}
                      />
                      <line
                        x1={innerTopA[0]} y1={innerTopA[1]} x2={innerTopB[0]} y2={innerTopB[1]}
                        stroke={revealFace} strokeWidth={1} opacity={0.3}
                      />
                    </svg>
                  )
                })}
                {openingRanges.map(({ opening, from, to }, openingIndex) => {
                  const gapStart = along(from)
                  const gapEnd = along(to)
                  const openingHeight = Math.min(68, height - 12)
                  const headerBottomStart: [number, number] = [gapStart[0], gapStart[1] - openingHeight]
                  const headerBottomEnd: [number, number] = [gapEnd[0], gapEnd[1] - openingHeight]
                  const headerTopStart: [number, number] = [gapStart[0], gapStart[1] - height]
                  const headerTopEnd: [number, number] = [gapEnd[0], gapEnd[1] - height]
                  const headerInnerTopStart: [number, number] = [
                    headerTopStart[0] + capInset[0], headerTopStart[1] + capInset[1],
                  ]
                  const headerInnerTopEnd: [number, number] = [
                    headerTopEnd[0] + capInset[0], headerTopEnd[1] + capInset[1],
                  ]
                  const startInnerBase: [number, number] = [
                    gapStart[0] + capInset[0], gapStart[1] + capInset[1],
                  ]
                  const endInnerBase: [number, number] = [
                    gapEnd[0] + capInset[0], gapEnd[1] + capInset[1],
                  ]
                  const startInnerTop: [number, number] = [
                    headerBottomStart[0] + capInset[0], headerBottomStart[1] + capInset[1],
                  ]
                  const endInnerTop: [number, number] = [
                    headerBottomEnd[0] + capInset[0], headerBottomEnd[1] + capInset[1],
                  ]
                  const contact = contactAt((from + to) / 2)
                  return (
                    <svg
                      key={'opening-' + openingIndex}
                      width={boardW}
                      height={boardH}
                      data-wall-opening={opening.kind}
                      style={{
                        position: 'absolute', inset: 0,
                        zIndex: sceneZ(contact.row, contact.col, 2),
                        pointerEvents: 'none', overflow: 'visible',
                      }}
                    >
                      <polygon
                        data-doorway-reveal=""
                        points={points([gapStart, headerBottomStart, startInnerTop, startInnerBase])}
                        fill={revealFace}
                      />
                      <polygon
                        data-doorway-reveal=""
                        points={points([gapEnd, headerBottomEnd, endInnerTop, endInnerBase])}
                        fill={revealFace}
                      />
                      <g data-doorway-header="">
                        <polygon
                          data-doorway-header-face=""
                          points={points([headerBottomStart, headerBottomEnd, headerTopEnd, headerTopStart])}
                          fill={face}
                        />
                        <polygon
                          data-doorway-header-cap=""
                          points={points([headerTopStart, headerTopEnd, headerInnerTopEnd, headerInnerTopStart])}
                          fill={cap}
                        />
                      </g>
                      <g data-doorway-opening="" data-doorway-frame="">
                        <line
                          data-doorway-threshold=""
                          x1={gapStart[0]} y1={gapStart[1] + 1}
                          x2={gapEnd[0]} y2={gapEnd[1] + 1}
                          stroke="#8C7864" strokeWidth={2.5} strokeLinecap="round" opacity={0.42}
                        />
                        <line
                          data-doorway-jamb=""
                          x1={gapStart[0]} y1={gapStart[1]}
                          x2={headerBottomStart[0]} y2={headerBottomStart[1]}
                          stroke="#76523A" strokeWidth={4.5} strokeLinecap="square"
                        />
                        <line
                          data-doorway-jamb=""
                          x1={gapEnd[0]} y1={gapEnd[1]}
                          x2={headerBottomEnd[0]} y2={headerBottomEnd[1]}
                          stroke="#76523A" strokeWidth={4.5} strokeLinecap="square"
                        />
                        <line
                          data-doorway-lintel=""
                          x1={headerBottomStart[0]} y1={headerBottomStart[1]}
                          x2={headerBottomEnd[0]} y2={headerBottomEnd[1]}
                          stroke="#76523A" strokeWidth={4.5} strokeLinecap="square"
                        />
                      </g>
                    </svg>
                  )
                })}
              </div>
            )
          })}
          {/* ---------------- DECOR ----------------
              Every raised prop has a declared supporting surface. Small props
              may be enlarged as miniatures, but remain bottom-anchored. */}
          {decor.map((d, i) => {
            const file = d.file + '_' + d.facing
            const [nativeW, nativeH] = SPRITE_DIMS[file] ?? [60, 90]
            const visualScale = d.scale ?? 1
            const dw = nativeW * visualScale
            const dh = nativeH * visualScale
            const { left, top } = project(d.row, d.col)
            const cx = left + TILE_W / 2, cy = top + TILE_H / 2
            const groundY = cy + TILE_H / 4
            const lift = d.lift ?? 0
            const depthRow = lift > 0 ? Math.ceil(d.row) : d.row
            const depthCol = lift > 0 ? Math.ceil(d.col) : d.col
            // A flat floor covering sorts just above the floor polygon (z 10)
            // and the placement cues, but below every standing object, so
            // furniture and suspects always rest ON the rug, never behind it.
            const z = d.flat ? 16 : sceneZ(depthRow, depthCol, lift > 0 ? 5 : 1)
            return (
              <div key={'dec' + i}>
                {lift === 0 && !d.flat && (
                  <div style={{
                    position: 'absolute',
                    left: cx - dw * 0.24,
                    top: groundY - dh * 0.045,
                    width: dw * 0.48, height: dh * 0.09, borderRadius: '50%',
                    background: SKIN.contactShadow, filter: 'blur(2.5px)',
                    zIndex: z - 1,
                  }} />
                )}
                <img
                  src={'/kenney/' + file + '.png'}
                  alt=""
                  aria-hidden
                  draggable={false}
                  data-scene-object="decor"
                  data-decor={d.file}
                  data-decor-lift={lift}
                  data-decor-support={d.support}
                  data-visual-scale={visualScale}
                  style={{
                    position: 'absolute',
                    left: cx - dw / 2,
                    // A flat rug is centred on its cell's floor plane; a
                    // standing prop is bottom-anchored on the contact line.
                    top: d.flat ? cy + TILE_H / 4 - dh / 2 : groundY - dh - lift,
                    width: dw,
                    height: dh,
                    zIndex: z,
                    pointerEvents: 'none',
                  }}
                />
              </div>
            )
          })}
          {/* Room names are deliberately NOT drawn on the floor. If the
              rooms only read as bedroom/kitchen/office because the words are
              printed across them, the composition has failed — identity has
              to come from architecture and furnishing. Room names remain
              available to screen readers via the hit layer's aria-label, and
              can be surfaced contextually later (on hover, or when a room
              clue is selected) rather than as permanent floor text. */}

          {/* ---------------- LANES ----------------
              Above the WALLS (walls stack up to ~220 for a 6x6 scene) so a
              row/column trace is never sliced into fragments by an
              architectural panel standing in front of it — gameplay
              feedback outranks decoration, same principle the furniture
              occlusion logic already follows.
              Order: completed < cross-storey < conflict < clue < lane < cell. */}
          {!envOnly && (
          <svg
            width={boardW} height={boardH}
            data-active-lanes=""
            style={{ position: 'absolute', inset: 0, zIndex: overlayZ, pointerEvents: 'none' }}
          >
            {/* Locked lanes are a QUIET, PERSISTENT state — an outline only,
                never a fill. This is what keeps them from fighting an active
                lane (which floods + dims) or from re-becoming the permanent
                colour-band look the whole redesign exists to remove. A small
                pin at each end of the lane is what actually answers "which
                lanes are already resolved" at a glance, since a thin stroke
                across a busy floor is easy to miss on its own. */}
            {/* A 1.25px 55%-alpha hairline was invisible once the floors
                became bright cream instead of dark boards — a UX review
                could not tell a locked board from an untouched one, which
                is the single worst failure this state can have. It stays a
                stroke (never a saturated band), but a legible one, with a
                translucent wash at 0.10 so the lane's extent reads as a
                soft "already settled" tone rather than a drawn line. */}
            {[...lockedRows].map(r => (
              <g key={`lr${r}`} data-locked-lane="row">
                {Array.from({ length: N }, (_, c) => (
                  <polygon key={`lr${r}-${c}`} points={diamond(r, c)} fill={LANE.lockedWash} stroke={LANE.lockedEdge} strokeWidth={2.5} />
                ))}
                <circle cx={project(r, 0).left} cy={project(r, 0).top + TILE_H / 2} r={7} fill={LANE.lockedEdge} />
                <circle cx={project(r, N - 1).left + TILE_W} cy={project(r, N - 1).top + TILE_H / 2} r={7} fill={LANE.lockedEdge} />
              </g>
            ))}
            {[...lockedCols].map(c => (
              <g key={`lc${c}`} data-locked-lane="column">
                {Array.from({ length: N }, (_, r) => (
                  <polygon key={`lc${c}-${r}`} points={diamond(r, c)} fill={LANE.lockedWash} stroke={LANE.lockedEdge} strokeWidth={2.5} />
                ))}
                <circle cx={project(0, c).left + TILE_W / 2} cy={project(0, c).top} r={7} fill={LANE.lockedEdge} />
                <circle cx={project(N - 1, c).left + TILE_W / 2} cy={project(N - 1, c).top + TILE_H} r={7} fill={LANE.lockedEdge} />
              </g>
            ))}

            {/* Locked from the OTHER storey — same quiet outline grammar,
                a distinct hue, because the player did not do this on the
                floor they are looking at. */}
            {[...(blockedRows ?? [])].map(r => Array.from({ length: N }, (_, c) => (
              <polygon key={`br${r}-${c}`} points={diamond(r, c)} fill="none" stroke={LANE.blockedEdge} strokeWidth={1.25} strokeDasharray="4 3" />
            )))}
            {[...(blockedCols ?? [])].map(c => Array.from({ length: N }, (_, r) => (
              <polygon key={`bc${c}-${r}`} points={diamond(r, c)} fill="none" stroke={LANE.blockedEdge} strokeWidth={1.25} strokeDasharray="4 3" />
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
                  <polygon
                    key={`dim${r}-${c}`}
                    data-active-dim=""
                    points={diamond(r, c)}
                    fill={isMidnightDelivery ? MIDNIGHT_LANE.dim : LANE.dim}
                  />
                )
              )),
            )}
            {active && Array.from({ length: N }, (_, c) => (
              <polygon key={`ar${c}`} data-active-lane="row" points={diamond(active.row, c)}
                fill={isMidnightDelivery ? MIDNIGHT_LANE.row : LANE.row}
                stroke={isMidnightDelivery ? MIDNIGHT_LANE.rowEdge : LANE.rowEdge}
                strokeWidth={isMidnightDelivery ? 1.5 : 2.5} />
            ))}
            {active && Array.from({ length: N }, (_, r) => (
              <polygon key={`ac${r}`} data-active-lane="column" points={diamond(r, active.col)}
                fill={isMidnightDelivery ? MIDNIGHT_LANE.col : LANE.col}
                stroke={isMidnightDelivery ? MIDNIGHT_LANE.colEdge : LANE.colEdge}
                strokeWidth={isMidnightDelivery ? 1.5 : 2.5} />
            ))}
            {/* End markers — small triangles pointing off-board at both ends
                of the active row and column, so the lane's full extent reads
                even where furniture or the board edge crops the polygon. */}
            {active && (() => {
              const rowStart = project(active.row, 0), rowEnd = project(active.row, N - 1)
              const colStart = project(0, active.col), colEnd = project(N - 1, active.col)
              const hh = TILE_H / 2
              const tri = (x: number, y: number, dx: number, dy: number) =>
                `${x},${y} ${x - dy * 7 - dx * 10},${y + dx * 7 - dy * 10} ${x + dy * 7 - dx * 10},${y - dx * 7 - dy * 10}`
              return (
                <>
                  <polygon points={tri(rowStart.left, rowStart.top + hh, -1, 0)} fill={isMidnightDelivery ? MIDNIGHT_LANE.rowEdge : LANE.rowEdge} />
                  <polygon points={tri(rowEnd.left + TILE_W, rowEnd.top + hh, 1, 0)} fill={isMidnightDelivery ? MIDNIGHT_LANE.rowEdge : LANE.rowEdge} />
                  <polygon points={tri(colStart.left + TILE_W / 2, colStart.top, 0, -1)} fill={isMidnightDelivery ? MIDNIGHT_LANE.colEdge : LANE.colEdge} />
                  <polygon points={tri(colEnd.left + TILE_W / 2, colEnd.top + TILE_H, 0, 1)} fill={isMidnightDelivery ? MIDNIGHT_LANE.colEdge : LANE.colEdge} />
                </>
              )
            })()}
            {active && (
              <polygon
                data-active-intersection=""
                points={diamond(active.row, active.col)}
                fill={isMidnightDelivery ? 'rgba(232,207,158,0.26)' : LANE.cross}
                stroke={isMidnightDelivery ? 'rgba(82,57,26,0.52)' : LANE.crossEdge}
                strokeWidth={isMidnightDelivery ? 1.5 : 4}
              />
            )}
          </svg>
          )}

          {/* ---------------- FURNITURE ----------------
              The logical object owns one full-footprint shadow and depth key.
              Scene-specific visual modules may represent that same immutable
              footprint without changing the puzzle object. */}
          {furniture.map((f, i) => {
            const rot = f.rotation ?? 0
            const file = KENNEY_FILE[f.type] + '_' + (rot === 90 || rot === 270 ? 'SW' : 'SE')
            const [nativeW, nativeH] = SPRITE_DIMS[file] ?? [92, 92]
            const visual = isMidnightDelivery ? getSceneFurnitureVisual(puzzle.id, f) : undefined
            const visualScale = visual?.scale ?? 1
            const offsetRow = visual?.offsetRow ?? 0
            const offsetCol = visual?.offsetCol ?? 0
            const groundOffsetY = visual?.groundOffsetY ?? 0
            const shadowScale = visual?.shadowScale ?? 0.58
            const shadowOpacity = visual?.shadowOpacity ?? 0.55
            const shadowBlur = visual?.shadowBlur ?? 3
            const shadowOffsetRow = visual?.shadowOffsetRow ?? 0
            const shadowOffsetCol = visual?.shadowOffsetCol ?? 0
            const renderW = nativeW * visualScale
            const renderH = nativeH * visualScale
            const { w: fw, h: fh } = furnitureFootprint(f)
            const centreRow = f.row + (fh - 1) / 2
            const centreCol = f.col + (fw - 1) / 2
            const frontRow = f.row + fh - 1
            const frontCol = f.col + fw - 1
            const visualCentreRow = centreRow + offsetRow
            const visualCentreCol = centreCol + offsetCol
            const occupiedCells = furnitureCells(f)
            const { left, top } = project(visualCentreRow, visualCentreCol)
            const occluding = occludes(f, active)
              || occupiedCells.some(cell => cellsWithToken.has(cell.row + ',' + cell.col))
            const opacity = occluding ? 0.26 : inActiveLane(f) ? 0.55 : 1
            const cx = left + TILE_W / 2, cy = top + TILE_H / 2
            const groundY = cy + TILE_H / 4 + groundOffsetY
            const z = sceneZ(frontRow + offsetRow, frontCol + offsetCol)
            const commonData = {
              'data-scene-object': 'furniture',
              'data-furniture': f.type,
              'data-logical-cell': f.row + ',' + f.col,
              'data-footprint-center': centreRow + ',' + centreCol,
              'data-footprint-front': frontRow + ',' + frontCol,
              'data-visual-offset': offsetRow + ',' + offsetCol,
              'data-ground-offset-y': groundOffsetY,
            }

            return (
              <div key={f.type + '-' + f.row + '-' + f.col + '-' + i}>
                <svg
                  width={boardW}
                  height={boardH}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: z - 1,
                    pointerEvents: 'none',
                    filter: `blur(${shadowBlur}px)`,
                  }}
                >
                  <polygon
                    data-furniture-shadow={f.type}
                    data-logical-cell={f.row + ',' + f.col}
                    data-visual-offset={offsetRow + ',' + offsetCol}
                    data-shadow-offset={shadowOffsetRow + ',' + shadowOffsetCol}
                    data-shadow-footprint={fh + 'x' + fw}
                    data-shadow-scale={shadowScale}
                    points={footprintPolygon(
                      f.row + offsetRow + shadowOffsetRow,
                      f.col + offsetCol + shadowOffsetCol,
                      fh,
                      fw,
                      shadowScale,
                    )}
                    fill={SKIN.contactShadow}
                    opacity={opacity * shadowOpacity}
                  />
                </svg>
                {visual?.modules ? (
                  <div
                    {...commonData}
                    data-furniture-modular=""
                    style={{
                      position: 'absolute', left: 0, top: 0, width: boardW, height: boardH,
                      zIndex: z, opacity, transition: 'opacity 160ms ease', pointerEvents: 'none',
                    }}
                  >
                    {visual.modules.map((module, moduleIndex) => {
                      const moduleFile = module.file + '_' + module.facing
                      const [moduleNativeW, moduleNativeH] = SPRITE_DIMS[moduleFile] ?? [92, 92]
                      const moduleScale = module.scale ?? 1
                      const moduleLift = module.lift ?? 0
                      const moduleW = moduleNativeW * moduleScale
                      const moduleH = moduleNativeH * moduleScale
                      const modulePoint = project(module.row + offsetRow, module.col + offsetCol)
                      const moduleX = modulePoint.left + TILE_W / 2
                      const moduleGround = modulePoint.top + TILE_H / 2 + TILE_H / 4
                      return (
                        <img
                          key={module.file + '-' + moduleIndex}
                          src={'/kenney/' + moduleFile + '.png'}
                          alt=""
                          aria-hidden
                          draggable={false}
                          data-furniture-module={f.type}
                          data-furniture-module-file={module.file}
                          data-furniture-module-lift={moduleLift}
                          data-visual-scale={moduleScale}
                          style={{
                            position: 'absolute',
                            left: moduleX - moduleW / 2,
                            top: moduleGround - moduleLift - moduleH,
                            width: moduleW,
                            height: moduleH,
                            pointerEvents: 'none',
                          }}
                        />
                      )
                    })}
                  </div>
                ) : (
                  <img
                    src={'/kenney/' + file + '.png'}
                    alt=""
                    aria-hidden
                    draggable={false}
                    {...commonData}
                    data-visual-scale={visualScale}
                    style={{
                      position: 'absolute',
                      left: cx - renderW / 2,
                      top: groundY - renderH,
                      width: renderW,
                      height: renderH,
                      zIndex: z,
                      opacity,
                      transition: 'opacity 160ms ease',
                      pointerEvents: 'none',
                    }}
                  />
                )}
              </div>
            )
          })}
          {!envOnly && (
          <>
          {/* ---------------- TOKENS ----------------
              Above everything decorative: suspects are gameplay. A placed
              suspect stands IN the scene — bottom-anchored on its tile like
              a furniture piece, with a small portrait badge at chest height
              — rather than floating as a large card well above it. */}
          {Array.from({ length: N }, (_, r) =>
            Array.from({ length: N }, (_, c) => {
              const m = marks[r][c]
              const { left, top } = project(r, c)
              const cx = left + TILE_W / 2
              const cy = top + TILE_H / 2
              const groundY = cy + TILE_H / 4

              if (m.kind === 'person') {
                const p = personById(m.person)
                if (!p) return null
                const bad = conflicts.has(p.id)
                const standeeH = 92
                return (
                  <div
                    key={`p${r}-${c}`}
                    title={`${p.name}${p.isVictim ? ' — victim' : ''}`}
                    data-scene-object="suspect"
                    data-ground-offset={TILE_H / 4}
                    data-standee-height={standeeH}
                    style={{
                      position: 'absolute', left: cx - 32, top: groundY - standeeH,
                      zIndex: gameplayZ(r, c, 3), pointerEvents: 'none',
                    }}
                  >
                    <div style={{
                      position: 'absolute', left: -4, top: standeeH - 6, width: 72, height: 16,
                      borderRadius: '50%', background: SKIN.contactShadow, filter: 'blur(2.5px)',
                    }} />
                    {/* the "stand" — a thin card body the badge sits on top of,
                        reading as a small standee rather than a floating chip */}
                    <div style={{
                      position: 'absolute', left: 27, top: 38, width: 10, height: standeeH - 32,
                      background: bad ? SKIN.tokenPlateConflict : SKIN.tokenPlate,
                      borderRadius: 2, boxShadow: `0 4px 8px ${SKIN.tokenShadow}`,
                    }} />
                    <div style={{
                      width: 64, height: 64, borderRadius: '50%', padding: 3,
                      background: bad ? SKIN.tokenPlateConflict : SKIN.tokenPlate,
                      boxShadow: `0 4px 10px ${SKIN.tokenShadow}`,
                    }}>
                      <Avatar seed={p.avatarSeed} accent={p.accent} size={58} dead={p.isVictim} name={p.name} />
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
                      zIndex: gameplayZ(r, c, 3), pointerEvents: 'none',
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
                      zIndex: gameplayZ(r, c, 3), pointerEvents: 'none',
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
                      zIndex: gameplayZ(r, c, 3), pointerEvents: 'none',
                    }}
                  />
                )
              }
              return null
            }),
          )}
          </>
          )}

          {/* ---------------- PLACEMENT TARGET ----------------
              Only drawn on the hovered cell while a suspect is armed for
              placement — a landing-pad ring, dashed and unfilled, in the
              same restrained grammar as everything else on the board. */}
          {!envOnly && armedPerson && active && (() => {
            const occupied = marks[active.row][active.col].kind === 'person'
            const color = occupied ? LANE.invalidTarget : LANE.validTarget
            return (
              <svg width={boardW} height={boardH} style={{ position: 'absolute', inset: 0, zIndex: overlayZ + 100, pointerEvents: 'none' }}>
                <polygon
                  points={diamond(active.row, active.col)}
                  fill="none"
                  stroke={color}
                  strokeWidth={2.5}
                  strokeDasharray="5 4"
                />
              </svg>
            )
          })()}

          {/* ---------------- HIT LAYER ----------------
              Precise diamond hit areas above everything, so a click always
              lands on the cell the player aimed at and never on a sprite that
              happens to overhang it. */}
          <svg
            width={boardW} height={boardH}
            style={{ position: 'absolute', inset: 0, zIndex: overlayZ + 200 }}
          >
            {Array.from({ length: N }, (_, r) =>
              Array.from({ length: N }, (_, c) => (
                <polygon
                  key={`h${r}-${c}`}
                  points={diamond(r, c)}
                  fill="transparent"
                  data-cell={`${r}-${c}`}
                  role="gridcell"
                  style={{ cursor: 'pointer', pointerEvents: 'all', touchAction: 'manipulation' }}
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
