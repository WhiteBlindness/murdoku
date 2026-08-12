import type {
  Cell,
  CellMark,
  Difficulty,
  FurnitureType,
  GameMode,
  Puzzle,
} from './types'

export const IN_PROGRESS_KEY = 'murdoku_play_v1'
export const LEGACY_IN_PROGRESS_KEY = 'murdoku_inprogress'
export const CASE_NOTES_KEY = 'murdoku_case_notes_v1'
export const NOTE_STORE_KEY = CASE_NOTES_KEY
export const CASE_NOTES_STORAGE_KEY = CASE_NOTES_KEY

export type DifficultyFilter = Difficulty | 'All'

export interface InProgressSummary {
  readonly id: string
  readonly mode: GameMode
  readonly elapsedSeconds: number
  readonly placedCount: number
  readonly selectedPerson: string | null
}

export interface ClueHighlight {
  roomId?: string
  furniture?: FurnitureType
  cells?: Cell[]
}

export interface CaseNotesStore {
  version: 1
  notes: Record<string, string>
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function decode(raw: unknown): unknown {
  if (typeof raw !== 'string') return raw
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function normalized(value: string): string {
  return value.trim().toLocaleLowerCase()
}

/** Return catalog cases matching both the free-text query and difficulty. */
export function filterCases(
  puzzles: readonly Puzzle[],
  query = '',
  difficulty: DifficultyFilter = 'All',
): Puzzle[] {
  const needle = normalized(query)
  return puzzles.filter(puzzle => {
    if (difficulty !== 'All' && puzzle.difficulty !== difficulty) return false
    if (!needle) return true

    const searchable = [
      puzzle.id,
      puzzle.title,
      puzzle.caseNumber,
      puzzle.flavor,
      ...puzzle.people.map(person => person.name),
      ...puzzle.rooms.map(room => room.name),
    ]
      .join(' ')
      .toLocaleLowerCase()

    return searchable.includes(needle)
  })
}

function validMode(value: unknown): value is GameMode {
  return value === 'classic' || value === 'detective'
}

function validPersonId(value: unknown, personIds: ReadonlySet<string>): value is string {
  return typeof value === 'string' && personIds.has(value)
}

function validCellMark(value: unknown, personIds: ReadonlySet<string>): value is CellMark {
  if (!isRecord(value) || typeof value.kind !== 'string') return false

  switch (value.kind) {
    case 'empty':
      return true
    case 'person':
      return validPersonId(value.person, personIds)
        && (value.locked === undefined || typeof value.locked === 'boolean')
    case 'x':
      return value.auto === undefined || typeof value.auto === 'boolean'
    case 'draft': {
      if (!Array.isArray(value.persons) || value.persons.length === 0) return false
      const persons = value.persons.filter((person): person is string => typeof person === 'string')
      return persons.length === value.persons.length
        && new Set(persons).size === persons.length
        && persons.every(person => personIds.has(person))
    }
    default:
      return false
  }
}

/**
 * Parse an autosaved play into the small, read-only summary needed by Home.
 * Invalid JSON, unknown cases, wrong board dimensions, and stale person ids
 * are deliberately treated as no resumable work.
 */
export function parseInProgress(
  raw: unknown,
  puzzles: readonly Puzzle[],
): InProgressSummary | null {
  const value = decode(raw)
  if (!isRecord(value)) return null

  const id = value.id ?? value.puzzleId
  if (typeof id !== 'string' || !id) return null
  const puzzle = puzzles.find(candidate => candidate.id === id)
  if (!puzzle || !validMode(value.mode)) return null

  const marks = value.marks
  if (!Array.isArray(marks) || marks.length !== puzzle.size) return null

  const personIds = new Set(puzzle.people.map(person => person.id))
  const placedPeople = new Set<string>()
  for (const row of marks) {
    if (!Array.isArray(row) || row.length !== puzzle.size) return null
    for (const mark of row) {
      if (!validCellMark(mark, personIds)) return null
      if (mark.kind === 'person') {
        if (placedPeople.has(mark.person)) return null
        placedPeople.add(mark.person)
      }
    }
  }

  const elapsedValue = value.elapsedSeconds ?? value.elapsed
  if (typeof elapsedValue !== 'number' || !Number.isFinite(elapsedValue) || elapsedValue < 0) return null

  const selected = value.selectedPerson ?? value.selected ?? null
  if (selected !== null && !validPersonId(selected, personIds)) return null

  return {
    id,
    mode: value.mode,
    elapsedSeconds: Math.floor(elapsedValue),
    placedCount: placedPeople.size,
    selectedPerson: selected,
  }
}

function cellsForRow(size: number, row: number): Cell[] {
  if (row < 0 || row >= size) return []
  return Array.from({ length: size }, (_, col) => ({ row, col }))
}

function cellsForColumn(size: number, col: number): Cell[] {
  if (col < 0 || col >= size) return []
  return Array.from({ length: size }, (_, row) => ({ row, col }))
}

function cellsForEdge(size: number): Cell[] {
  const cells: Cell[] = []
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (row === 0 || col === 0 || row === size - 1 || col === size - 1) cells.push({ row, col })
    }
  }
  return cells
}

function cellsForCorner(size: number): Cell[] {
  return [
    { row: 0, col: 0 },
    { row: 0, col: size - 1 },
    { row: size - 1, col: 0 },
    { row: size - 1, col: size - 1 },
  ]
}

/** Resolve the most direct board target represented by a person's clue. */
export function resolveClueHighlight(puzzle: Puzzle, personId: string): ClueHighlight | null {
  const clues = puzzle.clues.filter(({ clue }) => clue.person === personId)
  if (!clues.length) return null

  const roomClue = clues.find(({ clue }) => clue.kind === 'room')?.clue
  if (roomClue?.kind === 'room') return { roomId: roomClue.roomId }

  const furnitureClue = clues.find(({ clue }) =>
    clue.kind === 'onFurniture'
      || clue.kind === 'onlyOnFurniture'
      || clue.kind === 'besideFurniture'
      || clue.kind === 'besideAny'
  )?.clue
  if (furnitureClue?.kind === 'onFurniture' || furnitureClue?.kind === 'onlyOnFurniture' || furnitureClue?.kind === 'besideFurniture') {
    return { furniture: furnitureClue.furniture }
  }
  if (furnitureClue?.kind === 'besideAny') {
    const furniture = furnitureClue.furniture[0]
    return furniture ? { furniture } : null
  }

  const coordinateClue = clues.find(({ clue }) =>
    clue.kind === 'row'
      || clue.kind === 'col'
      || clue.kind === 'edge'
      || clue.kind === 'corner'
  )?.clue
  if (!coordinateClue) return null

  let cells: Cell[] = []
  switch (coordinateClue.kind) {
    case 'row': cells = cellsForRow(puzzle.size, coordinateClue.row); break
    case 'col': cells = cellsForColumn(puzzle.size, coordinateClue.col); break
    case 'edge': cells = cellsForEdge(puzzle.size); break
    case 'corner': cells = cellsForCorner(puzzle.size); break
  }
  return cells.length ? { cells } : null
}

function emptyCaseNotes(): CaseNotesStore {
  return { version: 1, notes: {} }
}

function cleanNotes(value: unknown): Record<string, string> {
  if (!isRecord(value)) return {}
  const notes: Record<string, string> = {}
  for (const [caseId, note] of Object.entries(value)) {
    if (caseId && typeof note === 'string' && note.length > 0) notes[caseId] = note
  }
  return notes
}

/** Parse the v1 notes record; malformed versions fail closed to an empty store. */
export function parseCaseNotes(raw: unknown): CaseNotesStore {
  const value = decode(raw)
  if (!isRecord(value) || value.version !== 1) return emptyCaseNotes()
  const notes = isRecord(value.notes) ? value.notes : value.cases
  return { version: 1, notes: cleanNotes(notes) }
}

/** Serialize a notes map or a v1 store without allowing prototype pollution. */
export function serializeCaseNotes(value: CaseNotesStore | Record<string, string>): string {
  const candidate: unknown = value
  const notes = isRecord(candidate) && candidate.version === 1 && isRecord(candidate.notes)
    ? cleanNotes(candidate.notes)
    : cleanNotes(candidate)
  return JSON.stringify({ version: 1, notes })
}

// Explicit aliases keep the helpers discoverable for consumers that call the
// persistence layer a note store rather than a case-notes store.
export const parseNoteStore = parseCaseNotes
export const serializeNoteStore = serializeCaseNotes
export const parseNotes = parseCaseNotes
export const serializeNotes = serializeCaseNotes
