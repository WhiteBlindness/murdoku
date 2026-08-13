---
version: 1
slug: "src-app-tsx"
primary_target: "src/App.tsx"
related_targets: ["src/components/HomeScreen.tsx","src/components/GameScreen.tsx","src/components/MapGrid.tsx","src/components/SuspectCard.tsx"]
---

## Scope and mode

- Primary target: `src/App.tsx`
- Related targets: `src/components/HomeScreen.tsx`, `src/components/GameScreen.tsx`, `src/components/MapGrid.tsx`, `src/components/SuspectCard.tsx`
- Mode: Operate

## Audience, job, and action

Solo puzzle players reconstruct a murder case by mapping literal suspect clues onto a spatial house board. The core action is selecting a person, connecting their clue to a visible room or object, placing them, and submitting only when every row and column is resolved.

## Constraints

- Preserve product behavior, generated cases, local-storage compatibility, offline PWA behavior, both themes, keyboard/touch use, reduced motion, and WCAG AA.
- Board rooms and furniture remain visually distinct, labeled, and nameable; the hybrid Noire-Illustration treatment uses dark muted materials and espresso contours rather than neon color.
- Mobile order remains board → suspects/clues → tools → accuse.
- Home must never load every avatar.

## Chosen direction

**Continuity Desk:** a cinematic evidence-reconstruction table using magnetic graphite, bone evidence strips, projector amber active states, oxblood danger, contact-sheet crop marks, clipped tabs, film perforation rhythm, and one taut clue-to-board connection.

Approved comp: `.impeccable/mocks/continuity-desk-approved.png`

Memorable moment: selecting Alexander lights his continuity frame, clue record, and the board’s lamp with one precise amber path; placing him locks that frame into the reconstructed sequence.

## Composition commitments

| Ingredient | Production medium |
|---|---|
| Compact case masthead and timer | semantic HTML/CSS |
| Full-width continuity strip | ordered list + CSS perforation |
| Dominant illustrated board | authored React SVG miniatures + layered CSS materials |
| Active clue connector | authored SVG/CSS overlay |
| Contact-sheet dossier | semantic buttons + existing avatars |
| Command rail and accuse | semantic buttons + Lucide icons |
| Projector field and grain | bounded CSS pseudo-elements |
| Per-case notes | semantic textarea + local persistence |

The comp’s photographic room render, fictional jobs, timestamps, and extra evidence log are not product truth and must not ship.

## Responsive commitments

- Desktop: masthead → continuity strip → roughly 60/40 board/dossier workspace → command rail.
- Mobile: masthead → board → compact scrollable continuity strip → clues → notes → tools → accuse.
- Controls remain at least 44px; no sticky region may hide a board cell or clue.

## Unresolved decisions

None. The user explicitly delegated implementation and direction choices for this autonomous overhaul.
