import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import CaseNotes from '../src/components/CaseNotes'
import { CASE_NOTES_KEY, serializeCaseNotes } from '../src/core/ux'

describe('CaseNotes', () => {
  it('starts collapsed and saves notes that remain available after reopening', () => {
    const { unmount } = render(<CaseNotes caseId="case-1" />)
    const toggle = screen.getByRole('button', { name: /case notes/i })

    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('textbox', { name: /case notes/i })).not.toBeInTheDocument()

    fireEvent.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    const textarea = screen.getByRole('textbox', { name: /case notes/i })

    fireEvent.change(textarea, { target: { value: 'The rug is a decoy.' } })

    expect(screen.getByRole('status')).toHaveTextContent(/saved locally/i)
    expect(JSON.parse(localStorage.getItem(CASE_NOTES_KEY) ?? '')).toEqual({
      version: 1,
      notes: { 'case-1': 'The rug is a decoy.' },
    })

    unmount()
    render(<CaseNotes caseId="case-1" />)
    expect(screen.getByRole('button', { name: /the rug is a decoy/i })).toHaveAttribute('aria-expanded', 'false')
    fireEvent.click(screen.getByRole('button', { name: /case notes/i }))
    expect(screen.getByRole('textbox', { name: /case notes/i })).toHaveValue('The rug is a decoy.')
  })

  it('requires inline confirmation before clearing and leaves another case intact', () => {
    localStorage.setItem(CASE_NOTES_KEY, serializeCaseNotes({ 'case-1': 'Erase me.', 'case-2': 'Keep me.' }))
    render(<CaseNotes caseId="case-1" />)
    fireEvent.click(screen.getByRole('button', { name: /case notes/i }))

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
