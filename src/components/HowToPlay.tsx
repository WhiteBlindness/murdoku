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
        exit={{ scale: 0.96, opacity: 0 }}
        transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-md border border-border-strong bg-bg-panel p-5 max-h-[85vh] overflow-y-auto"
        style={{ boxShadow: 'var(--shadow-elevated)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="font-mono text-[9px] tracking-[0.3em] uppercase text-paper-muted mb-0.5">
              DETECTIVE BRIEFING
            </p>
            <h2 className="font-display text-xl font-bold text-text-primary tracking-wide uppercase">
              How to Play
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="focus-ring text-paper-muted p-2.5 border border-border-strong hover:text-text-primary hover:border-accent-text transition-colors"
            style={{ minWidth: 44, minHeight: 44 }}
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        {/* Divider */}
        <div className="h-px bg-border-strong mb-4" />

        {/* Rules — typed briefing document in Courier Prime */}
        <ol className="flex flex-col gap-4">
          <Step n={1}>
            <span className="font-display text-text-primary font-semibold">One per row &amp; column.</span>
            <span className="font-mono text-[12px] text-text-secondary leading-relaxed block mt-1">
              Each suspect (and the victim) sits in exactly one row and one column — most cells stay empty.
            </span>
          </Step>
          <Step n={2}>
            <span className="font-display text-text-primary font-semibold">Clues are rules, not hints.</span>
            <span className="font-mono text-[12px] text-text-secondary leading-relaxed block mt-1">
              Every clue under a suspect must be literally true of where they end up. Use them to deduce each position. A suspect may carry more than one clue.
            </span>
          </Step>
          <Step n={3}>
            <span className="font-display text-text-primary font-semibold">Find the killer.</span>
            <span className="font-mono text-[12px] text-text-secondary leading-relaxed block mt-1">
              Solve the board, then submit. Whoever ends up alone with the victim in the same room is the murderer.
            </span>
          </Step>
        </ol>

        {/* Tools section */}
        <div className="mt-5 pt-4 border-t border-border-strong">
          <p className="font-mono text-[9px] text-paper-muted tracking-[0.3em] uppercase mb-3">
            FIELD TOOLS
          </p>
          <ul className="flex flex-col gap-3">
            {mode === 'detective'
              ? <Tool icon={<MousePointerClick size={15} aria-hidden="true" />}>
                  <span className="font-display text-text-primary font-semibold">Place</span>
                  <span className="font-mono text-[12px] text-text-secondary leading-relaxed"> — tap a cell to put the selected suspect there. Their whole row &amp; column instantly cross out. Tap again to lift.</span>
                </Tool>
              : <Tool icon={<MousePointerClick size={15} aria-hidden="true" />}>
                  <span className="font-display text-text-primary font-semibold">Place</span>
                  <span className="font-mono text-[12px] text-text-secondary leading-relaxed"> — select a suspect, tap a cell to put them there. Tap again to lift.</span>
                </Tool>
            }
            {mode === 'detective' && (
              <Tool icon={<Pencil size={15} aria-hidden="true" />}>
                <span className="font-display text-text-primary font-semibold">Draft</span>
                <span className="font-mono text-[12px] text-text-secondary leading-relaxed"> — pencil in candidates without eliminating anything; several suspects can share a cell as maybes.</span>
              </Tool>
            )}
            <Tool icon={<X size={15} aria-hidden="true" />}>
              <span className="font-display text-text-primary font-semibold">Mark ✕</span>
              <span className="font-mono text-[12px] text-text-secondary leading-relaxed"> — flag a cell where someone definitely isn&rsquo;t.</span>
            </Tool>
            <Tool icon={<Lightbulb size={15} aria-hidden="true" />}>
              <span className="font-display text-text-primary font-semibold">Hint</span>
              <span className="font-mono text-[12px] text-text-secondary leading-relaxed"> — places one suspect correctly (3 per case).</span>
            </Tool>
          </ul>
        </div>

        {/* Confirm button */}
        <button
          onClick={onClose}
          className="focus-ring mt-6 w-full py-3 border-2 border-accent font-display font-semibold text-sm uppercase tracking-widest transition-colors"
          style={{
            background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-strong))',
            color: 'var(--color-on-accent)',
            boxShadow: 'var(--shadow-cut)',
            minHeight: 44,
          }}
        >
          UNDERSTOOD
        </button>
      </motion.div>
    </motion.div>
  )
}

function Step({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      {/* Step number — stamped ink badge, no rounded pill */}
      <span
        className="flex-shrink-0 w-6 h-6 flex items-center justify-center font-display font-bold text-[11px] border border-border-strong text-accent-text"
        style={{ background: 'color-mix(in srgb, var(--color-accent) 12%, var(--color-bg-surface))' }}
        aria-hidden="true"
      >
        {n}
      </span>
      <span className="flex-1">{children}</span>
    </li>
  )
}

function Tool({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <li className="flex gap-2.5 items-start">
      <span className="flex-shrink-0 mt-0.5 text-accent-text">{icon}</span>
      <span className="flex-1">{children}</span>
    </li>
  )
}
