import { useMemo } from 'react'
import type { CellMark, Puzzle } from '../core/types'
import MapGrid from './MapGrid'

interface Props {
  puzzles: Puzzle[]
  /** Stable seed so the preview does not reshuffle on every re-render. */
  seed?: number
}

/**
 * A real board, shown on the landing as the product shot.
 *
 * It renders an actual generated case from the hardest tier available, with
 * suspects scattered across it, so the first thing a visitor sees is the thing
 * they will be doing. It is decoration only: inert, aria-hidden, and never the
 * real solution — showing a solved board would hand away a live case.
 */
function pickPuzzle(puzzles: Puzzle[]): Puzzle | null {
  if (!puzzles.length) return null
  const order = ['Master', 'Expert', 'Hard', 'Medium', 'Easy', 'Very Easy']
  for (const tier of order) {
    const inTier = puzzles.filter(p => p.difficulty === tier)
    if (inTier.length) return inTier[0]
  }
  return puzzles[0]
}

/**
 * A scattered, deliberately WRONG arrangement that still obeys the visible rule
 * of one suspect per row and per column, so the preview looks like a board
 * mid-solve rather than like an answer key.
 */
function scatterMarks(puzzle: Puzzle, seed: number): CellMark[][] {
  const n = puzzle.size
  const marks: CellMark[][] = Array.from({ length: n }, () =>
    Array.from({ length: n }, () => ({ kind: 'empty' as const })),
  )

  // Small deterministic PRNG: the preview must be identical across renders.
  let s = (seed % 2147483647) || 1
  const rand = () => { s = (s * 48271) % 2147483647; return (s - 1) / 2147483646 }
  const shuffled = <T,>(arr: T[]): T[] => {
    const a = [...arr]
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1))
      ;[a[i], a[j]] = [a[j], a[i]]
    }
    return a
  }

  const rows = shuffled([...Array(n).keys()])
  const cols = shuffled([...Array(n).keys()])
  const cast = puzzle.people.slice(0, Math.min(puzzle.people.length, n))

  cast.forEach((person, i) => {
    const row = rows[i]
    const col = cols[i]
    const truth = puzzle.solution[person.id]
    // Never place someone on their real cell: this is a teaser, not a spoiler.
    if (truth && truth.row === row && truth.col === col) return
    marks[row][col] = { kind: 'person', person: person.id }
  })

  return marks
}

export default function BoardPreview({ puzzles, seed = 7 }: Props) {
  const puzzle = useMemo(() => pickPuzzle(puzzles), [puzzles])
  const marks = useMemo(() => puzzle ? scatterMarks(puzzle, seed) : null, [puzzle, seed])
  if (!puzzle || !marks) return null

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none select-none w-full"
      data-testid="board-preview"
    >
      <MapGrid
        puzzle={puzzle}
        marks={marks}
        conflicts={new Set<string>()}
        onCellClick={() => undefined}
      />
    </div>
  )
}
