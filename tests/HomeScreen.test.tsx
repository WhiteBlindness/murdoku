import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import HomeScreen from '../src/components/HomeScreen'
import type { InProgressSummary } from '../src/core/ux'
import { makePuzzle } from './fixtures'

function renderHome(overrides: Partial<React.ComponentProps<typeof HomeScreen>> = {}) {
  // Two Easy puzzles + one Hard puzzle, so clicking the Easy tier gives us
  // two cases to search/filter within.
  const puzzles = [
    makePuzzle({ id: 'case-1', title: 'The Empty Chair', difficulty: 'Easy' }),
    makePuzzle({ id: 'case-2', title: 'Midnight Delivery', difficulty: 'Easy' }),
    makePuzzle({ id: 'case-3', title: 'The Locked Study', difficulty: 'Hard' }),
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

// Helper: drill into a tier by clicking its tier button on the landing.
function drillInto(tierLabel: string) {
  fireEvent.click(screen.getByRole('button', { name: new RegExp(tierLabel, 'i') }))
}

describe('HomeScreen search, filters, and resume', () => {
  it('filters visible cases from the accessible search field within a tier', () => {
    renderHome()
    // Drill into the Easy tier, which holds two cases.
    drillInto('Easy cases')
    // Search within the tier.
    fireEvent.change(screen.getByRole('searchbox', { name: /search cases/i }), { target: { value: 'midnight' } })

    expect(screen.getByTestId('case-result-count')).toHaveTextContent('1 matching case')
    expect(screen.getByRole('button', { name: /midnight delivery/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /empty chair/i })).not.toBeInTheDocument()
  })

  it('back button returns to the landing and shows tier buttons again', () => {
    renderHome()
    // Drill into Hard tier.
    drillInto('Hard cases')
    // The Hard case should be visible.
    expect(screen.getByRole('button', { name: /locked study/i })).toBeInTheDocument()
    // Go back.
    fireEvent.click(screen.getByRole('button', { name: /back to landing/i }))
    // Landing shows tier navigation again.
    expect(screen.getByRole('button', { name: /Easy cases/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Hard cases/i })).toBeInTheDocument()
  })

  it('shows the continuation strip and routes resume with saved mode', () => {
    const onResume = vi.fn()
    const puzzles = [
      makePuzzle({ id: 'case-1', title: 'The Empty Chair', difficulty: 'Easy' }),
      makePuzzle({ id: 'case-2', title: 'Midnight Delivery', difficulty: 'Hard' }),
      makePuzzle({ id: 'case-3', title: 'The Locked Study', difficulty: 'Expert' }),
    ]
    const inProgress: InProgressSummary = {
      id: 'case-2',
      mode: 'detective',
      elapsedSeconds: 91,
      placedCount: 2,
      selectedPerson: 'p1',
    }
    render(
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
        inProgress={inProgress}
        onResume={onResume}
      />
    )

    // Continue strip is visible on the landing.
    expect(screen.getByTestId('continue-reconstruction')).toHaveTextContent(/continue reconstruction/i)
    expect(screen.getByText(/2 \/ 4 placed/i)).toBeInTheDocument()
    fireEvent.click(screen.getByTestId('continue-reconstruction'))

    expect(onResume).toHaveBeenCalledWith('case-2', 'detective')
  })

  it('communicates an empty result set when searching within a tier', () => {
    renderHome()
    drillInto('Easy cases')
    fireEvent.change(screen.getByRole('searchbox', { name: /search cases/i }), { target: { value: 'no such case' } })

    expect(screen.getByText(/no cases match/i)).toBeInTheDocument()
  })
})
