import { AlertTriangle, Check, CircleDashed, UserRound } from 'lucide-react'
import type { Puzzle } from '../core/types'

interface Props {
  puzzle: Puzzle
  selectedPerson: string | null
  placedOf: Record<string, { row: number; col: number; locked?: boolean }>
  conflicts: Set<string>
  onSelectPerson: (id: string) => void
}

/** Compact, selectable cast index. The selected person's full clue lives in the dossier. */
export default function CaseProgressStrip({
  puzzle,
  selectedPerson,
  placedOf,
  conflicts,
  onSelectPerson,
}: Props) {
  const placedCount = puzzle.people.reduce((count, person) => count + (placedOf[person.id] ? 1 : 0), 0)
  const nextPerson = puzzle.people.find(person => !placedOf[person.id])

  return (
    <section
      data-testid="case-progress-strip"
      aria-labelledby="case-progress-heading"
      className="site-sequence"
    >
      <div className="site-sequence-heading">
        <h2 id="case-progress-heading">People</h2>
        <span aria-live="polite">{placedCount} of {puzzle.people.length} placed</span>
      </div>
      <ol className="site-sequence-list" aria-label="People in the reconstruction sequence">
        {puzzle.people.map((person, index) => {
          const placed = Boolean(placedOf[person.id])
          const conflicted = conflicts.has(person.id)
          const selected = selectedPerson === person.id
          const suggested = !placed && person.id === nextPerson?.id
          const state = conflicted ? 'conflict' : placed ? 'placed' : suggested ? 'next' : 'open'
          const stateLabel = conflicted ? 'conflict' : placed ? 'placed' : suggested ? 'next' : 'open'
          const portraitIndex = [...person.id].reduce((sum, character) => sum + character.charCodeAt(0), 0) % 8
          const portraitColumn = portraitIndex % 4
          const portraitRow = Math.floor(portraitIndex / 4)

          return (
            <li key={person.id}>
              <button
                type="button"
                onClick={() => onSelectPerson(person.id)}
                aria-pressed={selected}
                aria-current={selected ? 'step' : undefined}
                aria-label={`Step ${index + 1}, ${person.name}, ${stateLabel}${person.isVictim ? ', victim' : ''}`}
                data-person={person.id}
                data-state={state}
                className="site-sequence-person focus-ring"
              >
                <span
                  aria-hidden="true"
                  className="site-sequence-portrait contact-sheet-portrait"
                  style={{
                    backgroundImage: 'url("/assets/contact-sheet.jpg")',
                    backgroundSize: '400% 200%',
                    backgroundPosition: `${portraitColumn * 33.333}% ${portraitRow * 100}%`,
                  }}
                />
                <span aria-hidden="true" className="site-sequence-number">{index + 1}</span>
                <span className="site-sequence-copy">
                  <span className="site-sequence-name">{person.name}</span>
                  <span className="site-sequence-state">
                    {conflicted
                      ? <AlertTriangle size={12} aria-hidden="true" />
                      : placed
                        ? <Check size={12} aria-hidden="true" />
                        : suggested
                          ? <CircleDashed size={12} aria-hidden="true" />
                          : <UserRound size={12} aria-hidden="true" />}
                    <span>{stateLabel}</span>
                    {person.isVictim && <span className="site-victim-label">Victim</span>}
                  </span>
                </span>
              </button>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
