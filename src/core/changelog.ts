/* ============================================================================
   Changelog data.

   FORMAT FOR FUTURE ENTRIES (keep it consistent):
     {
       date: 'YYYY-MM-DD',        // ISO date; drives ordering + month grouping
       headline: 'Short imperative or noun phrase, ~3–7 words',
       detail: '2–3 sentences. What changed, and why it matters to the player.',
       tag: 'Feature' | 'Improvement' | 'Fix' | 'Content',  // optional label
     }

   Rules of thumb:
     • Newest first is handled automatically (do NOT pre-sort).
     • One entry = one shippable change the player would notice.
     • Write detail in plain language; avoid internal file/commit references.
     • Use `tag` consistently so entries are scannable at a glance.
============================================================================ */

export type ChangeTag = 'Feature' | 'Improvement' | 'Fix' | 'Content'

export interface ChangeEntry {
  date: string
  headline: string
  detail: string
  tag?: ChangeTag
}

export const CHANGELOG: ChangeEntry[] = [
  {
    date: '2026-08-14',
    headline: 'A case of the day, and a record of your own',
    detail:
      'Everyone now gets the same case each day, and solving it builds a streak. Badges track the rest — your first case, an Expert, a Master, a solve with no hints spent, a case closed inside two minutes. Finishing a case also offers a share card that gives away nothing: case number, board size, your time, and how many hints you had left.',
    tag: 'Feature',
  },
  {
    date: '2026-08-14',
    headline: 'An assistant that only states the obvious',
    detail:
      'A new Assist button crosses off every cell that is already impossible — the rows and columns taken by someone you have placed, and any cell no remaining suspect could stand on. It never places anyone and never reveals an answer, so it costs no hints. One undo takes the whole sweep back. Tools also have keys now: P to place, X to mark, D to draft, H for a hint, A for assist.',
    tag: 'Feature',
  },
  {
    date: '2026-08-14',
    headline: 'The case index opens straight away',
    detail:
      'Building sixty cases for the first time used to hold the page blank while it worked. The index is now assembled one case at a time after the screen appears, with a progress line, so nothing is ever frozen. Suspects with two clues now get both squared off on the board instead of only the first.',
    tag: 'Improvement',
  },
  {
    date: '2026-08-14',
    headline: 'Sixty cases and a new Master tier',
    detail:
      'The case index grew from 27 to 60, including a new Master tier: 8x8 boards, more rooms, and no suspect ever handed a plain "In the Study" — everyone has to be triangulated. The solver behind the generator now searches the most-constrained suspect first, which made the whole catalog quicker to build than the old, smaller one.',
    tag: 'Content',
  },
  {
    date: '2026-08-14',
    headline: 'Help when you ask for it',
    detail:
      'The dotted line from a clue to the board is gone; it could not stay attached to its target and often pointed at nothing. Each suspect card now has a crosshair button that squares off exactly where that clue points, and only when you press it. The top bar was rebuilt too, so it stays one tidy row from a phone up to an ultrawide monitor.',
    tag: 'Improvement',
  },
  {
    date: '2026-08-13',
    headline: 'The board is hand-drawn again',
    detail:
      'Every object on the board was redrawn as a real illustration: pillows and a turned-down sheet on the beds, spines and a globe on the bookshelf, individual leaves on the plants, a shade and weighted base on the lamps. Floors are drawn materials now — floorboards, encaustic tile, stone courses, clipped lawn — and they hold the same rhythm on a 4x4 case and a 7x7 one. Room walls print heavier, so a room reads as one space at a glance.',
    tag: 'Improvement',
  },
  {
    date: '2026-07-08',
    headline: 'Every case is fair again',
    detail:
      'Fixed a bug where suspect cards only showed one clue even when a case needed more, making some puzzles impossible to deduce. All clues are now shown, and a solver-checker verifies every case has exactly one clue-derivable answer. Failed accusations now tell you how many suspects are in the right spot.',
    tag: 'Fix',
  },
  {
    date: '2026-07-08',
    headline: 'Quality-of-life tools',
    detail:
      'Added an interactive How-to-Play guide, redo, an optional relaxed mode that hides the timer, a confirm before clearing the board, a legend explaining the map, and clearer draft & lock affordances. Rooms now have distinct floor textures — grass, tile, wood — and richer, room-specific furniture.',
    tag: 'Improvement',
  },
  {
    date: '2026-07-07',
    headline: 'Detective mode',
    detail:
      'A new game mode for serious sleuths. Pencil in draft candidates across cells, then lock a person to a square to automatically block the rest of their row and column. Check off clues as you solve them — Classic mode stays as a clean place-and-submit experience.',
    tag: 'Feature',
  },
  {
    date: '2026-07-07',
    headline: 'Richer crime-scene maps',
    detail:
      'The house maps got a visual overhaul — textured floors, furniture on tinted mats, stronger walls, and clearer room boundaries. It reads far more like a real floor plan.',
    tag: 'Improvement',
  },
  {
    date: '2026-07-07',
    headline: 'Real deduction puzzles',
    detail:
      'Alibi is now a true logic-deduction game, not themed Sudoku. Read each suspect’s clue, place everyone on the house map so each sits in one row and one column, and unmask whoever is left alone with the victim. Cases span five difficulties with procedurally generated, uniquely-solvable puzzles.',
    tag: 'Feature',
  },
  {
    date: '2026-07-07',
    headline: 'Illustrated suspects & furniture',
    detail:
      'Every suspect now has a distinct portrait and every room is furnished with clean line-icon furniture that the clues reference. A refreshed, more legible typeface ties it together.',
    tag: 'Improvement',
  },
  {
    date: '2026-07-07',
    headline: 'Light & dark themes',
    detail:
      'Alibi now ships a full theming system with a one-tap light/dark toggle in the top corner. It follows your device preference by default and remembers your choice. Every colour meets accessibility contrast standards in both modes.',
    tag: 'Feature',
  },
  {
    date: '2026-07-07',
    headline: 'New vintage-noir type',
    detail:
      'Headlines now use a typewriter face and body copy a warm serif, leaning into the detective-novel mood. The old display font was retired for something with more character.',
    tag: 'Improvement',
  },
  {
    date: '2026-07-07',
    headline: 'Faster first load',
    detail:
      'We trimmed unused fonts and assets, split heavy screens so they load on demand, and made the puzzle generator run off the main thread where possible. The app now paints noticeably sooner on first visit.',
    tag: 'Improvement',
  },
  {
    date: '2026-07-06',
    headline: 'Alibi launches',
    detail:
      'The first release: six hand-built mysteries across three difficulties, a full suspect roster, hints, pencil-note mode, and an animated “Case Closed” reveal. Installable as an app and playable fully offline.',
    tag: 'Feature',
  },
]

/* ---------------------- grouping helpers (pure) -------------------------- */

export interface MonthGroup {
  key: string          // 'YYYY-MM'
  label: string        // 'July 2026'
  entries: ChangeEntry[]
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

/** Return entries newest-first, grouped by month (also newest-first). */
export function groupByMonth(entries: ChangeEntry[]): MonthGroup[] {
  const sorted = [...entries].sort((a, b) => (a.date < b.date ? 1 : -1))
  const groups = new Map<string, MonthGroup>()
  for (const e of sorted) {
    const [y, m] = e.date.split('-')
    const key = `${y}-${m}`
    if (!groups.has(key)) {
      groups.set(key, { key, label: `${MONTHS[Number(m) - 1]} ${y}`, entries: [] })
    }
    groups.get(key)!.entries.push(e)
  }
  return [...groups.values()]
}

/** '2026-07-07' -> 'Jul 7'. */
export function formatDay(iso: string): string {
  const [, m, d] = iso.split('-')
  return `${MONTHS[Number(m) - 1].slice(0, 3)} ${Number(d)}`
}
