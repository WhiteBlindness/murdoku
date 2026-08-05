# DESIGN.md — Alibi

Derived from the shipped artifact, not from intentions. Everything here is in the
code today; where a rule exists because of a specific failure, the failure is named
so the rule doesn't get "simplified" back out.

**Product:** a noir murder-mystery deduction puzzle PWA. Read each suspect's clue,
place everyone on the house map so each person occupies exactly one row and one
column, and unmask whoever is left alone with the victim.

**Naming:** the app says *Alibi*. The GitHub repo, the deploy URL
(`murdoku-seven.vercel.app`) and every `murdoku_*` localStorage key still say
*murdoku* — deliberate, so no player loses progress. Not drift; do not "fix" it.

**Stack:** React 18 · Vite · TypeScript · Tailwind · Framer Motion · vite-plugin-pwa.

---

## 1. Token layer — `src/styles/theme.css`

The single source of visual truth. Semantic, role-based custom properties only —
never raw hue names (`--color-accent`, never `--gold`). Adding a theme is one
`:root.theme-<name> { … }` block plus one entry in `THEMES`
(`src/hooks/useTheme.ts`); no component changes.

| Group | Tokens |
|---|---|
| Surfaces | `--color-bg-base` · `-surface` · `-elevated` · `-inset` |
| Borders | `--color-border-subtle` · `-strong` |
| Text | `--color-text-primary` · `-secondary` · `-muted` |
| Accent | `--color-accent` · `-strong` · `-text` · `--color-on-accent` |
| Danger | `--color-danger` · `-text` |
| FX | `--shadow-elevated` · `--overlay-scrim` |

Surfaces step up in luminance `base < surface < elevated` so cards visibly lift.
They were once near-flat (`#141008` on `#0A0806`) and cards were invisible in dark
mode; the current spacing is the fix, not an accident.

**Dark is the default and renders correctly with zero JavaScript.**
`prefers-color-scheme: light` is honoured out of the box via
`:root:not(.theme-dark)`, so a system-light user gets the light palette with no JS.
An explicit user choice is applied as `.theme-light` / `.theme-dark` on `<html>` by
a tiny inline script in `index.html`, and that class wins over the media query.

### Contrast is a documented property, not a hope

Every foreground/background pairing carries its measured ratio in a comment and
meets WCAG AA (≥ 4.5:1 body, ≥ 3:1 large text and non-text UI) in **both** themes.
Treat those annotations as tests: change a value, re-measure, update the comment.

### Difficulty scale

`--diff-{very-easy,easy,medium,hard,expert}` and a `-text` variant of each.

- **base token** = decorative fill — section rails, gradients, the card spine.
- **`-text` variant** = AA-safe foreground. Use this any time the colour renders text.

These replaced a hardcoded hex map that was duplicated in `HomeScreen.tsx` and
`GameScreen.tsx` and was tuned for dark only. On the light page (`#ECE3CF`) four of
its five colours failed AA outright — Very Easy 1.66:1, Easy 1.61:1, Medium 2.16:1,
Hard 2.29:1 — and Expert `#B82020` was only 3.11:1 on dark, failing as text there.
All ten current pairings are verified ≥ 4.5:1. Do not reintroduce a local colour map.

### Board floor filter

`--board-floor-brightness` / `--board-floor-saturate` (dark: `0.62` / `0.88`,
light: `1` / `1`). The board carries its own 1950s palette rather than the UI tokens,
because it is a physical object; these two knobs let dark mode dim the whole board
**as one unit** so it doesn't glare as a bright slab on a near-black page.

They are applied as a CSS `filter` on a dedicated floor `<span>` inside each cell —
a *sibling* of the token/mark/label layers, never an ancestor. That placement is
load-bearing twice over: avatars, ✕ marks, conflict rings and room labels must stay
at full legibility, and `filter` on an ancestor would create a containing block.

---

## 2. Tailwind — `tailwind.config.js`

Maps every token to a Tailwind colour so `bg-bg-surface`, `text-accent-text` etc.
resolve to the custom properties. Legacy aliases (`paper`, `paper-dim`, `gold`,
`crimson`, `bg-deep`, `br-thin`…) are **repointed at the same vars**, so old markup
themes correctly and no refactor is owed. `darkMode: ['class', '.theme-dark']`.

**Type:** Bricolage Grotesque for display/headings (`font-display`), Hanken Grotesk
for body and UI (`font-sans`). Characterful but legible — not a noir pastiche.

**Keyframes:** `stamp` (victory reveal), `cell-pop`, `pulse` (conflict), `shake`
(rejection). See §5.

---

## 3. The board — `src/components/MapGrid.tsx`

**User-mandated art direction. Preserve it.** Classic Cluedo board-game look:

- Every SVG shape stroked black at **3–4px**. This is the defining trait.
- Muted 1950s palette.
- **6px solid black** room walls; 1px hairlines between cells within a room
  (dashed for outdoor rooms).
- Pill room labels: white text, black fill, white ring, uppercase, letter-spaced.
- Top-down furniture (`src/core/furniture.tsx`, viewBox `0 0 100 100`, fills the cell).
- One distinct floor material per room type, so adjacent rooms never blend:
  bedroom carpet stipple · office/study dark mahogany · living/dining pale oak
  planks · kitchen/bath checker · hallway diamonds · outdoor sage grass.

### Pattern scale is cell-relative — never fixed px

Floors are SVG data-URI tiles built by `svgTile()`. Their `backgroundSize` is a
**percentage of the cell**, not an absolute size.

This is the rule most likely to be broken by someone "tidying up", so: the tiles
were originally sized in px (checker 128px, grass 80px, planks 320px). At Expert
(7×7) on a 390px phone a cell is ~48px — smaller than the checker tile — so every
kitchen cell rendered as one flat coral block and room differentiation died exactly
where the puzzle is hardest.

Scale is chosen for **boldness, not density**. The board-game look depends on those
3px strokes staying visible; shrink a tile far below one cell and the strokes render
sub-pixel and the pattern turns to grey noise. So tiles that already contain their
own repeat (checker = 2×2 squares, planks = 3 rows) map to a **full** cell, and no
tile goes below 50% of one.

### Room labels

Full pill at N ≤ 5. At N ≥ 6 the label abbreviates to a corner tab riding the wall
junction (`FRONT YARD` → `FY`, `KITCHEN` → `KIT`), because full-width pills covered
1–2 playable cells at Expert size. Font never renders below **9px**.

The full room name is always preserved — in `title` and in an `sr-only` span, with
the visible abbreviation `aria-hidden`. Abbreviating visually must never abbreviate
for assistive tech.

The label overlay is `pointer-events-none`; clicks always reach the cells beneath.

---

## 4. Interaction and layout conventions

- **Cells are real `<button>`s** with `aria-label` ("Row 3, column 2, Greta"),
  arrow-key navigation (`handleCellKey`) and a visible `focus-visible` ring.
  Never regress these to `<div>`s.
- **44px minimum touch target** on every control.
- **`.focus-ring`** (`src/index.css`) is the shared keyboard affordance.
- **Toolbar groups by meaning, not by count:** modes (what a tap does) sit apart
  from actions (one-shot commands). A single N-column grid stranded a lone button
  at 390px, and the count changes between Classic and Detective mode; the semantic
  split makes an orphan impossible in either.
- **Mobile order:** board → suspects/clues → toolbar → accuse. Clues must be
  reachable without scrolling past the whole toolbar, because reading clues *is*
  the core loop.
- `pt-safe` / `pb-safe` for device insets.
- **Avatars are remote images** (DiceBear). Never render them in a list or grid over
  the catalog — 27 cards × N people ≈ 150 HTTP requests. The home screen uses
  `person.accent` colour dots to signal the cast for free.

---

## 5. Motion

**Default to CSS, not Framer.** The global `prefers-reduced-motion` block in
`src/index.css` zeroes animation and transition durations — but it can only reach
CSS. It cannot touch Framer's JS-driven springs. Anything that must be Framer is
covered by `<MotionConfig reducedMotion="user">` in `App.tsx`; hover, press and
feedback affordances should be plain CSS so the block covers them directly.

Hover treatments are gated behind `@media (hover: hover) and (pointer: fine)` so a
tap never leaves a stuck hover state.

### `shake` — the rejection gesture

Small amplitude, 400ms, `translate3d` so it composites on the GPU and never triggers
layout. It fires only on a genuine rejection (`feedback === 'wrong' | 'blocked'`).
`incomplete` is *guidance, not a mistake* — it surfaces the message without shaking,
because shaking there scolds the player for doing nothing wrong.

**It is restarted imperatively — remove class → force reflow (`void el.offsetWidth`)
→ re-add — via a ref, never by remounting with a React `key`.** Two reasons, both
learned the hard way:

1. A plain conditional class cannot re-fire when the *same* failure repeats, because
   `feedback` never changes value between two identical rejections and React skips
   the DOM write.
2. Remounting via `key` does restart it, but destroys the focused node — a keyboard
   user pressing Enter to accuse loses focus to `<body>` on the game's primary
   action.

An element may not carry both `animate-shake` and a Framer `transform` (e.g. an
entry `y` offset): two systems writing one composited property fight during the
overlap. Give each its own element.

---

## 6. Working on this project

- Verify visuals with real screenshots at **390px and 1440px, in both themes**,
  before declaring anything done. Screenshots over claims.
- After editing `tailwind.config.js`, **restart the dev server.** The running Vite
  instance keeps serving the old CSS: the class appears in the DOM but
  `getComputedStyle(el).animationName` is `"none"` — which reads exactly like a
  broken component and will send you debugging the wrong file.
- `docs/UX_REVIEW.md` is **stale** — it predates the redesign from themed-Sudoku to
  true deduction game. All three of its P0s are already implemented.
