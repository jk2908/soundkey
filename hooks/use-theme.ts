import { ThemeContext } from '@/ctx/theme'
import { use } from 'react'

export function useTheme() {
  const { theme, setTheme } = use(ThemeContext)
  const altTheme = theme === 'light' ? 'dark' : 'light'

  function toggleTheme() {
    setTheme(altTheme)
  }

  return { theme, altTheme, toggleTheme }
}