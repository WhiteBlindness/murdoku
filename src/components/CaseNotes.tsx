import { useId, useState } from 'react'
import { ChevronDown, ChevronRight, NotebookPen } from 'lucide-react'
import { useCaseNotes } from '../hooks/useCaseNotes'

export interface CaseNotesProps {
  caseId: string
}

/** A self-contained, local-only reasoning pad for the active case. */
export default function CaseNotes({ caseId }: CaseNotesProps) {
  const { note, setNote, clearNote, saveStatus } = useCaseNotes(caseId)
  const [expanded, setExpanded] = useState(false)
  const [confirmClear, setConfirmClear] = useState(false)
  const textareaId = useId()
  const contentId = useId()
  const statusId = useId()

  function confirmNotesClear() {
    clearNote()
    setConfirmClear(false)
  }

  return (
    <section data-testid="case-notes" aria-labelledby="case-notes-heading" className={`site-notebook ${expanded ? 'is-open' : ''}`}>
      <div className="site-notebook-heading">
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls={contentId}
          onClick={() => setExpanded(open => !open)}
          className="site-notebook-toggle focus-ring"
        >
          <span className="site-notebook-icon"><NotebookPen size={17} aria-hidden="true" /></span>
          <span className="site-notebook-title">
            <span id="case-notes-heading">Case notes</span>
            {!expanded && <span className="site-notebook-preview">{note.trim() ? note.trim().split('\n')[0] : 'Private to this device'}</span>}
          </span>
          <span className="site-notebook-chevron" aria-hidden="true">
            {expanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </span>
        </button>
        <span id={statusId} role="status" aria-live="polite" className="site-notebook-status">
          {saveStatus === 'saved' ? 'Saved locally' : 'Unable to save locally'}
        </span>
      </div>

      <div id={contentId} className="site-notebook-content" hidden={!expanded}>
          <label htmlFor={textareaId} className="sr-only">Case notes</label>
          <textarea
            id={textareaId}
            data-testid="case-notes-textarea"
            value={note}
            onChange={event => setNote(event.currentTarget.value)}
            aria-describedby={statusId}
            placeholder="Record a room, a contradiction, or your next deduction…"
            className="site-notebook-textarea focus-ring"
          />

          <div className="site-notebook-actions">
            <button
              type="button"
              onClick={() => setConfirmClear(true)}
              disabled={!note}
              className="site-notebook-clear focus-ring"
            >
              Clear notes
            </button>

            {confirmClear && (
              <div className="site-notebook-confirm" role="alert">
                <span>Clear these notes?</span>
                <button type="button" onClick={confirmNotesClear} className="focus-ring">Confirm clear</button>
                <button type="button" onClick={() => setConfirmClear(false)} className="focus-ring">Keep notes</button>
              </div>
            )}
          </div>
      </div>
    </section>
  )
}
