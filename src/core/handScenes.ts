import type { Furniture } from './types'

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
  /** Stable scene-only identity for visual QA and local rendering policy. */
  id?: string
  kind: 'edge' | 'corner'
  /** For kind 'edge': which rear edge of THIS cell — A = row-1 side, B = col-1 side.
   *  For kind 'corner': ignored; the piece sits at THIS cell's back vertex (row-0.5, col-0.5). */
  edge?: 'A' | 'B'
  row: number
  col: number
  /** Exact Kenney base name. Edge A uses *_NW; edge B uses *_NE. */
  file: string
  /** Exterior Kenney sprite or a custom cutaway partition. */
  render: 'native' | 'cutaway'
  /** Number of contiguous board edges represented by this single architectural run. */
  span?: number
  /** Interior partitions can be lowered without narrowing their plan length. */
  height?: number
  /** Shell returns keep the exterior material family while using cutaway geometry. */
  tone?: 'interior' | 'shell'
  /** Deliberate openings cut into one continuous architectural run. */
  openings?: WallOpening[]
}

export interface WallOpening {
  /** Zero-based cell within the run containing the opening. */
  index: number
  /** Opening width as a fraction of one board edge. */
  width: number
  kind: 'door' | 'cased'
}

const edgeWall = (edge: 'A' | 'B', row: number, col: number, file: string, render: WallSegment['render']): WallSegment =>
  ({ kind: 'edge', edge, row, col, file, render })
const corner = (row: number, col: number, file: string): WallSegment =>
  ({ kind: 'corner', row, col, file, render: 'native' })
const cutawayRun = (
  id: string,
  edge: 'A' | 'B',
  row: number,
  col: number,
  span: number,
  file: string,
  height: number,
  openings: WallOpening[] = [],
  tone: WallSegment['tone'] = 'interior',
): WallSegment => ({
  id, kind: 'edge', edge, row, col, span, file, height, openings, tone, render: 'cutaway',
})

const VERY_EASY_1: WallSegment[] = [
  // ---- Exterior — the true back of the house. -----------------------------
  // North run (row 0, edge A): a window over the bedroom and the office desk,
  // a real corner piece at the true back vertex, plain wall elsewhere.
  corner(0, 0, 'wallCorner_NW'),
  edgeWall('B', 0, 0, 'wall_NE', 'native'),
  edgeWall('A', 0, 0, 'wall_NW', 'native'),
  edgeWall('A', 0, 1, 'wallWindow_NW', 'native'),
  edgeWall('A', 0, 2, 'wall_NW', 'native'),
  edgeWall('A', 0, 3, 'wall_NW', 'native'),
  edgeWall('A', 0, 4, 'wallWindow_NW', 'native'),
  edgeWall('A', 0, 5, 'wall_NW', 'native'),
  // West run (col 0, edge B): a window behind the living-room sofa.
  edgeWall('B', 1, 0, 'wall_NE', 'native'),
  edgeWall('B', 2, 0, 'wall_NE', 'native'),
  edgeWall('B', 3, 0, 'wall_NE', 'native'),
  edgeWall('B', 4, 0, 'wallWindow_NE', 'native'),

  // A low camera-side return finishes the perimeter without hiding the room.
  cutawayRun('shell-west-return', 'B', 5, 0, 1, 'wall_NE', 58, [], 'shell'),
  // The matching low kitchen return gives the fridge/stove a built edge while
  // preserving the open dollhouse view across the camera-facing elevation.
  cutawayRun('shell-kitchen-return', 'B', 3, 6, 3, 'wall_NE', 52, [], 'shell'),

  // ---- Interior — four long architectural runs. ---------------------------
  // They follow room-scale boundaries, not cell rhythm. Doorways are openings
  // in these runs, so circulation stays readable without detached panels.
  // Bedroom vs Office: solid private partition.
  cutawayRun('bedroom-office', 'B', 0, 3, 2, 'wall_NE', 86),

  // Bedroom/Office vs Hallway: one doorway into each private room. The office
  // opening sits away from the fixed lamp at (1,4).
  cutawayRun('bedrooms-hall', 'A', 2, 0, 6, 'wallDoorway_NW', 86, [
    { index: 1, width: 0.74, kind: 'door' },
    { index: 3, width: 0.74, kind: 'door' },
  ]),

  // The social zone enters through the living room. The kitchen's north wall
  // remains a coherent service wall behind its immutable counter/stove run.
  cutawayRun('hall-social', 'A', 3, 0, 6, 'wallDoorway_NW', 80, [
    { index: 1, width: 0.88, kind: 'cased' },
  ]),

  // Living Room vs Kitchen: the opening is at row 5, not behind the row-4
  // television/table pair. This also makes the visible route agree with the
  // authored Priya-at-(5,2) / chair-at-(5,3) relationship.
  cutawayRun('living-kitchen', 'B', 3, 3, 3, 'wallDoorway_NE', 80, [
    { index: 2, width: 0.82, kind: 'cased' },
  ]),
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
  /** Named visible support, required for every lifted scene prop. */
  support?: 'counter' | 'desk' | 'bookshelf'
  /** Presentational enlargement for props that disappear at phone scale. */
  scale?: number
}

// Pure decoration — never a clue target, never read by the solver. A few
// touches beyond the real gameplay furniture (very-easy-1.ts) so the hallway
// and living room don't read as emptier than the rooms with more clues.
// The near half of the board (living room + hallway, rows 3-5) read as bare
// floor next to a furnished far half, so the composition was lopsided. These
// fill it as a real sitting area and a used corridor.
const VERY_EASY_1_DECOR: DecorPiece[] = [
  { row: 3, col: 4, file: 'kitchenMicrowave', facing: 'SE', lift: 76, scale: 1.25, support: 'counter' },
  { row: 0, col: 3, file: 'laptop', facing: 'SE', lift: 68, scale: 1.25, support: 'desk' },
  { row: 1, col: 5, file: 'books', facing: 'SE', lift: 52, scale: 2, support: 'bookshelf' },
]

export type SceneFloorMaterial = 'oak' | 'slate' | 'terrazzo' | 'carpet' | 'tile'

export interface SceneFloorFinish {
  room: string
  material: SceneFloorMaterial
  fill: string
  detail: string
}

const VERY_EASY_1_FLOORS: SceneFloorFinish[] = [
  { room: 'Bedroom', material: 'oak', fill: '#D6A66F', detail: '#B77B45' },
  { room: 'Office', material: 'slate', fill: '#A9B5B1', detail: '#788985' },
  { room: 'Hallway', material: 'terrazzo', fill: '#C9B99F', detail: '#95836B' },
  { room: 'Living Room', material: 'carpet', fill: '#9B8795', detail: '#786573' },
  { room: 'Kitchen', material: 'tile', fill: '#D9D3BD', detail: '#AAA38C' },
]

export interface SceneFloorAccent {
  id: string
  row: number
  col: number
  w: number
  h: number
  scale: number
  fill: string
  stroke: string
}

const VERY_EASY_1_ACCENTS: SceneFloorAccent[] = []

export interface SceneFurnitureModule {
  file: string
  facing: 'NE' | 'NW' | 'SE' | 'SW'
  row: number
  col: number
  scale?: number
  /** Pixels above the logical contact plane; used only when another module visibly supports it. */
  lift?: number
}

export interface SceneFurnitureVisual {
  scale?: number
  /** Scene-only fractional shift; logical cell and clue footprint remain unchanged. */
  offsetRow?: number
  offsetCol?: number
  /** Small presentational correction for a sprite whose illustrated feet/base sit above its logical contact plane. */
  groundOffsetY?: number
  /** Scene-only contact-shadow tuning; these never change logical footprint or clue semantics. */
  shadowScale?: number
  shadowOpacity?: number
  shadowBlur?: number
  /** Aligns the contact shadow with transparent padding in the illustrated sprite. */
  shadowOffsetRow?: number
  shadowOffsetCol?: number
  modules?: SceneFurnitureModule[]
}

export function getSceneFurnitureVisual(
  puzzleId: string,
  furniture: Furniture,
): SceneFurnitureVisual | undefined {
  if (puzzleId !== 'very-easy-1') return undefined
  if (furniture.type === 'counter' && furniture.row === 3 && furniture.col === 3) {
    return {
      modules: [
        { file: 'kitchenSink', facing: 'SE', row: 3, col: 3, scale: 1.28 },
        { file: 'kitchenCabinet', facing: 'SE', row: 3, col: 4, scale: 1.28 },
      ],
    }
  }
  if (furniture.type === 'bed') return {
    scale: 1, groundOffsetY: 7, shadowScale: 0.62, shadowOpacity: 0.38, shadowBlur: 2.2,
    shadowOffsetRow: -0.05, shadowOffsetCol: -0.35,
  }
  if (furniture.type === 'sofa') return {
    scale: 1.04, groundOffsetY: 6, shadowScale: 0.6, shadowOpacity: 0.42, shadowBlur: 2.2,
    shadowOffsetRow: -0.08, shadowOffsetCol: -0.4,
  }
  if (furniture.type === 'lamp') return {
    modules: [
      {
        file: 'sideTable', facing: 'SE',
        row: furniture.row, col: furniture.col, scale: 0.65,
      },
      {
        file: 'lampRoundTable', facing: 'SE',
        row: furniture.row, col: furniture.col, scale: 0.9, lift: 54,
      },
    ],
  }
  if (furniture.type === 'plant') return { scale: 1.82, offsetRow: 0.2, offsetCol: -0.08 }
  if (furniture.type === 'chair' && furniture.row === 0 && furniture.col === 4) {
    return { scale: 1.28, offsetRow: 0.04, offsetCol: -0.38 }
  }
  if (furniture.type === 'chair' && furniture.row === 5 && furniture.col === 3) {
    return { scale: 1.28, offsetRow: 0.08, offsetCol: 0.35 }
  }
  if (furniture.type === 'chair') return { scale: 1.28 }
  if (furniture.type === 'desk') return { scale: 1.18 }
  if (furniture.type === 'bookshelf') return { scale: 1.25 }
  if (furniture.type === 'table' && furniture.row === 3 && furniture.col === 1) {
    return { scale: 1.12, offsetRow: 0.28, offsetCol: 0.22 }
  }
  if (furniture.type === 'table') return { scale: 1.12 }
  if (furniture.type === 'tv') return { scale: 1.3 }
  if (furniture.type === 'stove') return { scale: 1.12, offsetCol: 0.22 }
  if (furniture.type === 'fridge') return { scale: 1.06, offsetRow: 0.1, offsetCol: 0.22 }
  return undefined
}

const FLOOR_FINISHES: Record<string, SceneFloorFinish[]> = {
  'very-easy-1': VERY_EASY_1_FLOORS,
}
const FLOOR_ACCENTS: Record<string, SceneFloorAccent[]> = {
  'very-easy-1': VERY_EASY_1_ACCENTS,
}

const WALLS: Record<string, WallSegment[]> = { 'very-easy-1': VERY_EASY_1 }
const DECOR: Record<string, DecorPiece[]> = { 'very-easy-1': VERY_EASY_1_DECOR }

export function getSceneWalls(puzzleId: string): WallSegment[] {
  return WALLS[puzzleId] ?? []
}
export function getSceneDecor(puzzleId: string): DecorPiece[] {
  return DECOR[puzzleId] ?? []
}
export function getSceneFloorFinishes(puzzleId: string): SceneFloorFinish[] {
  return FLOOR_FINISHES[puzzleId] ?? []
}

export function getSceneFloorAccents(puzzleId: string): SceneFloorAccent[] {
  return FLOOR_ACCENTS[puzzleId] ?? []
}
