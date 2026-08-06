import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Undo2, Redo2, Trash2, Lightbulb, X as XIcon, MousePointerClick, Pencil,
  HelpCircle, Eye, EyeOff, Info, Palette,
} from 'lucide-react'
import type { Puzzle, CellMark, GameMode, Furniture, FurnitureType } from '../core/types'
import type { Tool } from '../hooks/useGame'
import MapGrid from './MapGrid'
import SuspectCard from './SuspectCard'
import HowToPlay from './HowToPlay'
import FurniturePicker from './FurniturePicker'

interface Props {
  puzzle: Puzzle
  mode: GameMode
  marks: CellMark[][]
  conflicts: Set<string>
  placedOf: Record<string, { row: number; col: number; locked?: boolean }>
  selectedPerson: string | null
  tool: Tool
  hintsLeft: number
  timer: string
  hideTimer: boolean
  canUndo: boolean
  canRedo: boolean
  feedback: 'none' | 'incomplete' | 'wrong' | 'blocked'
  correctCount: number
  resolvedClues: string[]
  onSelectPerson: (id: string) => void
  onSetTool: (t: Tool) => void
  onCell: (r: number, c: number) => void
  onToggleClue: (id: string) => void
  onUndo: () => void
  onRedo: () => void
  onClear: () => void
  onHint: () => void
  onToggleTimer: () => void
  onSubmit: () => void
  onDismissFeedback: () => void
  onBack: () => void
}

const DIFF_COLOR: Record<string, string> = {
  'Very Easy': 'var(--diff-very-easy-text)', 'Easy': 'var(--diff-easy-text)', 'Medium': 'var(--diff-medium-text)', 'Hard': 'var(--diff-hard-text)', 'Expert': 'var(--diff-expert-text)',
}
const HELP_KEY = 'murdoku_seen_help'

// ── Legend content — shared by the desktop Case File rail (always expanded)
//    and the mobile/narrow disclosure. One source, no drift.
function LegendContent() {
  return (
    <div
      className="border bg-bg-surface p-3 text-[11px] font-mono text-text-secondary grid gap-1.5"
      style={{ borderColor: 'var(--color-border-subtle)', boxShadow: 'var(--shadow-cut)' }}
    >
      <p>• <b className="text-text-primary">Coloured areas</b> are rooms (labelled). Different tint &amp; floor = different room.</p>
      <p>• <b className="text-text-primary">Furniture icons</b> are scene decoration that clues refer to (a chair, a rug, a plant…).</p>
      <p>• <b className="text-text-primary">✕</b> marks a cell where nobody is; faint ✕ is auto-added when you lock a row/column.</p>
      <p>• A glowing ring = a placed suspect; a red ring means two suspects share a row or column.</p>
    </div>
  )
}

export default function GameScreen(props: Props) {
  const { puzzle, mode, marks, conflicts, placedOf, selectedPerson, tool, hintsLeft, timer, hideTimer, feedback, correctCount, resolvedClues } = props
  const cluesOf: Record<string, string[]> = {}
  for (const ct of puzzle.clues) (cluesOf[ct.clue.person] ||= []).push(ct.text)
  const placedCount = Object.keys(placedOf).length
  const detective = mode === 'detective'

  const [help, setHelp] = useState(false)
  const [legend, setLegend] = useState(false)
  const [confirmClear, setConfirmClear] = useState(false)
  const [confirmLeave, setConfirmLeave] = useState(false)

  // Furniture decoration editor
  const [showDecor, setShowDecor] = useState(false)
  const [placingFurniture, setPlacingFurniture] = useState<FurnitureType | null>(null)
  const [placingRotation, setPlacingRotation] = useState<0 | 90 | 180 | 270>(0)
  const [customFurniture, setCustomFurniture] = useState<Furniture[]>([])

  function handlePlaceFurniture(r: number, c: number) {
    if (!placingFurniture) return
    setCustomFurniture(prev => {
      const sameSpot = prev.findIndex(f => f.row === r && f.col === c && f.type === placingFurniture)
      if (sameSpot >= 0) return prev.filter((_, i) => i !== sameSpot)
      const cleared = prev.filter(f => !(f.row === r && f.col === c))
      return [...cleared, { type: placingFurniture, row: r, col: c, rotation: placingRotation }]
    })
  }

  function handleRotatePlacing() {
    setPlacingRotation(prev => ((prev + 90) % 360) as 0 | 90 | 180 | 270)
  }

  // Every Accuse press bumps this, whether or not `feedback` changes value —
  // two identical rejections in a row must still re-announce themselves.
  const [submitNonce, setSubmitNonce] = useState(0)
  function handleSubmit() {
    setSubmitNonce(n => n + 1)
    props.onSubmit()
  }

  // A miss or an illegal placement is a real rejection and earns the shake.
  // "You haven't finished yet" is guidance, not a mistake, so it only surfaces
  // the message — shaking there would scold the player for doing nothing wrong.
  const hardReject = feedback === 'wrong' || feedback === 'blocked'

  // Replay the shake by restarting the animation IN PLACE rather than by
  // remounting via `key`. Remounting destroys the focused node, so a keyboard
  // user who presses Enter to accuse loses focus to <body> and has to tab back
  // to the CTA — on the game's primary action. Removing the class, forcing a
  // reflow, then re-adding it restarts a CSS animation while keeping the same
  // element (and therefore the focus ring and the screen-reader cursor).
  const ctaRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (submitNonce === 0 || !hardReject) return
    const el = ctaRef.current
    if (!el) return
    el.classList.remove('animate-shake')
    void el.offsetWidth // forced reflow — without it the re-add is coalesced
    el.classList.add('animate-shake')
  }, [submitNonce, hardReject])

  const hasProgress = marks.some(row => row.some(c => c.kind !== 'empty'))

  useEffect(() => {
    try { if (!localStorage.getItem(HELP_KEY)) { setHelp(true); localStorage.setItem(HELP_KEY, '1') } } catch { /* ignore */ }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="bg-bg-base flex flex-col min-h-[100dvh] lg:h-[100dvh] lg:overflow-hidden"
    >
      <AnimatePresence>{help && <HowToPlay mode={mode} onClose={() => setHelp(false)} />}</AnimatePresence>

      {/*
        ── THREE-COLUMN DETECTIVE'S DESK ─────────────────────────────────────

        Architecture: CSS grid with `display:contents` wrapper trick.

        At mobile: the three wrapper divs (case-file-col, scene-col, dossier-col)
        are `contents` — they dissolve into the flow and the four sections
        (board, suspects, toolbar, accuse) sequence via `order-*` as if they were
        direct children of this flex column. DOM order preserved; no markup fork.

        At lg+: wrappers become `flex flex-col` grid cells — each column scrolls
        (or not) independently. The SCENE column is non-scrolling by design.

        Three-column grid starts at xl (1280px+):
          col 1: Case File rail  — minmax(260px,320px)
          col 2: The Scene       — minmax(0,1fr)
          col 3: Dossier         — minmax(340px,420px)

        Two-column grid at lg–xl (1024–1280px):
          col 1: The Scene       — minmax(0,1fr)
          col 2: Dossier         — minmax(320px,420px)
          The case-file rail content folds into the dossier column top.

        Below lg: single scrolling column.
      */}

      {/* ── Header — spans all columns at lg+, full-width at mobile ────────── */}
      <header
        className="pt-safe flex items-center justify-between px-4 pt-3 pb-2 flex-shrink-0 lg:col-span-full"
        style={{ borderBottom: '1px solid var(--color-border-subtle)' }}
      >
        {/* Back — stencil label */}
        <button
          onClick={() => hasProgress ? setConfirmLeave(true) : props.onBack()}
          className="focus-ring text-text-muted font-mono text-xs px-2 min-h-[44px] flex items-center whitespace-nowrap flex-shrink-0 tracking-widest uppercase hover:text-text-secondary transition-colors"
        >
          ← Cases
        </button>

        {/* Case title + metadata */}
        <div className="text-center min-w-0 px-2 flex-1">
          <h1 className="font-display text-text-primary text-base font-bold leading-tight truncate uppercase tracking-wide">
            {puzzle.title}
          </h1>
          <div className="flex items-center justify-center gap-2 mt-0.5">
            <span
              className="text-[10px] font-mono tracking-[0.18em] whitespace-nowrap"
              style={{ color: DIFF_COLOR[puzzle.difficulty] }}
            >
              {puzzle.difficulty.toUpperCase()}
            </span>
            <span className="text-text-muted text-[10px] font-mono whitespace-nowrap tracking-wider">
              {puzzle.size}×{puzzle.size}
            </span>
            <span
              className="text-[10px] font-mono tracking-[0.15em] px-1.5 whitespace-nowrap"
              style={{
                color: detective ? 'var(--color-accent-text)' : 'var(--color-text-muted)',
                background: detective ? 'color-mix(in srgb, var(--color-accent) 14%, transparent)' : 'transparent',
              }}
            >
              {detective ? 'DETECTIVE' : 'CLASSIC'}
            </span>
          </div>
        </div>

        {/* Timer + icon controls — always in header so it's reachable on mobile */}
        <div className="flex items-center gap-1.5">
          {!hideTimer && (
            <span className="font-mono text-accent-text text-sm tabular-nums tracking-widest">
              {timer}
            </span>
          )}
          <button
            onClick={props.onToggleTimer}
            aria-label={hideTimer ? 'Show timer' : 'Hide timer'}
            title={hideTimer ? 'Show timer' : 'Hide timer (relaxed)'}
            className="focus-ring text-text-muted w-11 h-11 flex items-center justify-center hover:text-text-secondary transition-colors"
          >
            {hideTimer ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
          <button
            onClick={() => setHelp(true)}
            aria-label="How to play"
            title="How to play"
            className="focus-ring text-text-muted w-11 h-11 flex items-center justify-center hover:text-text-secondary transition-colors"
          >
            <HelpCircle size={19} />
          </button>
        </div>
      </header>

      {/*
        Body grid — three columns at xl, two at lg, one below lg.
        `lg:grid` activates the column layout; below that it's a flex column.
        The wrapper divs use `contents` trick (below lg) / real grid cells (lg+).
      */}
      <div
        className={[
          'flex-1 flex flex-col min-h-0',
          // lg: two-column grid
          'lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(320px,420px)] lg:grid-rows-[1fr] lg:min-h-0',
          // xl: three-column grid
          'xl:grid-cols-[minmax(260px,320px)_minmax(0,1fr)_minmax(340px,420px)]',
        ].join(' ')}
      >

        {/* ── CASE FILE RAIL (left) ─────────────────────────────────────────
            Mobile: display:contents — contributes nothing to flow, children
            are ordered via order-* on the flex column above.
            lg: hidden (folded into dossier top via xl:block below).
            xl: first grid column — visible side rail.
        */}
        <div className="contents xl:flex xl:flex-col xl:min-h-0 xl:overflow-y-auto xl:border-r xl:col-start-1 xl:row-start-1"
          style={{ borderColor: 'var(--color-border-subtle)' }}
        >
          {/* Case file rail inner — only rendered visually at xl */}
          <div className="hidden xl:flex xl:flex-col xl:gap-4 xl:p-4 xl:flex-1">

            {/* Case metadata block */}
            <div className="border-b pb-4" style={{ borderColor: 'var(--color-border-subtle)' }}>
              <p className="text-[9px] font-mono text-text-muted tracking-[0.25em] uppercase mb-2">Case File</p>
              <p className="font-display font-bold text-text-primary text-lg uppercase tracking-wide leading-tight">{puzzle.title}</p>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span
                  className="text-[10px] font-mono tracking-[0.18em]"
                  style={{ color: DIFF_COLOR[puzzle.difficulty] }}
                >
                  {puzzle.difficulty.toUpperCase()}
                </span>
                <span className="text-text-muted text-[10px] font-mono tracking-wider">{puzzle.size}×{puzzle.size}</span>
                <span
                  className="text-[10px] font-mono tracking-[0.15em] px-1.5"
                  style={{
                    color: detective ? 'var(--color-accent-text)' : 'var(--color-text-muted)',
                    background: detective ? 'color-mix(in srgb, var(--color-accent) 14%, transparent)' : 'transparent',
                  }}
                >
                  {detective ? 'DETECTIVE' : 'CLASSIC'}
                </span>
              </div>
            </div>

            {/* Timer — large, case-file data */}
            <div className="border-b pb-4" style={{ borderColor: 'var(--color-border-subtle)' }}>
              <p className="text-[9px] font-mono text-text-muted tracking-[0.25em] uppercase mb-2">Time Elapsed</p>
              {!hideTimer ? (
                <span className="font-mono text-accent-text text-3xl tabular-nums tracking-widest">{timer}</span>
              ) : (
                <span className="font-mono text-text-muted text-xl tracking-widest">— : — —</span>
              )}
              <button
                onClick={props.onToggleTimer}
                aria-label={hideTimer ? 'Show timer' : 'Hide timer'}
                className="focus-ring block mt-1.5 text-[10px] font-mono text-text-muted tracking-widest uppercase hover:text-text-secondary transition-colors"
              >
                {hideTimer ? '+ Show timer' : '— Hide timer'}
              </button>
            </div>

            {/* Progress */}
            <div className="border-b pb-4" style={{ borderColor: 'var(--color-border-subtle)' }}>
              <p className="text-[9px] font-mono text-text-muted tracking-[0.25em] uppercase mb-2">Progress</p>
              <p className="font-mono text-text-secondary text-sm">
                <span className="text-text-primary font-bold">{placedCount}</span>
                <span className="text-text-muted"> / {puzzle.size}</span>
                <span className="text-text-muted text-[10px] ml-2">suspects placed</span>
              </p>
              <p className="font-mono text-text-secondary text-sm mt-1">
                <span className="text-text-primary font-bold">{hintsLeft}</span>
                <span className="text-text-muted text-[10px] ml-1">hints remaining</span>
              </p>
            </div>

            {/* Legend — always expanded on the desktop rail */}
            <div className="border-b pb-4" style={{ borderColor: 'var(--color-border-subtle)' }}>
              <p className="text-[9px] font-mono text-text-muted tracking-[0.25em] uppercase mb-2">Reading the Scene</p>
              <LegendContent />
            </div>

            {/* Future features placeholder — deliberate empty state */}
            <div>
              <p className="text-[9px] font-mono text-text-muted tracking-[0.25em] uppercase mb-2">Detective&apos;s Notes</p>
              <div
                className="border p-3 min-h-[80px] flex items-center justify-center"
                style={{ borderColor: 'var(--color-border-subtle)', borderStyle: 'dashed' }}
              >
                <p className="text-[10px] font-mono text-text-muted tracking-wide text-center">
                  [ Coming soon ]
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* ── THE SCENE (centre / full-width at lg) ────────────────────────
            Mobile: contents — board is order-1, toolbar is order-3.
            lg: first grid column (two-col layout), non-scrolling.
            xl: second grid column (three-col layout), non-scrolling.
            The board fills available height — no scrollbar, board always visible.
        */}
        <div
          className={[
            'contents',
            // lg: real grid column — non-scrolling, board fills the height
            'lg:flex lg:flex-col lg:min-h-0 lg:overflow-hidden lg:col-start-1 lg:row-start-1',
            // xl: shift to second column
            'xl:col-start-2',
          ].join(' ')}
        >
          {/* ── Instruction line (mobile: order 0, desktop: inside centre) ── */}
          <p
            className={[
              'px-5 py-2 text-center text-text-muted text-[12px] font-mono tracking-wide flex-shrink-0',
              // on desktop, show only in the scene column (hide at top-level flow)
              'order-0 lg:block',
            ].join(' ')}
          >
            {detective
              ? 'Place a suspect to cross out their row & column automatically. Use Draft to pencil in candidates. Each person = one row, one column.'
              : 'Each person is in exactly one row and one column. Read the clues, place everyone, then submit.'}
          </p>

          {/* ── Board slot ────────────────────────────────────────────────
              Single MapGrid instance — no mobile/desktop fork.

              Mobile: the slot is in normal flow (wrapper is `contents`).
                `aspect-square` on the inner makes it a natural square that
                grows to full column width.

              Desktop (lg+): the slot is `flex-1 min-h-0 relative`. The
                absolute fill + inner flex centering approach:
                  - the absolute div fills the slot completely (known px height)
                  - the aspect-square child with max-w/max-h 100% is constrained
                    to whichever dimension (w or h) is smaller, staying square.
          */}
          <div className="order-1 lg:flex-1 lg:min-h-0 lg:relative">
            {/* Absolute fill at desktop only; on mobile this is just a normal div */}
            <div className="lg:absolute lg:inset-0 flex items-center justify-center p-2 lg:p-3">
              {/* Square that fits the shorter of available width / height.
                  Mobile: w-full drives size; aspect-square derives the height
                    (parent has no fixed height so height:100% would be 0).
                  Desktop (lg+): the absolute container has a known pixel height;
                    lg:h-full takes that height, aspect-square makes width equal,
                    and max-w-full clamps if it would exceed the container width. */}
              <div
                className="aspect-square w-full lg:w-auto lg:h-full"
                style={{ maxWidth: '100%' }}
              >
                <MapGrid
                  puzzle={puzzle}
                  marks={marks}
                  conflicts={conflicts}
                  onCellClick={props.onCell}
                  extraFurniture={customFurniture}
                  placingFurniture={showDecor ? placingFurniture : null}
                  placingRotation={placingRotation}
                  onPlaceFurniture={showDecor ? handlePlaceFurniture : undefined}
                />
              </div>
            </div>
          </div>

          {/* Legend (mobile only — disclosure; on xl it's in the rail, expanded) */}
          <div className="order-2 xl:hidden mx-auto w-full max-w-[640px] px-4 pb-1">
            <button
              onClick={() => setLegend(v => !v)}
              className="focus-ring flex items-center gap-1.5 text-[11px] text-text-muted font-mono mx-auto tracking-widest uppercase hover:text-text-secondary transition-colors"
            >
              <Info size={13} /> {legend ? '— Hide' : '+ What am I looking at?'}
            </button>
            <AnimatePresence>
              {legend && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden mt-2"
                >
                  <LegendContent />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── Toolbar ─────────────────────────────────────────────────────
              Mobile: order-3 — after board and suspects.
              Desktop: flex-shrink-0 at the bottom of the scene column.
              FurniturePicker lives here so it's beside the board.
          */}
          <div className="order-3 flex-shrink-0 mx-auto w-full max-w-[640px] px-3 pb-3 lg:pb-3 flex flex-col gap-2">
            {/* FurniturePicker — transient, in the scene column */}
            <AnimatePresence>
              {showDecor && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <FurniturePicker
                    selected={placingFurniture}
                    rotation={placingRotation}
                    onSelect={setPlacingFurniture}
                    onRotate={handleRotatePlacing}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Mode row — Place / Draft / Mark */}
            <div className="flex gap-2 justify-center [&>button]:flex-1 sm:[&>button]:flex-none">
              <ToolBtn
                active={tool === 'place'}
                onClick={() => props.onSetTool('place')}
                icon={<MousePointerClick size={16} />}
                label="Place"
                title={detective ? 'Place a suspect — crosses out their row & column' : 'Place a suspect'}
              />
              {detective && (
                <ToolBtn
                  active={tool === 'draft'}
                  onClick={() => props.onSetTool('draft')}
                  icon={<Pencil size={16} />}
                  label="Draft"
                  title="Pencil in candidates (no elimination)"
                />
              )}
              <ToolBtn
                active={tool === 'x'}
                onClick={() => props.onSetTool('x')}
                icon={<XIcon size={16} />}
                label="Mark ✕"
              />
            </div>

            {/* Actions grid — Undo / Redo / Clear / Hint / Decorate */}
            <div className="grid grid-cols-3 gap-2 sm:flex sm:flex-wrap sm:justify-center">
              <ToolBtn onClick={props.onUndo} disabled={!props.canUndo} icon={<Undo2 size={16} />} label="Undo" />
              <ToolBtn onClick={props.onRedo} disabled={!props.canRedo} icon={<Redo2 size={16} />} label="Redo" />
              <ToolBtn onClick={() => setConfirmClear(true)} icon={<Trash2 size={16} />} label="Clear" />
              <ToolBtn onClick={props.onHint} disabled={hintsLeft <= 0} icon={<Lightbulb size={16} />} label={`Hint ×${hintsLeft}`} />
              <ToolBtn
                toggled={showDecor}
                onClick={() => { setShowDecor(v => !v); if (showDecor) setPlacingFurniture(null) }}
                icon={<Palette size={16} />}
                label="Decorate"
                title="Place decorative furniture"
              />
            </div>
          </div>

        </div>{/* end scene column */}

        {/* ── DOSSIER (right) ───────────────────────────────────────────────
            Mobile: contents — suspects is order-2, accuse is order-4.
            lg: second grid column. Suspects scroll, Accuse is anchored bottom.
            xl: third grid column.
            Structure: flex-col with suspects taking flex-1 (scrolls) and
            accuse as flex-shrink-0 outside the scroll zone — so the shake's
            translate3d never clips inside an overflow-y container.
        */}
        <div
          className={[
            'contents',
            'lg:flex lg:flex-col lg:min-h-0 lg:border-l lg:col-start-2 lg:row-start-1',
            'xl:col-start-3',
          ].join(' ')}
          style={{ borderColor: 'var(--color-border-subtle)' } as React.CSSProperties}
        >

          {/* Case meta at lg (two-col) — folded rail content at top of dossier.
              On xl it's hidden because the side rail has it. */}
          <div className="hidden lg:block xl:hidden flex-shrink-0 px-4 pt-3 pb-2 border-b"
            style={{ borderColor: 'var(--color-border-subtle)' }}
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[9px] font-mono text-text-muted tracking-[0.25em] uppercase">Progress</p>
                <p className="font-mono text-text-secondary text-sm mt-0.5">
                  <span className="text-text-primary font-bold">{placedCount}</span>
                  <span className="text-text-muted"> / {puzzle.size}</span>
                  <span className="text-text-muted text-[10px] ml-1.5">placed</span>
                  <span className="text-text-muted text-[10px] ml-2">·</span>
                  <span className="text-text-primary font-bold ml-2">{hintsLeft}</span>
                  <span className="text-text-muted text-[10px] ml-1">hints</span>
                </p>
              </div>
              {/* Timer shown in dossier at lg when the rail isn't visible */}
              {!hideTimer && (
                <span className="font-mono text-accent-text text-xl tabular-nums tracking-widest">{timer}</span>
              )}
            </div>
          </div>

          {/* Suspects list — scrollable region */}
          {/*
            Mobile: order-2 — between board and toolbar in the single column.
            Desktop: flex-1 overflow-y-auto — fills dossier column, scrolls.
          */}
          <div className="order-2 lg:flex-1 lg:min-h-0 lg:overflow-y-auto">
            <div className="p-3 lg:p-4 flex flex-col gap-3">

              {/* Suspects label */}
              <p className="text-[10px] text-text-muted font-mono uppercase tracking-[0.2em]">
                Suspects · tap to select{detective ? ' · check off solved clues' : ''}
              </p>

              {/* Suspect cards — single column on all breakpoints in the dossier */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
                {puzzle.people.map(person => (
                  <SuspectCard
                    key={person.id}
                    person={person}
                    clues={cluesOf[person.id] ?? []}
                    selected={selectedPerson === person.id}
                    placed={!!placedOf[person.id]}
                    locked={!!placedOf[person.id]?.locked}
                    conflicted={conflicts.has(person.id)}
                    resolved={resolvedClues.includes(person.id)}
                    showCheck={detective}
                    onSelect={() => props.onSelectPerson(person.id)}
                    onToggleResolved={() => props.onToggleClue(person.id)}
                  />
                ))}
              </div>

            </div>
          </div>

          {/* ── Accuse CTA — anchored OUTSIDE the scroll zone ────────────────
              Mobile: order-4 — last in the single column.
              Desktop: flex-shrink-0 below the suspects scroller.
              Note: Accuse is outside overflow-y-auto on purpose — the shake's
              translate3d(±5px) must not clip inside the scroll container, which
              would also produce a transient horizontal scrollbar at 390px.
          */}
          <div className="order-4 flex-shrink-0 p-3 lg:p-4 flex flex-col gap-2 border-t"
            style={{ borderColor: 'var(--color-border-subtle)' }}
          >
            {/* ── Accuse — the dramatic beat ─────────────────────────────── */}
            <motion.button
              /* No `key` here on purpose — see the effect above. The class is
                 added imperatively so the element (and its focus) survives. */
              ref={ctaRef}
              whileTap={{ scale: 0.97 }}
              onClick={handleSubmit}
              className="focus-ring w-full py-4 font-display font-bold tracking-[0.15em] uppercase text-sm transition-colors"
              style={{
                background: 'var(--color-accent)',
                color: 'var(--color-on-accent)',
                boxShadow: '0 4px 0 0 color-mix(in srgb, var(--color-accent) 45%, #000), var(--shadow-cut)',
                letterSpacing: '0.15em',
              }}
            >
              Accuse — Submit Solution ({placedCount}/{puzzle.size})
            </motion.button>

            {/* ── Feedback message ─────────────────────────────────────────
                Framer owns this node's transform (the y entry offset), so it
                must NOT also carry animate-shake — two systems writing one
                composited property fight during the 400ms overlap. The CTA
                above carries the shake; this only re-plays its entry. */}
            <AnimatePresence>
              {feedback !== 'none' && (
                <motion.button
                  onClick={props.onDismissFeedback}
                  key={`feedback-${submitNonce}`}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-[12px] font-mono px-3 py-2 text-center w-full tracking-wide"
                  style={{
                    color: 'var(--color-danger-text)',
                    backgroundColor: 'color-mix(in srgb, var(--color-danger) 14%, transparent)',
                    borderLeft: '2px solid var(--color-danger)',
                  }}
                >
                  {feedback === 'incomplete'
                    ? 'Place every person first.'
                    : feedback === 'blocked'
                    ? 'That row or column is already taken by another suspect.'
                    : `Not quite — ${correctCount} of ${puzzle.people.length} are in the right spot. Keep deducing.`}
                </motion.button>
              )}
            </AnimatePresence>
          </div>

        </div>{/* end dossier column */}

      </div>{/* end body grid */}

      {/* ── Leave confirmation ── classified dossier dialog ─────────────── */}
      <AnimatePresence>
        {confirmLeave && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'var(--overlay-scrim)' }}
            onClick={() => setConfirmLeave(false)}
          >
            <motion.div
              initial={{ scale: 0.94, y: 8 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-xs border bg-bg-surface p-6 text-center"
              style={{
                borderColor: 'var(--color-border-strong)',
                boxShadow: 'var(--shadow-elevated)',
              }}
            >
              <p className="font-display font-bold text-text-primary text-lg mb-1 uppercase tracking-[0.12em]">
                Leave this case?
              </p>
              <p className="text-text-secondary text-[13px] font-mono mb-5 tracking-wide">
                Progress is saved — you can pick up where you left off.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmLeave(false)}
                  className="focus-ring flex-1 py-2.5 border font-display text-sm uppercase tracking-[0.1em] text-text-secondary hover:text-text-primary transition-colors"
                  style={{ borderColor: 'var(--color-border-strong)' }}
                >
                  Stay
                </button>
                <button
                  onClick={props.onBack}
                  className="focus-ring flex-1 py-2.5 font-display text-sm uppercase tracking-[0.1em]"
                  style={{ background: 'var(--color-accent)', color: 'var(--color-on-accent)' }}
                >
                  Leave
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Clear confirmation ── classified dossier dialog ──────────────── */}
      <AnimatePresence>
        {confirmClear && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'var(--overlay-scrim)' }}
            onClick={() => setConfirmClear(false)}
          >
            <motion.div
              initial={{ scale: 0.94, y: 8 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-xs border bg-bg-surface p-6 text-center"
              style={{
                borderColor: 'var(--color-border-strong)',
                boxShadow: 'var(--shadow-elevated)',
              }}
            >
              <p className="font-display font-bold text-text-primary text-lg mb-1 uppercase tracking-[0.12em]">
                Clear the board?
              </p>
              <p className="text-text-secondary text-[13px] font-mono mb-5 tracking-wide">
                This removes every placement, ✕ and draft. You can undo it once.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmClear(false)}
                  className="focus-ring flex-1 py-2.5 border font-display text-sm uppercase tracking-[0.1em] text-text-secondary hover:text-text-primary transition-colors"
                  style={{ borderColor: 'var(--color-border-strong)' }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => { props.onClear(); setConfirmClear(false) }}
                  className="focus-ring flex-1 py-2.5 font-display text-sm uppercase tracking-[0.1em]"
                  style={{ background: 'var(--color-danger)', color: 'var(--color-on-accent)' }}
                >
                  Clear
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function ToolBtn({ active, toggled, disabled, cta, onClick, icon, label, title }: {
  active?: boolean; toggled?: boolean; disabled?: boolean; cta?: boolean; onClick: () => void; icon: React.ReactNode; label: string; title?: string
}) {
  // `active` = the current TOOL mode (strong fill). `toggled` = an action that
  // is currently engaged, e.g. a locked suspect (outline only — visually
  // distinct from a tool mode so it never reads as "you switched tools").
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-pressed={active || toggled}
      className="focus-ring flex items-center justify-center gap-1.5 px-3.5 min-h-[44px] border text-[13px] font-display font-medium transition-colors whitespace-nowrap uppercase tracking-[0.08em]"
      style={{
        borderColor: active
          ? 'var(--color-accent)'
          : (toggled || cta)
          ? 'color-mix(in srgb, var(--color-accent) 65%, transparent)'
          : 'var(--color-border-strong)',
        backgroundColor: active
          ? 'color-mix(in srgb, var(--color-accent) 22%, transparent)'
          : 'var(--color-bg-surface)',
        color: active
          ? 'var(--color-accent-text)'
          : (toggled || cta)
          ? 'var(--color-accent-text)'
          : 'var(--color-text-secondary)',
        borderStyle: toggled && !active ? 'dashed' : 'solid',
        opacity: disabled ? 0.35 : 1,
        boxShadow: active ? 'var(--shadow-cut)' : 'none',
      }}
    >
      {icon}{label}
    </button>
  )
}
