import type { AuthoredCaseSpec } from '../../core/authored'

// Hand-authored replacement for the procedurally-generated "The Empty Chair"
// (very-easy-2) — the exact case from the live-board screenshot where a
// rotated sofa visually overlapped the TV above it. That was a code bug
// (fixed in generate.ts's placeSeating), not a randomness problem, but this
// case is also the pilot for hand-authored content: every room, every piece
// of furniture, and every person's position below is a deliberate design
// choice, not a seed.
export const veryEasy2: AuthoredCaseSpec = {
  slug: 'very-easy-2',
  difficulty: 'Very Easy',
  size: 6,
  rooms: [
    { name: 'Living Room', hue: 265, r0: 0, c0: 0, r1: 2, c1: 3 },
    { name: 'Office', hue: 230, r0: 0, c0: 4, r1: 2, c1: 5 },
    { name: 'Garden', hue: 108, r0: 3, c0: 0, r1: 5, c1: 5 },
  ],
  furniture: [
    // Sofa on the Living Room's west wall — vertical footprint (w=1,h=2) with
    // rotation 90 to face east into the room. This is exactly the
    // orientation that used to render with a landscape (w=2,h=1) bounding
    // box and spill into the row above it.
    { type: 'sofa', row: 1, col: 0, w: 1, h: 2, rotation: 90 },
    { type: 'tv', row: 0, col: 1, w: 1, h: 1, rotation: 0 },
    { type: 'clock', row: 0, col: 3, w: 1, h: 1, rotation: 0 },
    { type: 'desk', row: 0, col: 5, w: 1, h: 1, rotation: 270 },
    { type: 'bookshelf', row: 2, col: 4, w: 2, h: 1, rotation: 180 },
    { type: 'plant', row: 3, col: 1, w: 1, h: 1, rotation: 0 },
    { type: 'shrub', row: 4, col: 2, w: 1, h: 1, rotation: 0 },
    { type: 'plant', row: 5, col: 3, w: 1, h: 1, rotation: 0 },
    { type: 'shrub', row: 3, col: 4, w: 1, h: 1, rotation: 0 },
  ],
  people: [
    { name: 'Greta', accentIndex: 2, isVictim: true, row: 1, col: 1 },
    { name: 'Marco', accentIndex: 6, row: 2, col: 3 },
    { name: 'Idris', accentIndex: 4, row: 0, col: 4 },
    { name: 'Nadia', accentIndex: 3, row: 4, col: 5 },
  ],
  maxDirectness: 3,
  minDirectness: 0,
  flavor: 'Greta was found in the Living Room, the television still murmuring to an empty sofa. Everyone claims to have been elsewhere — trace each alibi to its room, and the one left beside her is the killer.',
}
