import type { CSSProperties } from 'react'

/** Dark, clue-readable finishes for the mansion reconstruction board. */
export type RoomMaterial =
  | 'kitchen' | 'bathroom' | 'pantry' | 'living-room' | 'dining-room'
  | 'study' | 'office' | 'bedroom' | 'hallway' | 'front-yard' | 'garden' | 'porch'

const rgba = (hex: string, alpha: number) => {
  const value = hex.replace('#', '')
  const red = Number.parseInt(value.slice(0, 2), 16)
  const green = Number.parseInt(value.slice(2, 4), 16)
  const blue = Number.parseInt(value.slice(4, 6), 16)
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`
}

/**
 * Each finish uses an authored material cue rather than an anonymous board
 * pattern: encaustic tile, stone, walnut, wool, parquet, earth, or timber.
 * Bases intentionally stay dark so the light token and X-mark treatment works
 * across all twelve rooms without changing meaning from room to room.
 */
export const ROOM_MATERIALS: Record<RoomMaterial, CSSProperties> = {
  kitchen: {
    // Aged encaustic tiles: oxblood clay, worn cream inlay, and hairline grout.
    backgroundColor: '#46342d',
    backgroundImage: [
      `radial-gradient(circle at 25% 24%, ${rgba('#c7a770', 0.18)} 0 4%, transparent 4.8%)`,
      `linear-gradient(45deg, transparent 43%, ${rgba('#b1885a', 0.19)} 44% 47%, transparent 48%)`,
      `linear-gradient(135deg, #694536 0 46%, #4b312d 47% 53%, #56382f 54% 100%)`,
    ].join(', '),
    backgroundSize: '32px 32px, 32px 32px, 32px 32px',
  },
  bathroom: {
    // Slate slabs with mineral bloom and deep, irregular-looking joins.
    backgroundColor: '#4d5754',
    backgroundImage: [
      `radial-gradient(ellipse at 26% 28%, ${rgba('#a9b09a', 0.14)} 0 7%, transparent 8%)`,
      `repeating-linear-gradient(0deg, transparent 0 31px, ${rgba('#293737', 0.62)} 32px 34px, transparent 35px 62px)`,
      'linear-gradient(132deg, #66706a 0%, #4d5754 48%, #394846 100%)',
    ].join(', '),
    backgroundSize: '64px 64px, 100% 64px, 100% 100%',
  },
  pantry: {
    // Narrow dark-walnut shelving boards, softly rubbed along their grain.
    backgroundColor: '#4b3128',
    backgroundImage: [
      `linear-gradient(90deg, transparent 0 82%, ${rgba('#c59561', 0.12)} 83% 85%, transparent 86%)`,
      `repeating-linear-gradient(0deg, #674331 0 18px, #4b3128 19px 21px, #593729 22px 39px)`,
      `linear-gradient(112deg, ${rgba('#d0a16c', 0.12)} 0%, transparent 28%, ${rgba('#24191d', 0.22)} 100%)`,
    ].join(', '),
    backgroundSize: '48px 100%, 100% 40px, 100% 100%',
  },
  'living-room': {
    // Faded aubergine wool carpet, richer at the room edges than its centre.
    backgroundColor: '#382a33',
    backgroundImage: [
      `radial-gradient(ellipse at 42% 34%, ${rgba('#a46d61', 0.23)} 0%, transparent 48%)`,
      `radial-gradient(circle at 73% 69%, ${rgba('#c0926d', 0.1)} 0 2%, transparent 3%)`,
      'linear-gradient(145deg, #573a43 0%, #382a33 56%, #2c202d 100%)',
    ].join(', '),
    backgroundSize: '100% 100%, 35px 35px, 100% 100%',
  },
  'dining-room': {
    // Mahogany parquet: long diagonal blocks with a dark pitch between them.
    backgroundColor: '#402925',
    backgroundImage: [
      `linear-gradient(45deg, transparent 46%, ${rgba('#ca9360', 0.18)} 47% 49%, transparent 50%)`,
      `linear-gradient(-45deg, transparent 46%, ${rgba('#21181b', 0.56)} 47% 49%, transparent 50%)`,
      'linear-gradient(135deg, #61382c 0%, #402925 50%, #2f2021 100%)',
    ].join(', '),
    backgroundSize: '44px 44px, 44px 44px, 100% 100%',
  },
  study: {
    // Nearly black library walnut: wide boards, amber catch-light, knot shadows.
    backgroundColor: '#2c1d1e',
    backgroundImage: [
      `radial-gradient(ellipse at 74% 36%, ${rgba('#bb7b50', 0.17)} 0 5%, transparent 6%)`,
      `repeating-linear-gradient(90deg, #482920 0 44px, #2c1d1e 45px 48px, #3b241f 49px 92px)`,
      `linear-gradient(12deg, ${rgba('#d49a64', 0.12)} 0%, transparent 32%, ${rgba('#1c171b', 0.4)} 100%)`,
    ].join(', '),
    backgroundSize: '94px 94px, 96px 100%, 100% 100%',
  },
  office: {
    // Smoked slate slabs, restrained enough to sit behind papers and desks.
    backgroundColor: '#343d39',
    backgroundImage: [
      `radial-gradient(circle at 20% 72%, ${rgba('#a5a98c', 0.12)} 0 2%, transparent 3%)`,
      `linear-gradient(118deg, transparent 49%, ${rgba('#202c2c', 0.55)} 50% 52%, transparent 53%)`,
      'linear-gradient(136deg, #505b55 0%, #343d39 52%, #293330 100%)',
    ].join(', '),
    backgroundSize: '39px 39px, 76px 76px, 100% 100%',
  },
  bedroom: {
    // Worn oxblood-and-aubergine runner weave, intentionally quiet beneath a bed.
    backgroundColor: '#47333e',
    backgroundImage: [
      `radial-gradient(ellipse at 50% 47%, ${rgba('#bc856d', 0.17)} 0%, transparent 48%)`,
      `linear-gradient(90deg, transparent 46%, ${rgba('#d0a47c', 0.08)} 48% 52%, transparent 54%)`,
      'linear-gradient(135deg, #664652 0%, #47333e 54%, #352a36 100%)',
    ].join(', '),
    backgroundSize: '100% 100%, 18px 18px, 100% 100%',
  },
  hallway: {
    // Aged limestone: low-contrast blocks, burnished at the edges rather than bright tile.
    backgroundColor: '#5f584c',
    backgroundImage: [
      `radial-gradient(ellipse at 30% 26%, ${rgba('#c3b38a', 0.14)} 0 9%, transparent 10%)`,
      `linear-gradient(90deg, transparent 48%, ${rgba('#302d29', 0.34)} 49% 51%, transparent 52%)`,
      'linear-gradient(145deg, #746d5d 0%, #5f584c 52%, #49463e 100%)',
    ].join(', '),
    backgroundSize: '76px 76px, 76px 76px, 100% 100%',
  },
  'front-yard': {
    // Clipped grass over packed earth, with a few deliberately sparse blades.
    backgroundColor: '#3f513f',
    backgroundImage: [
      `radial-gradient(ellipse at 22% 76%, ${rgba('#836443', 0.65)} 0 10%, transparent 11%)`,
      `linear-gradient(74deg, transparent 45%, ${rgba('#a1a76d', 0.15)} 47% 49%, transparent 51%)`,
      'linear-gradient(145deg, #5d704f 0%, #3f513f 56%, #304638 100%)',
    ].join(', '),
    backgroundSize: '72px 72px, 22px 22px, 100% 100%',
  },
  garden: {
    // Damp earth pockets interrupt desaturated garden grass; no lawn-grid treatment.
    backgroundColor: '#344738',
    backgroundImage: [
      `radial-gradient(ellipse at 24% 34%, ${rgba('#85623d', 0.78)} 0 12%, transparent 13%)`,
      `radial-gradient(ellipse at 72% 70%, ${rgba('#9a7147', 0.58)} 0 15%, transparent 16%)`,
      'linear-gradient(145deg, #596847 0%, #344738 54%, #293b30 100%)',
    ].join(', '),
    backgroundSize: '100% 100%, 100% 100%, 100% 100%',
  },
  porch: {
    // Weathered porch boards: long charcoal timber with pale rubbed edges.
    backgroundColor: '#4d4941',
    backgroundImage: [
      `linear-gradient(8deg, transparent 44%, ${rgba('#c3a47b', 0.16)} 46% 48%, transparent 50%)`,
      `repeating-linear-gradient(90deg, #62584d 0 46px, #3b3a35 47px 50px, #524c43 51px 96px)`,
      `linear-gradient(135deg, ${rgba('#d2b783', 0.12)} 0%, transparent 31%, ${rgba('#252529', 0.34)} 100%)`,
    ].join(', '),
    backgroundSize: '31px 31px, 98px 100%, 100% 100%',
  },
}

const ROOM_MATERIAL_BY_NAME: Record<string, RoomMaterial> = {
  kitchen: 'kitchen',
  bathroom: 'bathroom',
  pantry: 'pantry',
  'living room': 'living-room',
  'dining room': 'dining-room',
  study: 'study',
  office: 'office',
  bedroom: 'bedroom',
  hallway: 'hallway',
  'front yard': 'front-yard',
  garden: 'garden',
  porch: 'porch',
}

export function roomMaterial(name: string): RoomMaterial {
  const normalized = name.trim().toLowerCase()
  if (normalized.includes('yard')) return 'front-yard'
  return ROOM_MATERIAL_BY_NAME[normalized] ?? 'living-room'
}

export function floorStyle(material: RoomMaterial): CSSProperties {
  return {
    ...ROOM_MATERIALS[material],
    backgroundPosition: 'center',
    backgroundRepeat: 'repeat',
  }
}

/** Every finish is intentionally dark enough for the board's light mark treatment. */
export function isDarkFloor(_material: RoomMaterial): boolean {
  return true
}
