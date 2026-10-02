import type { Puzzle } from '../../core/types'
import type { SceneSpec } from '../schema'
import { fallbackScene } from './fallback'
import { midnightDelivery } from './midnight-delivery'
import { theEmptyChair } from './the-empty-chair'
import { theLastNightcap } from './the-last-nightcap'
import { twoStoreyReferenceGround } from './two-storey-reference-ground'
import { twoStoreyReferenceUpper } from './two-storey-reference-upper'
import { deathBeforeDinner } from './death-before-dinner'
import { aFatalRehearsal } from './a-fatal-rehearsal'
import { checkmate } from './checkmate'
import { theBrokenVase } from './the-broken-vase'
import { theSilentGuest } from './the-silent-guest'
import { noWayOut } from './no-way-out'
import { theFinalCurtain } from './the-final-curtain'
import { aGraveMistake } from './a-grave-mistake'
import { theVanishingAct } from './the-vanishing-act'
import { theLockedStudy } from './the-locked-study'
import { theUninvited } from './the-uninvited'
import { aColdReception } from './a-cold-reception'
import { theMissingKey } from './the-missing-key'
import { ashesInTheStudy } from './ashes-in-the-study'
import { theSeventhGuest } from './the-seventh-guest'
import { aToastToMurder } from './a-toast-to-murder'
import { theTornLetter } from './the-torn-letter'
import { shadowsInTheHall } from './shadows-in-the-hall'
import { thePoisonedPen } from './the-poisoned-pen'
import { oneLastWaltz } from './one-last-waltz'
import { theButlersSecret } from './the-butlers-secret'
import { whispersUpstairs } from './whispers-upstairs'
import { theCrackedMirror } from './the-cracked-mirror'
import { aDebtRepaid } from './a-debt-repaid'

/** Authored scenes, keyed by `${puzzleId}#${floor}`. */
export const AUTHORED_SCENES: Record<string, SceneSpec> = Object.fromEntries(
  [
    midnightDelivery, theEmptyChair, theLastNightcap,
    twoStoreyReferenceGround, twoStoreyReferenceUpper, deathBeforeDinner,
    aFatalRehearsal, checkmate, theBrokenVase, theSilentGuest, noWayOut,
    theLockedStudy, theUninvited, aColdReception,
    theFinalCurtain, aGraveMistake, theVanishingAct,
    theMissingKey, ashesInTheStudy, theSeventhGuest,
    aToastToMurder, theTornLetter, shadowsInTheHall,
    thePoisonedPen, oneLastWaltz, theButlersSecret,
    whispersUpstairs, theCrackedMirror, aDebtRepaid,
  ]
    .map(s => [`${s.puzzleId}#${s.floor ?? 0}`, s]),
)

export function hasAuthoredScene(puzzleId: string, floor = 0): boolean {
  return `${puzzleId}#${floor}` in AUTHORED_SCENES
}

/** The scene to draw for a puzzle storey: authored if it exists, else the
 *  procedural fallback built from the puzzle's own furniture list. */
export function sceneFor(puzzle: Puzzle, floor = 0): SceneSpec {
  return AUTHORED_SCENES[`${puzzle.id}#${floor}`] ?? fallbackScene(puzzle, floor)
}
