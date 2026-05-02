import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { THEMES, type TokenSet, type ThemeMode } from './theme'

interface ThemeCtx {
  mode: ThemeMode
  t: TokenSet
  toggle: () => void
}

const Ctx = createContext<ThemeCtx>({
  mode: 'light',
  t: THEMES.light,
  toggle: () => {},
})

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(() => {
    return (localStorage.getItem('hrn-theme') as ThemeMode) || 'light'
  })

  const toggle = () => setMode(m => {
    const next = m === 'light' ? 'dark' : 'light'
    localStorage.setItem('hrn-theme', next)
    return next
  })

  useEffect(() => {
    document.documentElement.style.background = THEMES[mode].bg
    document.documentElement.style.colorScheme = mode
  }, [mode])

  return (
    <Ctx.Provider value={{ mode, t: THEMES[mode], toggle }}>
      {children}
    </Ctx.Provider>
  )
}

export const useTheme = () => useContext(Ctx)
