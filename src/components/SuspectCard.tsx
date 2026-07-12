import { motion } from 'framer-motion'
import { Check, Lock } from 'lucide-react'
import type { Person } from '../core/types'
import Avatar from './Avatar'

interface Props {
  person: Person
  clues: string[]
  selected: boolean
  placed: boolean
  locked?: boolean
  conflicted: boolean
  resolved?: boolean
  showCheck?: boolean
  onSelect: () => void
  onToggleResolved?: () => void
}

export default function SuspectCard({
  person, clues, selected, placed, locked, conflicted, resolved, showCheck, onSelect, onToggleResolved,
}: Props) {
  return (
    <motion.div
      whileTap={{ scale: 0.99 }}
      className="w-full rounded-xl border p-2.5 flex gap-2.5 transition-colors"
      style={{
        borderColor: selected ? person.accent : 'var(--color-border-subtle)',
        backgroundColor: selected ? person.accent + '18' : 'var(--color-bg-surface)',
        boxShadow: selected ? `0 0 0 1px ${person.accent}` : undefined,
        opacity: resolved ? 0.55 : 1,
      }}
    >
      <button onClick={onSelect} aria-pressed={selected} className="focus-ring flex gap-2.5 flex-1 min-w-0 text-left items-start">
        <div className="relative flex-shrink-0">
          <Avatar seed={person.avatarSeed} accent={person.accent} size={44} dead={person.isVictim} />
          {placed && (
            /* neutral "placed" marker — NOT a correctness check. lock = committed. */
            <span className="absolute -bottom-1 -right-1 rounded-full flex items-center justify-center"
              title={locked ? 'Locked in' : conflicted ? 'Row/column conflict' : 'Placed on the board'}
              style={{
                width: 16, height: 16,
                backgroundColor: conflicted ? 'var(--color-danger)' : locked ? 'var(--color-accent)' : 'var(--color-bg-elevated)',
                border: `2px solid ${conflicted ? 'var(--color-danger)' : locked ? 'var(--color-accent)' : person.accent}`,
                color: 'var(--color-on-accent)',
              }}>
              {locked ? <Lock size={9} strokeWidth={3} /> : conflicted ? <span className="text-[10px] font-bold leading-none" style={{ color: 'var(--color-on-accent)' }}>!</span> : null}
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className={`font-display font-semibold text-sm text-paper leading-tight truncate ${resolved ? 'line-through' : ''}`}>{person.name}</span>
            {person.isVictim && (
              <span className="text-[9px] font-sans uppercase tracking-wider px-1 py-0.5 rounded" style={{ color: 'var(--color-danger-text)', backgroundColor: 'color-mix(in srgb, var(--color-danger) 16%, transparent)' }}>Victim</span>
            )}
          </div>
          {clues.map((c, i) => (
            <p key={i} className={`text-paper-dim text-[12px] leading-snug mt-0.5 font-sans flex gap-1 ${resolved ? 'line-through' : ''}`}>
              {clues.length > 1 && <span className="text-paper-muted flex-shrink-0" aria-hidden>•</span>}
              <span>{c}</span>
            </p>
          ))}
        </div>
      </button>

      {showCheck && (
        <button
          onClick={onToggleResolved}
          aria-label={resolved ? 'Mark clue unsolved' : 'Mark clue solved'}
          title="Your own note — check off clues you've worked out"
          className="focus-ring flex-shrink-0 self-start w-6 h-6 rounded-md border flex items-center justify-center transition-colors"
          style={{
            borderColor: resolved ? 'var(--color-accent)' : 'var(--color-border-subtle)',
            background: resolved ? 'var(--color-accent)' : 'transparent',
            color: resolved ? 'var(--color-on-accent)' : 'var(--color-text-muted)',
          }}
        >
          {resolved && <Check size={13} strokeWidth={3} />}
        </button>
      )}
    </motion.div>
  )
}
