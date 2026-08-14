---
name: Alibi
description: A cinematic continuity desk for reconstructing one account of the night.
colors:
  background-base: "var(--color-bg-base)"
  background-surface: "var(--color-bg-surface)"
  background-elevated: "var(--color-bg-elevated)"
  background-inset: "var(--color-bg-inset)"
  border-subtle: "var(--color-border-subtle)"
  border-strong: "var(--color-border-strong)"
  text-primary: "var(--color-text-primary)"
  text-secondary: "var(--color-text-secondary)"
  text-muted: "var(--color-text-muted)"
  projector-amber: "var(--color-accent)"
  projector-focus: "var(--color-accent-strong)"
  ink-on-amber: "var(--color-on-accent)"
  oxblood: "var(--color-danger)"
  danger-copy: "var(--color-danger-text)"
  bone-evidence: "#D8C8A4"
  evidence-ink: "#19150F"
  board-wall: "var(--board-wall)"
  miniature-contour: "#241820"
  miniature-contour-deep: "#1A1A1A"
  miniature-seam: "#654246"
  miniature-highlight: "#D8B777"
  evidence-amber-ink: "#62400B"
  evidence-danger-ink: "#641F19"
  step-numeral: "#F1E8CE"
  step-numeral-selected: "#FFF7E4"
  board-vignette: "rgba(24, 14, 19, 0.18)"
  board-keylight: "rgba(255, 244, 211, 0.08)"
typography:
  display:
    fontFamily: "Barlow Condensed, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2rem, 5vw, 2.8rem)"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Barlow Condensed, ui-sans-serif, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "0.01em"
  action:
    fontFamily: "Barlow Condensed, ui-sans-serif, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "0.08em"
  evidence:
    fontFamily: "Courier Prime, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "11px"
    fontWeight: 400
    lineHeight: 1.375
    letterSpacing: "normal"
  technical-label:
    fontFamily: "Courier Prime, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "10px"
    fontWeight: 400
    lineHeight: 1.25
    letterSpacing: "0.18em"
  ui:
    fontFamily: "Hanken Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "0.1em"
  reveal:
    fontFamily: "Barlow Condensed, ui-sans-serif, system-ui, sans-serif"
    fontSize: "30px"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "0.02em"
  verdict:
    fontFamily: "Barlow Condensed, ui-sans-serif, system-ui, sans-serif"
    fontSize: "24px"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "0.35em"
  section:
    fontFamily: "Barlow Condensed, ui-sans-serif, system-ui, sans-serif"
    fontSize: "20px"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "0.02em"
  panel-title:
    fontFamily: "Barlow Condensed, ui-sans-serif, system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.12em"
  subject:
    fontFamily: "Barlow Condensed, ui-sans-serif, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.14em"
  copy:
    fontFamily: "Courier Prime, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: "normal"
  headline-wide:
    fontFamily: "Barlow Condensed, ui-sans-serif, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "0.01em"
rounded:
  square: "0"
  micro: "2px"
  token: "6px"
spacing:
  hairline: "4px"
  compact: "8px"
  panel: "12px"
  roomy: "16px"
components:
  masthead-navigation:
    backgroundColor: "{colors.background-inset}"
    textColor: "{colors.text-primary}"
    typography: "{typography.technical-label}"
    rounded: "{rounded.square}"
    padding: "0 12px"
    height: "64px"
  button-primary:
    backgroundColor: "{colors.projector-amber}"
    textColor: "{colors.ink-on-amber}"
    typography: "{typography.action}"
    rounded: "{rounded.square}"
    padding: "16px"
    height: "44px"
  button-tool:
    backgroundColor: "{colors.background-surface}"
    textColor: "{colors.text-secondary}"
    typography: "{typography.action}"
    rounded: "{rounded.square}"
    padding: "0 14px"
    height: "44px"
  filter-chip:
    backgroundColor: "{colors.background-inset}"
    textColor: "{colors.text-secondary}"
    typography: "{typography.technical-label}"
    rounded: "{rounded.square}"
    size: "44px"
  search-field:
    backgroundColor: "{colors.background-inset}"
    textColor: "{colors.text-primary}"
    typography: "{typography.evidence}"
    rounded: "{rounded.square}"
    padding: "0 12px 0 40px"
    height: "44px"
  case-card:
    backgroundColor: "{colors.bone-evidence}"
    textColor: "{colors.evidence-ink}"
    typography: "{typography.headline}"
    rounded: "{rounded.square}"
    padding: "14px"
  continuity-frame:
    backgroundColor: "#E2D7BD"
    textColor: "{colors.evidence-ink}"
    typography: "{typography.action}"
    rounded: "{rounded.square}"
    padding: "8px 12px"
    height: "52px"
  suspect-evidence:
    backgroundColor: "#DDD1B3"
    textColor: "{colors.evidence-ink}"
    typography: "{typography.evidence}"
    rounded: "{rounded.square}"
    padding: "10px"
  notes-field:
    backgroundColor: "{colors.background-inset}"
    textColor: "{colors.text-primary}"
    typography: "{typography.evidence}"
    rounded: "{rounded.square}"
    padding: "12px"
---

# Design System: Alibi

## Overview

**Creative North Star: "The Continuity Desk"**

Alibi is a working 1940s film-editing continuity desk translated into a modern deduction interface. Magnetic graphite holds the workspace together; bone evidence strips, contact-sheet portraits, clipped tabs, film perforations, and restrained projector amber make the player's reasoning feel assembled by hand. It is cinematic without becoming a poster: the board, clues, tools, and accusation remain unmistakably operative.

The chrome and the board intentionally use different materials. The surrounding interface is dark, archival, and controlled, while the board is a premium detective-dossier mansion reconstruction: twelve distinct dark room material tiles, nineteen hand-illustrated miniatures with confident espresso contours, and heavy espresso dividers keep every clue target nameable. Paper is reserved for evidence-bearing objects, never spread across the whole application as a parchment dashboard.

**Key Characteristics:**

- Magnetic graphite and smoky-olive chrome in dark mode; a daylight editing bench in light mode.
- Fixed bone paper for evidence, continuity frames, and case files.
- One projector-amber chain linking the selected frame, clue, and literal board target.
- Condensed industrial headlines, typewritten evidence, and neutral compact controls.
- Sharp rectangles, clipped corners, torn edges, perforations, and contact-sheet crops.
- A dominant square mansion reconstruction built from authored dark material tiles and thick-contoured illustrated miniatures rather than a full-board raster.

## Colors

The palette separates theme-aware desk chrome from fixed physical evidence and board materials: semantic chrome flips between night and daylight, while paper and illustrated floors retain their object identity.

### Primary

- **Projector Amber** (`colors.projector-amber`): active tools, the accusation action, selected continuity states, timer readouts, and the clue-to-board trace.
- **Projector Focus** (`colors.projector-focus`): the solid keyboard focus outline and the precise active target edge; never substitute a translucent glow.
- **Ink on Amber** (`colors.ink-on-amber`): text and icons placed directly on amber fills.

### Secondary

- **Bone Evidence** (`colors.bone-evidence`): archival-paper case cards and the continuity strip. It remains a material color across themes rather than becoming page chrome.

### Tertiary

- **Oxblood Conflict** (`colors.oxblood`): row/column conflicts, destructive confirmation, victim and rejection states only.
- **Danger Copy** (`colors.danger-copy`): accessible conflict and destructive-state text against the current desk theme.

### Neutral

- **Magnetic Ground** (`colors.background-base`): the full-bleed graphite desk or daylight bench.
- **Instrument Surface** (`colors.background-surface`): panels, command controls, notes, and bounded support regions.
- **Selected Plate** (`colors.background-elevated`): committed or selected dark-chrome states.
- **Film Gate** (`colors.background-inset`): recessed inputs, command rails, and deep framing.
- **Bone, Evidence, and Metadata Copy** (`colors.text-primary`, `colors.text-secondary`, `colors.text-muted`): the three-level chrome hierarchy.
- **Strong Edge** (`colors.border-strong`): every outline that must communicate an interactive boundary.
- **Subtle Hairline** (`colors.border-subtle`): decorative dividers only.
- **Evidence Ink** (`colors.evidence-ink`): fixed near-black copy on bone paper.
- **Espresso Divider** (`colors.board-wall`): the heavy near-black frame and room boundaries, printed like the rules of a physical board, that organize the mansion without overpowering its materials.
- **Espresso Illustration Ink** (`colors.miniature-contour`, `colors.miniature-contour-deep`): the 2.4–3.2px outer silhouette and directional shadow on board miniatures; never substitute pure black.
- **Mahogany Seam and Muted Brass** (`colors.miniature-seam`, `colors.miniature-highlight`): fine construction detail, hardware, paper edges, and selective highlights inside the stronger silhouette.
- **Evidence Amber and Danger Ink** (`colors.evidence-amber-ink`, `colors.evidence-danger-ink`): the placed-count readout and the conflict state printed on the parchment continuity strip.
- **Step Numerals** (`colors.step-numeral`, `colors.step-numeral-selected`): the sequence numbers on the continuity strip's dark and amber chips.
- **Board Vignette and Key Light** (`colors.board-vignette`, `colors.board-keylight`): the two-layer lighting wash over the reconstruction board.

### Named Rules

**The Amber Evidence Rule.** Projector amber marks the current reasoning path and primary commitment; it is not ambient decoration.

**The Oxblood Exception Rule.** Oxblood is reserved for danger, conflict, victim, destructive confirmation, and rejection.

**The Strong Edge Rule.** A border that is the only visible affordance must use the strong tier; the subtle tier may divide content but never carry interaction alone.

**The Fixed Material Rule.** Anything printed on a physical surface — parchment evidence, the continuity strip, the board and its lighting — keeps a fixed literal colour and does not follow the theme. Parchment is parchment in both themes, so ink that flipped with the theme would go bone-on-bone and vanish in daylight. These values are listed as tokens above precisely so they read as decisions rather than as stray hex; do not "helpfully" convert them to `var(--color-*)`.

## Typography

**Display Font:** Barlow Condensed (with a system sans-serif fallback)

**Body/Evidence Font:** Courier Prime (with a system monospace fallback)

**UI Font:** Hanken Grotesk (with a system sans-serif fallback)

**Character:** Barlow Condensed supplies taut industrial headlines, Courier Prime makes clues and measurements read as recorded evidence, and Hanken Grotesk keeps dense utility chrome legible. The pairing is narrow and technical, never distressed or novelty-noir.

### Hierarchy

- **Display** (700, `typography.display`): the ALIBI masthead only; condensed, immediate, and tightly tracked.
- **Headline** (700, `typography.headline`): case titles and evidence subjects, usually uppercase.
- **Action** (600, `typography.action`): tool and command labels with moderate tracking.
- **Evidence** (400, `typography.evidence`): clues, notes, timers, counts, and explanatory copy.
- **Technical Label** (400, `typography.technical-label`): compact uppercase metadata at 10px with wide tracking; use only where the nearby value or section content carries the meaning. 10px is the floor — the previous "9–10px" wording is what let a second, undocumented step accumulate across the app.
- **UI** (600, `typography.ui`): compact search, resume, and secondary control copy where monospace would become noisy.
- **Subject** (700, `typography.subject`): suspect names and primary button labels — the smallest size Barlow is allowed to name something at.
- **Copy** (400, `typography.copy`): the case-notes field and any evidence paragraph that has to be read rather than scanned.
- **Headline Wide** (700, `typography.headline-wide`): the case masthead title once there is room for it; `subject` is its narrow-screen step.
- **Panel Title** (700, `typography.panel-title`): panel, rail, and modal headings.
- **Section** (700, `typography.section`): screen-level section titles and large monospace readouts.
- **Verdict** (700, `typography.verdict`): the CASE CLOSED stamp. One element, deliberately its own step.
- **Reveal** (700, `typography.reveal`): the murderer's name on the victory screen, and the headline stat readouts beside it.

### Named Rules

**The Three Voices Rule.** Barlow names the subject, Courier records the evidence, and Hanken operates the chrome; do not swap their jobs.

**The Closed Ramp Rule.** The thirteen steps above are the whole type scale: 10, 11, 12, 13, 14, 16, 17, 18, 20, 24, 30, and the display clamp. Every size shipping in the app maps to one of them, whether it is written as an arbitrary value, an inline style, or a Tailwind step. A size that does not appear here is drift, not a decision — add a named role with a stated job, or use the nearest existing one. This ramp was reconciled against the running app rather than asserted: before reconciliation the document described five steps while the components rendered eleven, so the automated check could only police how a size was written, never whether it was on the scale.

## Layout

The solving surface is a reconstruction sequence, not a dashboard. A compact 64px masthead leads into a full-width horizontal continuity strip, followed by the dominant square board and a 340–420px dossier column at large screens (1024px and above). The board remains square by sizing from the shorter available axis; the dossier scrolls independently while its accusation control remains outside the scroll region.

Below 1024px the screen becomes one natural document flow: masthead → board → horizontally scrollable continuity strip → suspect clues → notes → tools → accusation. At 640–1023px, suspect evidence may use two columns; on smaller phones it returns to one. Interactive targets remain at least 44px and no sticky region may cover a cell or clue.

The home index uses a full-bleed desk with a centered 1600px maximum content width, page gutters of 16px, 24px, and 40px across the responsive range, and a case grid that progresses from one to two, three, then six columns. The base spacing rhythm is 4px, with 8px control gaps, 12px panel density, and 16px roomier panel padding.

**The Board-First Rule.** On narrow screens, the board precedes evidence, tools, and accusation because spatial reading starts the solving loop.

## Elevation & Depth

Depth is physical and directional: raster graphite on the surrounding desk, archival paper, cut inset edges, and restrained lifted evidence. The mansion itself uses authored SVG material tiles — one stretched per cell so plank and grout rhythm never changes with board size — never a full-board reconstruction raster. The system is flat by default and adds shadow only when an object behaves like paper above steel, a selected projector field, or a focused control. Hover lift is limited to fine pointers; reduced motion collapses transitions and animations.

### Shadow Vocabulary

- **Cut Edge** (`var(--shadow-cut)`): an inset top highlight and lower shadow that gives panels and paper a physical edge.
- **Evidence Lift** (`var(--shadow-elevated)`): a deep, blurred directional shadow for elevated or hovered evidence.
- **Projector Field** (`var(--projector-glow)`): an amber light bloom around the active reasoning area, never used as the sole focus indicator.
- **Accessible Focus** (`var(--focus-ring)`): a two-stage base-and-amber ring paired with a solid 2px outline and 3px offset.

### Named Rules

**The Directional Depth Rule.** Every shadow must describe paper, steel, or projector light; generic ambient card shadows do not belong on the desk.

## Shapes

The default form is a sharp rectangle. Evidence frames use clipped 6–10px corners, arrow-notched continuity steps, irregular torn strip edges, square numbered magnets, and heavy espresso room dividers. Micro-rounding is limited to tiny overlays, miniature upholstery and fixtures, and suspect tokens where a 2–6px radius protects legibility at small sizes; it is never promoted into rounded card language.

**The Clipped, Not Rounded Rule.** Use clipping, not pills or generous radii, to create tactile silhouettes.

## Components

### Masthead Navigation

- **Character:** a compact instrument bar, not a marketing header.
- **Shape:** full-width, square, 64px minimum height with subtle internal dividers.
- **States:** 44px back, timer, and help targets; muted copy brightens on hover and receives the shared focus ring.

### Buttons

- **Primary:** full-width projector amber, ink-on-amber copy, square corners, 16px vertical padding, and condensed uppercase type. The accusation button is always reachable below the dossier scroller.
- **Tool:** a 44px minimum outlined control on the instrument surface. Active mode uses an amber wash and solid amber edge; an engaged non-mode action uses a dashed amber edge so it cannot be mistaken for the selected tool.
- **Filter:** a 44px square clipped-corner control. Selection changes fill, text, and border together rather than relying on color alone.
- **Hover / Focus:** hover color changes are limited to fine pointers where practical; focus uses the solid projector-focus outline and the two-stage focus ring.

### Cards / Containers

- **Case File:** fixed bone paper with evidence texture, torn strip silhouette, strong edge, and restrained directional lift.
- **Continuity Frame:** an ordered 52px minimum button with a right-pointing clipped tab, square magnetic number, name, and text state. The horizontal sequence may scroll; it never compresses below readable identity on phones.
- **Suspect Evidence:** bone paper strip with a contact-sheet portrait, industrial uppercase name, typewritten clue, and optional 44px resolution box. Selection warms the paper and uses the suspect accent as a precise edge.
- **Evidence Panel:** theme-aware instrument surface with a strong border and cut inset edge; use for search, notes, and support content.

### Inputs / Fields

- **Search:** 44px high recessed field with a left search icon, strong boundary, and Courier Prime input text.
- **Case Notes:** a resizeable inset textarea with 12px internal padding, visible focus-border shift, local-save status, and an explicit destructive-confirmation step before clearing.

### Illustrated Reconstruction Board

The board is a square collection of real buttons with a heavy espresso frame and room dividers, twelve distinct dark material finishes, persistent room labels, nineteen recognizable top-down furniture miniatures, suspect tokens, draft chips, and conflict marks. Furniture reads through a 2.4–3.2px deep espresso outer contour, layered muted fills, finer mahogany seams, brass or parchment highlights, and directional shadow. The contour is illustration ink, never pure black and never applied uniformly to every interior detail. A selected literal clue adds one amber projector trace to its target; the lamp miniature answers it with a localized brass glow, creating the signature projector moment without washing the whole board. Keyboard arrows retain cell navigation and every cell keeps a visible solid focus ring.

### Named Rules

**The Literal Board Rule.** Every room material and furniture silhouette must remain nameable because clue language points directly to them; projection purity always loses to recognition.

**The Taut Connection Rule.** Only the selected literal clue earns the authored amber connector, and the trace must terminate at its actual board target.

**The Miniature, Not Pictogram Rule.** Furniture is rendered as fully illustrated overhead or cheated-projection objects: a confident espresso outer silhouette, recognizable construction details, and restrained internal seams. Never collapse it into wireframe symbols or uniform black-outlined clip art.

## Do's and Don'ts

### Do:

- **Do** keep theme-aware chrome and fixed evidence/board materials as separate layers.
- **Do** keep paper on evidence-bearing objects and steel/graphite on application chrome.
- **Do** preserve all twelve dark room finishes and the nineteen-object miniature vocabulary; preserve recognition cues such as cushions, armrests, taps, book spines, leaves, papers, and the lamp's shade, arm, base, and localized projector glow.
- **Do** preserve full room names wherever they fit and expose any abbreviation with the full accessible name.
- **Do** use real buttons, 44px targets, visible focus, keyboard board navigation, and reduced-motion fallbacks.
- **Do** keep avatar use to the active dossier; use inexpensive accent markers in the case catalog.
- **Do** test both themes at phone and desktop widths with the board, clues, and accusation all visible and legible.

### Don't:

- **Don't** turn the interface into a generic rounded-card dashboard, glass surface, neon cyberpunk scene, or full-screen parchment tableau.
- **Don't** use projector amber for passive decoration or oxblood for ordinary emphasis.
- **Don't** let two rooms share the same floor signature or reduce nameable furniture to ambiguous wireframes, borderless blobs, pure-black contouring, uniformly outlined clip art, or neon/plastic fills.
- **Don't** replace the authored room materials and miniatures with a full-board reconstruction raster.
- **Don't** use the translucent board glow as a focus ring or the subtle border as an interactive boundary.
- **Don't** load every suspect portrait in the home catalog.
- **Don't** remount the accusation button to replay rejection motion; preserve focus and restart the CSS animation in place.
