import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import CaseNotes from '../src/components/CaseNotes'
import { CASE_NOTES_KEY, serializeCaseNotes } from '../src/core/ux'

describe('CaseNotes', () => {
  it('provides a labeled textarea and reports local save status', () => {
    render(<CaseNotes caseId="case-1" />)
    const textarea = screen.getByRole('textbox', { name: /case notes/i })

    fireEvent.change(textarea, { target: { value: 'The rug is a decoy.' } })

    expect(screen.getByRole('status')).toHaveTextContent(/saved locally/i)
    expect(JSON.parse(localStorage.getItem(CASE_NOTES_KEY) ?? '')).toEqual({
      version: 1,
      notes: { 'case-1': 'The rug is a decoy.' },
    })
  })

  it('requires inline confirmation before clearing and leaves another case intact', () => {
    localStorage.setItem(CASE_NOTES_KEY, serializeCaseNotes({ 'case-1': 'Erase me.', 'case-2': 'Keep me.' }))
    render(<CaseNotes caseId="case-1" />)

    fireEvent.click(screen.getByRole('button', { name: /clear notes/i }))
    expect(screen.getByText(/clear these notes/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /confirm clear/i })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /keep notes/i }))
    expect(screen.getByRole('textbox', { name: /case notes/i })).toHaveValue('Erase me.')
    fireEvent.click(screen.getByRole('button', { name: /clear notes/i }))

    fireEvent.click(screen.getByRole('button', { name: /confirm clear/i }))

    expect(screen.getByRole('textbox', { name: /case notes/i })).toHaveValue('')
    expect(JSON.parse(localStorage.getItem(CASE_NOTES_KEY) ?? '')).toEqual({
      version: 1,
      notes: { 'case-2': 'Keep me.' },
    })
  })
})
