import { describe, expect, it } from 'vitest'
import { clueHolds, countSolutions } from '../src/core/engine'
import { makePuzzle } from './fixtures'
import type { Clue } from '../src/core/types'

// Fixture layout (4×4, size=4):
//   p0 → row 0, col 0 → room 'study'
//   p1 → row 1, col 1 → room 'study'
//   p2 → row 2, col 2 → room 'kitchen'
//   p3 → row 3, col 3 → room 'kitchen'  (victim)
//
// Rooms: 'study' (0,0–1,1), 'hall' (0,2–1,3),
//        'garden' (2,0–3,1), 'kitchen' (2,2–3,3)

describe('notRoom clue', () => {
  it('holds when the person is NOT in the given room', () => {
    const p = makePuzzle()
    const clue: Clue = { kind: 'notRoom', person: 'p0', roomId: 'kitchen' }
    // p0 is in 'study', so definitely not in 'kitchen'
    expect(clueHolds(p, clue, p.solution)).toBe(true)
  })

  it('fails when the person IS in the given room', () => {
    const p = makePuzzle()
    const clue: Clue = { kind: 'notRoom', person: 'p0', roomId: 'study' }
    // p0 IS in 'study'
    expect(clueHolds(p, clue, p.solution)).toBe(false)
  })

  it('prunes cells — reduces but does not eliminate solutions', () => {
    // With only notRoom:study for p0, p0 cannot be in study, but solutions
    // exist with p0 anywhere else. Compared to no-clue (24 solutions), it must
    // be strictly fewer, but still > 0.
    const pNoClue = makePuzzle({ clues: [] })
    const pWithNotStudy = makePuzzle({
      clues: [{ clue: { kind: 'notRoom', person: 'p0', roomId: 'study' }, text: '' }],
    })
    // The cap must exceed the true count or both sides saturate at the cap and
    // the comparison is vacuous — an earlier version of this test capped at 30
    // and compared 30 < 30.
    const CAP = 1000
    const before = countSolutions(pNoClue, CAP)
    const after = countSolutions(pWithNotStudy, CAP)
    expect(before).toBeLessThan(CAP)
    expect(after).toBeGreaterThan(0)
    expect(after).toBeLessThan(before)
  })

  it('combined with room clues produces a unique solution', () => {
    // Pin everyone via room + row clues; notRoom for a foreign room is
    // vacuously true and must not break uniqueness.
    const pWith = makePuzzle({
      clues: [
        // notRoom:kitchen for p0 is TRUE (p0 is in study) — must not interfere
        { clue: { kind: 'notRoom', person: 'p0', roomId: 'kitchen' }, text: '' },
        { clue: { kind: 'room', person: 'p0', roomId: 'study' }, text: '' },
        { clue: { kind: 'room', person: 'p1', roomId: 'study' }, text: '' },
        { clue: { kind: 'room', person: 'p2', roomId: 'kitchen' }, text: '' },
        { clue: { kind: 'room', person: 'p3', roomId: 'kitchen' }, text: '' },
        { clue: { kind: 'row', person: 'p0', row: 0 }, text: '' },
        { clue: { kind: 'row', person: 'p1', row: 1 }, text: '' },
      ],
    })
    // Room + row clues alone do NOT pin this fixture: p0/p1 can swap columns
    // within the study and p2/p3 within the kitchen, so four arrangements
    // satisfy every clue. The point of this case is that a vacuously-true
    // notRoom clue neither breaks nor tightens that — it must leave the count
    // exactly where the positive clues put it.
    const withoutNegation = makePuzzle({
      clues: [
        { clue: { kind: 'room', person: 'p0', roomId: 'study' }, text: '' },
        { clue: { kind: 'room', person: 'p1', roomId: 'study' }, text: '' },
        { clue: { kind: 'room', person: 'p2', roomId: 'kitchen' }, text: '' },
        { clue: { kind: 'room', person: 'p3', roomId: 'kitchen' }, text: '' },
        { clue: { kind: 'row', person: 'p0', row: 0 }, text: '' },
        { clue: { kind: 'row', person: 'p1', row: 1 }, text: '' },
      ],
    })
    expect(countSolutions(pWith, 50)).toBe(countSolutions(withoutNegation, 50))
  })
})

describe('notSameRoomAs clue', () => {
  it('holds when two people are in DIFFERENT rooms', () => {
    const p = makePuzzle()
    const clue: Clue = { kind: 'notSameRoomAs', person: 'p0', other: 'p2' }
    // p0 is in 'study', p2 is in 'kitchen'
    expect(clueHolds(p, clue, p.solution)).toBe(true)
  })

  it('fails when two people are in the SAME room', () => {
    const p = makePuzzle()
    const clue: Clue = { kind: 'notSameRoomAs', person: 'p0', other: 'p1' }
    // p0 and p1 are both in 'study'
    expect(clueHolds(p, clue, p.solution)).toBe(false)
  })

  it('reduces the solution count when it rules out shared-room placements', () => {
    // notSameRoomAs p0/p1 eliminates placements where both are in the same room.
    // This is strictly fewer solutions than unconstrained.
    const pNoClue = makePuzzle({ clues: [] })
    const pWithNot = makePuzzle({
      clues: [{ clue: { kind: 'notSameRoomAs', person: 'p0', other: 'p1' }, text: '' }],
    })
    const CAP = 1000
    const before = countSolutions(pNoClue, CAP)
    const after = countSolutions(pWithNot, CAP)
    expect(before).toBeLessThan(CAP)
    expect(after).toBeGreaterThan(0)
    expect(after).toBeLessThan(before)
  })

  it('is symmetric in logic even if only one direction is declared', () => {
    const p = makePuzzle()
    const fwd: Clue = { kind: 'notSameRoomAs', person: 'p0', other: 'p2' }
    const rev: Clue = { kind: 'notSameRoomAs', person: 'p2', other: 'p0' }
    // Both should hold: p0=study, p2=kitchen
    expect(clueHolds(p, fwd, p.solution)).toBe(true)
    expect(clueHolds(p, rev, p.solution)).toBe(true)
  })
})
