import { useCallback, useEffect, useState } from 'react'
import { CASE_NOTES_KEY, parseCaseNotes, serializeCaseNotes } from '../core/ux'

export type NoteSaveStatus = 'saved' | 'error'

export interface UseCaseNotesResult {
  note: string
  setNote: (value: string) => void
  clearNote: () => void
  saveStatus: NoteSaveStatus
}

function readStorage(): Storage | null {
  if (typeof window === 'undefined') return null
  try {
    return window.localStorage
  } catch {
    return null
  }
}

export function readCaseNote(caseId: string): string {
  if (!caseId) return ''
  const storage = readStorage()
  if (!storage) return ''
  try {
    return parseCaseNotes(storage.getItem(CASE_NOTES_KEY)).notes[caseId] ?? ''
  } catch {
    return ''
  }
}

export function saveCaseNote(caseId: string, note: string): boolean {
  if (!caseId) return false
  const storage = readStorage()
  if (!storage) return false
  try {
    const store = parseCaseNotes(storage.getItem(CASE_NOTES_KEY))
    const notes = { ...store.notes }
    if (note.length > 0) notes[caseId] = note
    else delete notes[caseId]
    storage.setItem(CASE_NOTES_KEY, serializeCaseNotes(notes))
    return true
  } catch {
    return false
  }
}

/** Local-only, per-case notes with an immediate autosave. */
export function useCaseNotes(caseId: string): UseCaseNotesResult {
  const [note, setNoteState] = useState(() => readCaseNote(caseId))
  const [loadedCaseId, setLoadedCaseId] = useState(caseId)
  const [saveStatus, setSaveStatus] = useState<NoteSaveStatus>('saved')

  useEffect(() => {
    setLoadedCaseId(caseId)
    setNoteState(readCaseNote(caseId))
    setSaveStatus('saved')
  }, [caseId])

  useEffect(() => {
    if (loadedCaseId !== caseId) return
    setSaveStatus(saveCaseNote(caseId, note) ? 'saved' : 'error')
  }, [caseId, loadedCaseId, note])

  const setNote = useCallback((value: string) => {
    setNoteState(value)
    setSaveStatus('saved')
  }, [])

  const clearNote = useCallback(() => {
    setNoteState('')
    setSaveStatus('saved')
  }, [])

  return { note, setNote, clearNote, saveStatus }
}
