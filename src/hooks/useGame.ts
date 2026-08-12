import { useReducer, useEffect, useCallback, useMemo } from 'react'
import type { Puzzle, CellMark, Screen, GameMode } from '../core/types'
import { getAllPuzzles, getPuzzleById, initCatalog } from '../core/catalog'
import { findMurderer } from '../core/engine'
import { IN_PROGRESS_KEY, LEGACY_IN_PROGRESS_KEY, parseInProgress } from '../core/ux'
import type { InProgressSummary } from '../core/ux'

export type Tool = 'place' | 'x' | 'draft'

interface GameState {
  screen: Screen
  mode: GameMode
  puzzle: Puzzle | null
  marks: CellMark[][]
  selectedPerson: string | null
  tool: Tool
  history: CellMark[][][]
  future: CellMark[][][]     // redo stack
  hintsLeft: number
  elapsedSeconds: number
  completed: boolean
  murderer: string | null
  feedback: 'none' | 'incomplete' | 'wrong' | 'blocked'
  correctCount: number       // # correctly-placed suspects at last wrong submit
  hideTimer: boolean
  resolvedClues: string[]   // person ids the player has crossed off (detective)
  completedIds: string[]
}

type Action =
  | { type: 'NAVIGATE'; screen: Screen }
  | { type: 'SET_MODE'; mode: GameMode }
  | { type: 'START'; puzzleId: string; mode: GameMode }
  | { type: 'SELECT_PERSON'; id: string }
  | { type: 'SET_TOOL'; tool: Tool }
  | { type: 'CELL'; row: number; col: number }
  | { type: 'ERASE'; row: number; col: number }
  | { type: 'TOGGLE_CLUE'; person: string }
  | { type: 'CLEAR_ALL' }
  | { type: 'UNDO' }
  | { type: 'HINT' }
  | { type: 'SUBMIT' }
  | { type: 'DISMISS_FEEDBACK' }
  | { type: 'REDO' }
  | { type: 'TOGGLE_TIMER' }
  | { type: 'TICK' }

const HINTS_START = 3
const STORAGE_KEY = 'murdoku_solved_v2'
const MODE_KEY = 'murdoku_mode'
const TIMER_KEY = 'murdoku_hide_timer'

function emptyMarks(n: number): CellMark[][] {
  return Array.from({ length: n }, () => Array.from({ length: n }, () => ({ kind: 'empty' as const })))
}
function cloneMarks(m: CellMark[][]): CellMark[][] {
  return m.map(row => row.map(c => c.kind === 'draft' ? { kind: 'draft' as const, persons: [...c.persons] } : { ...c }))
}

function loadSolved(): string[] { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') } catch { return [] } }
function saveSolved(ids: string[]) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(ids)) } catch { /* ignore */ } }

const RECORDS_KEY = 'murdoku_records'
export interface CaseRecord { bestSeconds: number; hints: number }
export function loadRecords(): Record<string, CaseRecord> {
  try { return JSON.parse(localStorage.getItem(RECORDS_KEY) ?? '{}') } catch { return {} }
}
function saveRecord(id: string, seconds: number, hints: number) {
  try {
    const r = loadRecords()
    if (!r[id] || seconds < r[id].bestSeconds) r[id] = { bestSeconds: seconds, hints }
    localStorage.setItem(RECORDS_KEY, JSON.stringify(r))
  } catch { /* ignore */ }
}
function loadMode(): GameMode { try { return (localStorage.getItem(MODE_KEY) as GameMode) || 'classic' } catch { return 'classic' } }
function loadHideTimer(): boolean { try { return localStorage.getItem(TIMER_KEY) === '1' } catch { return false } }

// --- mid-solve autosave (survives backing out to the case list / tab close) --
// v1 is the public read-only summary source. Keep writing the original key
// too so existing installs retain their resume behavior and compatibility.
const PLAY_KEY = IN_PROGRESS_KEY
const LEGACY_PLAY_KEY = LEGACY_IN_PROGRESS_KEY
interface SavedPlay { id: string; mode: GameMode; marks: CellMark[][]; elapsed: number; hints: number; selected: string | null }
function loadPlay(puzzle?: Puzzle): SavedPlay | null {
  for (const key of [PLAY_KEY, LEGACY_PLAY_KEY]) {
    try {
      const raw = localStorage.getItem(key)
      if (!raw) continue
      const parsed = JSON.parse(raw) as SavedPlay
      if (
        parsed
        && typeof parsed === 'object'
        && typeof parsed.hints === 'number'
        && Number.isFinite(parsed.hints)
        && parsed.hints >= 0
        && (!puzzle || parseInProgress(raw, [puzzle]))
      ) return parsed
    } catch { /* try the compatibility key */ }
  }
  return null
}
function savePlay(p: SavedPlay) {
  try {
    const raw = JSON.stringify(p)
    localStorage.setItem(PLAY_KEY, raw)
    localStorage.setItem(LEGACY_PLAY_KEY, raw)
  } catch { /* ignore */ }
}
function clearPlay() {
  try {
    localStorage.removeItem(PLAY_KEY)
    localStorage.removeItem(LEGACY_PLAY_KEY)
  } catch { /* ignore */ }
}
function loadInProgressSummary(puzzles: readonly Puzzle[]): InProgressSummary | null {
  for (const key of [PLAY_KEY, LEGACY_PLAY_KEY]) {
    try {
      const summary = parseInProgress(localStorage.getItem(key), puzzles)
      if (summary) return summary
    } catch { /* ignore unavailable storage */ }
  }
  return null
}
function hasAnyPlacement(marks: CellMark[][]): boolean {
  return marks.some(row => row.some(c => c.kind === 'person' || c.kind === 'draft' || c.kind === 'x'))
}

function clearPerson(marks: CellMark[][], personId: string) {
  for (const row of marks) for (let c = 0; c < row.length; c++) {
    const m = row[c]
    if (m.kind === 'person' && m.person === personId) row[c] = { kind: 'empty' }
    if (m.kind === 'draft') { const rest = m.persons.filter(p => p !== personId); row[c] = rest.length ? { kind: 'draft', persons: rest } : { kind: 'empty' } }
  }
}

function personCell(marks: CellMark[][], personId: string) {
  for (let r = 0; r < marks.length; r++) for (let c = 0; c < marks[r].length; c++) {
    const m = marks[r][c]
    if (m.kind === 'person' && m.person === personId) return { row: r, col: c }
  }
  return null
}

/**
 * Detective mode: placing a suspect immediately crosses their whole row and
 * column (nobody else can be there). So auto-✕ is derived from EVERY placed
 * suspect — there is no separate "lock" step. Classic mode does no crossing.
 */
function withAutoX(marks: CellMark[][], mode: GameMode): CellMark[][] {
  const N = marks.length
  // start by clearing any existing auto-✕ back to empty
  const m = marks.map(row => row.map(c => (c.kind === 'x' && c.auto) ? { kind: 'empty' as const } : (c.kind === 'draft' ? { kind: 'draft' as const, persons: [...c.persons] } : { ...c })))
  if (mode !== 'detective') return m
  const placed: { r: number; c: number }[] = []
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
    if (m[r][c].kind === 'person') placed.push({ r, c })
  }
  for (const { r, c } of placed) {
    for (let k = 0; k < N; k++) {
      for (const [rr, cc] of [[r, k], [k, c]] as const) {
        if (rr === r && cc === c) continue
        const cell = m[rr][cc]
        if (cell.kind === 'empty' || cell.kind === 'draft') m[rr][cc] = { kind: 'x', auto: true }
      }
    }
  }
  return m
}

/** Is there ANOTHER placed suspect sharing this row or column? (blocks placement) */
function occupiedRowOrCol(marks: CellMark[][], row: number, col: number, except: string): boolean {
  const N = marks.length
  for (let k = 0; k < N; k++) {
    for (const [r, c] of [[row, k], [k, col]] as const) {
      const m = marks[r][c]
      if (m.kind === 'person' && m.person !== except) return true
    }
  }
  return false
}

const initial: GameState = {
  screen: 'home', mode: loadMode(), puzzle: null, marks: [], selectedPerson: null, tool: 'place',
  history: [], future: [], hintsLeft: HINTS_START, elapsedSeconds: 0, completed: false,
  murderer: null, feedback: 'none', correctCount: 0, hideTimer: loadHideTimer(),
  resolvedClues: [], completedIds: loadSolved(),
}

function pushHistory(state: GameState): CellMark[][][] {
  return [...state.history.slice(-80), cloneMarks(state.marks)]
}

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'NAVIGATE':
      return { ...state, screen: action.screen }

    case 'SET_MODE': {
      try { localStorage.setItem(MODE_KEY, action.mode) } catch { /* ignore */ }
      return { ...state, mode: action.mode }
    }

    case 'START': {
      const puzzle = getPuzzleById(action.puzzleId)
      if (!puzzle) return state
      try { localStorage.setItem(MODE_KEY, action.mode) } catch { /* ignore */ }
      // Resume an unsubmitted attempt on this exact case + mode, if one exists.
      const saved = loadPlay(puzzle)
      const resume = saved && saved.id === action.puzzleId && saved.mode === action.mode
        && Array.isArray(saved.marks) && saved.marks.length === puzzle.size
      return {
        ...state, screen: 'game', mode: action.mode, puzzle,
        marks: resume ? saved!.marks : emptyMarks(puzzle.size),
        selectedPerson: resume ? (saved!.selected ?? puzzle.people[0]?.id ?? null) : (puzzle.people[0]?.id ?? null),
        tool: 'place', history: [], future: [], hintsLeft: resume ? saved!.hints : HINTS_START,
        elapsedSeconds: resume ? saved!.elapsed : 0,
        completed: false, murderer: null, feedback: 'none', correctCount: 0, resolvedClues: [],
      }
    }

    case 'SELECT_PERSON':
      return { ...state, selectedPerson: action.id, tool: state.tool === 'x' ? 'place' : state.tool, feedback: 'none' }

    case 'SET_TOOL':
      return { ...state, tool: action.tool, feedback: 'none' }

    case 'CELL': {
      if (!state.puzzle) return state
      const { row, col } = action
      const cur = state.marks[row][col]
      const history = pushHistory(state)
      let marks = cloneMarks(state.marks)

      if (state.tool === 'x') {
        if (cur.kind === 'person' && cur.locked) return state       // can't ✕ a locked answer
        if (cur.kind === 'x' && cur.auto) return { ...state, feedback: 'blocked' }
        marks[row][col] = cur.kind === 'x' ? { kind: 'empty' } : { kind: 'x' }
        return { ...state, marks: withAutoX(marks, state.mode), history, future: [], feedback: 'none' }
      }

      if (state.tool === 'draft') {
        if (!state.selectedPerson) return state
        if (cur.kind === 'person' || (cur.kind === 'x' && cur.auto)) return state
        const persons = cur.kind === 'draft' ? [...cur.persons] : []
        const i = persons.indexOf(state.selectedPerson)
        if (i >= 0) persons.splice(i, 1); else persons.push(state.selectedPerson)
        marks[row][col] = persons.length ? { kind: 'draft', persons } : { kind: 'empty' }
        return { ...state, marks: withAutoX(marks, state.mode), history, future: [], feedback: 'none' }
      }

      // place mode
      if (!state.selectedPerson) return state
      const existing = personCell(state.marks, state.selectedPerson)

      // tap the selected suspect's own cell to lift them
      if (cur.kind === 'person' && cur.person === state.selectedPerson) {
        marks[row][col] = { kind: 'empty' }
        marks = withAutoX(marks, state.mode)
        return { ...state, marks, history, future: [], feedback: 'none' }
      }

      if (state.mode === 'detective') {
        // Placing auto-crosses the row & column, so you may only place where no
        // OTHER suspect already sits in that row or column. Blocked clicks give
        // explicit feedback instead of doing nothing silently.
        if (occupiedRowOrCol(state.marks, row, col, state.selectedPerson)) {
          return { ...state, feedback: 'blocked' }
        }
        clearPerson(marks, state.selectedPerson)
        marks[row][col] = { kind: 'person', person: state.selectedPerson }
        marks = withAutoX(marks, state.mode)
        return { ...state, marks, history, future: [], feedback: 'none' }
      }

      // classic mode: free placement. If the target holds another suspect, swap
      // them to the mover's old cell rather than silently deleting them.
      const occupant = cur.kind === 'person' ? cur.person : null
      clearPerson(marks, state.selectedPerson)
      marks[row][col] = { kind: 'person', person: state.selectedPerson }
      if (occupant && occupant !== state.selectedPerson && existing) {
        marks[existing.row][existing.col] = { kind: 'person', person: occupant }
      }
      return { ...state, marks, history, future: [], feedback: 'none' }
    }

    case 'TOGGLE_CLUE': {
      const has = state.resolvedClues.includes(action.person)
      return { ...state, resolvedClues: has ? state.resolvedClues.filter(p => p !== action.person) : [...state.resolvedClues, action.person] }
    }

    case 'ERASE': {
      const cur = state.marks[action.row][action.col]
      if (cur.kind === 'person' && cur.locked) return state
      if (cur.kind === 'x' && cur.auto) return state
      const history = pushHistory(state)
      const marks = cloneMarks(state.marks)
      marks[action.row][action.col] = { kind: 'empty' }
      return { ...state, marks: withAutoX(marks, state.mode), history, future: [], feedback: 'none' }
    }

    case 'CLEAR_ALL': {
      if (!state.puzzle) return state
      return { ...state, history: pushHistory(state), future: [], marks: emptyMarks(state.puzzle.size), resolvedClues: [], feedback: 'none' }
    }

    case 'UNDO': {
      if (!state.history.length) return state
      const prev = state.history[state.history.length - 1]
      return { ...state, marks: cloneMarks(prev), history: state.history.slice(0, -1), future: [cloneMarks(state.marks), ...state.future].slice(0, 80), feedback: 'none' }
    }

    case 'REDO': {
      if (!state.future.length) return state
      const next = state.future[0]
      return { ...state, marks: cloneMarks(next), future: state.future.slice(1), history: [...state.history, cloneMarks(state.marks)], feedback: 'none' }
    }

    case 'TOGGLE_TIMER': {
      const v = !state.hideTimer
      try { localStorage.setItem(TIMER_KEY, v ? '1' : '0') } catch { /* ignore */ }
      return { ...state, hideTimer: v }
    }

    case 'HINT': {
      if (!state.puzzle || state.hintsLeft <= 0) return state
      const target = state.puzzle.people.find(person => {
        const cell = personCell(state.marks, person.id)
        const sol = state.puzzle!.solution[person.id]
        return !cell || cell.row !== sol.row || cell.col !== sol.col
      })
      if (!target) return state
      const history = pushHistory(state)
      let marks = cloneMarks(state.marks)
      // don't disturb locked correct answers
      const targetCellNow = personCell(marks, target.id)
      if (targetCellNow) { const tm = marks[targetCellNow.row][targetCellNow.col]; if (tm.kind === 'person' && tm.locked) return state }
      clearPerson(marks, target.id)
      const sol = state.puzzle.solution[target.id]
      const occ = marks[sol.row][sol.col]
      if (occ.kind === 'person') { if (occ.locked) return state; clearPerson(marks, occ.person) }
      marks[sol.row][sol.col] = { kind: 'person', person: target.id }
      marks = withAutoX(marks, state.mode)
      return checkWin({ ...state, marks, history, future: [], hintsLeft: state.hintsLeft - 1 })
    }

    case 'SUBMIT': {
      if (!state.puzzle) return state
      const allPlaced = state.puzzle.people.every(p => personCell(state.marks, p.id))
      if (!allPlaced) return { ...state, feedback: 'incomplete' }
      const correctCount = state.puzzle.people.reduce((n, p) => {
        const cell = personCell(state.marks, p.id)!
        const sol = state.puzzle!.solution[p.id]
        return n + (cell.row === sol.row && cell.col === sol.col ? 1 : 0)
      }, 0)
      if (correctCount !== state.puzzle.people.length) return { ...state, feedback: 'wrong', correctCount }
      return win(state)
    }

    case 'DISMISS_FEEDBACK':
      return { ...state, feedback: 'none' }

    case 'TICK':
      if (state.screen !== 'game' || state.completed) return state
      return { ...state, elapsedSeconds: state.elapsedSeconds + 1 }

    default:
      return state
  }
}

function checkWin(state: GameState): GameState {
  if (!state.puzzle) return state
  const done = state.puzzle.people.every(p => {
    const cell = personCell(state.marks, p.id)
    const sol = state.puzzle!.solution[p.id]
    return cell && cell.row === sol.row && cell.col === sol.col
  })
  return done ? win(state) : state
}

function win(state: GameState): GameState {
  const murderer = findMurderer(state.puzzle!, state.puzzle!.solution)
  const completedIds = state.completedIds.includes(state.puzzle!.id)
    ? state.completedIds : [...state.completedIds, state.puzzle!.id]
  saveSolved(completedIds)
  saveRecord(state.puzzle!.id, state.elapsedSeconds, HINTS_START - state.hintsLeft)
  clearPlay() // solved — drop the in-progress autosave
  return { ...state, completed: true, murderer, screen: 'victory', completedIds, feedback: 'none' }
}

export function useGame() {
  const [state, dispatch] = useReducer(reducer, initial)

  useEffect(() => { initCatalog() }, [])
  useEffect(() => {
    let paused = document.hidden
    const onVisibility = () => { paused = document.hidden }
    document.addEventListener('visibilitychange', onVisibility)
    const id = setInterval(() => { if (!paused) dispatch({ type: 'TICK' }) }, 1000)
    return () => { clearInterval(id); document.removeEventListener('visibilitychange', onVisibility) }
  }, [])

  // Autosave the in-progress attempt so backing out (or a tab close) never
  // loses mid-solve placements. Cleared automatically on solve.
  useEffect(() => {
    if (state.screen === 'game' && state.puzzle && !state.completed) {
      if (hasAnyPlacement(state.marks)) {
        savePlay({
          id: state.puzzle.id, mode: state.mode, marks: state.marks,
          elapsed: state.elapsedSeconds, hints: state.hintsLeft, selected: state.selectedPerson,
        })
      } else {
        clearPlay()
      }
    }
  }, [state.marks, state.elapsedSeconds, state.screen, state.completed, state.puzzle, state.mode, state.hintsLeft, state.selectedPerson])

  const puzzles = useMemo(() => getAllPuzzles(), [])

  const placedOf = useMemo(() => {
    const map: Record<string, { row: number; col: number; locked?: boolean }> = {}
    state.marks.forEach((row, r) => row.forEach((m, c) => {
      if (m.kind === 'person') map[m.person] = { row: r, col: c, locked: m.locked }
    }))
    return map
  }, [state.marks])

  const conflicts = useMemo(() => {
    if (!state.puzzle) return new Set<string>()
    const byRow: Record<number, string[]> = {}, byCol: Record<number, string[]> = {}
    for (const [pid, cell] of Object.entries(placedOf)) {
      ; (byRow[cell.row] ||= []).push(pid); (byCol[cell.col] ||= []).push(pid)
    }
    const bad = new Set<string>()
    for (const g of [...Object.values(byRow), ...Object.values(byCol)])
      if (g.length > 1) g.forEach(id => bad.add(id))
    return bad
  }, [placedOf, state.puzzle])

  const inProgress = loadInProgressSummary(puzzles)

  return {
    ...state,
    puzzles,
    placedOf,
    conflicts,
    inProgress,
    records: loadRecords(),
    timer: formatTime(state.elapsedSeconds),
    start: useCallback((id: string, mode: GameMode) => dispatch({ type: 'START', puzzleId: id, mode }), []),
    setMode: useCallback((mode: GameMode) => dispatch({ type: 'SET_MODE', mode }), []),
    navigate: useCallback((screen: Screen) => dispatch({ type: 'NAVIGATE', screen }), []),
    selectPerson: useCallback((id: string) => dispatch({ type: 'SELECT_PERSON', id }), []),
    setTool: useCallback((tool: Tool) => dispatch({ type: 'SET_TOOL', tool }), []),
    clickCell: useCallback((row: number, col: number) => dispatch({ type: 'CELL', row, col }), []),
    eraseCell: useCallback((row: number, col: number) => dispatch({ type: 'ERASE', row, col }), []),
    toggleClue: useCallback((person: string) => dispatch({ type: 'TOGGLE_CLUE', person }), []),
    clearAll: useCallback(() => dispatch({ type: 'CLEAR_ALL' }), []),
    undo: useCallback(() => dispatch({ type: 'UNDO' }), []),
    redo: useCallback(() => dispatch({ type: 'REDO' }), []),
    toggleTimer: useCallback(() => dispatch({ type: 'TOGGLE_TIMER' }), []),
    hint: useCallback(() => dispatch({ type: 'HINT' }), []),
    submit: useCallback(() => dispatch({ type: 'SUBMIT' }), []),
    dismissFeedback: useCallback(() => dispatch({ type: 'DISMISS_FEEDBACK' }), []),
  }
}

function formatTime(s: number): string {
  const m = Math.floor(s / 60), sec = s % 60
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
}
