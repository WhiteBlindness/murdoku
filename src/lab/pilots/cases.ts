import type { AuthoredCaseSpec } from '../../core/authored'

const solution = [
  { name: 'Mara', accentIndex: 2, isVictim: true, row: 1, col: 1 },
  { name: 'Elias', accentIndex: 6, row: 2, col: 2 },
  { name: 'Nora', accentIndex: 4, row: 0, col: 4 },
  { name: 'Tomas', accentIndex: 1, row: 4, col: 5 },
]

export const cemeteryPilot: AuthoredCaseSpec = {
  slug: 'pilot-cemetery',
  difficulty: 'Very Easy',
  size: 6,
  rooms: [
    { name: 'Graveyard', hue: 138, r0: 0, c0: 0, r1: 2, c1: 2 },
    { name: 'Chapel', hue: 38, r0: 0, c0: 3, r1: 2, c1: 5 },
    { name: 'Gate', hue: 28, r0: 3, c0: 0, r1: 5, c1: 2 },
    { name: 'Orchard', hue: 104, r0: 3, c0: 3, r1: 5, c1: 5 },
  ],
  furniture: [
    { type: 'shrub', row: 0, col: 0 },
    { type: 'lamp', row: 2, col: 0 },
    { type: 'chair', row: 0, col: 3 },
    { type: 'plant', row: 1, col: 5 },
    { type: 'box', row: 3, col: 0 },
    { type: 'shrub', row: 5, col: 2 },
    { type: 'plant', row: 3, col: 3 },
    { type: 'chair', row: 5, col: 5 },
  ],
  people: solution,
  maxDirectness: 3,
  minDirectness: 0,
  flavor: 'Mara was found among the old graves after the chapel bell rang. Trace the visitors’ alibis through the cemetery and find who remained with her.',
}

export const shopPilot: AuthoredCaseSpec = {
  slug: 'pilot-shop',
  difficulty: 'Very Easy',
  size: 6,
  rooms: [
    { name: 'Shop Floor', hue: 38, r0: 0, c0: 0, r1: 2, c1: 2 },
    { name: 'Aisle', hue: 210, r0: 0, c0: 3, r1: 2, c1: 5 },
    { name: 'Stockroom', hue: 28, r0: 3, c0: 0, r1: 5, c1: 2 },
    { name: 'Office', hue: 225, r0: 3, c0: 3, r1: 5, c1: 5 },
  ],
  furniture: [
    { type: 'counter', row: 0, col: 0, w: 2, h: 1, rotation: 0 },
    { type: 'fridge', row: 0, col: 5 },
    { type: 'clock', row: 2, col: 4 },
    { type: 'bookshelf', row: 3, col: 0, w: 2, h: 1, rotation: 0 },
    { type: 'box', row: 4, col: 2 },
    { type: 'table', row: 3, col: 3 },
    { type: 'chair', row: 4, col: 3 },
  ],
  people: solution,
  maxDirectness: 3,
  minDirectness: 0,
  flavor: 'Mara was found just beyond the counter before opening time. Compare the staff’s accounts with what each part of the shop can hold.',
}

export const cafePilot: AuthoredCaseSpec = {
  slug: 'pilot-cafe',
  difficulty: 'Very Easy',
  size: 6,
  rooms: [
    { name: 'Dining Room', hue: 18, r0: 0, c0: 0, r1: 2, c1: 2 },
    { name: 'Kitchen', hue: 42, r0: 0, c0: 3, r1: 2, c1: 5 },
    { name: 'Patio', hue: 120, r0: 3, c0: 0, r1: 5, c1: 2 },
    { name: 'Counter', hue: 30, r0: 3, c0: 3, r1: 5, c1: 5 },
  ],
  furniture: [
    { type: 'plant', row: 0, col: 0 },
    { type: 'lamp', row: 2, col: 0 },
    { type: 'chair', row: 2, col: 2 },
    { type: 'counter', row: 3, col: 4, w: 2, h: 1, rotation: 0 },
    { type: 'stove', row: 0, col: 5 },
    { type: 'table', row: 3, col: 3 },
    { type: 'chair', row: 4, col: 3 },
    { type: 'clock', row: 5, col: 5 },
  ],
  people: solution,
  maxDirectness: 3,
  minDirectness: 0,
  flavor: 'Mara was found in the dining room as the first coffee of the day cooled. Follow the breakfast shift through the kitchen, patio and counter.',
}

export const DEV_PILOT_CASES = {
  cemetery: cemeteryPilot,
  shop: shopPilot,
  cafe: cafePilot,
} satisfies Record<string, AuthoredCaseSpec>

export type DevPilotKey = keyof typeof DEV_PILOT_CASES
