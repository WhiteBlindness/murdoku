import { describe, expect, it } from 'vitest'
import {
  CASE_NOTES_KEY,
  filterCases,
  parseCaseNotes,
  parseInProgress,
  resolveClueHighlight,
  serializeCaseNotes,
} from '../src/core/ux'
import { emptyMarks, makePuzzle } from './fixtures'

describe('filterCases', () => {
  const puzzles = [
    makePuzzle({ id: 'case-1', title: 'The Empty Chair', difficulty: 'Easy' }),
    makePuzzle({ id: 'case-2', title: 'Midnight Delivery', difficulty: 'Hard' }),
    makePuzzle({ id: 'case-3', title: 'The Locked Study', difficulty: 'Expert' }),
  ]

  it('matches case title and ignores query casing and surrounding whitespace', () => {
    expect(filterCases(puzzles, '  MIDNIGHT  ', 'All').map(p => p.id)).toEqual(['case-2'])
  })

  it('combines a search query with a difficulty filter without mutating input', () => {
    const result = filterCases(puzzles, 'case', 'Hard')
    expect(result.map(p => p.id)).toEqual(['case-2'])
    expect(puzzles.map(p => p.id)).toEqual(['case-1', 'case-2', 'case-3'])
  })

  it('returns all cases for an empty query and All difficulty', () => {
    expect(filterCases(puzzles, '', 'All')).toEqual(puzzles)
  })

  it('searches ids, case numbers, flavor, people, and rooms', () => {
    const puzzle = makePuzzle({ id: 'archive-17', caseNumber: 'Case No. XVII', flavor: 'A silver bell rang.' })
    expect(filterCases([puzzle], 'archive')).toHaveLength(1)
    expect(filterCases([puzzle], 'xvii')).toHaveLength(1)
    expect(filterCases([puzzle], 'silver bell')).toHaveLength(1)
    expect(filterCases([puzzle], 'ada stone')).toHaveLength(1)
    expect(filterCases([puzzle], 'garden')).toHaveLength(1)
    expect(filterCases([puzzle], 'missing')).toHaveLength(0)
  })
})

describe('parseInProgress', () => {
  it('returns safe summary metadata and counts placed people only', () => {
    const marks = emptyMarks()
    marks[0][0] = { kind: 'person', person: 'p0' }
    marks[1][1] = { kind: 'draft', persons: ['p1'] }
    marks[2][2] = { kind: 'x' }
    const raw = JSON.stringify({
      id: 'case-1',
      mode: 'detective',
      marks,
      elapsed: 125,
      hints: 2,
      selected: 'p1',
    })

    expect(parseInProgress(raw, [makePuzzle()])).toEqual({
      id: 'case-1',
      mode: 'detective',
      elapsedSeconds: 125,
      placedCount: 1,
      selectedPerson: 'p1',
    })
  })

  it.each([
    ['invalid JSON', '{not-json'],
    ['missing payload', null],
    ['unknown case', JSON.stringify({ id: 'missing', mode: 'classic', marks: emptyMarks(), elapsed: 1 })],
    ['wrong board shape', JSON.stringify({ id: 'case-1', mode: 'classic', marks: emptyMarks(3), elapsed: 1 })],
    ['stale person id', JSON.stringify({ id: 'case-1', mode: 'classic', marks: [[{ kind: 'person', person: 'old-person' }]], elapsed: 1 })],
  ])('returns null for %s saved play', (_label, raw) => {
    expect(parseInProgress(raw, [makePuzzle()])).toBeNull()
  })

  it('rejects malformed cell marks instead of exposing corrupted progress', () => {
    const marks = emptyMarks()
    marks[0][0] = { kind: 'person', person: 'p0' }
    const malformed = JSON.stringify({ id: 'case-1', mode: 'classic', marks, elapsed: -1 })
    expect(parseInProgress(malformed, [makePuzzle()])).toBeNull()
  })

  it('rejects duplicate placed people and invalid selected people', () => {
    const marks = emptyMarks()
    marks[0][0] = { kind: 'person', person: 'p0' }
    marks[1][1] = { kind: 'person', person: 'p0', locked: true }
    expect(parseInProgress(JSON.stringify({ id: 'case-1', mode: 'classic', marks, elapsed: 1 }), [makePuzzle()])).toBeNull()

    marks[1][1] = { kind: 'empty' }
    expect(parseInProgress(JSON.stringify({ id: 'case-1', mode: 'classic', marks, elapsed: 1, selected: 'gone' }), [makePuzzle()])).toBeNull()
  })

  it('accepts the expanded field aliases and a decoded object payload', () => {
    const marks = emptyMarks()
    marks[0][0] = { kind: 'person', person: 'p0', locked: false }
    marks[0][1] = { kind: 'x', auto: true }
    expect(parseInProgress({
      puzzleId: 'case-1', mode: 'classic', marks, elapsedSeconds: 2.9, selectedPerson: null,
    }, [makePuzzle()])).toEqual({
      id: 'case-1', mode: 'classic', elapsedSeconds: 2, placedCount: 1, selectedPerson: null,
    })
  })

  it.each([
    ['empty id', { id: '', mode: 'classic', marks: emptyMarks(), elapsed: 1 }],
    ['invalid mode', { id: 'case-1', mode: 'arcade', marks: emptyMarks(), elapsed: 1 }],
    ['non-array marks', { id: 'case-1', mode: 'classic', marks: {}, elapsed: 1 }],
    ['non-array row', { id: 'case-1', mode: 'classic', marks: [{}, [], [], []], elapsed: 1 }],
    ['invalid mark kind', { id: 'case-1', mode: 'classic', marks: [[{ kind: 'nope' }, ...emptyMarks()[0].slice(1)], ...emptyMarks().slice(1)], elapsed: 1 }],
    ['invalid locked flag', { id: 'case-1', mode: 'classic', marks: [[{ kind: 'person', person: 'p0', locked: 'yes' }, ...emptyMarks()[0].slice(1)], ...emptyMarks().slice(1)], elapsed: 1 }],
    ['invalid auto flag', { id: 'case-1', mode: 'classic', marks: [[{ kind: 'x', auto: 'yes' }, ...emptyMarks()[0].slice(1)], ...emptyMarks().slice(1)], elapsed: 1 }],
    ['empty draft', { id: 'case-1', mode: 'classic', marks: [[{ kind: 'draft', persons: [] }, ...emptyMarks()[0].slice(1)], ...emptyMarks().slice(1)], elapsed: 1 }],
    ['duplicate draft', { id: 'case-1', mode: 'classic', marks: [[{ kind: 'draft', persons: ['p0', 'p0'] }, ...emptyMarks()[0].slice(1)], ...emptyMarks().slice(1)], elapsed: 1 }],
    ['unknown draft person', { id: 'case-1', mode: 'classic', marks: [[{ kind: 'draft', persons: ['gone'] }, ...emptyMarks()[0].slice(1)], ...emptyMarks().slice(1)], elapsed: 1 }],
    ['infinite elapsed', { id: 'case-1', mode: 'classic', marks: emptyMarks(), elapsed: Infinity }],
  ])('rejects %s', (_label, raw) => {
    expect(parseInProgress(raw, [makePuzzle()])).toBeNull()
  })
})

describe('resolveClueHighlight', () => {
  it('maps room clues to a room id', () => {
    const puzzle = makePuzzle({ clues: [{ clue: { kind: 'room', person: 'p0', roomId: 'study' }, text: 'In the Study.' }] })
    expect(resolveClueHighlight(puzzle, 'p0')).toEqual({ roomId: 'study' })
  })

  it('maps furniture clues to the furniture type', () => {
    const puzzle = makePuzzle({ clues: [{ clue: { kind: 'onFurniture', person: 'p1', furniture: 'desk' }, text: 'On the desk.' }] })
    expect(resolveClueHighlight(puzzle, 'p1')).toEqual({ furniture: 'desk' })
  })

  it.each(['onlyOnFurniture', 'besideFurniture'] as const)('maps %s clues to furniture', kind => {
    const puzzle = makePuzzle({ clues: [{ clue: { kind, person: 'p1', furniture: 'chair' }, text: 'By the chair.' }] })
    expect(resolveClueHighlight(puzzle, 'p1')).toEqual({ furniture: 'chair' })
  })

  it('uses the first beside-any furniture and ignores an empty alternative list', () => {
    const puzzle = makePuzzle({ clues: [{ clue: { kind: 'besideAny', person: 'p1', furniture: ['plant', 'shrub'] }, text: 'By a plant.' }] })
    expect(resolveClueHighlight(puzzle, 'p1')).toEqual({ furniture: 'plant' })
    const empty = makePuzzle({ clues: [{ clue: { kind: 'besideAny', person: 'p1', furniture: [] }, text: 'Nowhere.' }] })
    expect(resolveClueHighlight(empty, 'p1')).toBeNull()
  })

  it('expands row and column constraints into matching board cells', () => {
    const puzzle = makePuzzle({ clues: [{ clue: { kind: 'row', person: 'p2', row: 2 }, text: 'In row 3.' }] })
    expect(resolveClueHighlight(puzzle, 'p2')).toEqual({
      cells: [0, 1, 2, 3].map(col => ({ row: 2, col })),
    })
    const columnPuzzle = makePuzzle({ clues: [{ clue: { kind: 'col', person: 'p2', col: 1 }, text: 'In column 2.' }] })
    expect(resolveClueHighlight(columnPuzzle, 'p2')).toEqual({
      cells: [0, 1, 2, 3].map(row => ({ row, col: 1 })),
    })
  })

  it('maps edge, corner, and directional constraints to exact candidate cells', () => {
    const edgePuzzle = makePuzzle({ clues: [{ clue: { kind: 'edge', person: 'p0' }, text: 'Against a wall.' }] })
    expect(resolveClueHighlight(edgePuzzle, 'p0')?.cells).toHaveLength(12)

    const cornerPuzzle = makePuzzle({ clues: [{ clue: { kind: 'corner', person: 'p0' }, text: 'In a corner.' }] })
    expect(resolveClueHighlight(cornerPuzzle, 'p0')).toEqual({
      cells: [{ row: 0, col: 0 }, { row: 0, col: 3 }, { row: 3, col: 0 }, { row: 3, col: 3 }],
    })

  })

  it('returns null for missing people and impossible coordinate clues', () => {
    expect(resolveClueHighlight(makePuzzle(), 'missing')).toBeNull()
    const row = makePuzzle({ clues: [{ clue: { kind: 'row', person: 'p0', row: 9 }, text: 'Outside.' }] })
    expect(resolveClueHighlight(row, 'p0')).toBeNull()
  })

  it('leaves relationship-only clues unhighlighted', () => {
    const puzzle = makePuzzle({ clues: [{ clue: { kind: 'sameRoomAs', person: 'p0', other: 'p1' }, text: 'With Bram.' }] })
    expect(resolveClueHighlight(puzzle, 'p0')).toBeNull()
    const direction = makePuzzle({ clues: [{ clue: { kind: 'direction', person: 'p0', other: 'p1', dir: 'N', steps: 1 }, text: 'North of Bram.' }] })
    expect(resolveClueHighlight(direction, 'p0')).toBeNull()
  })
})

describe('versioned case notes store', () => {
  it('serializes and parses the exact versioned record shape', () => {
    const raw = serializeCaseNotes({ 'case-1': 'Check the desk.' })
    expect(CASE_NOTES_KEY).toBe('murdoku_case_notes_v1')
    expect(JSON.parse(raw)).toEqual({ version: 1, notes: { 'case-1': 'Check the desk.' } })
    expect(parseCaseNotes(raw)).toEqual({ version: 1, notes: { 'case-1': 'Check the desk.' } })
  })

  it('drops malformed entries while preserving a safe empty store', () => {
    expect(parseCaseNotes('{"version":2,"notes":{"case-1":"old"}}')).toEqual({ version: 1, notes: {} })
    expect(parseCaseNotes('{"version":1,"notes":{"case-1":4,"":"ignored"}}')).toEqual({ version: 1, notes: {} })
  })

  it('accepts decoded stores, legacy cases, and store-shaped serialization', () => {
    expect(parseCaseNotes({ version: 1, cases: { 'case-1': 'Legacy note.' } })).toEqual({ version: 1, notes: { 'case-1': 'Legacy note.' } })
    expect(JSON.parse(serializeCaseNotes({ version: 1, notes: { 'case-2': 'Keep.', '': 'Drop.' } }))).toEqual({
      version: 1,
      notes: { 'case-2': 'Keep.' },
    })
    expect(parseCaseNotes(null)).toEqual({ version: 1, notes: {} })
  })
})
