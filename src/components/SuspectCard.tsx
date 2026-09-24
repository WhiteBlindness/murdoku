import { motion } from 'framer-motion'
import { Check, Crosshair, Lock } from 'lucide-react'
import type { Person } from '../core/types'

interface Props {
  person: Person
  clues: string[]
  selected: boolean
  placed: boolean
  locked?: boolean
  conflicted: boolean
  resolved?: boolean
  showCheck?: boolean
  located?: boolean
  canLocate?: boolean
  satisfiedClues?: boolean[]
  onSelect: () => void
  onToggleResolved?: () => void
  onToggleLocate?: () => void
}

export default function SuspectCard({
  person, clues, selected, placed, locked, conflicted, resolved, showCheck,
  located, canLocate, satisfiedClues, onSelect, onToggleResolved, onToggleLocate,
}: Props) {
  const portraitIndex = [...person.id].reduce((sum, character) => sum + character.charCodeAt(0), 0) % 8
  const portraitColumn = portraitIndex % 4
  const portraitRow = Math.floor(portraitIndex / 4)
  const state = conflicted ? 'conflict' : placed ? 'placed' : 'open'
  const stateLabel = conflicted ? 'Conflict' : placed ? (locked ? 'Placed · locked' : 'Placed') : 'Open'

  return (
    <motion.article
      data-testid="suspect-card"
      data-person={person.id}
      data-state={state}
      className={`site-suspect-card ${selected ? 'is-selected' : ''} ${conflicted ? 'has-conflict' : ''}`}
    >
      <div className="site-suspect-main">
        <button
          type="button"
          onClick={onSelect}
          aria-pressed={selected}
          className="site-suspect-select focus-ring"
        >
          <span
            className="site-suspect-portrait contact-sheet-portrait"
            role="img"
            aria-label={`${person.name} portrait`}
            style={{
              backgroundImage: 'url("/assets/contact-sheet.jpg")',
              backgroundSize: '400% 200%',
              backgroundPosition: `${portraitColumn * 33.333}% ${portraitRow * 100}%`,
            }}
          />
          <span className="site-suspect-heading">
            <span className="site-suspect-name">{person.name}</span>
            <span className={`site-suspect-status ${conflicted ? 'is-conflicted' : ''}`}>
              {locked && <Lock size={12} aria-hidden="true" />}
              {conflicted && <span className="site-conflict-mark" aria-hidden="true">!</span>}
              {person.isVictim && <span className="site-victim-label">Victim</span>}
              <span>{stateLabel}</span>
              {resolved && <span className="site-resolved-label">Clues reviewed</span>}
            </span>
          </span>
        </button>

        <div className="site-suspect-tools">
          {canLocate && onToggleLocate && (
            <button
              type="button"
              onClick={onToggleLocate}
              aria-pressed={!!located}
              aria-label={located ? `Hide ${person.name}'s clue on the board` : `Show ${person.name}'s clue on the board`}
              title="Show me where this clue points"
              className="site-suspect-action focus-ring"
            >
              <Crosshair size={16} strokeWidth={2.2} />
            </button>
          )}
          {showCheck && (
            <button
              type="button"
              onClick={onToggleResolved}
              aria-label={resolved ? 'Mark clue unsolved' : 'Mark clue solved'}
              aria-pressed={!!resolved}
              title="Check off clues you have worked out"
              className="site-suspect-action focus-ring"
            >
              {resolved && <Check size={16} strokeWidth={2.6} />}
              {!resolved && <span aria-hidden="true" className="site-empty-check" />}
            </button>
          )}
        </div>
      </div>

      <div className="site-suspect-clues">
        {clues.map((clue, index) => {
          const satisfied = satisfiedClues?.[index] === true
          return (
            <p key={index} className={satisfied ? 'is-satisfied' : ''}>
              {satisfied && <Check size={14} strokeWidth={3} aria-label="clue satisfied" />}
              {!satisfied && clues.length > 1 && <span aria-hidden="true" className="site-clue-mark">•</span>}
              <span>{clue}</span>
            </p>
          )
        })}
      </div>
    </motion.article>
  )
}
