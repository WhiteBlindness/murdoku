import { useState, useEffect } from 'react'
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
  'Very Easy': '#48C890', 'Easy': '#7BC848', 'Medium': '#C8922A', 'Hard': '#E8783C', 'Expert': '#B82020',
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

  const hasProgress = marks.some(row => row.some(c => c.kind !== 'empty'))

  useEffect(() => {
    try { if (!localStorage.getItem(HELP_KEY)) { setHelp(true); localStorage.setItem(HELP_KEY, '1') } } catch { /* ignore */ }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="min-h-screen bg-bg-deep flex flex-col"
    >
      <AnimatePresence>{help && <HowToPlay mode={mode} onClose={() => setHelp(false)} />}</AnimatePresence>

      <header className="pt-safe flex items-center justify-between px-4 pt-3 pb-2 border-b border-br-thin flex-shrink-0">
        <button onClick={() => hasProgress ? setConfirmLeave(true) : props.onBack()} className="focus-ring text-paper-muted text-sm font-sans px-2 min-h-[44px] flex items-center">← Cases</button>
        <div className="text-center">
          <h1 className="font-display text-paper text-base font-bold leading-tight">{puzzle.title}</h1>
          <div className="flex items-center justify-center gap-2 mt-0.5">
            <span className="text-[10px] font-sans tracking-wider" style={{ color: DIFF_COLOR[puzzle.difficulty] }}>{puzzle.difficulty.toUpperCase()}</span>
            <span className="text-paper-muted text-[10px] font-sans">{puzzle.size}×{puzzle.size}</span>
            <span className="text-[10px] font-sans tracking-wider px-1.5 rounded" style={{ color: detective ? 'var(--color-accent-text)' : 'var(--color-text-muted)', background: detective ? 'color-mix(in srgb, var(--color-accent) 14%, transparent)' : 'transparent' }}>
              {detective ? 'DETECTIVE' : 'CLASSIC'}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {!hideTimer && <span className="font-display text-accent-text text-sm tabular-nums">{timer}</span>}
          <button onClick={props.onToggleTimer} aria-label={hideTimer ? 'Show timer' : 'Hide timer'} title={hideTimer ? 'Show timer' : 'Hide timer (relaxed)'} className="focus-ring text-paper-muted w-11 h-11 flex items-center justify-center rounded-lg">
            {hideTimer ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
          <button onClick={() => setHelp(true)} aria-label="How to play" title="How to play" className="focus-ring text-paper-muted w-11 h-11 flex items-center justify-center rounded-lg"><HelpCircle size={19} /></button>
        </div>
      </header>

      <p className="px-5 py-2 text-center text-paper-dim text-[12px] font-sans max-w-2xl mx-auto flex-shrink-0">
        {detective
          ? 'Place a suspect to cross out their row & column automatically. Use Draft to pencil in candidates. Each person = one row, one column.'
          : 'Each person is in exactly one row and one column. Read the clues, place everyone, then submit.'}
      </p>

      <div className="flex-1 w-full max-w-6xl mx-auto px-3 pb-safe pb-4 grid gap-4 lg:grid-cols-[1fr_minmax(320px,420px)] items-start">
        <div className="flex flex-col gap-3 order-1">
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

          {/* Legend */}
          <div className="mx-auto w-full max-w-[580px]">
            <button onClick={() => setLegend(v => !v)} className="focus-ring flex items-center gap-1.5 text-[11px] text-paper-muted font-sans mx-auto">
              <Info size={13} /> {legend ? 'Hide' : 'What am I looking at?'}
            </button>
            <AnimatePresence>
              {legend && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden">
                  <div className="mt-2 rounded-lg border border-br-thin bg-bg-panel p-3 text-[11px] font-sans text-paper-dim grid gap-1.5">
                    <p>• <b className="text-paper">Coloured areas</b> are rooms (labelled). Different tint & floor = different room.</p>
                    <p>• <b className="text-paper">Furniture icons</b> are scene decoration that clues refer to (a chair, a rug, a plant…).</p>
                    <p>• <b className="text-paper">✕</b> marks a cell where nobody is; faint ✕ is auto-added when you lock a row/column.</p>
                    <p>• A glowing ring = a placed suspect; a red ring means two suspects share a row or column.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Toolbar */}
          <div className="flex items-center gap-2 justify-center flex-wrap">
            <ToolBtn active={tool === 'place'} onClick={() => props.onSetTool('place')} icon={<MousePointerClick size={16} />} label="Place"
              title={detective ? 'Place a suspect — crosses out their row & column' : 'Place a suspect'} />
            {detective && <ToolBtn active={tool === 'draft'} onClick={() => props.onSetTool('draft')} icon={<Pencil size={16} />} label="Draft" title="Pencil in candidates (no elimination)" />}
            <ToolBtn active={tool === 'x'} onClick={() => props.onSetTool('x')} icon={<XIcon size={16} />} label="Mark ✕" />
            <ToolBtn onClick={props.onUndo} disabled={!props.canUndo} icon={<Undo2 size={16} />} label="Undo" />
            <ToolBtn onClick={props.onRedo} disabled={!props.canRedo} icon={<Redo2 size={16} />} label="Redo" />
            {/* grouped so Clear+Hint always wrap together, never orphan Hint */}
            <span className="flex items-center gap-2">
              <ToolBtn onClick={() => setConfirmClear(true)} icon={<Trash2 size={16} />} label="Clear" />
              <ToolBtn onClick={props.onHint} disabled={hintsLeft <= 0} icon={<Lightbulb size={16} />} label={`Hint ×${hintsLeft}`} />
            </span>
            <ToolBtn
              toggled={showDecor}
              onClick={() => { setShowDecor(v => !v); if (showDecor) setPlacingFurniture(null) }}
              icon={<Palette size={16} />}
              label="Decorar"
              title="Colocar móveis decorativos"
            />
          </div>

          <div className="flex flex-col items-center gap-2">
            <motion.button whileTap={{ scale: 0.98 }} onClick={props.onSubmit}
              className="focus-ring w-full max-w-[580px] py-3.5 rounded-xl font-display font-semibold tracking-wide uppercase text-sm"
              style={{ background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-strong))', color: 'var(--color-on-accent)' }}>
              Accuse — Submit Solution ({placedCount}/{puzzle.size})
            </motion.button>
            <AnimatePresence>
              {feedback !== 'none' && (
                <motion.button onClick={props.onDismissFeedback}
                  initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="text-[12px] font-sans px-3 py-1.5 rounded-lg text-center"
                  style={{ color: 'var(--color-danger-text)', backgroundColor: 'color-mix(in srgb, var(--color-danger) 14%, transparent)' }}>
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

        {/* Suspects + Furniture Picker */}
        <div className="order-2 flex flex-col gap-3">
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
          <p className="col-span-full text-[10px] text-paper-muted font-sans uppercase tracking-[0.2em] mb-0.5">
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
      </div>

      {/* Leave confirmation */}
      <AnimatePresence>
        {confirmLeave && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm" style={{ background: 'color-mix(in srgb, var(--color-bg-base) 55%, transparent)' }}
            onClick={() => setConfirmLeave(false)}>
            <motion.div initial={{ scale: 0.94 }} animate={{ scale: 1 }} onClick={e => e.stopPropagation()}
              className="w-full max-w-xs rounded-2xl border border-br-box bg-bg-panel p-5 text-center" style={{ boxShadow: 'var(--shadow-elevated)' }}>
              <p className="font-display font-bold text-paper mb-1">Leave this case?</p>
              <p className="text-paper-dim text-[13px] font-sans mb-4">Progress is saved — you can pick up where you left off.</p>
              <div className="flex gap-2">
                <button onClick={() => setConfirmLeave(false)} className="focus-ring flex-1 py-2.5 rounded-xl border border-br-thin text-paper-dim font-display text-sm uppercase tracking-wide">Stay</button>
                <button onClick={props.onBack} className="focus-ring flex-1 py-2.5 rounded-xl font-display text-sm uppercase tracking-wide" style={{ background: 'var(--color-accent)', color: 'var(--color-on-accent)' }}>Leave</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Clear confirmation */}
      <AnimatePresence>
        {confirmClear && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'var(--overlay-scrim)' }}
            onClick={() => setConfirmClear(false)}>
            <motion.div initial={{ scale: 0.94 }} animate={{ scale: 1 }} onClick={e => e.stopPropagation()}
              className="w-full max-w-xs rounded-2xl border border-br-box bg-bg-panel p-5 text-center" style={{ boxShadow: 'var(--shadow-elevated)' }}>
              <p className="font-display font-bold text-paper mb-1">Clear the board?</p>
              <p className="text-paper-dim text-[13px] font-sans mb-4">This removes every placement, ✕ and draft. You can undo it once.</p>
              <div className="flex gap-2">
                <button onClick={() => setConfirmClear(false)} className="focus-ring flex-1 py-2.5 rounded-xl border border-br-thin text-paper-dim font-display text-sm uppercase tracking-wide">Cancel</button>
                <button onClick={() => { props.onClear(); setConfirmClear(false) }} className="focus-ring flex-1 py-2.5 rounded-xl font-display text-sm uppercase tracking-wide" style={{ background: 'var(--color-danger)', color: 'var(--color-on-accent)' }}>Clear</button>
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
    <button onClick={onClick} disabled={disabled} title={title} aria-pressed={active || toggled}
      className="focus-ring flex items-center justify-center gap-1.5 px-3.5 min-h-[44px] rounded-lg border text-[13px] font-sans font-medium transition-colors"
      style={{
        // Only the current TOOL gets the strong filled highlight. `cta` (an
        // available action) is a subtle coloured border; `toggled` (engaged
        // action, e.g. locked) is a dashed coloured border. Neither is filled,
        // so they never look like "the mode you're in".
        borderColor: active ? 'var(--color-accent)' : (toggled || cta) ? 'color-mix(in srgb, var(--color-accent) 65%, transparent)' : 'var(--color-border-subtle)',
        backgroundColor: active ? 'color-mix(in srgb, var(--color-accent) 20%, transparent)' : 'var(--color-bg-surface)',
        color: active ? 'var(--color-accent-text)' : (toggled || cta) ? 'var(--color-accent-text)' : 'var(--color-text-secondary)',
        borderStyle: toggled && !active ? 'dashed' : 'solid',
        opacity: disabled ? 0.35 : 1,
      }}>
      {icon}{label}
    </button>
  )
}
