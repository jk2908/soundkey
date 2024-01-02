import { useContext } from 'react'
import { ThemeContext } from '@/context/theme'

export function useTheme() {
  const { theme, setTheme } = useContext(ThemeContext)
  const altTheme = theme === 'light' ? 'dark' : 'light'

  function toggleTheme() {
    setTheme(altTheme)
  }

  return { theme, altTheme, toggleTheme }
}