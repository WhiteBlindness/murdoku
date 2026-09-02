# Scene migration plan — the remaining cases

Three scenes are authored and validated: `very-easy-1` (golden master), `very-easy-2` (courtyard pilot), `easy-1` (7×7 pilot). Every other case renders through the procedural fallback (`scenes/fallback.ts`): shell, no partitions, one default model per logical furnishing at its footprint centre. The fallback is playable and honest; it is not the product.

This plan is written for an agent that is capable but should not improvise foundations (Opus). It repeats nothing from `ISOMETRIC_SCENE_SYSTEM.md`; read that first and keep it open.

## Inventory

| Tier | Cases | Size | Storeys | Notes |
| --- | --- | --- | --- | --- |
| Very Easy | 8 (1 done, 1 pilot) | 6×6 | 1 | authored data for #1–#2, generated for #3–#8 |
| Easy | 10 (1 pilot) | 7×7 | 1 | generated |
| Medium | 12 | 8×8 | 1 | generated |
| Hard / Expert / Master | 30 | 8×8 | 2 | generated; each storey is its own scene spec (`floor: 0` and `floor: 1`) |

Generated cases are deterministic (seeded from the catalog plan), so a scene authored against `easy-3` today matches `easy-3` tomorrow. Dump a case's rooms, furniture, solution and clues with the snippet in §"Tooling" before authoring.

## Batch order

1. **Batch A — Very Easy 3–8** (6 scenes, 6×6). Same board size as the golden master; most rooms map onto the Midnight Delivery vocabulary.
2. **Batch B — Easy 2–10** (9 scenes, 7×7). Central halls and gardens appear; the Nightcap pilot is the reference.
3. **Batch C — Medium 1–12** (12 scenes, 8×8). Larger rooms; expect more décor per room and two furniture groups per room.
4. **Batch D — ground floors of Hard/Expert/Master** (30 scenes, 8×8, `floor: 0`).
5. **Batch E — upper floors** (30 scenes, `floor: 1`), after `TWO_STOREY_FEASIBILITY.md` decisions are taken (stairs placement is a system feature, not a per-scene guess).

Do not interleave batches. Each batch ends with a batch gate before the next starts.

## Per-scene workflow (exactly this, every time)

1. **Read the case.** Room rectangles, furniture list with footprints and rotations, solution cells, clue texts. Note which furniture carries clues (the clue texts name them) — those objects must be unmistakable.
2. **Draw the plan in the file header** as ASCII (see the three authored scenes). Decide: entry wall, which rooms get partitions, where the doors are, which walls are pony walls, whether a garden zone exists. Rooms on the south/east edge get pony walls or open passes, never full partitions.
3. **Place logical furniture first**, each with `logic`, using `against` wherever the piece belongs to a wall. Check every logical cell is *touched* by its visual (the validator will say `logic-displaced` if not).
4. **Complete the groups** (§4.5 of the system doc): the second dining chair, the coffee table, the laptop, the lamp on the nightstand, the doormat. No filler.
5. **Register** the scene in `src/scene3d/scenes/index.ts`.
6. **Run the validator**: `npx vitest run tests/IsoBoard.test.tsx`. The "every authored scene passes" block fails with the exact violation messages. Fix by the rule, not by nudging until green.
7. **Look**: `npm run dev`, open `/?env=1&case=<id>` and `/?env=1&diag=1&case=<id>`, screenshot at 2× DPR, crop the board, inspect the list in system doc §8. Then `/?case=<id>` and check hover, armed, placed, conflict states. Then 390 px wide.
8. **Record** two screenshots per scene in `docs/scenes/<id>-env.png` and `docs/scenes/<id>-play.png` (crops of the board only).
9. **Commit one scene per commit**: `scene(<id>): <one-line plan summary>`.

Budget: a 6×6 scene should take one pass through steps 1–7 plus at most one fix round. If a scene needs a third round, stop and escalate (below).

## Batch gate (before the next batch)

- `npx vitest run` fully green; `npx tsc --noEmit -p tsconfig.app.json` clean; `npm run build` succeeds.
- Every scene in the batch has zero validator errors and zero `cell-hidden` warnings; every `tall-back-exposed` warning is listed in the batch note with a one-line justification.
- A human (or the reviewing agent with a browser) opens **three random scenes** of the batch and checks §8 of the system doc. One rejected scene sends that scene back; two rejected scenes send the batch back and require the batch note to name the systemic cause.
- The batch note (`docs/scenes/BATCH-<letter>.md`) lists: scenes done, warnings accepted, any catalogue additions (new `represents`/`surfaces` entries), any rule that was unclear.

## Escalation — stop and ask when

- A logical furnishing cannot be represented without breaking a rule (e.g. a tall piece whose cell is on the south-east edge and no `symmetric` model fits). Do not solve it by editing the case data.
- The validator's rule and the picture disagree (a passing scene that looks wrong, or a failing scene that looks right). This means a rule is incomplete; it gets fixed in `validate.ts` with a test, not worked around in the scene.
- A model needed for a room role is missing from `catalog.ts` (`MODEL_META`). Adding metadata is allowed — measured heights only (`scripts/kenney-catalog.mjs` plus the vertex-plane snippet in the system doc) — but adding a new `represents` mapping for a *different* logical type than the model's obvious meaning needs sign-off.
- Any temptation to add a field to the schema. The schema is the product; changes are architecture work.

## Tooling

Dump a case (run once with vitest, read the JSON):

```ts
// tests/_tmp_dump.test.ts (delete after use)
import { it } from 'vitest'
import { writeFileSync } from 'node:fs'
import { initCatalog, getPuzzleById } from '../src/core/catalog'
it('dump', () => {
  initCatalog()
  const p = getPuzzleById('easy-3')!
  writeFileSync('C:/tmp/easy-3.json', JSON.stringify({
    size: p.size, rooms: p.rooms, furniture: p.furniture, solution: p.solution, clues: p.clues.map(c => c.text),
  }, null, 1))
})
```

Deep link for QA (dev builds only): `/?case=<id>` opens the case directly; add `&env=1` for environment only, `&diag=1` for the physical model overlay.

Validator report for one scene without the test runner: the dev build prints it to the browser console as `[scene <id>#<floor>]` whenever the board mounts.

## Definition of done for the migration

- 60 ground-floor scenes authored and passing; 30 upper-floor scenes authored after the two-storey decision.
- `scenes/fallback.ts` is still present (it is the safety net for any future generated case) but no shipped case uses it — add a test that asserts `hasAuthoredScene(id)` for every catalog id once the last batch lands.
