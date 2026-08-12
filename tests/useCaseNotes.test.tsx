import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { CASE_NOTES_KEY, serializeCaseNotes } from '../src/core/ux'
import { useCaseNotes } from '../src/hooks/useCaseNotes'

describe('useCaseNotes', () => {
  it('loads a case note and immediately persists edits under the versioned key', () => {
    localStorage.setItem(CASE_NOTES_KEY, serializeCaseNotes({ 'case-1': 'Watch the clock.' }))
    const { result } = renderHook(() => useCaseNotes('case-1'))

    expect(result.current.note).toBe('Watch the clock.')
    act(() => result.current.setNote('Watch the clock and desk.'))

    expect(result.current.saveStatus).toBe('saved')
    expect(JSON.parse(localStorage.getItem(CASE_NOTES_KEY) ?? '')).toEqual({
      version: 1,
      notes: { 'case-1': 'Watch the clock and desk.' },
    })
  })

  it('clears only the active case note and preserves other case notes', () => {
    localStorage.setItem(CASE_NOTES_KEY, serializeCaseNotes({ 'case-1': 'Remove me.', 'case-2': 'Keep me.' }))
    const { result } = renderHook(() => useCaseNotes('case-1'))

    act(() => result.current.clearNote())

    expect(result.current.note).toBe('')
    expect(JSON.parse(localStorage.getItem(CASE_NOTES_KEY) ?? '')).toEqual({
      version: 1,
      notes: { 'case-2': 'Keep me.' },
    })
  })
})
