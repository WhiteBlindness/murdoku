import { motion } from 'framer-motion'
import { X, MousePointerClick, Pencil, Lightbulb } from 'lucide-react'
import type { GameMode } from '../core/types'

interface Props {
  mode: GameMode
  onClose: () => void
}

export default function HowToPlay({ mode, onClose }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'var(--overlay-scrim)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.94, y: 8 }} animate={{ scale: 1, y: 0 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl border border-br-box bg-bg-panel p-5 max-h-[85vh] overflow-y-auto"
        style={{ boxShadow: 'var(--shadow-elevated)' }}
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-lg font-bold text-paper">How to play</h2>
          <button onClick={onClose} aria-label="Close" className="focus-ring text-paper-muted p-1 rounded-lg"><X size={18} /></button>
        </div>

        <ol className="flex flex-col gap-3 text-[13px] font-sans text-paper-dim leading-relaxed">
          <Step n={1}><b className="text-paper">One per row & column.</b> Each suspect (and the victim) sits in exactly one row and one column — most cells stay empty.</Step>
          <Step n={2}><b className="text-paper">Clues are rules, not hints.</b> Every clue under a suspect must be literally true of where they end up. Use them to deduce each position. A suspect may carry more than one clue.</Step>
          <Step n={3}><b className="text-paper">Find the killer.</b> Solve the board, then submit. Whoever ends up alone with the victim in the same room is the murderer.</Step>
        </ol>

        <div className="mt-4 pt-4 border-t border-br-thin">
          <p className="text-[10px] text-paper-muted font-sans uppercase tracking-[0.2em] mb-2">Tools</p>
          <ul className="flex flex-col gap-2 text-[13px] font-sans text-paper-dim">
            {mode === 'detective'
              ? <Tool icon={<MousePointerClick size={15} />}><b className="text-paper">Place</b> — tap a cell to put the selected suspect there. Their whole row &amp; column instantly cross out (nobody else can be there). Tap them again to lift.</Tool>
              : <Tool icon={<MousePointerClick size={15} />}><b className="text-paper">Place</b> — select a suspect, tap a cell to put them there. Tap them again to lift.</Tool>}
            {mode === 'detective' && <Tool icon={<Pencil size={15} />}><b className="text-paper">Draft</b> — pencil in candidates without eliminating anything; several suspects can share a cell as maybes.</Tool>}
            <Tool icon={<X size={15} />}><b className="text-paper">Mark ✕</b> — flag a cell where someone definitely isn&rsquo;t.</Tool>
            <Tool icon={<Lightbulb size={15} />}><b className="text-paper">Hint</b> — places one suspect correctly (3 per case).</Tool>
          </ul>
        </div>

        <button onClick={onClose}
          className="focus-ring mt-5 w-full py-3 rounded-xl font-display font-semibold text-sm uppercase tracking-wide"
          style={{ background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-strong))', color: 'var(--color-on-accent)' }}>
          Got it
        </button>
      </motion.div>
    </motion.div>
  )
}

function Step({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <li className="flex gap-2.5">
      <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center font-display font-bold text-[11px]"
        style={{ background: 'color-mix(in srgb, var(--color-accent) 18%, transparent)', color: 'var(--color-accent-text)' }}>{n}</span>
      <span>{children}</span>
    </li>
  )
}
function Tool({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <li className="flex gap-2 items-start">
      <span className="flex-shrink-0 mt-0.5 text-accent-text">{icon}</span>
      <span>{children}</span>
    </li>
  )
}
