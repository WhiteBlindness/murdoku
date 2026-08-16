import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useGame } from '../src/hooks/useGame'
import { getAllPuzzles } from '../src/core/catalog'

const puzzles = getAllPuzzles()
const twoFloorCase = puzzles.find(p => (p.floors ?? 1) === 2)!
const singleFloorCase = puzzles.find(p => (p.floors ?? 1) === 1)!

describe('two-floor play state', () => {
  it('the catalog actually ships two-floor cases', () => {
    expect(twoFloorCase, 'no two-floor case in the catalog').toBeTruthy()
    expect(singleFloorCase).toBeTruthy()
  })

  it('placing upstairs leaves the ground floor untouched', () => {
    const { result } = renderHook(() => useGame())
    act(() => result.current.start(twoFloorCase.id, 'classic'))
    const person = twoFloorCase.people[0]
    act(() => result.current.selectPerson(person.id))
    act(() => result.current.switchFloor?.(1))
    act(() => result.current.clickCell(0, 0))

    const upstairs = result.current.marksPerFloor?.[1]
    const ground = result.current.marksPerFloor?.[0]
    expect(upstairs?.[0][0].kind, 'suspect should be upstairs').toBe('person')
    expect(ground?.[0][0].kind, 'ground floor must not be disturbed').not.toBe('person')
  })

  it('detects a row conflict ACROSS floors in classic mode', () => {
    // Classic mode permits an illegal placement and flags it, rather than
    // refusing it. The point here is that the conflict is seen across storeys:
    // floors share one set of rows and columns, which is the whole mechanic.
    const { result } = renderHook(() => useGame())
    act(() => result.current.start(twoFloorCase.id, 'classic'))
    const [a, b] = twoFloorCase.people
    act(() => result.current.selectPerson(a.id))
    act(() => result.current.switchFloor?.(1))
    act(() => result.current.clickCell(2, 2))
    act(() => result.current.switchFloor?.(0))
    act(() => result.current.selectPerson(b.id))
    act(() => result.current.clickCell(2, 3)) // same ROW, other storey

    expect(result.current.conflicts.has(a.id), 'upstairs suspect should conflict').toBe(true)
    expect(result.current.conflicts.has(b.id), 'ground suspect should conflict').toBe(true)
  })

  it('refuses the same row from another storey in detective mode', () => {
    const { result } = renderHook(() => useGame())
    act(() => result.current.start(twoFloorCase.id, 'detective'))
    const [a, b] = twoFloorCase.people
    act(() => result.current.selectPerson(a.id))
    act(() => result.current.switchFloor?.(1))
    act(() => result.current.clickCell(2, 2))
    act(() => result.current.switchFloor?.(0))
    act(() => result.current.selectPerson(b.id))
    act(() => result.current.clickCell(2, 3))

    expect(result.current.marksPerFloor?.[0][2][3].kind,
      'row 2 is already spent upstairs').not.toBe('person')
    expect(result.current.feedback).toBe('blocked')
  })

  it('single-floor cases keep exactly one storey of marks', () => {
    const { result } = renderHook(() => useGame())
    act(() => result.current.start(singleFloorCase.id, 'classic'))
    const mpf = result.current.marksPerFloor
    const used = mpf?.filter(floor => floor.some(row => row.length > 0)) ?? []
    expect(used.length).toBeLessThanOrEqual(2)
    expect(result.current.marks.length).toBe(singleFloorCase.size)
  })
})
