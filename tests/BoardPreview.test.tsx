import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import BoardPreview from '../src/components/BoardPreview'
import { getAllPuzzles } from '../src/core/catalog'

const puzzles = getAllPuzzles()

describe('landing board preview', () => {
  it('renders nothing when the catalog has not been built yet', () => {
    const { container } = render(<BoardPreview puzzles={[]} />)
    expect(container.querySelector('[data-testid="board-preview"]')).toBeNull()
  })

  it('shows a real board from the hardest tier available', () => {
    const { getByTestId } = render(<BoardPreview puzzles={puzzles} />)
    expect(getByTestId('board-preview').querySelector('[data-testid="board"]')).not.toBeNull()
  })

  it('is inert: hidden from assistive tech and not clickable', () => {
    const { getByTestId } = render(<BoardPreview puzzles={puzzles} />)
    const preview = getByTestId('board-preview')
    expect(preview.getAttribute('aria-hidden')).toBe('true')
    expect(preview.className).toContain('pointer-events-none')
  })

  it('never shows a suspect standing on their real cell', () => {
    // The landing is public. A preview that happened to show the true
    // arrangement would hand a live case away to anyone who looked at it.
    const hardest = puzzles.filter(p => p.difficulty === 'Master')
    expect(hardest.length).toBeGreaterThan(0)
    const shown = hardest[0]

    for (const seed of [1, 7, 42, 1234, 99999]) {
      const { container, unmount } = render(<BoardPreview puzzles={puzzles} seed={seed} />)
      for (const person of shown.people) {
        const truth = shown.solution[person.id]
        if (!truth) continue
        const cell = container.querySelector(`[data-cell="${truth.row}-${truth.col}"]`)
        const label = cell?.getAttribute('aria-label') ?? ''
        expect(label, `seed ${seed} put ${person.name} on their solution cell`)
          .not.toContain(person.name)
      }
      unmount()
    }
  })

  it('is deterministic for a given seed', () => {
    const first = render(<BoardPreview puzzles={puzzles} seed={99} />)
    const firstHtml = first.container.innerHTML
    first.unmount()
    const second = render(<BoardPreview puzzles={puzzles} seed={99} />)
    expect(second.container.innerHTML).toBe(firstHtml)
  })
})
