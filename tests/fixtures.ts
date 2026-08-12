import type { CellMark, Puzzle } from '../src/core/types'

export function makePuzzle(overrides: Partial<Puzzle> = {}): Puzzle {
  const people = [
    { id: 'p0', name: 'Ada Stone', avatarSeed: 'ada', accent: '#d89a22' },
    { id: 'p1', name: 'Bram Vale', avatarSeed: 'bram', accent: '#6aa6d8' },
    { id: 'p2', name: 'Cora Bell', avatarSeed: 'cora', accent: '#aa6a9c' },
    { id: 'p3', name: 'Drew Pike', avatarSeed: 'drew', accent: '#6da06d', isVictim: true },
  ]
  const rooms = [
    { id: 'study', name: 'Study', hue: 20, cells: [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 1, col: 0 }, { row: 1, col: 1 }] },
    { id: 'hall', name: 'Hall', hue: 120, cells: [{ row: 0, col: 2 }, { row: 0, col: 3 }, { row: 1, col: 2 }, { row: 1, col: 3 }] },
    { id: 'garden', name: 'Garden', hue: 200, cells: [{ row: 2, col: 0 }, { row: 2, col: 1 }, { row: 3, col: 0 }, { row: 3, col: 1 }] },
    { id: 'kitchen', name: 'Kitchen', hue: 280, cells: [{ row: 2, col: 2 }, { row: 2, col: 3 }, { row: 3, col: 2 }, { row: 3, col: 3 }] },
  ]
  const roomOf = [
    ['study', 'study', 'hall', 'hall'],
    ['study', 'study', 'hall', 'hall'],
    ['garden', 'garden', 'kitchen', 'kitchen'],
    ['garden', 'garden', 'kitchen', 'kitchen'],
  ]
  return {
    id: 'case-1',
    title: 'The Empty Chair',
    caseNumber: 'Case No. I',
    difficulty: 'Easy',
    size: 4,
    rooms,
    roomOf,
    furniture: [
      { type: 'desk', row: 1, col: 1 },
      { type: 'chair', row: 2, col: 2 },
      { type: 'rug', row: 3, col: 3 },
    ],
    people,
    clues: [],
    solution: {
      p0: { row: 0, col: 0 },
      p1: { row: 1, col: 1 },
      p2: { row: 2, col: 2 },
      p3: { row: 3, col: 3 },
    },
    victimId: 'p3',
    murdererId: 'p0',
    flavor: 'A quiet house keeps one loud secret.',
    source: 'builtin',
    ...overrides,
  }
}

export function emptyMarks(size = 4): CellMark[][] {
  return Array.from({ length: size }, () =>
    Array.from({ length: size }, () => ({ kind: 'empty' as const }))
  )
}
