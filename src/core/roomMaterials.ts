import type { CSSProperties } from 'react'

/** The room finishes used by the investigation board.
 *
 * These are deliberately material-first rather than game-board patterns. The
 * gradients have enough scale to read at a 4×4 board and enough restraint to
 * stay quiet behind a suspect token at 7×7.
 */
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

/** Public so visual regression tests can prove every room has a unique finish. */
export const ROOM_MATERIALS: Record<RoomMaterial, CSSProperties> = {
  kitchen: {
    backgroundColor: '#6f4b43',
    backgroundImage: [
      `radial-gradient(circle at 14% 28%, ${rgba('#e1c1a2', 0.22)} 0 1px, transparent 1.8px)`,
      `radial-gradient(circle at 74% 68%, ${rgba('#2b1c22', 0.2)} 0 1.2px, transparent 2px)`,
      'linear-gradient(132deg, #8a5b4f 0%, #69443f 48%, #4f3438 100%)',
    ].join(', '),
    backgroundSize: '27px 27px, 39px 39px, 100% 100%',
  },
  bathroom: {
    backgroundColor: '#87979a',
    backgroundImage: [
      `repeating-linear-gradient(0deg, transparent 0 31px, ${rgba('#f6f0dc', 0.2)} 31px 32px)`,
      `repeating-linear-gradient(90deg, transparent 0 31px, ${rgba('#30464c', 0.16)} 31px 32px)`,
      'linear-gradient(135deg, #d3d7ce 0%, #9faeaa 50%, #74888d 100%)',
    ].join(', '),
    backgroundSize: '32px 32px, 32px 32px, 100% 100%',
  },
  pantry: {
    backgroundColor: '#815344',
    backgroundImage: [
      `repeating-linear-gradient(45deg, transparent 0 22px, ${rgba('#321e22', 0.12)} 22px 23px, transparent 23px 45px)`,
      `repeating-linear-gradient(-45deg, transparent 0 22px, ${rgba('#f0c49e', 0.12)} 22px 23px, transparent 23px 45px)`,
      'linear-gradient(135deg, #9a6851 0%, #754b41 100%)',
    ].join(', '),
    backgroundSize: '64px 64px, 64px 64px, 100% 100%',
  },
  'living-room': {
    backgroundColor: '#44303a',
    backgroundImage: [
      `radial-gradient(ellipse at 30% 30%, ${rgba('#bd896e', 0.18)} 0%, transparent 48%)`,
      `repeating-linear-gradient(18deg, transparent 0 5px, ${rgba('#d2aa8a', 0.045)} 5px 6px)`,
      'linear-gradient(145deg, #6d4a4a 0%, #50363f 44%, #382832 100%)',
    ].join(', '),
    backgroundSize: '100% 100%, 13px 13px, 100% 100%',
  },
  'dining-room': {
    backgroundColor: '#4c2928',
    backgroundImage: [
      `repeating-linear-gradient(45deg, transparent 0 41px, ${rgba('#d9a873', 0.1)} 41px 42px, transparent 42px 84px)`,
      `repeating-linear-gradient(-45deg, transparent 0 41px, ${rgba('#26171d', 0.2)} 41px 42px, transparent 42px 84px)`,
      'linear-gradient(135deg, #6c3b30 0%, #482629 54%, #321e23 100%)',
    ].join(', '),
    backgroundSize: '84px 84px, 84px 84px, 100% 100%',
  },
  study: {
    backgroundColor: '#321b20',
    backgroundImage: [
      `repeating-linear-gradient(90deg, transparent 0 46px, ${rgba('#d08d62', 0.12)} 46px 47px, transparent 47px 94px)`,
      `repeating-linear-gradient(12deg, transparent 0 7px, ${rgba('#210f16', 0.16)} 7px 8px, transparent 8px 23px)`,
      'linear-gradient(135deg, #623129 0%, #442229 48%, #2b171e 100%)',
    ].join(', '),
    backgroundSize: '94px 100%, 31px 31px, 100% 100%',
  },
  office: {
    backgroundColor: '#344045',
    backgroundImage: [
      `repeating-linear-gradient(0deg, transparent 0 39px, ${rgba('#d3d1be', 0.1)} 39px 40px)`,
      `repeating-linear-gradient(90deg, transparent 0 39px, ${rgba('#1f2a31', 0.2)} 39px 40px)`,
      'linear-gradient(140deg, #5f6b6d 0%, #3f4d52 48%, #29363c 100%)',
    ].join(', '),
    backgroundSize: '40px 40px, 40px 40px, 100% 100%',
  },
  bedroom: {
    backgroundColor: '#5a4d55',
    backgroundImage: [
      `radial-gradient(ellipse at 50% 45%, ${rgba('#b98a78', 0.16)} 0%, transparent 52%)`,
      `repeating-radial-gradient(ellipse at 50% 50%, transparent 0 8px, ${rgba('#d3af91', 0.05)} 8px 9px, transparent 9px 18px)`,
      'linear-gradient(135deg, #806260 0%, #5d4b56 52%, #423944 100%)',
    ].join(', '),
    backgroundSize: '100% 100%, 38px 38px, 100% 100%',
  },
  hallway: {
    backgroundColor: '#a09683',
    backgroundImage: [
      `repeating-linear-gradient(45deg, transparent 0 47px, ${rgba('#f2e6c7', 0.22)} 47px 48px)`,
      `repeating-linear-gradient(-45deg, transparent 0 47px, ${rgba('#584b49', 0.14)} 47px 48px)`,
      'linear-gradient(135deg, #c4b9a2 0%, #a79b88 50%, #837b71 100%)',
    ].join(', '),
    backgroundSize: '96px 96px, 96px 96px, 100% 100%',
  },
  'front-yard': {
    backgroundColor: '#526b58',
    backgroundImage: [
      `repeating-linear-gradient(74deg, transparent 0 9px, ${rgba('#b3c48e', 0.11)} 9px 10px, transparent 10px 21px)`,
      `radial-gradient(circle at 20% 74%, ${rgba('#273b2c', 0.2)} 0 2px, transparent 2.5px)`,
      'linear-gradient(145deg, #718767 0%, #526b58 55%, #3b5148 100%)',
    ].join(', '),
    backgroundSize: '25px 25px, 43px 43px, 100% 100%',
  },
  garden: {
    backgroundColor: '#3f4d3a',
    backgroundImage: [
      `radial-gradient(ellipse at 24% 34%, ${rgba('#8e6a43', 0.48)} 0 12px, transparent 13px)`,
      `radial-gradient(ellipse at 72% 70%, ${rgba('#9a724a', 0.42)} 0 15px, transparent 16px)`,
      `repeating-linear-gradient(22deg, transparent 0 13px, ${rgba('#b2bf7e', 0.08)} 13px 14px, transparent 14px 28px)`,
      'linear-gradient(145deg, #61704b 0%, #465b40 52%, #2e4335 100%)',
    ].join(', '),
    backgroundSize: '100% 100%, 100% 100%, 33px 33px, 100% 100%',
  },
  porch: {
    backgroundColor: '#605a54',
    backgroundImage: [
      `repeating-linear-gradient(90deg, transparent 0 48px, ${rgba('#e0bf96', 0.14)} 48px 49px, transparent 49px 98px)`,
      `repeating-linear-gradient(8deg, transparent 0 6px, ${rgba('#342a2a', 0.12)} 6px 7px, transparent 7px 17px)`,
      'linear-gradient(135deg, #81766b 0%, #665e59 48%, #4c4a49 100%)',
    ].join(', '),
    backgroundSize: '98px 100%, 29px 29px, 100% 100%',
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

export function isDarkFloor(material: RoomMaterial): boolean {
  return material === 'study'
    || material === 'office'
    || material === 'front-yard'
    || material === 'garden'
    || material === 'living-room'
    || material === 'dining-room'
}
