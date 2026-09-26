import { buildAuthoredPuzzle } from '../../core/authored'
import type { Puzzle } from '../../core/types'
import { DEV_PILOT_CASES, type DevPilotKey } from './cases'

const TITLES: Record<DevPilotKey, string> = {
  cemetery: 'A quiet night at the cemetery',
  shop: 'After hours at the corner shop',
  cafe: 'Before the first coffee',
}

const builtPilots = new Map<DevPilotKey, Puzzle>()

function pilotKey(value: string | null): DevPilotKey | undefined {
  if (value === 'cemetery' || value === 'shop' || value === 'cafe') return value
  return undefined
}

/** Return only the pilot requested by a development URL. */
export function getSelectedDevPilot(): Puzzle | undefined {
  if (!import.meta.env.DEV || typeof window === 'undefined') return undefined

  const key = pilotKey(new URLSearchParams(window.location.search).get('pilot'))
  if (!key) return undefined

  const cached = builtPilots.get(key)
  if (cached) return cached

  const built = buildAuthoredPuzzle(DEV_PILOT_CASES[key], 'Dev pilot')
  const puzzle = { ...built, title: TITLES[key] }
  builtPilots.set(key, puzzle)
  return puzzle
}
