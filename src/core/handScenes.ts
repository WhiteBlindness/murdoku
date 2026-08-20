// ============================================================================
// HAND-AUTHORED SCENE DATA — deliberately NOT derived from puzzle geometry.
//
// Puzzle data (src/data/cases/very-easy-1.ts) is cells/rows/columns/clues/
// solution. This file is a SEPARATE, hand-picked list of wall segments and
// pure decoration for that one scene: exact positions, exact gaps for
// doorways, exact Kenney sprite per piece. Rooms have zero puzzle meaning
// here. Only 'very-easy-1' ("Midnight Delivery") has an entry; every other
// puzzle gets no walls/decor until this one scene's art direction is
// approved. See very-easy-1.ts for the room rectangles this wall plan
// encloses (Bedroom/Office top, Hallway middle, Living Room/Kitchen bottom).
//
// v2 (after a 5-agent design review): the first pass used ONE wall type
// repeated at every edge, which read as "board-game trim." Rendered evidence
// establishes the interior-facing families: board edge A uses *_NW, board
// edge B uses *_NE, and the shared back vertex uses wallCorner_NW. The file
// suffix alone is not a reliable description of the board axis.
// ============================================================================

export interface WallSegment {
  kind: 'edge' | 'corner'
  /** For kind 'edge': which rear edge of THIS cell — A = row-1 side, B = col-1 side.
   *  For kind 'corner': ignored; the piece sits at THIS cell's back vertex (row-0.5, col-0.5). */
  edge?: 'A' | 'B'
  row: number
  col: number
  /** Exact Kenney base name. Edge A uses *_NW; edge B uses *_NE. */
  file: string
  /** Interior partitions render shorter/fainter so they never block the cell just past them. */
  tall: boolean
}

const edgeWall = (edge: 'A' | 'B', row: number, col: number, file: string, tall: boolean): WallSegment =>
  ({ kind: 'edge', edge, row, col, file, tall })
const corner = (row: number, col: number, file: string, tall = true): WallSegment =>
  ({ kind: 'corner', row, col, file, tall })

const VERY_EASY_1: WallSegment[] = [
  // ---- Exterior — the true back of the house. -----------------------------
  // North run (row 0, edge A): a window over the bedroom and the office desk,
  // a real corner piece at the true back vertex, plain wall elsewhere.
  corner(0, 0, 'wallCorner_NW'),
  edgeWall('A', 0, 1, 'wallWindow_NW', true),
  edgeWall('A', 0, 2, 'wall_NW', true),
  edgeWall('A', 0, 3, 'wall_NW', true),
  edgeWall('A', 0, 4, 'wallWindow_NW', true),
  edgeWall('A', 0, 5, 'wall_NW', true),
  // Full-height join between the exterior run and the bedroom/office wall.
  corner(0, 3, 'wallCorner_NW'),
  // West run (col 0, edge B): a window behind the living-room sofa. It ends
  // before the open camera-facing corner; a half panel there read as an
  // orphaned screen rather than an architectural return.
  edgeWall('B', 1, 0, 'wall_NE', true),
  edgeWall('B', 2, 0, 'wall_NE', true),
  edgeWall('B', 3, 0, 'wall_NE', true),
  edgeWall('B', 4, 0, 'wallWindow_NE', true),

  // ---- Interior — Bedroom vs Office (c2/c3, rows 0-1). Solid: a private
  //      bedroom, no direct pass-through. ----
  edgeWall('B', 0, 3, 'wall_NE', false),
  edgeWall('B', 1, 3, 'wall_NE', false),

  // ---- Interior — Bedroom vs Hallway (r1/r2, c0-2). Real doorway sprite at
  //      the gap, not blank space. ----
  edgeWall('A', 2, 0, 'wall_NW', false),
  edgeWall('A', 2, 1, 'wallDoorway_NW', false),
  edgeWall('A', 2, 2, 'wall_NW', false),

  // ---- Interior — Office vs Hallway (r1/r2, c3-5). ----
  edgeWall('A', 2, 3, 'wall_NW', false),
  edgeWall('A', 2, 4, 'wallDoorway_NW', false),
  edgeWall('A', 2, 5, 'wall_NW', false),
  corner(2, 3, 'wallCorner_NW', false),

  // ---- Interior — Hallway vs Living Room (r2/r3, c0-2). ----
  edgeWall('A', 3, 0, 'wall_NW', false),
  edgeWall('A', 3, 1, 'wallDoorway_NW', false),
  edgeWall('A', 3, 2, 'wall_NW', false),

  // ---- Interior — Hallway vs Kitchen (r2/r3, c3-5). ----
  edgeWall('A', 3, 3, 'wall_NW', false),
  edgeWall('A', 3, 4, 'wallDoorway_NW', false),
  edgeWall('A', 3, 5, 'wall_NW', false),
  corner(3, 3, 'wallCorner_NW', false),

  // ---- Living Room vs Kitchen (c2/c3, rows 3-5). A complete partition with
  //      a real doorway at row 4 makes both rooms legible without sealing the
  //      route between them. ----
  edgeWall('B', 3, 3, 'wall_NE', false),
  edgeWall('B', 4, 3, 'wallDoorway_NE', false),
  edgeWall('B', 5, 3, 'wall_NE', false),

  // NOTE — no "corner return" stubs. An earlier pass added four short walls
  // at (1,1), (1,5), (4,2) and (4,5) to force L-shaped corners, but each of
  // those edges is INSIDE a room, so they rendered as free-standing screens
  // splitting the bedroom, office, living room and kitchen in half. Every
  // room is already enclosed by the exterior runs plus the row-2/row-3/col-3
  // dividers above; the corners come from those meeting, not from extra fins.
]

export interface DecorPiece {
  row: number
  col: number
  /** Exact Kenney base name, without facing suffix. */
  file: string
  facing: 'NE' | 'NW' | 'SE' | 'SW'
  /**
   * Pixels to raise the prop so it rests on the SURFACE in its cell rather
   * than on the floor — a microwave on the counter run, a laptop on a desk.
   * Omit for anything that genuinely stands on the floor. A prop with no
   * surface beneath it should be deleted, not left floating.
   */
  lift?: number
}

// Pure decoration — never a clue target, never read by the solver. A few
// touches beyond the real gameplay furniture (very-easy-1.ts) so the hallway
// and living room don't read as emptier than the rooms with more clues.
// The near half of the board (living room + hallway, rows 3-5) read as bare
// floor next to a furnished far half, so the composition was lopsided. These
// fill it as a real sitting area and a used corridor.
const VERY_EASY_1_DECOR: DecorPiece[] = [
  // Hallway — a low surface leaves the narrow passage visually open.
  { row: 2, col: 2, file: 'sideTable', facing: 'SE' },
  // Living room — a side table and plant complete the fixed seating group
  // without occupying the sofa or television footprints.
  { row: 5, col: 1, file: 'pottedPlant', facing: 'SE' },
  // Kitchen — the microwave is centred on the fixed two-cell counter run.
  { row: 3, col: 3.5, file: 'kitchenMicrowave', facing: 'SE', lift: 62 },
  // Office finishing touches — both props have visible supporting furniture.
  { row: 0, col: 3, file: 'laptop', facing: 'SE', lift: 58 },
  { row: 1, col: 5, file: 'books', facing: 'SE', lift: 45 },
]

const WALLS: Record<string, WallSegment[]> = { 'very-easy-1': VERY_EASY_1 }
const DECOR: Record<string, DecorPiece[]> = { 'very-easy-1': VERY_EASY_1_DECOR }

export function getSceneWalls(puzzleId: string): WallSegment[] {
  return WALLS[puzzleId] ?? []
}
export function getSceneDecor(puzzleId: string): DecorPiece[] {
  return DECOR[puzzleId] ?? []
}
