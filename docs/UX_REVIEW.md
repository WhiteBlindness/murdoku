# Murdoku — UX & Navigation Review

Reviewed for a design-focused audience. Issues are ordered by **likely impact on
user experience**, not by how hard they are to fix. Each item: the problem, why
it matters, and a specific fix. Items marked ✅ were fixed during this pass.

---

## P0 — High impact

### 1. Grid cells aren't keyboard- or screen-reader-accessible
**Problem.** Puzzle cells are `<div onClick>` (see `Cell.tsx`). They can't be
tabbed to, activated with Enter/Space, or announced by assistive tech.
**Why it matters.** A logic puzzle is exactly the kind of app power users play
with a keyboard. It also fails basic WCAG 2.1 (2.1.1 Keyboard, 4.1.2 Name/Role).
For a design-literate audience this reads as unpolished.
**Fix.** Make each cell a `<button>` (or add `role="button"` + `tabIndex={0}` +
`onKeyDown` for Enter/Space) with an `aria-label` like “Row 2, column 3, empty”
or “…, Dr. Voss”. Add arrow-key movement between cells for a real keyboard flow.

### 2. No first-run explanation of the core mechanic
**Problem.** Murdoku replaces Sudoku numbers with suspects and hides the killer
in one cell. A new player lands on a case with no “how to play”.
**Why it matters.** The novelty *is* the product, but an unfamiliar mechanic with
zero onboarding causes early bounce. People who’ve never played Sudoku won’t infer
the one-of-each-per-row/column/box rule.
**Fix.** A one-time, dismissible overlay on first case (stored in localStorage),
plus a small “?” affordance in the game header that reopens a rules card.

### 3. Selecting nothing then tapping Hint/Erase fails silently
**Problem.** Hint and Erase require a selected cell; with none selected they
no-op with no feedback.
**Why it matters.** Silent failure makes the app feel broken. Users repeat the
tap, get nothing, and distrust the control.
**Fix.** When no cell is selected, either disable the buttons (with a tooltip
“Select a cell first”) or, on tap, pulse/hint the grid to prompt a selection.

---

## P1 — Medium impact

### 4. Scroll position carried across screens ✅ *fixed*
**Problem.** Navigating to a new screen inherited the previous screen’s scroll
offset, so a screen could open showing blank space.
**Fix applied.** `App` now `window.scrollTo(0, 0)` on every screen change.

### 5. Getting home from a puzzle takes two steps
**Problem.** In-game Back goes to the case intro, not home; reaching the case
list is Back → Back.
**Why it matters.** “Home” is the most common escape hatch; burying it adds
friction and risks accidental loss of place.
**Fix.** Add a distinct Home/Cases control in the game header, separate from the
contextual Back. Consider confirming if meaningful progress would be lost.

### 6. Given vs. player-entered cells aren’t strongly differentiated
**Problem.** Fixed clue cells and user entries look similar (subtle background
tint only).
**Why it matters.** Sudoku players rely on instantly knowing which cells are
locked. Weak contrast slows solving and invites confusion about what’s editable.
**Fix.** Give “given” cells a clearly heavier weight/opacity and a non-tappable
cursor; keep player entries lighter. Ensure the difference survives both themes.

### 7. No confirmation before abandoning a case
**Problem.** Back from a partly-solved grid discards progress silently.
**Why it matters.** Losing several minutes of deduction with no warning is a
classic rage-quit trigger.
**Fix.** If the grid has user entries and isn’t solved, confirm on Back
(“Leave this case? Your progress isn’t saved.”). Longer term, persist in-progress
grids to localStorage like completed cases already are.

### 8. Theme toggle affordance is subtle
**Problem.** The sun/moon control is a small icon with no visible label.
**Why it matters.** Discoverability — users may not realise theming exists.
**Note.** `aria-label`/`title` are present ✅, so it’s accessible; this is about
*visibility*.
**Fix.** Fine to keep minimal, but consider a first-visit tooltip, or a settings
sheet grouping theme + rules + reset progress.

---

## P2 — Lower impact / polish

### 9. “Next Case” is hidden for custom/imported cases
**Problem.** Victory only shows Next Case when the current case has a successor in
the registry order; custom cases at the end just show “All Cases”.
**Fix.** Acceptable, but consider always offering “Play another” that jumps to any
unsolved case.

### 10. Progress bar can read 100% before victory resolves
**Problem.** The header progress reflects filled cells, which can hit 100% a beat
before the solved-state animation.
**Fix.** Drive the bar off correctness, or animate victory immediately on the last
correct placement (already the case) — just verify no flash of “100% + not solved”.

### 11. Timer keeps a solved case’s time visible only on victory
**Problem.** No pause on backgrounding; time inflates if the user tabs away.
**Fix.** Pause the interval on `visibilitychange` hidden.

### 12. Focus states ✅ *partially addressed*
**Fix applied.** Added a shared `.focus-ring` (visible `:focus-visible` outline in
the accent colour) and applied it to primary controls. Extend it to the grid cells
once they become buttons (see P0-1).

---

## Quick wins already shipped this pass
- ✅ Scroll reset on navigation (P1-4)
- ✅ `focus-visible` outlines on interactive controls (P2-12)
- ✅ `aria-label`/`aria-pressed` on toggles, picker, room/suspect glyphs
- ✅ `prefers-reduced-motion` honoured globally (animations collapsed)
- ✅ Semantic landmarks on Home/Release Notes (`header`/`main`/`footer`/`section`)
