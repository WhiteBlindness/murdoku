import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import SuspectCard from '../src/components/SuspectCard'
import type { Person } from '../src/core/types'

const person: Person = {
  id: 'p0',
  name: 'Ada Stone',
  avatarSeed: 'ada',
  accent: '#d89a22',
}

function renderCard(overrides: Partial<React.ComponentProps<typeof SuspectCard>> = {}) {
  return render(
    <SuspectCard
      person={person}
      clues={['In the Study.', 'Beside the desk.']}
      selected={false}
      placed={false}
      conflicted={false}
      onSelect={vi.fn()}
      {...overrides}
    />,
  )
}

// ── Task 1: satisfiedClues prop ───────────────────────────────────────────────

describe('SuspectCard satisfiedClues', () => {
  it('renders without satisfiedClues prop (backward compat — no ticks)', () => {
    renderCard()
    // Both clues visible, no satisfied tick icons
    expect(screen.getByText('In the Study.')).toBeInTheDocument()
    expect(screen.getByText('Beside the desk.')).toBeInTheDocument()
    expect(screen.queryAllByLabelText('clue satisfied')).toHaveLength(0)
  })

  it('renders a satisfied tick for a true entry and none for false', () => {
    renderCard({ satisfiedClues: [true, false] })
    // One clue satisfied → one tick
    const ticks = screen.getAllByLabelText('clue satisfied')
    expect(ticks).toHaveLength(1)
  })

  it('renders ticks for all clues when all are satisfied', () => {
    renderCard({ satisfiedClues: [true, true] })
    const ticks = screen.getAllByLabelText('clue satisfied')
    expect(ticks).toHaveLength(2)
  })

  it('renders no ticks when all are unsatisfied', () => {
    renderCard({ satisfiedClues: [false, false] })
    expect(screen.queryAllByLabelText('clue satisfied')).toHaveLength(0)
  })

  it('renders no ticks when satisfiedClues is shorter than clues (missing entry = unsatisfied)', () => {
    renderCard({ satisfiedClues: [] })
    expect(screen.queryAllByLabelText('clue satisfied')).toHaveLength(0)
  })

  it('does not disturb the existing resolved line-through when both resolved and satisfied', () => {
    renderCard({ resolved: true, showCheck: true, satisfiedClues: [true, false] })
    // The card-level opacity/line-through still applies — clue text still present
    expect(screen.getByText('In the Study.')).toBeInTheDocument()
    // A tick for the first satisfied clue still shows
    const ticks = screen.getAllByLabelText('clue satisfied')
    expect(ticks).toHaveLength(1)
  })

  it('shows clues text regardless of satisfaction state', () => {
    renderCard({ satisfiedClues: [true, false] })
    expect(screen.getByText('In the Study.')).toBeInTheDocument()
    expect(screen.getByText('Beside the desk.')).toBeInTheDocument()
  })
})
