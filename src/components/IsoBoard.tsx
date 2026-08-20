import { useEffect, useMemo, useRef, useState } from 'react'
import type { Puzzle, Cell, CellMark, Furniture, FurnitureType } from '../core/types'
import { furnitureCells, furnitureFootprint } from '../core/types'
import { KENNEY_FILE } from '../core/kenneyIcons'
import { SPRITE_DIMS, TILE_W, TILE_H, TILE_THICK } from '../core/kenneySprites'
import { getSceneWalls, getSceneDecor } from '../core/handScenes'
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

export default function IsoBoard({
  puzzle, marks, conflicts, onCellClick,
  highlight = null, highlightLabel,
  ghostMarks = null, blockedRows, blockedCols, floor = 0,
  flashRows, flashCols, armedPerson = null,
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
  const walls = useMemo(() => getSceneWalls(puzzle.id), [puzzle.id])
  const decor = useMemo(() => getSceneDecor(puzzle.id), [puzzle.id])

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
              Each floor sprite carries its own slab thickness, so at the
              board's outer edge those thicknesses ended in a row of separate
              teeth with notches between them — the house looked like it was
              standing on a torn strip rather than a solid base. This is one
              polygon under all of them tracing the board's outline and
              dropping TILE_THICK, so the foundation reads as a single block. */}
          {(() => {
            const hw = TILE_W / 2, hh = TILE_H / 2, th = TILE_THICK
            const R = project(0, N - 1)
            const B = project(N - 1, N - 1), L = project(N - 1, 0)
            const right = [R.left + TILE_W, R.top + hh]
            const bottom = [B.left + hw, B.top + TILE_H]
            const leftPt = [L.left, L.top + hh]
            // Only the SKIRT (the two front-facing sides), drawn ABOVE the
            // floor tiles. Underneath them it was useless: every tile paints
            // its own dark lower-left edge on top, and at the board boundary
            // those edges are exposed as a row of teeth. One band over the
            // top of them turns the foundation into a single clean block.
            const pts = [
              right, bottom, leftPt,
              [leftPt[0], leftPt[1] + th],
              [bottom[0], bottom[1] + th],
              [right[0], right[1] + th],
            ].map(p => p.join(',')).join(' ')
            return (
              <svg
                width={boardW} height={boardH}
                style={{ position: 'absolute', inset: 0, zIndex: 20, pointerEvents: 'none' }}
              >
                <polygon points={pts} fill="#C4762F" />
              </svg>
            )
          })()}

          {/* ---------------- FLOOR ----------------
              ONE continuous surface, not 36 tiled sprites.
              Each Kenney floor sprite carries its own slab thickness and its
              own dark lower edge, so tiling them painted a step at every cell
              boundary — which is precisely why the house read as "a bunch of
              disconnected stairs/platforms" rather than one building. Drawn as
              geometry there are no internal edges at all. Room identity comes
              from walls and furnishing, not from the floor. */}
          {(() => {
            const hw = TILE_W / 2, hh = TILE_H / 2
            const T = project(0, 0), R = project(0, N - 1)
            const B = project(N - 1, N - 1), L = project(N - 1, 0)
            const pts = [
              [T.left + hw, T.top],
              [R.left + TILE_W, R.top + hh],
              [B.left + hw, B.top + TILE_H],
              [L.left, L.top + hh],
            ].map(p => p.join(',')).join(' ')
            return (
              <svg
                width={boardW} height={boardH}
                style={{ position: 'absolute', inset: 0, zIndex: 10, pointerEvents: 'none' }}
              >
                <polygon data-floor-surface="" points={pts} fill={SKIN.floor} />
              </svg>
            )
          })()}

          {/* NO per-room or per-cell floor tint. A 5-agent design review
              concluded a translucent colour polygon over every tile is the
              SAME "pastel checkerboard" technique the whole redesign exists
              to remove, no matter how low its opacity — room identity has
              to come from architecture (walls, below) and furniture
              clustering, not a colour wash on the floor. */}

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
                      r={3.5}
                      fill="rgba(70,45,20,0.32)"
                    />
                  )
                }),
              )}
            </svg>
          )}

          {/* ---------------- WALLS ----------------
              Hand-authored, exact sprite per position (handScenes.ts) — a
              real wallCorner_* piece at the true back vertex, wallWindow_*
              over the desk and behind the sofa, wallDoorway_* at every
              interior gap instead of blank space. Every wall casts a
              contact shadow onto the floor it stands on, same as furniture
              below — nothing in this scene floats free of the floor. */}
          {walls.map((w, i) => {
            const [rawW, rawH] = SPRITE_DIMS[w.file] ?? [109, 212]
            const ww = rawW
            // Exterior walls keep their full silhouette. Interior partitions
            // are vertically shortened only; their native width remains
            // untouched, so a continuous run never opens panel-sized gaps.
            const heightScale = w.tall ? 1 : 0.72
            const wh = rawH * heightScale
            const virtual = w.kind === 'corner'
              ? project(w.row - 0.5, w.col - 0.5)
              : w.edge === 'A'
                ? project(w.row - 0.5, w.col)
                : project(w.row, w.col - 0.5)
            const baseX = virtual.left + TILE_W / 2
            const baseY = virtual.top + TILE_H / 2
            const wallLeft = Math.max(0, Math.min(boardW - ww, baseX - ww / 2))
            // Wall depth is measured at the EDGE it stands on, on the shared
            // scene scale, so walls and furniture occlude each other by real
            // distance from the camera rather than by object type.
            const wRow = w.kind === 'corner' ? w.row - 0.5 : w.edge === 'A' ? w.row - 0.5 : w.row
            const wCol = w.kind === 'corner' ? w.col - 0.5 : w.edge === 'A' ? w.col : w.col - 0.5
            const z = sceneZ(wRow, wCol)
            return (
              <div key={`w${i}`}>
                <div style={{
                  position: 'absolute', left: baseX - ww * 0.22, top: baseY - wh * 0.05,
                  width: ww * 0.44, height: wh * 0.1, borderRadius: '50%',
                  background: SKIN.contactShadow, filter: 'blur(3px)',
                  zIndex: z - 1,
                }} />
                <img
                  src={`/kenney/${w.file}.png`}
                  alt=""
                  aria-hidden
                  draggable={false}
                  data-scene-object="wall"
                  data-wall-axis={w.kind === 'corner' ? 'corner' : w.edge}
                  style={{
                    position: 'absolute',
                    left: wallLeft,
                    top: baseY - wh + (TILE_H / 4) * heightScale,
                    width: ww,
                    height: wh,
                    zIndex: z,
                    opacity: 1,
                    pointerEvents: 'none',
                  }}
                />
              </div>
            )
          })}

          {/* ---------------- DECOR ----------------
              Pure decoration (handScenes.ts) — never a clue target. Rendered
              exactly like furniture, contact shadow included, so it grounds
              into the floor the same way real gameplay pieces do. */}
          {decor.map((d, i) => {
            const file = `${d.file}_${d.facing}`
            const [dw, dh] = SPRITE_DIMS[file] ?? [60, 90]
            const { left, top } = project(d.row, d.col)
            const cx = left + TILE_W / 2, cy = top + TILE_H / 2
            const groundY = cy + TILE_H / 4
            // `lift` raises a prop onto the surface it belongs on — a
            // microwave onto the counter run, a laptop onto the desk. Without
            // it every prop bottom-anchors to the tile, which is why a
            // microwave was sitting on the bare floor. A lifted prop gets no
            // floor shadow: it isn't on the floor.
            const lift = d.lift ?? 0
            const depthRow = lift > 0 ? Math.ceil(d.row) : d.row
            const depthCol = lift > 0 ? Math.ceil(d.col) : d.col
            const z = sceneZ(depthRow, depthCol, lift > 0 ? 5 : 1)
            return (
              <div key={`dec${i}`}>
                {lift === 0 && (
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
                  src={`/kenney/${file}.png`}
                  alt=""
                  aria-hidden
                  draggable={false}
                  data-scene-object="decor"
                  data-decor={d.file}
                  style={{
                    position: 'absolute',
                    left: cx - dw / 2,
                    top: groundY - dh - lift,
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
              <g key={`lr${r}`}>
                {Array.from({ length: N }, (_, c) => (
                  <polygon key={`lr${r}-${c}`} points={diamond(r, c)} fill={LANE.lockedWash} stroke={LANE.lockedEdge} strokeWidth={2.5} />
                ))}
                <circle cx={project(r, 0).left} cy={project(r, 0).top + TILE_H / 2} r={7} fill={LANE.lockedEdge} />
                <circle cx={project(r, N - 1).left + TILE_W} cy={project(r, N - 1).top + TILE_H / 2} r={7} fill={LANE.lockedEdge} />
              </g>
            ))}
            {[...lockedCols].map(c => (
              <g key={`lc${c}`}>
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
                  <polygon points={tri(rowStart.left, rowStart.top + hh, -1, 0)} fill={LANE.rowEdge} />
                  <polygon points={tri(rowEnd.left + TILE_W, rowEnd.top + hh, 1, 0)} fill={LANE.rowEdge} />
                  <polygon points={tri(colStart.left + TILE_W / 2, colStart.top, 0, -1)} fill={LANE.colEdge} />
                  <polygon points={tri(colEnd.left + TILE_W / 2, colEnd.top + TILE_H, 0, 1)} fill={LANE.colEdge} />
                </>
              )
            })()}
            {active && (
              <polygon
                points={diamond(active.row, active.col)}
                fill={LANE.cross}
                stroke={LANE.crossEdge}
                strokeWidth={4}
              />
            )}
          </svg>
          )}

          {/* ---------------- FURNITURE ----------------
              Native resolution, bottom-anchored on the diamond's centre, depth
              sorted by (row + col) so nearer pieces occlude farther ones. */}
          {furniture.map((f, i) => {
            const rot = f.rotation ?? 0
            const file = `${KENNEY_FILE[f.type]}_${rot === 90 || rot === 270 ? 'SW' : 'SE'}`
            const [nw, nh] = SPRITE_DIMS[file] ?? [92, 92]
            // A piece covering several cells must be centred over its WHOLE
            // FOOTPRINT, not its anchor cell. Drawing a w2 bed or an h2 sofa
            // at project(row, col) put it half a cell off its real position —
            // that single bug is what made furniture look like it floated,
            // clipped into walls and sat inside other objects.
            const { w: fw, h: fh } = furnitureFootprint(f)
            const centreRow = f.row + (fh - 1) / 2
            const centreCol = f.col + (fw - 1) / 2
            const frontRow = f.row + fh - 1
            const frontCol = f.col + fw - 1
            const occupiedCells = furnitureCells(f)
            const { left, top } = project(centreRow, centreCol)
            const occluding = occludes(f, active)
              || occupiedCells.some(cell => cellsWithToken.has(`${cell.row},${cell.col}`))
            const opacity = occluding ? 0.26 : inActiveLane(f) ? 0.55 : 1
            const cx = left + TILE_W / 2, cy = top + TILE_H / 2
            const groundY = cy + TILE_H / 4
            // The front-most occupied corner owns depth. A centroid can sort
            // the near half of a two-cell bed behind an object it overlaps.
            const z = sceneZ(frontRow, frontCol)
            return (
              <div key={`${f.type}-${f.row}-${f.col}-${i}`}>
                <svg
                  width={boardW}
                  height={boardH}
                  style={{ position: 'absolute', inset: 0, zIndex: z - 1, pointerEvents: 'none', filter: 'blur(5px)' }}
                >
                  <polygon
                    data-furniture-shadow={f.type}
                    data-shadow-footprint={`${fh}x${fw}`}
                    points={footprintPolygon(f.row, f.col, fh, fw, 0.68)}
                    fill={SKIN.contactShadow}
                    opacity={opacity * 0.72}
                  />
                </svg>
                <img
                  src={`/kenney/${file}.png`}
                  alt=""
                  aria-hidden
                  draggable={false}
                  data-scene-object="furniture"
                  data-furniture={f.type}
                  data-footprint-center={`${centreRow},${centreCol}`}
                  data-footprint-front={`${frontRow},${frontCol}`}
                  style={{
                    position: 'absolute',
                    left: cx - nw / 2,
                    top: groundY - nh,
                    width: nw,
                    height: nh,
                    zIndex: z,
                    opacity,
                    transition: 'opacity 160ms ease',
                    pointerEvents: 'none',
                  }}
                />
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
