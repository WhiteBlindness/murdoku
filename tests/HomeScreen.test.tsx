import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import HomeScreen from '../src/components/HomeScreen'
import type { InProgressSummary } from '../src/core/ux'
import { makePuzzle } from './fixtures'

// Two-floor override — Easy difficulty with floors:2 proves we derive from
// data, not from a hardcoded difficulty list.
const TWO_FLOOR = { floors: 2 as const }

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

// ── Storey filter tests ──────────────────────────────────────────────────────

describe('storey filter on landing page', () => {
  function renderWithMixedTiers() {
    const puzzles = [
      makePuzzle({ id: 'easy-1', title: 'One Floor Case', difficulty: 'Easy' }),
      makePuzzle({ id: 'hard-1', title: 'Two Floor Case', difficulty: 'Hard', ...TWO_FLOOR }),
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
      />
    )
  }

  it('shows all tiers by default', () => {
    renderWithMixedTiers()
    expect(screen.getByRole('button', { name: /Easy cases/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Hard cases/i })).toBeInTheDocument()
  })

  it('with "2 floors" filter active, only two-storey tiers are listed', () => {
    renderWithMixedTiers()
    // Target specifically the filter button that carries aria-pressed (the
    // group control), not the tier row that also contains "2 floors" text.
    const filterButtons = screen.getAllByRole('button', { name: /2 floors/i })
    const filterBtn = filterButtons.find(b => b.hasAttribute('aria-pressed'))!
    fireEvent.click(filterBtn)
    expect(screen.getByRole('button', { name: /Hard cases/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Easy cases/i })).not.toBeInTheDocument()
  })

  it('with "1 floor" filter active, only single-storey tiers are listed', () => {
    renderWithMixedTiers()
    const filterButtons = screen.getAllByRole('button', { name: /1 floor/i })
    const filterBtn = filterButtons.find(b => b.hasAttribute('aria-pressed'))!
    fireEvent.click(filterBtn)
    expect(screen.getByRole('button', { name: /Easy cases/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Hard cases/i })).not.toBeInTheDocument()
  })

  it('filter buttons carry aria-pressed indicating which is active', () => {
    renderWithMixedTiers()
    const allBtn = screen.getByRole('button', { name: /^all$/i })
    expect(allBtn).toHaveAttribute('aria-pressed', 'true')
    // The filter button group — use aria-pressed presence to distinguish the
    // group control from tier row elements.
    const twoFloorBtns = screen.getAllByRole('button', { name: /2 floors/i })
    const twoBtn = twoFloorBtns.find(b => b.hasAttribute('aria-pressed'))!
    expect(twoBtn).toHaveAttribute('aria-pressed', 'false')
    fireEvent.click(twoBtn)
    expect(twoBtn).toHaveAttribute('aria-pressed', 'true')
    expect(allBtn).toHaveAttribute('aria-pressed', 'false')
  })

  it('renders an empty state rather than a blank gap when filter matches nothing', () => {
    // Single-storey only catalog — "2 floors" filter leaves nothing.
    const puzzles = [
      makePuzzle({ id: 'easy-1', difficulty: 'Easy' }),
    ]
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
      />
    )
    const filterBtns = screen.getAllByRole('button', { name: /2 floors/i })
    const filterBtn = filterBtns.find(b => b.hasAttribute('aria-pressed'))!
    fireEvent.click(filterBtn)
    expect(screen.getByText(/no tiers match/i)).toBeInTheDocument()
  })

  it('storey count is present as text on a two-storey tier row (not colour-only)', () => {
    renderWithMixedTiers()
    // The Hard tier row must contain the text "2 floors" so the information
    // is not conveyed by colour or icon alone.
    const hardBtn = screen.getByRole('button', { name: /Hard cases/i })
    expect(hardBtn).toHaveTextContent(/2 floors/i)
  })
})

// ── Storey chip on case cards ────────────────────────────────────────────────

describe('storey chip on tier-screen case cards', () => {
  it('shows "2 floors" text on a two-storey card (not colour-only)', () => {
    const puzzles = [
      makePuzzle({ id: 'hard-1', title: 'Upstairs Murder', difficulty: 'Hard', ...TWO_FLOOR }),
    ]
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
      />
    )
    // Drill into Hard tier.
    fireEvent.click(screen.getByRole('button', { name: /Hard cases/i }))
    // The case card must contain "2 floors" as text.
    expect(screen.getByRole('button', { name: /upstairs murder/i })).toHaveTextContent(/2 floors/i)
  })

  it('single-storey cards do not show a floor count', () => {
    const puzzles = [
      makePuzzle({ id: 'easy-1', title: 'Ground Level', difficulty: 'Easy' }),
    ]
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
      />
    )
    fireEvent.click(screen.getByRole('button', { name: /Easy cases/i }))
    const card = screen.getByRole('button', { name: /ground level/i })
    expect(card).not.toHaveTextContent(/floor/i)
  })
})

// ── Original search/filters/resume tests ────────────────────────────────────

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

// ── Landing page layout / proportion tests ───────────────────────────────────
// jsdom cannot measure pixels, so these assert structural classes and DOM
// invariants that encode the composition intent. A regression here means the
// layout was accidentally reverted, not that a pixel shifted.

describe('HomeScreen landing layout', () => {
  it('renders the content cap with its testid', () => {
    renderHome()
    expect(screen.getByTestId('home-content-cap')).toBeInTheDocument()
  })

  it('content cap carries the wider max-width class', () => {
    renderHome()
    const cap = screen.getByTestId('home-content-cap')
    // max-w-[1200px] replaces the former max-w-[860px] so the landing uses
    // horizontal space on wide monitors rather than a narrow centred ribbon.
    expect(cap.className).toMatch(/max-w-\[1200px\]/)
  })

  it('board preview on landing is inert and aria-hidden (never focusable)', () => {
    renderHome()
    // There may be two BoardPreview instances (mobile + desktop) — both must
    // carry inert and aria-hidden so no cell enters the tab order.
    const previews = screen.queryAllByTestId('board-preview')
    // At least one preview must exist.
    expect(previews.length).toBeGreaterThan(0)
    previews.forEach(preview => {
      expect(preview).toHaveAttribute('aria-hidden', 'true')
      // `inert` is a boolean attribute — presence is what matters.
      expect(preview.hasAttribute('inert')).toBe(true)
    })
  })

  it('renders every required landing section', () => {
    renderHome()
    // Title
    expect(screen.getByRole('heading', { name: /alibi/i })).toBeInTheDocument()
    // How it works heading (text content)
    expect(screen.getByText(/how it works/i)).toBeInTheDocument()
    // Case tiers section heading
    expect(screen.getByRole('heading', { name: /case tiers/i })).toBeInTheDocument()
    // Achievements shelf
    expect(screen.getByTestId('badge-shelf')).toBeInTheDocument()
    // Cases-solved counter in footer
    expect(screen.getByText(/cases solved/i)).toBeInTheDocument()
  })

  it('board preview desktop wrapper is hidden on mobile (lg:block)', () => {
    renderHome()
    const desktopWrapper = screen.getByTestId('board-preview-desktop')
    // The desktop preview wrapper uses `hidden lg:block` so it is invisible
    // below lg — screen readers and mobile users do not encounter a duplicate.
    expect(desktopWrapper.className).toMatch(/hidden/)
    expect(desktopWrapper.className).toMatch(/lg:block/)
  })
})
