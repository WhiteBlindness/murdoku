import { useState } from 'react'
import { useCaseNotes } from '../hooks/useCaseNotes'

export interface CaseNotesProps {
  caseId: string
}

/** A self-contained, local-only reasoning pad for the active case. */
export default function CaseNotes({ caseId }: CaseNotesProps) {
  const { note, setNote, clearNote, saveStatus } = useCaseNotes(caseId)
  const [confirmClear, setConfirmClear] = useState(false)

  function confirmNotesClear() {
    clearNote()
    setConfirmClear(false)
  }

  return (
    <section
      data-testid="case-notes"
      aria-labelledby="case-notes-heading"
      className="border border-border-strong bg-bg-surface p-3 sm:p-4"
      style={{ boxShadow: 'var(--shadow-cut)' }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 id="case-notes-heading" className="font-display text-sm font-bold uppercase tracking-[0.14em] text-text-primary">
            Case notes
          </h2>
          <p className="mt-1 font-mono text-[10px] text-text-muted">Private to this device.</p>
        </div>
        <span
          id="case-notes-status"
          role="status"
          aria-live="polite"
          className="font-mono text-[10px] uppercase tracking-[0.12em] text-accent-text"
        >
          {saveStatus === 'saved' ? 'Saved locally' : 'Unable to save locally'}
        </span>
      </div>

      <label htmlFor="case-notes-textarea" className="sr-only">Case notes</label>
      <textarea
        id="case-notes-textarea"
        data-testid="case-notes-textarea"
        value={note}
        onChange={event => setNote(event.currentTarget.value)}
        aria-describedby="case-notes-status"
        placeholder="Record a room, a contradiction, or your next deduction…"
        className="mt-3 min-h-28 w-full resize-y border border-border-strong bg-bg-inset p-3 font-mono text-sm text-text-primary outline-none placeholder:text-text-muted focus:border-accent-strong"
      />

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setConfirmClear(true)}
          disabled={!note}
          className="focus-ring min-h-11 border border-border-strong px-3 font-sans text-xs font-semibold uppercase tracking-[0.1em] text-text-secondary transition-colors hover:border-accent-strong hover:text-accent-text disabled:cursor-not-allowed disabled:opacity-50"
          style={{ minHeight: 44 }}
        >
          Clear notes
        </button>

        {confirmClear && (
          <div className="flex min-h-11 flex-wrap items-center gap-2 border border-danger px-2 py-1.5" role="alert">
            <span className="font-mono text-[10px] text-danger-text">Clear these notes?</span>
            <button
              type="button"
              onClick={confirmNotesClear}
              className="focus-ring min-h-11 border border-danger bg-danger px-3 font-sans text-xs font-semibold uppercase tracking-[0.1em] text-on-accent"
              style={{ minHeight: 44 }}
            >
              Confirm clear
            </button>
            <button
              type="button"
              onClick={() => setConfirmClear(false)}
              className="focus-ring min-h-11 border border-border-strong px-3 font-sans text-xs font-semibold uppercase tracking-[0.1em] text-text-secondary"
              style={{ minHeight: 44 }}
            >
              Keep notes
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
