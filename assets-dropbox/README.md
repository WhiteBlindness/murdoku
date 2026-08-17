# Drop Kenney assets here

This worktree is the **art-kenney** branch — the experiment that swaps the
hand-drawn noire miniatures for Kenney's CC0 furniture art.

## What to download

**Furniture Kit** — https://kenney.nl/assets/furniture-kit
(140 assets / ~120 objects, CC0 1.0 Universal: public domain, no attribution
required, commercial use fine, single author so the set is stylistically
consistent.)

Optional, for floors/backgrounds:

- Isometric Library Tiles — https://kenney-assets.itch.io/isometric-library-tiles
- Isometric Dungeon Tiles — https://kenney-assets.itch.io/isometric-dungeon-tiles

## Mixing libraries

Mixing IS viable when each library owns a separate layer — one for floors, one
for objects — because the two never sit inside the same silhouette and the eye
forgives a seam at the floor/object boundary. What does not survive mixing is
two libraries inside the SAME layer: nineteen objects by nineteen authors read
as a ransom note however good each one is.

The pairing to be careful about is projection, not palette. Palette is fixable
in an afternoon (recolour to the noire shelf in DESIGN.md); projection is not.
A floor drawn in straight-on plan view under objects drawn at an isometric 30
degrees will look wrong no matter how well both are made, because the room's
corners and the furniture's corners disagree about where the viewer is.

So the rule for any second library: it must share the projection of the first,
or own a layer where projection cannot be compared.

Candidate floor sources, both CC0:

- ambientCG — https://ambientcg.com/ (photoreal PBR scans; will fight an
  illustrated board, but the wood/carpet/grass scans are excellent if the board
  ever goes photoreal)
- Kenney's own tile packs (linked above) — safest match, same author as the
  objects, so projection and palette already agree

## What to do

1. Download the Furniture Kit zip from the link above.
2. Unzip it into this folder. Don't rename anything — keep Kenney's own folder
   structure (it usually contains `Isometric/`, `Previews/`, `Models/` etc.).
3. Tell Claude it's here. The 2D sprite folders are the ones that matter; the
   3D model folders can stay unused.

## Why the download is yours to make

Pulling a third-party asset archive onto your machine is your call, not
something to do unprompted — so this folder is the handoff point.

## What happens next

The board currently has 19 furniture types, all hand-drawn. Kenney's kit has
~120 objects, which is the difference between "the same furniture rearranged"
and boards that actually look like different houses. The wiring work is:

- map Kenney sprites onto the existing `FurnitureType` union, then extend it
- replace `FURNITURE_ICON` in `src/core/furniture.tsx` with sprite lookups
- check they read at ~40px cells, which is the real test

## Judging it

Run all three side by side:

| port | worktree | direction |
|---|---|---|
| 5173 | `murdoku` (main) | current hand-drawn noire 3/4 |
| 5174 | `murdoku-art-kenney` | Kenney CC0 sprites |
| 5175 | `murdoku-art-flat` | flat top-down plan view |

The thing to look for: Kenney's art is rendered isometric/top-down, which is a
different projection from the board's straight-on square grid. That mismatch is
the main risk, and it's much easier to judge with your eyes than to argue about.
