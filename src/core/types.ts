// ============================================================================
// Murdoku core types — a constraint-satisfaction deduction puzzle.
//
// N people (suspects + one victim) are placed on an N×N house map so that each
// row and each column holds exactly ONE person (a permutation — most cells stay
// empty). Clues constrain where each person was. The murderer is the suspect
// left alone with the victim in the same room.
//
// This module is pure data/logic — no React — so it ports to any runtime.
// ============================================================================

/**
 * Board size is no longer the suspect count. A house needs enough cells for
 * rooms that read as rooms; the number of suspects is tuned separately per
 * difficulty, so a large board does not force a large cast.
 */
export type GridSize = 4 | 5 | 6 | 7 | 8 | 9 | 10

/** A cell coordinate. row 0 = top, col 0 = left. floor 0 = ground (absent means 0). */
export interface Cell { row: number; col: number; floor?: number }

/** Returns the floor a cell is on, defaulting to 0 (ground). */
export function cellFloor(c: Cell): number { return c.floor ?? 0 }

/**
 * True when two cells share the same row AND column but are on different floors.
 * Used by above/below clues.
 */
export function sameColumnStack(a: Cell, b: Cell): boolean {
  return a.row === b.row && a.col === b.col && cellFloor(a) !== cellFloor(b)
}

export type FurnitureType =
  | 'chair' | 'sofa' | 'bed' | 'table' | 'box' | 'rug'
  | 'plant' | 'shrub' | 'lamp' | 'counter' | 'tv' | 'bathtub'
  | 'bookshelf' | 'stove' | 'fridge' | 'clock' | 'desk' | 'toilet' | 'shower'

export interface Furniture {
  type: FurnitureType
  /** Top-left anchor cell of the piece. */
  row: number
  col: number
  /**
   * Footprint in cells. A real bed or sofa covers more floor than a lamp, and a
   * board where every object is exactly one cell reads as a grid of icons
   * rather than as a room seen from above. Both default to 1 when absent, so
   * existing data and every single-cell piece stay valid.
   */
  w?: number
  h?: number
  rotation?: 0 | 90 | 180 | 270
  /** Floor the piece sits on. Absent means 0 (ground). */
  floor?: number
}

/** Footprint of a piece, defaulting to a single cell. */
export function furnitureFootprint(f: Furniture): { w: number; h: number } {
  return { w: Math.max(1, f.w ?? 1), h: Math.max(1, f.h ?? 1) }
}

/** Every cell a piece covers. */
export function furnitureCells(f: Furniture): Cell[] {
  const { w, h } = furnitureFootprint(f)
  const cells: Cell[] = []
  for (let r = 0; r < h; r++) {
    for (let c = 0; c < w; c++) cells.push({ row: f.row + r, col: f.col + c })
  }
  return cells
}

export interface Room {
  id: string
  name: string
  hue: number            // 0–360, gives each room a distinct tint
  cells: Cell[]          // the cells belonging to this room
  /** Floor this room is on. Absent means 0 (ground). */
  floor?: number
}

export interface Person {
  id: string
  name: string
  /** Seed handed to DiceBear so each suspect gets a stable, distinct portrait. */
  avatarSeed: string
  accent: string         // hex accent used for their token/border
  isVictim?: boolean
}

// --- Clues -----------------------------------------------------------------
// Every clue is a hard rule that must be literally true of the solution.

export type Clue =
  | { kind: 'room'; person: string; roomId: string }                 // "was in the Bedroom"
  | { kind: 'onFurniture'; person: string; furniture: FurnitureType }// "sitting in a chair"
  | { kind: 'besideFurniture'; person: string; furniture: FurnitureType } // "beside the box"
  | { kind: 'besideAny'; person: string; furniture: FurnitureType[] }// "beside a shrub or a plant"
  | { kind: 'onlyOnFurniture'; person: string; furniture: FurnitureType } // "only person on a rug"
  | { kind: 'row'; person: string; row: number }                     // "in the top row" (0-indexed)
  | { kind: 'col'; person: string; col: number }                     // "in the last column"
  | { kind: 'edge'; person: string }                                 // "against a wall"
  | { kind: 'corner'; person: string }                               // "in a corner"
  | { kind: 'direction'; person: string; other: string; dir: 'N' | 'S' | 'E' | 'W'; steps?: number }
  | { kind: 'besidePerson'; person: string; other: string }          // "right next to X"
  | { kind: 'sameRoomAs'; person: string; other: string }            // "in the same room as X"
  | { kind: 'victim'; person: string }                               // marks the victim
  // Two-floor clues (Hard/Expert/Master only)
  | { kind: 'floor'; person: string; floorNum: number }             // "Upstairs." / "On the ground floor."
  | { kind: 'above'; person: string; target: string; targetKind: 'room' | 'person' } // "Directly above the Kitchen." / "Directly above Marco."
  | { kind: 'below'; person: string; target: string; targetKind: 'room' | 'person' } // "Directly below the Kitchen." / "Directly below Marco."
  // Negation clues — exclude rather than pin
  | { kind: 'notRoom'; person: string; roomId: string }             // "Never set foot in the Kitchen."
  | { kind: 'notSameRoomAs'; person: string; other: string }        // "Was not in the same room as Marco."

/** Human-readable rendering data lives alongside the logical clue. */
export interface ClueText {
  clue: Clue
  text: string           // full sentence, e.g. "He was beside the box."
}

// --- Puzzle ----------------------------------------------------------------

export interface Puzzle {
  id: string
  title: string
  caseNumber: string
  difficulty: Difficulty
  size: GridSize
  rooms: Room[]
  roomOf: string[][]     // roomOf[row][col] -> room id (floor 0 / single-floor)
  /**
   * Per-floor room maps. Index 0 must equal roomOf for two-floor puzzles.
   * Absent for single-floor puzzles.
   */
  roomOfByFloor?: string[][][]
  /** Number of floors. Absent or 1 = single-floor. */
  floors?: number
  furniture: Furniture[]
  people: Person[]       // includes the victim
  clues: ClueText[]      // one-or-more per person (victim gets the "alone with" line)
  solution: Record<string, Cell>  // person id -> cell (the unique answer)
  victimId: string
  murdererId: string
  flavor: string         // short intro blurb
  source?: 'builtin' | 'imported' | 'custom' | 'generated'
}

export type Difficulty = 'Very Easy' | 'Easy' | 'Medium' | 'Hard' | 'Expert' | 'Master'

// --- Play state ------------------------------------------------------------

/** What the player has put in a cell. */
export type CellMark =
  | { kind: 'empty' }
  | { kind: 'person'; person: string; locked?: boolean } // placed token (locked = committed answer)
  | { kind: 'x'; auto?: boolean }        // "nobody here" (auto = derived from a lock)
  | { kind: 'draft'; persons: string[] } // tentative pencil candidates

/** Classic = free placement + submit. Detective = draft + lock/auto-eliminate. */
export type GameMode = 'classic' | 'detective'

export type Screen = 'home' | 'game' | 'victory' | 'releases'
