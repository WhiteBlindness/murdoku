import { useCallback, useEffect, useState } from 'react'

/* ----------------------------------------------------------------------------
   Theme registry. Add a new theme here + a matching `:root.theme-<id>` block in
   src/styles/theme.css and it appears in the cycle — no other code changes.
---------------------------------------------------------------------------- */
export interface ThemeDef {
  id: string
  label: string
}

export const THEMES: ThemeDef[] = [
  { id: 'dark', label: 'Dark' },
  { id: 'light', label: 'Light' },
]

const STORAGE_KEY = 'murdoku_theme'
type ThemeChoice = string | 'system'

function readStored(): ThemeChoice {
  try {
    const t = localStorage.getItem(STORAGE_KEY)
    if (t && THEMES.some(x => x.id === t)) return t
  } catch {}
  return 'system'
}

function systemPrefersLight(): boolean {
  return typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-color-scheme: light)').matches
}

/** Resolve the concrete theme id currently in effect. */
function resolve(choice: ThemeChoice): string {
  if (choice === 'system') return systemPrefersLight() ? 'light' : 'dark'
  return choice
}

function applyClass(choice: ThemeChoice) {
  const root = document.documentElement
  THEMES.forEach(t => root.classList.remove(`theme-${t.id}`))
  // Only add an explicit class when the user picked one; 'system' relies on the
  // CSS media query so it needs no class (and keeps SSR/no-JS correct).
  if (choice !== 'system') root.classList.add(`theme-${choice}`)
}

export function useTheme() {
  const [choice, setChoice] = useState<ThemeChoice>(readStored)

  // Keep in sync if the OS theme flips while on 'system'.
  const [resolved, setResolved] = useState<string>(() => resolve(readStored()))
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: light)')
    const onChange = () => choice === 'system' && setResolved(resolve('system'))
    mq.addEventListener?.('change', onChange)
    return () => mq.removeEventListener?.('change', onChange)
  }, [choice])

  useEffect(() => {
    applyClass(choice)
    setResolved(resolve(choice))
    try {
      if (choice === 'system') localStorage.removeItem(STORAGE_KEY)
      else localStorage.setItem(STORAGE_KEY, choice)
    } catch {}
  }, [choice])

  /** Cycle Dark -> Light (respecting current resolved state). */
  const toggle = useCallback(() => {
    setChoice(prev => (resolve(prev) === 'dark' ? 'light' : 'dark'))
  }, [])

  const setTheme = useCallback((id: ThemeChoice) => setChoice(id), [])

  return { choice, resolved, toggle, setTheme }
}
