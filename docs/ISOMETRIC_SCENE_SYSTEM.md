# Isometric scene system — the recipe

This is the authoring contract for every dollhouse scene in Alibi/Murdoku. It exists so that a scene can be built by a capable agent **without improvising any foundational rule**. If a rule here is not enough to decide something, the answer is "ask", not "tune a number until it looks close".

Companion documents: `ADR-0001-3d-scene-renderer.md` (why 3D), `ROOT_CAUSE_REPORT.md` (what went wrong before), `SCENE_MIGRATION_PLAN.md` (how to roll this out).

Golden master: **Midnight Delivery** (`src/scene3d/scenes/midnight-delivery.ts`). When in doubt, do what it does. Reference renders: `docs/scenes/midnight-delivery-*.png`.

---

## 0. Two topologies, one contract

| | Puzzle topology | Architectural topology |
| --- | --- | --- |
| Lives in | `src/data/cases/*.ts`, `src/core/*` | `src/scene3d/scenes/*.ts` |
| Owns | N×N cells, rooms, furniture list, clues, solution | shell, walls, doors, windows, floor materials, visual furniture, décor |
| May change when authoring a scene | **never** | freely |

The only bridge is `logic: 'type@row,col'` on a visual object. It says "this thing on screen is the puzzle's `bed` at (0,0)". The validator enforces that every logical furnishing is represented, by a model allowed to represent that type, touching the logical cells. Nothing else about the puzzle is visible to the scene.

A Murdoku row is allowed to cross several rooms. Rooms in the puzzle are rectangles of cells; the house is not obliged to draw a wall on any cell edge, and must not draw a wall on every one.

---

## 1. Units and camera (fixed; do not change per scene)

- World units are **Kenney units**: one `floorFull` tile is 1×1, a `wall` is 1.29 tall, every model's feet are at y = 0 in the file.
- One Murdoku cell = `CELL = 0.8` units. A 6×6 board is 4.8 units on a side.
- Axes: `x` grows with **column** (screen right-down), `z` grows with **row** (screen left-down), `y` is up.
- Camera: orthographic, azimuth 45°, elevation 32°, from the +x/+z corner. It never moves. `units.ts` is the single source of the projection and the renderer's camera is built from it, so DOM overlays and pixels agree.
- Facing: `S` = toward the camera (+z), `N` = toward the back (−z), `E` = +x, `W` = −x. A model's *front* is its +z side at rot 0; `against` picks the facing for you.

Authoring coordinates are **cell units** (0…N). Convert in your head: 1 cell = 0.8 Kenney units. Kenney sizes (from `catalog.generated.ts`): double bed 0.96 × 1.13, sofa 0.98 × 0.41, kitchen cabinet 0.43 × 0.45, desk 0.73 × 0.39, fridge 0.43 wide × 0.92 tall.

---

## 2. Scene schema (`src/scene3d/schema.ts`)

```ts
{
  puzzleId: 'very-easy-1', floor: 0,
  entry:  { wall: 'west' | 'north', at: <cell> },            // the front door
  shell:  { features: [{ wall: 'north'|'west', at, kind: 'window'|'door' }] },
  floors: [{ id, cells: [col0,row0,col1,row1], material: 'grass'|'tile'|'stone' }],
  walls:  [{ id, from: [x,z], to: [x,z], height?: 'low'|'half'|'full',
             openings?: [{ at, width?, kind: 'door'|'open' }], freeEnds?: ['from'|'to'] }],
  furniture: [{ id, model, logic?, facing?,
                at?: [x,z] | against?: { wall, at, side?, gap? } | on?: { parent, offset?, surface? },
                yaw? }],
  rugs: [{ id, model, at, facing? }],
}
```

What the schema deliberately **cannot** express: per-object scale, pixel offsets, lifts, arbitrary y, a wall without two endpoints, a prop without a parent. If you want one of those you have misdiagnosed the problem — go back to the rule that applies.

### 2.1 Placement modes

| Mode | Use for | Result |
| --- | --- | --- |
| `against: { wall, at, side? }` | anything that belongs to a wall: beds, sofas, desks, counters, consoles, bookcases | back face touches the finished wall face (plus `gap` and the model's `rearGap`); facing is set away from the wall |
| `on: { parent, surface?, offset? }` | lamps, laptops, microwaves, TVs, books, small plants | feet at the parent's measured surface height; footprint must stay on the parent |
| `at: [x, z]` | free-standing pieces: coffee table, dining table, chairs, floor lamp, plant, parcel | centre of footprint at that point |

`side` is required for interior walls (`N/S` for x-axis walls, `E/W` for z-axis walls). The shell walls are `'north' | 'west' | 'south' | 'east'`.

---

## 3. The house before the furniture

### 3.1 Shell and cutaway (one rule, never varied)

- North and west shell walls: full height (1.29), carry windows and the front door.
- South and east shell walls: cut to a 0.12 plinth. The floor slab edge is the visible base.
- Corners meet: the resolver extends closed wall ends by half a thickness. Never author corner pieces.
- Every shell segment ends at a corner or at a window/door feature; the validator's tiling test proves there are no gaps.

### 3.2 Partitions

- Default `'low'` (0.6): a Sims-style cut-down wall. Reads as a wall, hides nothing at standee height.
- `'half'` (0.35): a pony wall / breakfast bar. **The only wall furniture may back onto from the camera side** (its west or north face), because anything behind a 0.6 wall on that side is hidden (see §4.4).
- `'full'` (1.29): only where nothing playable is behind it. The validator will tell you if you are wrong.
- Both endpoints must land on the shell or another wall. A deliberate open end (a nib wall, a pony wall stopping at a pass-through) is declared with `freeEnds`. Undeclared free ends are errors — they are the "unexplained posts" of the sprite era.
- Thickness is 0.08 for everything. Do not draw thickness by hand.

### 3.3 Openings

- `door`: a `doorwayOpen` frame model stands in the gap. Gap = frame width + 0.02 (`DOOR_GAP`). The frame is full height even in a low wall — that is how a doorway stays a doorway in a cutaway.
- `open`: a plain pass-through; give it a `width` (1.0–1.3 cells reads as patio doors / a wide opening).
- Keep 0.3+ cells of wall between an opening and a corner or it reads as a jamb-less slot.
- Clearance: 0.45 units on both sides of every opening must be free of solid furniture (validated).
- An opening that would leave a piece shorter than ~0.15 cells at a wall's end is a stub. Extend the opening to the end and declare a `freeEnd` instead (this is exactly the fix applied to Midnight Delivery's pony wall).

### 3.4 Circulation

- Declare the `entry`. Every room must be walkable from it (validated with a 0.2-unit grid; walls thinner than the grid still block).
- Hallways are entrance halls or galleries, not corridors: open them onto a room (Midnight Delivery's hall flows into the living room; The Last Nightcap's hall is a two-cell gallery with pony walls to the kitchen and garden).

### 3.5 Floors

- Default is the Kenney wood tile per cell. `floors` zones override cells with `grass`, `tile` or `stone` slabs. A garden is a grass zone inside the shell (a courtyard); it needs no extra walls.

---

## 4. Furniture rules

### 4.1 Grounding and support (never a number)

- Floor furniture: `against` or `at`. Feet are at y = 0 because the models are.
- Surface props (`support: 'surface'` in the catalogue) **must** be `on` a parent whose surface `role` is in the prop's `requires` list. Microwave → `counter`; laptop → `desk`/`table`; table lamp → `nightstand`/`table`/`desk`/`counter`/`shelf`/`stand`; TV → `stand`/`table`; books → `shelf`/`desk`/`table`/`nightstand`.
- Surface heights are measured from the meshes (desk 0.38, side table 0.38, bedside cabinet 0.26, TV cabinet 0.31, kitchen counters 0.45, coffee table 0.23, dining table 0.33, bookcaseOpen shelves 0.13/0.37/0.61/0.88).
- Rugs go in `rugs`, lie flat at y = 0.002, have no collision.

### 4.2 Collision and contact

- Physical envelope = the model's bounding box turned to its facing. Envelopes may not intersect walls or each other (4 mm tolerance). Contact with a wall face is exactly what `against` produces; that is allowed and expected.
- Children may overhang a parent by at most 0.03 (the TV on the TV cabinet); larger overhang is an error. Models whose usual child overhangs them carry `rearGap` in the catalogue so `against` leaves room.

### 4.3 Orientation

- Tall objects (> 0.7, or flagged `tall`) must face `S` or `E` — never show their back to the camera — unless the catalogue marks them `symmetric` (floor lamps, plants, coat stands, speakers).
- A tall object `against` the south or east shell (cut-away side) is allowed but reported as a warning: its back faces the camera. Accept only when the logical cell leaves no alternative (Midnight Delivery's fridge at (4,5)); otherwise re-plan.
- Chairs face their table/desk. Sofas face the TV. Counters face into the kitchen. Beds have their head to a wall.
- Furniture is square to the walls. Only `loose` props (boxes, books, bins, pillows) accept a `yaw`, and only a small one (≤ 20°).

### 4.4 Visibility

- Every cell must be visible at standee-chest height (0.45) from the camera; the validator warns per cell. In practice this means: **never put décor south-east of a cell centre it does not itself occupy** — the bin behind the desk end and the plant in front of the hall cell were both caught this way.
- Furniture against a partition must be on the wall's **south or east face** unless the wall is `'half'`. The TV cabinet on the west face of a 0.6 wall was invisible; making the wall a pony wall fixed it.
- Small floor props (bins, boxes) stand in front of (south/east of) the furniture they belong to. Behind it, their base is hidden and they read as sitting on top of it.

### 4.5 Composition (visual-quality rules; not machine-checked)

- Living: sofa → coffee table → TV/media on the axis the sofa faces. A rug under the group.
- Kitchen: one continuous run against one wall: cabinet, sink, cabinet+microwave, stove. Fridge at the run's end or in the nearest corner. Dining table with two chairs facing each other.
- Office: desk against a wall, laptop on it, chair facing it, a bin beside (in front of) the desk end, storage against a side wall, a floor lamp behind the chair.
- Bedroom: bed head to the wall, nightstand beside the head with a lamp on it, clear floor at the foot.
- Hall: a console with a lamp, a doormat inside the front door, nothing in door clearances.
- No orphan chair, no prop placed "to fill a cell". Every object has a reason a person would put it there.
- One story cue from the case's flavour text (the unopened parcel beside the victim's cell), never scattered clutter.

---

## 5. Lighting and shadows (fixed in `renderer.ts`)

- One hemisphere fill (sky `#fff8ec`, ground `#9c8266`, 1.6) and one warm key light (`#ffe2b8`, 2.2) from upper-left-front. Shadows come from the key light's shadow map: contact shadows under every object, cast shadows falling right and back.
- No per-object shadow settings exist. If an object looks airborne, its placement is wrong, not its shadow.
- Kenney materials are unlit in the files; they are rebuilt as Lambert with +15% saturation so the palette matches Kenney's own sample renders. Window glass is opaque midnight blue (the case plays at night, and translucent glass would show the page behind the house).

---

## 6. Interaction layer (`IsoBoard.tsx`)

- Idle: no markers of any kind. The house is the whole picture.
- Hover: the row and column get floor washes painted **on the floor** (occluded by furniture like real paint) plus a thin dashed trace with end pins in the DOM layer so the lane's extent is always legible; the intersection cell is brighter.
- Armed placement: small landing dots on free cells; a dashed ring on the hovered cell (green = free, red = occupied).
- Placed suspects: standees whose feet sit on the cell's floor point; locked rows/columns get a quiet green wash; conflicts a red wash and a red standee plate.
- Clue locate: cream wash on the target cells.
- Nothing ever outlines every cell.

---

## 7. Validation (`validate.ts`) — machine-checkable invariants

Errors (must be zero to ship):

| Code | Meaning |
| --- | --- |
| `unresolved` | schema misuse: missing parent, wrong surface role, non-axis wall, opening off its wall, a rug in `furniture` |
| `wall-penetration` | envelope intersects a wall piece |
| `furniture-overlap` | two solid envelopes intersect |
| `outside-floor` | envelope leaves the slab |
| `unsupported-prop` / `prop-overhang` | surface prop without a parent / hanging off it |
| `door-blocked` | solid furniture inside an opening's clearance |
| `wall-free-end` | partition end in open floor without `freeEnds` |
| `room-unreachable` | a room the entry cannot walk to |
| `object-hidden` | a floor object hidden behind a wall from the camera |
| `tall-back-exposed` | tall, non-symmetric object facing N/W (error), or against the cut shell (warning) |
| `logic-missing` / `logic-unknown` / `logic-type` / `logic-displaced` | the puzzle contract |

Warnings (a human decides): `cell-hidden`, `tall-back-exposed` on the cut shell, `no-entry`.

The dev build prints the report to the console on every scene build; `tests/IsoBoard.test.tsx` runs it for every authored scene and also proves each rule fires on a deliberately broken spec.

## 8. Visual-quality checks (a human, or an agent with a browser)

Machine checks cannot judge beauty. Before a scene ships, look at native-resolution crops of:

1. the whole house, environment only (`?env=1&case=<id>`),
2. every shell corner and the front plinth,
3. every doorway and pass-through,
4. every wall junction,
5. each room's furniture group,
6. the entry,
7. the interaction states (hover, armed, placed, conflict, clue),
8. mobile width (390 px).

Use `?diag=1` to see the physical model (blue wall pieces, orange openings, green furniture, pink surface props) over the render. Use `?elev=` / `?pw=` only to *study* a problem; the shipped constants are in `units.ts`.

Reject if anything floats, intersects, ends nowhere, shows its back, blocks a door, or reads as a grid.

---

## 9. Anti-patterns from this project, and the rule that replaces each

| Don't | Do |
| --- | --- |
| "move the counter −0.15 until it looks close to the wall" | `against: { wall: 'kitchen-back', side: 'S', at: 3.35 }` |
| "lift the microwave 20 px" | `on: { parent: 'counter-2' }` |
| "scale the side table 0.58 so it fits" | choose a model whose real size fits (`cabinetBedDrawerTable`, `sideTable`); there is no scale |
| "green footprint doesn't cross the wall centre-line" | envelopes are boxes; walls have thickness; contact is allowed, penetration is not |
| "add a bigger blob shadow so it looks grounded" | it is grounded because its feet are at y = 0; fix the placement, not the shadow |
| "cut the north wall into three spans with a low link" | shell walls are continuous; openings are features |
| "wall from (0.02, 2.58) span 2.04" | walls run between two named points on the plan and end on something |
| "put the TV cabinet against the west face of the kitchen wall" | camera-side faces of low walls are blind spots; use a pony wall or the S/E face |
| "chairDesk in the kitchen, tableCoffee for dining" | choose by room role: `chair` + `table` for dining, `chairDesk` + `desk` for the office |
| "the fridge looks fine from behind" | it is a known compromise: warn, look, and only accept when the logical cell forces it |
| "tests pin span = 2.36, height = 82" | tests assert invariants (zero errors, every logic represented, closed shell) |

---

## 10. Known limits

- The kit has no clock, no bush, no ceiling. `radio`/`speaker` stand in for clocks, `pottedPlant` for shrubs. If a case leans on those clues, say so in the scene comment.
- Tall furniture whose logical cell is on the south/east edge must either face S/E free-standing or back onto the cut shell (warning). There is no third option without changing the puzzle, which is forbidden.
- Windows are night-blue by material override; a daytime case would need a different glass rule (one constant in `renderer.ts`).
- Two-storey cases render each storey as its own scene (`floor` in the spec); vertical relationships are a study, not a feature yet — see `TWO_STOREY_FEASIBILITY.md`.
