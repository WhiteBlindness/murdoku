import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import GameScreen from '../src/components/GameScreen'
import { emptyMarks, makePuzzle } from './fixtures'

function renderGame() {
  const puzzle = makePuzzle()
  return render(
    <GameScreen
      puzzle={puzzle}
      mode="classic"
      marks={emptyMarks(puzzle.size)}
      conflicts={new Set()}
      placedOf={{}}
      selectedPerson={puzzle.people[0].id}
      tool="place"
      hintsLeft={3}
      timer="00:00"
      hideTimer={false}
      canUndo={false}
      canRedo={false}
      feedback="none"
      correctCount={0}
      resolvedClues={[]}
      onSelectPerson={vi.fn()}
      onSetTool={vi.fn()}
      onCell={vi.fn()}
      onToggleClue={vi.fn()}
      onUndo={vi.fn()}
      onRedo={vi.fn()}
      onClear={vi.fn()}
      onHint={vi.fn()}
      onToggleTimer={vi.fn()}
      onSubmit={vi.fn()}
      onDismissFeedback={vi.fn()}
      onBack={vi.fn()}
    />,
  )
}

describe('GameScreen destructive confirmations', () => {
  it('exposes an accessible clear dialog, focuses Cancel, and closes on Escape', async () => {
    localStorage.setItem('murdoku_seen_help', '1')
    renderGame()

    fireEvent.click(screen.getByRole('button', { name: 'Clear' }))
    const dialog = screen.getByRole('dialog', { name: 'Clear the board?' })
    const cancel = screen.getByRole('button', { name: 'Cancel' })

    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(cancel).toHaveFocus()
    expect(cancel).toHaveClass('min-h-[44px]')

    fireEvent.keyDown(document, { key: 'Escape' })
    await waitFor(() => expect(screen.queryByRole('dialog', { name: 'Clear the board?' })).not.toBeInTheDocument())
  })
})
