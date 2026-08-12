import { act, renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { IN_PROGRESS_KEY, LEGACY_IN_PROGRESS_KEY } from '../src/core/ux'
import { useGame } from '../src/hooks/useGame'

describe('useGame resume persistence', () => {
  it('removes current and compatibility resume keys after clearing the board', async () => {
    const { result } = renderHook(() => useGame())

    act(() => result.current.start('very-easy-1', 'classic'))
    act(() => result.current.clickCell(0, 0))

    await waitFor(() => {
      expect(localStorage.getItem(IN_PROGRESS_KEY)).not.toBeNull()
      expect(localStorage.getItem(LEGACY_IN_PROGRESS_KEY)).not.toBeNull()
    })

    act(() => result.current.clearAll())

    await waitFor(() => {
      expect(localStorage.getItem(IN_PROGRESS_KEY)).toBeNull()
      expect(localStorage.getItem(LEGACY_IN_PROGRESS_KEY)).toBeNull()
    })

    act(() => result.current.navigate('home'))
    expect(result.current.inProgress).toBeNull()
  })
})
