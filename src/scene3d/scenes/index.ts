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
import { theSecondShot } from './the-second-shot'
import { nobodyLeft } from './nobody-left'
import { aQuietAlibi } from './a-quiet-alibi'
import { ashesAtMidnightGround } from './ashes-at-midnight-ground'
import { ashesAtMidnightUpper } from './ashes-at-midnight-upper'
import { theLastTrainGround } from './the-last-train-ground'
import { theLastTrainUpper } from './the-last-train-upper'
import { roomWithoutADoorGround } from './room-without-a-door-ground'
import { roomWithoutADoorUpper } from './room-without-a-door-upper'
import { theUnlitLampGround } from './the-unlit-lamp-ground'
import { theUnlitLampUpper } from './the-unlit-lamp-upper'

import { theColdKettleGround } from './the-cold-kettle-ground'
import { theColdKettleUpper } from './the-cold-kettle-upper'
import { aNameInPencilGround } from './a-name-in-pencil-ground'
import { aNameInPencilUpper } from './a-name-in-pencil-upper'
import { threeEmptyGlassesGround } from './three-empty-glasses-ground'
import { threeEmptyGlassesUpper } from './three-empty-glasses-upper'
import { theLateArrivalGround } from './the-late-arrival-ground'
import { theLateArrivalUpper } from './the-late-arrival-upper'
import { aStoryRehearsedGround } from './a-story-rehearsed-ground'
import { aStoryRehearsedUpper } from './a-story-rehearsed-upper'
import { nothingWasTakenGround } from './nothing-was-taken-ground'
import { nothingWasTakenUpper } from './nothing-was-taken-upper'
import { theOpenWindowGround } from './the-open-window-ground'
import { theOpenWindowUpper } from './the-open-window-upper'
import { theLockedPantryGround } from './the-locked-pantry-ground'
import { theLockedPantryUpper } from './the-locked-pantry-upper'
import { theMissingHourGround } from './the-missing-hour-ground'
import { theMissingHourUpper } from './the-missing-hour-upper'
import { aWitnessRecantsGround } from './a-witness-recants-ground'
import { aWitnessRecantsUpper } from './a-witness-recants-upper'
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
    theSecondShot, nobodyLeft, aQuietAlibi,
    ashesAtMidnightGround, ashesAtMidnightUpper,
    theLastTrainGround, theLastTrainUpper,
    roomWithoutADoorGround, roomWithoutADoorUpper,
    theUnlitLampGround, theUnlitLampUpper,
    theColdKettleGround, theColdKettleUpper,
    aNameInPencilGround, aNameInPencilUpper,
    threeEmptyGlassesGround, threeEmptyGlassesUpper,
    theLateArrivalGround, theLateArrivalUpper,
    aStoryRehearsedGround, aStoryRehearsedUpper,
    nothingWasTakenGround, nothingWasTakenUpper,
    theOpenWindowGround, theOpenWindowUpper,
    theLockedPantryGround, theLockedPantryUpper,
    theMissingHourGround, theMissingHourUpper,
    aWitnessRecantsGround, aWitnessRecantsUpper,
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
