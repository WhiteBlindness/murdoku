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
      className="min-h-screen bg-bg-base flex flex-col"
    >
      <AnimatePresence>{help && <HowToPlay mode={mode} onClose={() => setHelp(false)} />}</AnimatePresence>

      {/* ── Header ── case file dossier top edge ─────────────────────────── */}
      <header
        className="pt-safe flex items-center justify-between px-4 pt-3 pb-2 flex-shrink-0"
        style={{ borderBottom: '1px solid var(--color-border-subtle)' }}
      >
        {/* Back — stencil label, text affordance (no border needed) */}
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
            {/* Difficulty: typed mark, noir scale colour */}
            <span
              className="text-[10px] font-mono tracking-[0.18em] whitespace-nowrap"
              style={{ color: DIFF_COLOR[puzzle.difficulty] }}
            >
              {puzzle.difficulty.toUpperCase()}
            </span>
            {/* Grid size: typewriter metadata */}
            <span className="text-text-muted text-[10px] font-mono whitespace-nowrap tracking-wider">
              {puzzle.size}×{puzzle.size}
            </span>
            {/* Mode chip: stencilled */}
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

        {/* Timer + icon controls */}
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

      {/* ── Instruction line ── typed log entry ──────────────────────────── */}
      <p className="px-5 py-2 text-center text-text-muted text-[12px] font-mono max-w-2xl mx-auto flex-shrink-0 tracking-wide">
        {detective
          ? 'Place a suspect to cross out their row & column automatically. Use Draft to pencil in candidates. Each person = one row, one column.'
          : 'Each person is in exactly one row and one column. Read the clues, place everyone, then submit.'}
      </p>

      {/*
        Four-section grid. Mobile (1-col): board → suspects → toolbar → accuse.
        Desktop lg (2-col): left col = board+toolbar (rows 1-2), right col = suspects+accuse (rows 1-2).
        This lets suspects stay close to the board on mobile (clues visible without deep scroll)
        and fills the right column height on desktop so both columns end near the same baseline.
      */}
      <div className="flex-1 w-full max-w-6xl mx-auto px-3 pb-safe pb-4 grid gap-4 lg:grid-cols-[1fr_minmax(320px,420px)] lg:grid-rows-[auto_auto]">

        {/* Section A — Board + Legend (mobile: order 1, desktop: left col row 1) */}
        <div className="flex flex-col gap-3 order-1 lg:col-start-1 lg:row-start-1">
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

          {/* Legend — case file annotation */}
          <div className="mx-auto w-full max-w-[580px]">
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
                  className="overflow-hidden"
                >
                  <div
                    className="mt-2 border bg-bg-surface p-3 text-[11px] font-mono text-text-secondary grid gap-1.5"
                    style={{ borderColor: 'var(--color-border-subtle)', boxShadow: 'var(--shadow-cut)' }}
                  >
                    <p>• <b className="text-text-primary">Coloured areas</b> are rooms (labelled). Different tint & floor = different room.</p>
                    <p>• <b className="text-text-primary">Furniture icons</b> are scene decoration that clues refer to (a chair, a rug, a plant…).</p>
                    <p>• <b className="text-text-primary">✕</b> marks a cell where nobody is; faint ✕ is auto-added when you lock a row/column.</p>
                    <p>• A glowing ring = a placed suspect; a red ring means two suspects share a row or column.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Section B — Suspects + Furniture Picker (mobile: order 2, desktop: right col row 1) */}
        <div className="order-2 lg:col-start-2 lg:row-start-1 flex flex-col gap-3">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
            {/* Section label — stencilled field header */}
            <p className="col-span-full text-[10px] text-text-muted font-mono uppercase tracking-[0.2em] mb-0.5">
              Suspects · tap to select{detective ? ' · check off solved clues' : ''}
            </p>
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

        {/* Section C — Toolbar (mobile: order 3, desktop: left col row 2) */}
        {/*
          Split by MEANING, not by count: modes (what a tap does) sit apart from
          actions (one-shot commands). That reads better and removes the orphan
          for free — a single 4-column grid stranded the last button on its own
          row at 390px, and the button count changes with detective mode.
          Modes are 2-3 items on one line; actions are 5 in a 3-col grid → 3+2,
          which cannot leave a lone button in either mode. On sm+ both revert to
          auto-width flex so "Undo" isn't a 175px slab, capped to the board
          width so the controls stay visually attached to the board.
        */}
        <div className="order-3 lg:col-start-1 lg:row-start-2 mx-auto w-full max-w-[580px] flex flex-col gap-2">
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

        {/* Section D — Accuse CTA + feedback (mobile: order 4, desktop: right col row 2) */}
        {/* Aligned to the row start (not `justify-end`): the grid's row 1 is as
            tall as the board, so pushing this to the row's bottom stranded the
            CTA ~90px below the toolbar. Starting it aligns both columns' row 2. */}
        <div className="order-4 lg:col-start-2 lg:row-start-2 flex flex-col items-center gap-2">

          {/* ── Accuse — the dramatic beat. Slam a file on the desk. ─────── */}
          <motion.button
            /* No `key` here on purpose — see the effect above. The class is
               added imperatively so the element (and its focus) survives. */
            ref={ctaRef}
            whileTap={{ scale: 0.97 }}
            onClick={handleSubmit}
            className="focus-ring w-full py-4 font-display font-bold tracking-[0.15em] uppercase text-sm transition-colors"
            style={{
              // Noir: stark brass block, ink text — not a gradient pill.
              // Sharp corners: no border-radius. Shadow punches it off the desk.
              background: 'var(--color-accent)',
              color: 'var(--color-on-accent)',
              boxShadow: '0 4px 0 0 color-mix(in srgb, var(--color-accent) 45%, #000), var(--shadow-cut)',
              letterSpacing: '0.15em',
            }}
          >
            Accuse — Submit Solution ({placedCount}/{puzzle.size})
          </motion.button>

          {/* ── Feedback message — typed log entry ───────────────────────── */}
          <AnimatePresence>
            {feedback !== 'none' && (
              <motion.button
                onClick={props.onDismissFeedback}
                /* Framer owns this node's transform (the y entry offset), so it
                   must NOT also carry animate-shake — two systems writing one
                   composited property fight during the 400ms overlap. The CTA
                   above carries the shake; this only re-plays its entry. */
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
      </div>

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
              {/* Case stamp heading */}
              <p className="font-display font-bold text-text-primary text-lg mb-1 uppercase tracking-[0.12em]">
                Leave this case?
              </p>
              <p className="text-text-secondary text-[13px] font-mono mb-5 tracking-wide">
                Progress is saved — you can pick up where you left off.
              </p>
              <div className="flex gap-3">
                {/* Stay — outline, strong border tier (border IS the affordance) */}
                <button
                  onClick={() => setConfirmLeave(false)}
                  className="focus-ring flex-1 py-2.5 border font-display text-sm uppercase tracking-[0.1em] text-text-secondary hover:text-text-primary transition-colors"
                  style={{ borderColor: 'var(--color-border-strong)' }}
                >
                  Stay
                </button>
                {/* Leave — filled, accent */}
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
                {/* Cancel — outline, strong border tier */}
                <button
                  onClick={() => setConfirmClear(false)}
                  className="focus-ring flex-1 py-2.5 border font-display text-sm uppercase tracking-[0.1em] text-text-secondary hover:text-text-primary transition-colors"
                  style={{ borderColor: 'var(--color-border-strong)' }}
                >
                  Cancel
                </button>
                {/* Clear — filled, danger */}
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
  // Border tier: resting outline buttons use --color-border-strong because the
  // border IS the affordance; active/toggled/cta still use accent variants.
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-pressed={active || toggled}
      className="focus-ring flex items-center justify-center gap-1.5 px-3.5 min-h-[44px] border text-[13px] font-display font-medium transition-colors whitespace-nowrap uppercase tracking-[0.08em]"
      style={{
        // Only the current TOOL gets the strong filled highlight. `cta` (an
        // available action) is a subtle coloured border; `toggled` (engaged
        // action, e.g. locked) is a dashed coloured border. Neither is filled,
        // so they never look like "the mode you're in".
        // Resting state uses --color-border-strong (not subtle) because the
        // border alone marks the interactive boundary — WCAG 1.4.11 requires
        // the strong tier (3.5:1) whenever a border is the only affordance.
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
