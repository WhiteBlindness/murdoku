import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import HomeScreen from '../src/components/HomeScreen'
import type { InProgressSummary } from '../src/core/ux'
import { makePuzzle } from './fixtures'

function renderHome(overrides: Partial<React.ComponentProps<typeof HomeScreen>> = {}) {
  const puzzles = [
    makePuzzle({ id: 'case-1', title: 'The Empty Chair', difficulty: 'Easy' }),
    makePuzzle({ id: 'case-2', title: 'Midnight Delivery', difficulty: 'Hard' }),
    makePuzzle({ id: 'case-3', title: 'The Locked Study', difficulty: 'Expert' }),
  ]
  return render(
    <HomeScreen
      puzzles={puzzles}
      completedIds={[]}
      records={{}}
      mode="classic"
      onSetMode={vi.fn()}
      onSelect={vi.fn()}
      onOpenReleases={vi.fn()}
      resolvedTheme="dark"
      onToggleTheme={vi.fn()}
      {...overrides}
    />
  )
}

describe('HomeScreen search, filters, and resume', () => {
  it('filters visible cases from the accessible search field', () => {
    renderHome()
    fireEvent.change(screen.getByRole('searchbox', { name: /search cases/i }), { target: { value: 'midnight' } })

    expect(screen.getByTestId('case-result-count')).toHaveTextContent('1 matching case')
    expect(screen.getByRole('button', { name: /midnight delivery/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /empty chair/i })).not.toBeInTheDocument()
  })

  it('filters by All and each square difficulty control', () => {
    renderHome()
    fireEvent.click(screen.getByRole('button', { name: 'Hard', pressed: false }))

    expect(screen.getByTestId('case-result-count')).toHaveTextContent('1 matching case')
    expect(screen.getByRole('button', { name: /midnight delivery/i })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'All', pressed: false }))
    expect(screen.getByTestId('case-result-count')).toHaveTextContent('3 matching cases')
  })

  it('shows the continuation strip and routes resume with saved mode', () => {
    const onResume = vi.fn()
    const inProgress: InProgressSummary = {
      id: 'case-2',
      mode: 'detective',
      elapsedSeconds: 91,
      placedCount: 2,
      selectedPerson: 'p1',
    }
    renderHome({ inProgress, onResume })

    expect(screen.getByTestId('continue-reconstruction')).toHaveTextContent(/continue reconstruction/i)
    expect(screen.getByText(/2 \/ 4 placed/i)).toBeInTheDocument()
    fireEvent.click(screen.getByTestId('continue-reconstruction'))

    expect(onResume).toHaveBeenCalledWith('case-2', 'detective')
  })

  it('communicates an empty result set', () => {
    renderHome()
    fireEvent.change(screen.getByRole('searchbox', { name: /search cases/i }), { target: { value: 'no such case' } })

    expect(screen.getByText(/no cases match/i)).toBeInTheDocument()
  })
})
