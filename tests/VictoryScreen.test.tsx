import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import VictoryScreen from '../src/components/VictoryScreen'
import { makePuzzle } from './fixtures'

function renderVictory(overrides: Partial<React.ComponentProps<typeof VictoryScreen>> = {}) {
  const puzzle = makePuzzle({
    murdererId: 'p0',
    victimId: 'p3',
    clues: [
      { clue: { kind: 'room', person: 'p0', roomId: 'study' }, text: 'She was in the Study.' },
      { clue: { kind: 'row', person: 'p1', row: 1 }, text: 'He was in row 2.' },
      { clue: { kind: 'victim', person: 'p3' }, text: 'Found alone with the killer.' },
    ],
    ...overrides.puzzle,
  })
  return render(
    <VictoryScreen
      puzzle={puzzle}
      murderer="p0"
      timer="02:30"
      elapsedSeconds={150}
      hintsLeft={2}
      completedIds={[]}
      onNext={vi.fn()}
      onPlayUnsolved={vi.fn()}
      onHome={vi.fn()}
      {...overrides}
    />,
  )
}

function openClueReview() {
  fireEvent.click(screen.getByRole('button', { name: /review clues/i }))
  return screen.getByRole('region', { name: 'Clue replay' })
}

// ── Clue review disclosure and navigation ────────────────────────────────────

describe('VictoryScreen clue replay', () => {
  it('keeps the clue review collapsed until requested', () => {
    renderVictory()
    expect(screen.getByRole('button', { name: 'Review clues' })).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('region', { name: 'Clue replay' })).not.toBeInTheDocument()
  })

  it('opens the review panel and exposes its disclosure state to assistive technology', () => {
    renderVictory()
    const btn = screen.getByRole('button', { name: 'Review clues' })
    const panelId = btn.getAttribute('aria-controls')

    fireEvent.click(btn)
    const panel = screen.getByRole('region', { name: 'Clue replay' })
    expect(btn).toHaveAttribute('aria-expanded', 'true')
    expect(btn).toHaveAccessibleName('Hide clue review')
    expect(panel).toHaveAttribute('id', panelId)
    expect(panel).toBeInTheDocument()

    fireEvent.click(btn)
    expect(btn).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('region', { name: 'Clue replay' })).not.toBeInTheDocument()
  })

  it('shows the first suspect clue text in the replay panel', () => {
    renderVictory()
    openClueReview()
    // The first non-victim suspect is p0 (Ada Stone) with clue "She was in the Study."
    expect(screen.getByText('She was in the Study.')).toBeInTheDocument()
  })

  it('steps to the next suspect on NEXT click', () => {
    renderVictory()
    openClueReview()
    fireEvent.click(screen.getByRole('button', { name: 'Next suspect' }))
    // Should now show p1 (Bram Vale) clue
    expect(screen.getByText('He was in row 2.')).toBeInTheDocument()
  })

  it('steps back on PREV click', () => {
    renderVictory()
    openClueReview()
    fireEvent.click(screen.getByRole('button', { name: 'Next suspect' }))
    fireEvent.click(screen.getByRole('button', { name: 'Previous suspect' }))
    // Back to p0
    expect(screen.getByText('She was in the Study.')).toBeInTheDocument()
  })

  it('PREV is disabled on the first step', () => {
    renderVictory()
    openClueReview()
    expect(screen.getByRole('button', { name: 'Previous suspect' })).toBeDisabled()
  })

  it('NEXT is disabled on the last step', () => {
    renderVictory()
    openClueReview()
    // Advance to the last step (p0, p1 and p2: three suspects; only p0 and p1 have clues)
    // p0 has a "room" clue and p1 has a "row" clue, so there are two steps.
    fireEvent.click(screen.getByRole('button', { name: 'Next suspect' }))
    // Now on last step
    expect(screen.getByRole('button', { name: 'Next suspect' })).toBeDisabled()
  })

  it('does not write to storage because clue review is read-only', () => {
    const setSpy = vi.spyOn(Storage.prototype, 'setItem')
    renderVictory()
    openClueReview()
    fireEvent.click(screen.getByRole('button', { name: 'Next suspect' }))
    // No localStorage.setItem called due to replay
    // (Other calls for unrelated saves are not tested here; we verify
    // the replay itself does not trigger a write)
    const replayCalls = setSpy.mock.calls.filter(([key]) =>
      typeof key === 'string' && key.includes('murdoku'),
    )
    expect(replayCalls).toHaveLength(0)
    setSpy.mockRestore()
  })

  it('shows the step counter inside the replay panel', () => {
    renderVictory()
    const panel = openClueReview()
    expect(panel).toHaveTextContent('1 / 2')
  })

  it('shows board target description for positioned clues', () => {
    renderVictory()
    const panel = openClueReview()
    // Ada Stone has a 'room' clue → POINTS AT section and "the Study" inside panel
    expect(panel.textContent).toMatch(/POINTS AT/i)
    expect(panel.textContent).toContain('the Study')
  })
})
