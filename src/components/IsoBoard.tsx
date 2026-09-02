import { useEffect, useMemo, useRef, useState } from 'react'
import type { Puzzle, Cell, CellMark, FurnitureType } from '../core/types'
import { furnitureCells } from '../core/types'
import { resolveScene } from '../scene3d/resolve'
import { sceneFor } from '../scene3d/scenes'
import type { SceneRenderer } from '../scene3d/renderer'
import { validateScene, formatViolations } from '../scene3d/validate'
import { makeStoreyFrame, STOREY_HEIGHT, type StoreyView } from '../scene3d/units'
import Avatar from './Avatar'

// ============================================================================
// ISOMETRIC DOLLHOUSE BOARD
//
// A 3D Kenney diorama (src/scene3d) with the Murdoku grid laid over it.
//
// Two layers, one projection:
//   1. the WebGL canvas draws the house — floor, shell, partitions, furniture,
//      shadows — and the floor highlights (lanes, clue cells, targets) as
//      decals that read through walls and furniture;
//   2. a DOM/SVG layer, scaled to the same virtual canvas, carries everything
//      the player interacts with: precise cell hit polygons, suspect standees,
//      marks and drafts. It is positioned with the closed-form projection in
//      scene3d/units.ts, which is the same maths the camera is built from.
//
// Cells, rows, columns, clues and solutions are untouched: `row` and `col`
// keep their exact meaning and are simply drawn on two diagonal screen axes.
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
  /** Physical context for the inactive storey. Ghost is the primary play view. */
  storeyView?: StoreyView
  /** Lanes that JUST locked elsewhere, for the one-shot cross-storey reveal. */
  flashRows?: ReadonlySet<number>
  flashCols?: ReadonlySet<number>
  /** The suspect currently armed for placement, if any — drives the valid/invalid target ring. */
  armedPerson?: string | null
}

const SKIN = {
  tokenPlate: '#FFFFFF',
  tokenPlateConflict: '#E14B4B',
  tokenShadow: 'rgba(20,15,10,0.45)',
  contactShadow: 'rgba(20,15,10,0.35)',
  markInk: '#3A2A18',
  markHalo: 'rgba(255,255,255,0.8)',
  draftPlate: '#FFF8E6',
  draftInk: '#2A1D10',
  ghostRing: 'rgba(80,60,40,0.55)',
  validTarget: '#3FAE5C',
  invalidTarget: '#C94444',
  placementCue: 'rgba(70,45,20,0.18)',
  laneRow: 'rgba(145,91,28,0.75)',
  laneCol: 'rgba(33,104,126,0.75)',
}

const flag = (name: string) =>
  typeof window !== 'undefined' && new URLSearchParams(window.location.search).has(name)

export default function IsoBoard({
  puzzle, marks, conflicts, onCellClick,
  highlight = null, highlightLabel,
  ghostMarks = null, blockedRows, blockedCols, floor = 0,
  storeyView = 'ghost', flashRows, flashCols, armedPerson = null,
}: Props) {
  const N = puzzle.size
  const [active, setActive] = useState<{ row: number; col: number } | null>(null)

  const spec = useMemo(() => sceneFor(puzzle, floor), [puzzle, floor])
  const rawScene = useMemo(() => resolveScene(spec, N), [spec, N])
  const twoStorey = (puzzle.floors ?? 1) > 1
  const companionFloor = (floor === 0 ? 1 : 0) as 0 | 1
  const companionSpec = useMemo(
    () => twoStorey ? sceneFor(puzzle, companionFloor) : null,
    [twoStorey, puzzle, companionFloor],
  )
  const companionScene = useMemo(
    () => companionSpec ? resolveScene(companionSpec, N) : null,
    [companionSpec, N],
  )
  const frame = useMemo(
    () => twoStorey ? makeStoreyFrame(N, floor, storeyView) : rawScene.frame,
    [twoStorey, N, floor, storeyView, rawScene.frame],
  )
  const scene = useMemo(() => ({ ...rawScene, frame }), [rawScene, frame])
  const companion = useMemo(() => companionScene ? {
    scene: companionScene,
    offsetY: (floor === 0 ? 1 : -1) * (storeyView === 'ghost' ? STOREY_HEIGHT : STOREY_HEIGHT * 1.8),
    mode: storeyView,
  } : undefined, [companionScene, floor, storeyView])

  // Dev-time guardrail: the physical model is validated on every scene build
  // and the report lands in the console, where the visual QA loop reads it.
  useEffect(() => {
    if (!import.meta.env.DEV) return
    const report = validateScene(scene, puzzle)
    if (report.length) console.warn(`[scene ${scene.puzzleId}#${scene.floor}]\n` + formatViolations(report))
  }, [scene, puzzle])

  /** `?env=1` strips every puzzle overlay so the house can be judged alone. */
  const envOnly = flag('env')
  const diag = flag('diag')

  const wrapRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const rendererRef = useRef<SceneRenderer | null>(null)
  const [rendererReady, setRendererReady] = useState(0)
  const [scale, setScale] = useState(1)

  // three.js is loaded on demand: the DOM board (hit grid, tokens, marks)
  // is usable before the first model arrives, and the app shell never pays
  // for the renderer on screens that do not draw a house.
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let cancelled = false
    let created: SceneRenderer | null = null
    import('../scene3d/renderer').then(({ createSceneRenderer }) => {
      if (cancelled) return
      created = createSceneRenderer(canvas, scene, companion)
      rendererRef.current = created
      const el = wrapRef.current
      if (created && el) created.setSize(el.clientWidth || frame.width, el.clientHeight || frame.height)
      setRendererReady(v => v + 1)
    })
    return () => { cancelled = true; created?.dispose(); rendererRef.current = null }
  }, [scene, companion, frame.width, frame.height])

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const fit = () => {
      const w = el.clientWidth || frame.width
      setScale(w / frame.width)
      rendererRef.current?.setSize(w, el.clientHeight || (w * frame.height) / frame.width)
    }
    fit()
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', fit)
      return () => window.removeEventListener('resize', fit)
    }
    const ro = new ResizeObserver(fit)
    ro.observe(el)
    return () => ro.disconnect()
  }, [frame.width, frame.height])

  const roomOf = puzzle.roomOfByFloor?.[floor] ?? puzzle.roomOf
  const roomName = (r: number, c: number) =>
    puzzle.rooms.find(rm => rm.id === roomOf[r]?.[c])?.name ?? ''
  const personById = (id: string) => puzzle.people.find(p => p.id === id)

  // ---- lane state, derived from the SAME marks the logical game uses -------
  const lockedRows = new Set<number>(), lockedCols = new Set<number>()
  const conflictRows = new Set<number>(), conflictCols = new Set<number>()
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
    const m = marks[r][c]
    if (m.kind === 'person') {
      lockedRows.add(r); lockedCols.add(c)
      if (conflicts.has(m.person)) { conflictRows.add(r); conflictCols.add(c) }
    }
  }
  const furniture = useMemo(() => puzzle.furniture.filter(f => (f.floor ?? 0) === floor), [puzzle.furniture, floor])
  const clueCells = useMemo(() => {
    const targets: ClueTarget[] = highlight ? (Array.isArray(highlight) ? highlight : [highlight]) : []
    const cells = new Set<string>()
    const clueRooms = new Set(targets.map(t => t.roomId).filter(Boolean))
    const clueFurn = new Set(targets.map(t => t.furniture).filter(Boolean))
    for (const t of targets) for (const c of t.cells ?? []) cells.add(`${c.row},${c.col}`)
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
      if (clueRooms.has(roomOf[r]?.[c])) cells.add(`${r},${c}`)
      if (furniture.some(f => clueFurn.has(f.type) && furnitureCells(f).some(x => x.row === r && x.col === c))) cells.add(`${r},${c}`)
    }
    return cells
  }, [highlight, furniture, roomOf, N])

  const lockedKey = [...lockedRows].join(',') + '|' + [...lockedCols].join(',') + '|' + [...conflictRows].join(',') + '|' + [...conflictCols].join(',')
  useEffect(() => {
    rendererRef.current?.setHighlights({
      activeRow: active?.row, activeCol: active?.col,
      lockedRows, lockedCols, conflictRows, conflictCols,
      blockedRows, blockedCols, clueCells,
      hoverTarget: armedPerson && active
        ? { row: active.row, col: active.col, valid: marks[active.row][active.col].kind !== 'person' }
        : null,
      envOnly, diag,
    })
    // lockedKey stands in for the four derived sets, which are rebuilt every render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene, rendererReady, active, lockedKey, blockedRows, blockedCols, clueCells, armedPerson, envOnly, diag])

  const points = (poly: Array<[number, number]>) => poly.map(p => p.join(',')).join(' ')
  const centreOf = (r: number, c: number) => frame.project(frame.cellCentre(r, c, scene.floorY[r][c]))
  const cellPoly = (r: number, c: number) => frame.cellPolygon(r, c, scene.floorY[r][c])

  return (
    <div
      data-testid="board"
      data-iso-board=""
      data-scene-authored={scene.walls.some(w => w.kind === 'partition') ? 'true' : 'false'}
      data-storey-view={twoStorey ? storeyView : undefined}
      data-companion-floor={twoStorey ? companionFloor : undefined}
      className="relative w-full select-none"
      style={{ aspectRatio: `${frame.width} / ${frame.height}` }}
      role="grid"
      aria-label={`Isometric house, ${N} by ${N} grid, floor ${floor + 1}`}
    >
      <div ref={wrapRef} style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <canvas
          ref={canvasRef}
          data-scene-canvas=""
          aria-hidden
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}
        />
        {/* Overlay authored at the virtual canvas size and scaled as ONE unit. */}
        <div
          style={{
            position: 'absolute', width: frame.width, height: frame.height,
            transformOrigin: 'top left', transform: `scale(${scale})`,
          }}
        >
          {/* placement cues: small landing marks on every free cell while a suspect is armed */}
          {!envOnly && armedPerson && (
            <svg width={frame.width} height={frame.height} style={{ position: 'absolute', inset: 0, zIndex: 20, pointerEvents: 'none' }}>
              {Array.from({ length: N }, (_, r) => Array.from({ length: N }, (_, c) => {
                if (!roomOf[r]?.[c] || marks[r][c].kind !== 'empty') return null
                const [x, y] = centreOf(r, c)
                return <circle key={`cue${r}-${c}`} data-placement-cue="" cx={x} cy={y} r={3.5} fill={SKIN.placementCue} />
              }))}
            </svg>
          )}

          {/* active lane traces: thin dashed lines with end pins, drawn above the scene */}
          {!envOnly && active && (
            <svg width={frame.width} height={frame.height} data-active-lanes="" style={{ position: 'absolute', inset: 0, zIndex: 30, pointerEvents: 'none' }}>
              {(() => {
                const r0 = centreOf(active.row, 0), r1 = centreOf(active.row, N - 1)
                const c0 = centreOf(0, active.col), c1 = centreOf(N - 1, active.col)
                return (
                  <>
                    <line data-lane-trace="row" x1={r0[0]} y1={r0[1]} x2={r1[0]} y2={r1[1]} stroke={SKIN.laneRow} strokeWidth={2.5} strokeDasharray="9 7" />
                    <line data-lane-trace="column" x1={c0[0]} y1={c0[1]} x2={c1[0]} y2={c1[1]} stroke={SKIN.laneCol} strokeWidth={2.5} strokeDasharray="9 7" />
                    {[r0, r1].map((p, i) => <circle key={'rp' + i} cx={p[0]} cy={p[1]} r={5} fill={SKIN.laneRow} />)}
                    {[c0, c1].map((p, i) => <circle key={'cp' + i} cx={p[0]} cy={p[1]} r={5} fill={SKIN.laneCol} />)}
                  </>
                )
              })()}
            </svg>
          )}

          {/* cross-storey reveal: lanes that just locked on the other floor pulse here */}
          {!envOnly && (flashRows?.size || flashCols?.size) ? (
            <svg width={frame.width} height={frame.height} style={{ position: 'absolute', inset: 0, zIndex: 30, pointerEvents: 'none' }}>
              {[...(flashRows ?? [])].map(r => Array.from({ length: N }, (_, c) => (
                <polygon key={`fr${r}-${c}`} points={points(cellPoly(r, c))} fill="rgba(150,120,255,0.38)">
                  <animate attributeName="opacity" values="0;1;0.2;1;0.55" dur="1.4s" fill="freeze" />
                </polygon>
              )))}
              {[...(flashCols ?? [])].map(c => Array.from({ length: N }, (_, r) => (
                <polygon key={`fc${c}-${r}`} points={points(cellPoly(r, c))} fill="rgba(150,120,255,0.38)">
                  <animate attributeName="opacity" values="0;1;0.2;1;0.55" dur="1.4s" fill="freeze" />
                </polygon>
              )))}
            </svg>
          ) : null}

          {/* ---------------- TOKENS ----------------
              Suspects are gameplay and stand IN the scene: a standee whose feet
              sit on the cell's floor point, with a portrait badge at chest height. */}
          {!envOnly && Array.from({ length: N }, (_, r) => Array.from({ length: N }, (_, c) => {
            const m = marks[r][c]
            const [cx, cy] = centreOf(r, c)
            const z = 100 + (r + c) * 2
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
                  data-cell-token={`${r}-${c}`}
                  style={{ position: 'absolute', left: cx - 32, top: cy - standeeH, zIndex: z, pointerEvents: 'none' }}
                >
                  <div style={{
                    position: 'absolute', left: -4, top: standeeH - 6, width: 72, height: 16,
                    borderRadius: '50%', background: SKIN.contactShadow, filter: 'blur(2.5px)',
                  }} />
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
                <div key={`x${r}-${c}`} style={{
                  position: 'absolute', left: cx - 18, top: cy - 22, zIndex: z, pointerEvents: 'none',
                  fontSize: 38, fontWeight: 800, lineHeight: 1, color: SKIN.markInk, textShadow: `0 1px 0 ${SKIN.markHalo}`,
                }}>×</div>
              )
            }
            if (m.kind === 'draft' && m.persons.length) {
              return (
                <div key={`d${r}-${c}`} style={{
                  position: 'absolute', left: cx - 42, top: cy - 24, width: 84,
                  display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'center', zIndex: z, pointerEvents: 'none',
                }}>
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
                <div key={`g${r}-${c}`} style={{
                  position: 'absolute', left: cx - 18, top: cy - 18, width: 36, height: 36, borderRadius: '50%',
                  border: `2px dashed ${SKIN.ghostRing}`, zIndex: z, pointerEvents: 'none',
                }} />
              )
            }
            return null
          }))}

          {/* placement target ring on the hovered cell while a suspect is armed */}
          {!envOnly && armedPerson && active && (
            <svg width={frame.width} height={frame.height} style={{ position: 'absolute', inset: 0, zIndex: 400, pointerEvents: 'none' }}>
              <polygon
                data-placement-target=""
                points={points(cellPoly(active.row, active.col))}
                fill="none"
                stroke={marks[active.row][active.col].kind === 'person' ? SKIN.invalidTarget : SKIN.validTarget}
                strokeWidth={2.5}
                strokeDasharray="5 4"
              />
            </svg>
          )}

          {/* ---------------- HIT LAYER ----------------
              Precise floor polygons above everything, so a click lands on the
              cell the player aimed at and never on a model that overhangs it. */}
          <svg width={frame.width} height={frame.height} style={{ position: 'absolute', inset: 0, zIndex: 500 }}>
            {Array.from({ length: N }, (_, r) => Array.from({ length: N }, (_, c) => (
              <polygon
                key={`h${r}-${c}`}
                points={points(cellPoly(r, c))}
                fill="transparent"
                data-cell={`${r}-${c}`}
                role="gridcell"
                style={{ cursor: 'pointer', pointerEvents: 'all', touchAction: 'manipulation' }}
                onMouseEnter={() => setActive({ row: r, col: c })}
                onMouseLeave={() => setActive(a => (a && a.row === r && a.col === c ? null : a))}
                onClick={() => { setActive({ row: r, col: c }); onCellClick(r, c) }}
                aria-label={`Row ${r + 1}, column ${c + 1}${roomName(r, c) ? `, ${roomName(r, c)}` : ''}`}
              />
            )))}
          </svg>
        </div>
      </div>
      {highlightLabel && <span className="sr-only">Clue highlight: {highlightLabel}</span>}
    </div>
  )
}
