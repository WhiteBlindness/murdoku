import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { useTheme } from '../src/hooks/useTheme'

describe('useTheme', () => {
  const originalMatchMedia = window.matchMedia

  beforeEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: () => ({ matches: false, addEventListener: () => {}, removeEventListener: () => {} }),
    })
  })

  afterEach(() => {
    document.documentElement.classList.remove('theme-light', 'theme-dark')
    localStorage.removeItem('murdoku_theme')
    if (originalMatchMedia) {
      Object.defineProperty(window, 'matchMedia', { configurable: true, value: originalMatchMedia })
    } else {
      Reflect.deleteProperty(window, 'matchMedia')
    }
  })

  it('restores the chosen theme when a screen tree is remounted', () => {
    const firstView = renderHook(() => useTheme())
    act(() => firstView.result.current.setTheme('light'))

    expect(firstView.result.current.resolved).toBe('light')
    expect(document.documentElement).toHaveClass('theme-light')
    expect(localStorage.getItem('murdoku_theme')).toBe('light')

    firstView.unmount()

    const nextView = renderHook(() => useTheme())
    expect(nextView.result.current.resolved).toBe('light')
    expect(document.documentElement).toHaveClass('theme-light')

    act(() => nextView.result.current.toggle())
    expect(nextView.result.current.resolved).toBe('dark')
    expect(document.documentElement).toHaveClass('theme-dark')
    expect(localStorage.getItem('murdoku_theme')).toBe('dark')
  })
})
