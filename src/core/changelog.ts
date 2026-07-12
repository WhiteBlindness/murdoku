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
      'Murdoku is now a true logic-deduction game, not themed Sudoku. Read each suspect’s clue, place everyone on the house map so each sits in one row and one column, and unmask whoever is left alone with the victim. Cases span five difficulties with procedurally generated, uniquely-solvable puzzles.',
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
      'Murdoku now ships a full theming system with a one-tap light/dark toggle in the top corner. It follows your device preference by default and remembers your choice. Every colour meets accessibility contrast standards in both modes.',
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
    headline: 'Murdoku launches',
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
