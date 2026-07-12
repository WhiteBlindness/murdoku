# Murdoku

A noir **murder-mystery deduction puzzle** (inspired by Manuel Garand's Murdoku).
Read each suspect's clue, place everyone on the house map so that each person sits
in exactly one row and one column, and unmask whoever is left **alone with the
victim**. Built as an installable, offline-capable PWA.

```bash
npm install
npm run dev      # http://localhost:5173  (add --host for LAN access)
npm run build    # production build in dist/
npm run preview  # serve the production build
```

## How it works
- The board is a top-down house map split into **rooms** (colored regions) with
  **furniture** (line icons the clues reference: chair, box, rug, plant, bed…).
- Each of N people (suspects + one **victim**) occupies **one row and one column**
  — a permutation, so most cells stay empty. Mark impossible cells with ✕.
- Every suspect carries a **clue** that must be literally true ("On the box",
  "In the Bedroom", "The only person on a rug", "Right beside Greta", "Exactly one
  row north of Priya"…). The clues together pin down a **unique** arrangement.
- Solve the grid and submit. The murderer is the suspect sharing the victim's room.

## Features
- **13 procedurally generated cases** across five difficulties (Very Easy 4×4 →
  Expert 7×7), each guaranteed to have a single solution.
- **Illustrated suspects** (DiceBear portraits) + **Lucide furniture icons**.
- **Light & dark themes** — follows the device, one-tap toggle, remembers choice,
  WCAG-AA in both.
- Place / Mark-✕ / Undo / Clear / Hint tools, live row-column conflict warnings,
  animated "Case Solved" reveal.
- Release Notes page. Installable PWA, playable offline (fonts + avatars cached).

## Architecture (portable by design)
```
src/core/       Pure TS — no React:
  types.ts        data model (puzzle, clues, play state)
  engine.ts       clue evaluation, backtracking solver, uniqueness, murderer
  generate.ts     procedural generator (solution → true clues → unique puzzle)
  catalog.ts      stable seeded set of puzzles (+ localStorage cache)
  furniture.tsx   FurnitureType → Lucide icon map
  changelog.ts    release-notes data
src/hooks/      useGame (reducer state machine) · useTheme
src/components/ MapGrid · SuspectCard · GameScreen · VictoryScreen · HomeScreen …
src/styles/     theme.css design tokens
docs/           UX_REVIEW.md · PERF_AUDIT.md
```
The game engine is framework-agnostic; the React layer is a thin view over
`src/core`, so it ports to React Native or another runtime unchanged.

## Theming
Semantic CSS custom properties in `src/styles/theme.css`. Dark is the default and
works with zero JS (system preference respected); a tiny inline script only applies
a remembered override. Add a theme = one `:root.theme-<name> { … }` block + one
entry in `THEMES` (`src/hooks/useTheme.ts`).

See `docs/` for the UX review and load-performance audit.
