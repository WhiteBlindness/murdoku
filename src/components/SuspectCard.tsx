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
      className="w-full border p-2.5 flex gap-2.5 transition-colors"
      style={{
        /* Unselected card: border-strong so the card boundary meets WCAG 1.4.11
           (bg-surface vs bg-base is near-zero contrast, the border IS the affordance).
           Selected: person.accent ring — accent carries the boundary at that point. */
        borderColor: selected ? person.accent : 'var(--color-border-strong)',
        backgroundColor: selected ? person.accent + '18' : 'var(--color-bg-surface)',
        /* Selected: double-ring — outer accent halo signals commitment */
        boxShadow: selected ? `0 0 0 1px ${person.accent}, var(--shadow-cut)` : 'var(--shadow-cut)',
        opacity: resolved ? 0.5 : 1,
        /* Accent left-spine when selected: same file-folder language as case cards */
        borderLeftWidth: selected ? '3px' : '1px',
        borderLeftColor: selected ? person.accent : 'var(--color-border-strong)',
      }}
    >
      <button onClick={onSelect} aria-pressed={selected} className="focus-ring flex gap-2.5 flex-1 min-w-0 text-left items-start">
        {/* Polaroid evidence print: parchment border with the deeper bottom
            margin a real print has, pinned at a slight angle and casting a hard
            directional shadow. The tilt alternates per suspect so a column of
            cards reads as pinned to a board, not mechanically stacked. */}
        <div
          className="relative flex-shrink-0"
          style={{
            background: 'var(--color-text-primary)',
            padding: '3px 3px 9px 3px',
            transform: `rotate(${person.id.charCodeAt(person.id.length - 1) % 2 ? -2.5 : 2}deg)`,
            boxShadow: '0 3px 8px -1px rgba(0,0,0,0.6)',
          }}
        >
          <Avatar seed={person.avatarSeed} accent={person.accent} size={44} dead={person.isVictim} />
          {placed && (
            /* Placement marker: sharp square badge (no rounding) for the noir
               language. NOT a correctness check — lock = committed. */
            <span className="absolute -bottom-1 -right-1 flex items-center justify-center"
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
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Suspect name: headline font-display, the case file's subject line */}
            <span className={`font-display font-bold text-sm text-paper leading-tight truncate tracking-wide uppercase ${resolved ? 'line-through' : ''}`}>{person.name}</span>
            {person.isVictim && (
              /* Stamped-ink VICTIM marker: rectangular (no rounding), danger-text
                 on a muted danger wash. Same rubber-stamp aesthetic as CLOSED on
                 the case cards. Slight rotation to read as physically stamped.
                 Uses danger-text for both the text and border so it reads in
                 light (parchment) as well as dark (obsidian). */
              <span
                className="text-[8px] font-display font-bold uppercase tracking-[0.22em] px-1 py-[2px] leading-none flex-shrink-0"
                style={{
                  color: 'var(--color-danger-text)',
                  border: '1px solid color-mix(in srgb, var(--color-danger-text) 55%, transparent)',
                  background: 'color-mix(in srgb, var(--color-danger) 12%, transparent)',
                  transform: 'rotate(-1deg)',
                  display: 'inline-block',
                }}
              >
                VICTIM
              </span>
            )}
          </div>
          {clues.map((c, i) => (
            /* Clue text: font-mono — typed evidence on the case file.
               This is the signature move of the redesign: clues read as
               a detective's typewritten notes, not UI body copy. */
            <p key={i} className={`text-paper-dim text-[11px] leading-snug mt-0.5 font-mono flex gap-1 ${resolved ? 'line-through' : ''}`}>
              {clues.length > 1 && <span className="text-paper-muted flex-shrink-0" aria-hidden>—</span>}
              <span>{c}</span>
            </p>
          ))}
        </div>
      </button>

      {showCheck && (
        /* Checkbox: sharp-cornered dossier tick box. Unresolved = unfilled
           outline button — border IS the affordance, so border-strong required. */
        <button
          onClick={onToggleResolved}
          aria-label={resolved ? 'Mark clue unsolved' : 'Mark clue solved'}
          title="Your own note — check off clues you've worked out"
          className="focus-ring flex-shrink-0 self-start w-6 h-6 border flex items-center justify-center transition-colors"
          style={{
            /* Unresolved: unfilled outline button → border-strong (WCAG 1.4.11) */
            borderColor: resolved ? 'var(--color-accent)' : 'var(--color-border-strong)',
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
