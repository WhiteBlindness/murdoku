# Two storeys and stairs — feasibility study

Product rule to satisfy: a logical row/column relationship may couple corresponding positions across storeys (the existing `above` / `below` / `floor` clues and the cross-floor row/column lock in `useGame`). The presentation must make that coupling understandable.

## 1. Assets

### Furniture Kit (already in the project)

The kit ships four staircases as glTF, measured from geometry (`catalog.generated.ts`):

| Model | Size w × h × d (Kenney units) | Notes |
| --- | --- | --- |
| `stairs` | 1.82 × 1.34 × 0.79 | closed stringers, straight run |
| `stairsOpen` | 1.82 × 1.34 × 0.79 | open risers |
| `stairsOpenSingle` | 1.82 × 1.34 × 0.79 | open, single stringer |
| `stairsCorner` | 1.77 × 1.34 × 1.43 | quarter-turn landing |

Key fact: **rise 1.34 ≈ wall height 1.29**. The kit was designed so one straight flight climbs one storey. A straight flight occupies 1.82 × 0.79 units = 2.3 × 1.0 cells at `CELL = 0.8`; a corner flight 2.2 × 1.8 cells. That is a large footprint on a 6×6 board and acceptable on 8×8 (the only two-storey sizes today).

Also in the kit: `floorFull` (1 × 0.05) for the upper slab, `wall`, `wallHalf`, `wallCorner`, `wallWindow`, `wallDoorway` for the upper shell, `paneling`.

### Building Kit (kenney.nl/assets/building-kit, 80 pieces, CC0) and Modular Buildings (100 variations, CC0)

Both are exterior/architectural kits: walls, roofs, windows, doors, stairs and porches at a slightly larger "house" scale intended for outdoors. They are the right source for **roofs, balconies, exterior stairs and a gable end** if a case ever shows the house from outside, and for a landing/balustrade vocabulary. They are not needed for interior storeys: the Furniture Kit already covers stairs, slab and shell. Mixing kits is safe as long as each owns a layer (exterior envelope vs interior fit-out) — the same rule the old `assets-dropbox/README.md` states for 2D.

Verification still owed before adoption: download both kits and run `scripts/kenney-catalog.mjs` on them to confirm wall height and unit scale match 1.29 / 1.0 (Kenney kits generally share the metre-ish unit, but this must be measured, not assumed).

## 2. Geometry of a second storey in the current system

Everything below is a `y` offset; nothing in `resolve.ts` or `validate.ts` cares which storey it is.

- Storey pitch `STOREY = 1.29 + 0.05` (wall + slab).
- Upper floor tiles at `y = STOREY − 0.05`, upper walls from `y = STOREY`.
- Each storey is its own `SceneSpec` (`floor: 0 | 1`), resolved and validated independently against `puzzle.roomOfByFloor[floor]` and that floor's furniture — this already works: `sceneFor(puzzle, floor)`.
- Stairs are a **system feature, not décor**: a `stairs` entry on the ground-floor spec names the cells it occupies; the resolver adds the model, blocks those cells for furniture, and on the upper spec carries the matching stairwell (a hole in the slab) automatically. The validator adds two rules: the stair's top lands inside the upper floor, and the stairwell cells are free on the upper floor.

## 3. Presentation options

| Option | How it looks | Reads the coupling? | Cost / risk |
| --- | --- | --- | --- |
| **A. Stacked dollhouse** (both storeys in one frame, upper slab at `STOREY`) | one tall diorama | poorly: the upper storey hides most of the ground floor from a 32° camera; the ground floor's back rows vanish | breaks the visibility invariant; rejected |
| **B. Exploded floors** (both storeys, upper one lifted by ~2× STOREY with a gap) | two slabs in one frame, stairs bridging the gap | well: the same column is literally the same screen diagonal; a vertical guide line can connect coupled cells | frame becomes ~1.8× taller; on phones each storey is small; doubles draw calls (fine) |
| **C. Active storey + ghost** (draw the active storey normally, the other as a translucent wireframe/slab above or below at true height) | current single-storey look with a faint second slab | moderately: ghost cells above/below the hovered cell can be highlighted | keeps everything readable; needs a depth-sorted transparency pass (three.js handles it); ghost must never receive hit-testing |
| **D. Camera transition** (animate the camera up/down when switching floors; only one storey drawn) | two single-storey scenes with a lift between them | only through motion memory; nothing simultaneous on screen | simplest; reduced-motion users see a cut; does not show coupling at all |

### Recommendation

**C now, B as the "overview" mode.**

- Default play: the active storey exactly as today, plus a **ghost** of the other storey: its slab and partitions as 12% opacity wireframe boxes at the true `y` offset, the stairwell drawn solid at both levels. When the player hovers a cell, the corresponding cell on the ghost storey lights with the same lane colours, and the existing cross-floor lock washes (`blockedRows/Cols`) are drawn on the ghost as well. This is what makes "directly above the kitchen" legible without leaving the floor.
- Floor switch: the existing buttons; the ghost and the active storey swap roles with a 250 ms opacity cross-fade, no camera move (reduced-motion safe).
- Overview (optional, later): a toggle that renders option B — both storeys exploded with the stair bridging them — for the "reveal" moment at case completion and the victory replay.
- Stairs: authored once on the ground-floor spec; the resolver mirrors the stairwell upstairs.

## 4. What changes in code (estimate)

| Piece | Change | Size |
| --- | --- | --- |
| `schema.ts` | `stairs?: { model, at, facing }` on the ground spec | small |
| `resolve.ts` | stairs object + upstairs stairwell cut-out; `y` offset per floor; `storey` on `ResolvedScene` | small |
| `validate.ts` | stair top inside upper slab; stairwell free upstairs; stairs cells not hidden | small |
| `renderer.ts` | draw a second (ghost) resolved scene at `y = ±STOREY` with a wireframe material; ghost highlight quads | medium |
| `IsoBoard.tsx` | pass both scenes; ghost hover; frame height grows by the ghost's extent (headroom above for floor 0, slab below for floor 1) | medium |
| `units.ts` | `STOREY` constant; `makeFrame` takes a `ghost: 'above' \| 'below' \| 'none'` extent | small |
| Tests | ghost never has hit polygons; stair rules; frame extents | small |

A spike of the ghost renderer is about a day; the full feature including authoring 30 upper-floor scenes is the migration plan's Batch E.

## 5. Open questions for the product owner

1. Should the ghost show its furniture (silhouettes) or only slab + walls? Recommendation: slab + walls + the stairs; furniture ghosts add noise.
2. Is the exploded overview wanted at all, or is the ghost enough? It costs a taller frame on phones.
3. Should the stairs be a clue target ever ("on the stairs")? If yes, `stairs` needs a logical furniture type; today it does not exist in `FurnitureType`.
