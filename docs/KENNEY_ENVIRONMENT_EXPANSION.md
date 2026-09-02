# Kenney environment expansion — outdoor and other scenes

Question: can future cases play in a garden, courtyard, forest clearing, park, campsite or exterior crime scene while keeping normal Murdoku logic and the hidden N×N grid?

Short answer: yes, with the same scene system, one new floor material set, and a second Kenney kit that shares the Furniture Kit's scale and style. Nothing about the puzzle, the projection, the interaction layer or the validator changes.

## 1. Compatible assets

- **Nature Kit** — kenney.nl/assets/nature-kit, 330 models, CC0, same author and low-poly flat-colour style as the Furniture Kit (trees, rocks, bushes, flowers, grass tufts, paths, fences, logs, tents, mushrooms, cliffs). Distributed in the same formats (glTF among them). Scale must be measured with `scripts/kenney-catalog.mjs` before use; Kenney's nature pieces are authored around a 1-unit ground tile, which matches `floorFull`.
- **Furniture Kit** pieces that already work outdoors: `bench`, `benchCushion`, `chair`, `tableRound`, `pottedPlant`, `cardboardBox*`, `lampSquareFloor` (as a lamppost), `rugDoormat` (as a step), `wallHalf` (garden wall), `doorway` (a garden gate).
- The pilots already prove the mechanism: The Empty Chair and The Last Nightcap each have a `grass` floor zone inside the shell.

## 2. Scene concepts (each is a normal SceneSpec)

| Concept | Shell | Walls | Floor | Objects |
| --- | --- | --- | --- | --- |
| Walled courtyard / garden (exists today) | north/west full, south/east plinth | pony walls, patio openings | `grass` zone | potted plants, bench, chairs |
| Park | no shell walls (a new `shell: 'none'` option), plinth only | none; low `wallHalf` as railings, hedges as furniture | `grass` with `stone` paths | trees, benches, lamppost, bins |
| Forest clearing | none | none | `grass`, `dirt` (new material) | trees on the perimeter cells, logs, rocks, a tent |
| Campsite | none | none | `grass`/`dirt` | tents, fire ring (rocks), logs as seats, a cooler box |
| Exterior crime scene (front garden + porch) | north full with the house façade (Building Kit door/window pieces), west full or hedge | porch pony wall | `stone` porch, `grass` lawn, `stone` path | mailbox, bins, a parked box, bushes |

A "hedge" is furniture with `support: 'floor'`, `tall: true`, `symmetric: true` and `represents: ['shrub']`; the Nature Kit has several bush models that fit.

## 3. Technical reuse

- `schema.ts`: add `FloorMaterial` values (`dirt`, `path`), an optional `shell: { walls: 'full' | 'none' }`, and nothing else. `floors`, `walls` (as railings/hedge lines), `furniture`, `rugs` already express everything above.
- `catalog.generated.ts`: run the generator over the Nature Kit's glb folder into a second generated table; `catalog.ts` gains the semantic entries (tree = floor + tall + symmetric; rock = floor + loose; tent = floor + tall, faces S). The `KenneyModel` union becomes the union of both tables; the loader looks up the path by table.
- `renderer.ts`: floor slabs already handle non-wood materials; add the two colours. Trees cast shadows like everything else — no special case.
- `validate.ts`: unchanged. A tree is a tall symmetric object; a hedge line is a wall for reachability if authored as a wall, or a row of furniture if authored as furniture (prefer walls so `door-blocked`/`room-unreachable` keep working).
- Interaction layer: unchanged.

## 4. Readability risks and their answers

- **Trees hide cells.** A tree is tall; anything south-east of it is occluded. The validator's `cell-hidden` warning already catches this. Rule: trees go on the north/west perimeter cells only, or use short bushes elsewhere — every cell can hold a suspect, so there is no "safe" interior cell for a tall canopy.
- **No walls means no room boundaries.** Outdoors, "rooms" (Garden / Path / Pond) need another cue: floor material zones carry it (grass vs stone vs dirt), exactly as the courtyard does today. The hit layer keeps the room name in `aria-label`.
- **A lawn reads as a flat green board.** Break it with paths, a tree line, a fence — objects that people place for reasons, not to mark cells. Never draw the grid.
- **Night palette.** The current key light and midnight glass are indoor choices. Outdoor cases at night need a cooler hemisphere and a lamppost as a local warm source; that is one constant set in `renderer.ts` selected by a `scene.lighting: 'night' | 'day'` field (to add when the first outdoor case is authored).

## 5. How the hidden logical grid works outdoors

Exactly as indoors: the grid is `CELL`-sized world squares; nothing on screen shows it until interaction. Outdoors the *architecture* that normally hints at cell rhythm (walls on cell lines) is absent, which makes the hidden-grid goal easier, not harder. Row/column feedback (floor washes, dashed traces, end pins) is projected onto the ground plane the same way; a wash on grass reads as a spotlight on the lawn.

Two things to watch:
- Paths and hedges should not run along cell lines for their whole length, or they become the grid. Offset them by a fraction of a cell or give them a bend.
- Standees need ground contact cues on uneven ground; keep outdoor floors flat (no terrain height), which the slab model already guarantees.

## 6. Order of work when this is picked up

1. Download the Nature Kit; run the catalogue generator; check unit scale against `floorFull`.
2. Add the two materials and the `shell: 'none'` option (small, with tests).
3. Author one outdoor pilot (a Very Easy case that already has a Garden room) and run it through the migration plan's per-scene workflow.
4. Only then consider the Building Kit for façades.
