# DESIGN.md — Alibi

Derived from the shipped artifact, not from intentions. Where a rule exists
because of a specific failure, the failure is named so the rule doesn't get
"simplified" back out.

**Product:** a noir murder-mystery deduction puzzle PWA. Read each suspect's
clue, place everyone on the house map so each occupies exactly one row and one
column, and unmask whoever is left alone with the victim.

**Naming:** the app says *Alibi*. The GitHub repo, the deploy URL
(`murdoku-seven.vercel.app`) and every `murdoku_*` localStorage key still say
*murdoku* — deliberate, so no player loses progress. Not drift.

**Stack:** React 18 · Vite · TypeScript · Tailwind · Framer Motion · vite-plugin-pwa.

---

## 0. Art direction — L.A. Noire

A 1940s LAPD case file on a detective's desk at night. Chiaroscuro: deep
obsidian ground, parchment documents, brass highlights, blood red for danger.
Stamped ink, stencilled labels, stark directional shadows. Sharp corners.

**The split is deliberate: noir CHROME, illustrated BOARD.**

Everything around the board — header, case-file rail, suspect dossier, polaroid
prints, buttons, typography — is L.A. Noire. The board itself is a colourful,
illustrated Cluedo-style game surface (painted SVG floor tiles, thick black
outlines, 1950s palette) sitting on the dark desk like a physical board under a
lamp. Do NOT "unify" these two into one aesthetic; the split IS the design.

A fully-noir board was built and then reverted, because it broke the game:

1. **Rooms must be individually identifiable at a glance.** Clues say "In the
   Pantry". The blueprint board rendered every room as near-identical dark
   slabs; later, a single `'tile'` material was shared by Kitchen, Bathroom AND
   Pantry, so the clue still could not be resolved by looking. Every room type
   in `ROOM_NAMES` now owns its own material, and two rooms that can appear in
   the same house must never collide.
2. **Furniture must be NAMEABLE, not merely visible.** Clues say "the only
   person on the lamp", "beside the bookshelf". Wireframe outlines failed this
   — but so did pure top-down projection: an overhead lamp is three concentric
   rings and reads as a target or a round rug. Objects are drawn in elevation
   or 3/4 view wherever that is what makes them recognisable. Projection
   accuracy loses to recognisability every time.

---

## 1. Token layer — `src/styles/theme.css`

Single source of visual truth. Semantic role-based custom properties, never raw
hue names. Adding a theme = one `:root.theme-<name>` block + one entry in
`THEMES` (`src/hooks/useTheme.ts`).

Groups: `--color-bg-{base,surface,elevated,inset}` ·
`--color-border-{subtle,strong}` · `--color-text-{primary,secondary,muted}` ·
`--color-accent{,-strong,-text}` · `--color-on-accent` ·
`--color-danger{,-text}` · `--shadow-{elevated,cut}` · `--overlay-scrim`.

**Dark is the default and renders correctly with ZERO JavaScript.**
`prefers-color-scheme: light` is honoured via `:root:not(.theme-dark)`. An
explicit choice is a `.theme-light` / `.theme-dark` root class set by the inline
script in `index.html`, which wins over the media query.

Light is **not** "noir with the lights on" — it is the same case file read in
daylight: parchment dossier, ink, brass. Same roles, same hierarchy.

### Contrast is a documented property, not a hope
Every text pairing carries its measured ratio in a comment and meets WCAG AA
(>= 4.5:1). Treat those numbers as tests.

### The two border tiers have DIFFERENT obligations — never collapse them
- `--color-border-subtle` — decorative hairline (~1.9:1). **May never be the
  only thing marking an interactive boundary.**
- `--color-border-strong` — 3.5:1, meets WCAG 1.4.11. Use wherever a border *is*
  the affordance (unfilled buttons, selectable cards).

This matters because `bg-surface` vs `bg-base` is near-zero contrast, so a card
edge genuinely is the only affordance.

### Difficulty scale
`--diff-{very-easy,easy,medium,hard,expert}` + `-text` variants. Deliberately
**not** a traffic light — noir has no bright green. Runs cold grey → sand →
brass → rust → blood, so severity reads as heat, not as a colour category.
Base token = decorative fill; `-text` = AA-safe foreground. All ten pairings
verified >= 4.5:1 in both themes. A previous hardcoded map, duplicated across
two components, failed AA on light at 1.6–2.3:1. Do not reintroduce a local map.

### Board tokens
`--board-ground` · `--board-ink` (drafting hairlines) · `--board-wall` (the
drawn room boundary) · `--board-glow` · `--board-chalk` ·
`--board-room-tint{,-2}` (fallbacks).

**Per-room-type tones:** `--room-{bedroom,kitchen,dining,living,bath,outdoor,
study,hall,pantry}`. Each room type owns a **hue**, not a brightness — the mood
stays dark while the rooms separate. An earlier pass alternated two
near-identical darks by room index parity; the board read as one flat slab and
you could not tell a Pantry from a Study. `MapGrid`'s `roomTone()` maps name →
token, and a repeated tone in one house falls back to the alternate tint so
same-type neighbours never merge.

---

## 2. Typography — `tailwind.config.js` + `index.html`

Three voices, one job each:
- `font-display` → **Oswald**. Stark condensed newspaper headline. Titles, button labels.
- `font-mono` (alias `font-typewriter`) → **Courier Prime**. The case file:
  clues, evidence, timer, case numbers, log lines. The signature move — clues
  must read as typed evidence.
- `font-sans` → **Hanken Grotesk**. Dense UI chrome only. Condensed display type
  is unreadable at 10–11px, so small labels get a neutral grotesk rather than
  being forced into the theme.

Legacy Tailwind colour aliases (`paper`, `gold`, `bg-deep`, `br-thin`…) are
repointed at the current vars, so older markup still themes correctly.

---

## 3. The board — `src/components/MapGrid.tsx`

A police blueprint / dossier floor plan. Dark ground, luminous drafting ink,
rooms defined by drawn lines plus a per-type tone. No painted materials.

- Room boundaries: solid `--board-wall`. Interior cell divisions: dashed
  `--board-ink` hairlines.
- **Furniture is filled, not wireframe.** `src/core/furniture.tsx` draws top-down
  pieces in `currentColor` with a translucent fill (`D` = 0.16 detail, `D2` =
  0.34 outline). Pure outlines made a bed and a table indistinguishable at cell
  size. Icons keep their identifying geometry because clue text depends on it.
- **Room labels** name the room wherever it fits: `compact` is decided by the
  room's own cell `span`, not by N. Keying it off N alone hid every label behind
  "KIT"/"STU" even where a room spanned three cells. When abbreviated, the full
  name is still exposed via `title` **and** an `sr-only` span, with the visible
  abbreviation `aria-hidden`. Overlay is `pointer-events-none`.
- Cells stay real `<button>`s with `aria-label`, `data-cell`/`data-grid`,
  arrow-key nav (`handleCellKey`) and a visible focus ring. The cell focus ring
  uses the **solid** `--color-accent-strong`, never the semi-transparent
  `--board-glow`, which composites to ~1.8:1 on the light room tint and fails
  WCAG 2.4.11 — and it is the only focus indicator on the main game surface.

---

## 4. Components and conventions

- **Suspects are polaroid evidence prints** — parchment frame with a deeper
  bottom margin, pinned at an alternating tilt, hard directional shadow. Clue
  text in `font-mono`.
- **44px minimum touch target** on every control.
- **Toolbar groups by meaning, not by count**: modes (what a tap does) apart from
  actions (one-shot commands). A single N-column grid stranded a lone button at
  390px, and the count changes between Classic and Detective mode.
- **Mobile order:** board → suspects/clues → toolbar → accuse. Clues must be
  reachable without scrolling past the toolbar; reading clues is the core loop.
- **Per-suspect `accent`** (`src/core/generate.ts` `ACCENTS`) is an identity
  function. Muted, low-saturation, hues far apart, and **never red/pink** — red
  is reserved for the conflict/danger signal.
- **Avatars are remote images** (DiceBear). Never render them in a list or grid
  over the catalog — 27 cards × N people ≈ 150 HTTP requests. The home screen
  uses accent dots instead.

---

## 5. Motion

**Default to CSS, not Framer.** The global `prefers-reduced-motion` block in
`src/index.css` zeroes animation and transition durations, but it can only reach
CSS — it cannot touch Framer's JS springs. Anything that must be Framer is
covered by `<MotionConfig reducedMotion="user">` in `App.tsx`.

Hover is gated behind `@media (hover: hover) and (pointer: fine)` so a tap never
leaves a stuck hover state.

### `shake` — the rejection gesture
400ms, `translate3d`, GPU-composited. Fires only on a genuine rejection
(`feedback === 'wrong' | 'blocked'`). `incomplete` is guidance, not a mistake, so
it surfaces the message without shaking.

**Restarted imperatively — remove class → force reflow (`void el.offsetWidth`) →
re-add — via a ref, never by remounting with a React `key`.** Two reasons, both
load-bearing:
1. A conditional class cannot re-fire when the *same* failure repeats, because
   `feedback` never changes value and React skips the DOM write.
2. Remounting via `key` restarts it but destroys the focused node — a keyboard
   user pressing Enter loses focus to `<body>` on the game's primary action.

An element may not carry both `animate-shake` and a Framer `transform`: two
systems writing one composited property fight during the overlap.

---

## 6. Working on this project

- Verify at **390px and 1440px, in BOTH themes**, with real screenshots.
  Screenshots over claims.
- After editing `tailwind.config.js`, **restart the dev server.** Vite keeps
  serving the old CSS: the class is in the DOM but
  `getComputedStyle(el).animationName` is `"none"` — which reads exactly like a
  broken component and sends you debugging the wrong file.
- **Changing `ACCENTS` or anything else in `generate.ts` changes generated puzzle
  data.** Catalogs are cached in localStorage, so bump `KEY` in
  `src/core/catalog.ts` (currently `murdoku_catalog_v12`) or returning players
  keep the old data forever.
- `docs/UX_REVIEW.md` is **stale** — it predates the deduction-game redesign.
