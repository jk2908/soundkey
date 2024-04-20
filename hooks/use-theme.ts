import { use } from 'react'
import { ThemeContext } from '@/ctx/theme'

export function useTheme() {
  const { theme, setTheme } = use(ThemeContext)
  const altTheme = theme === 'light' ? 'dark' : 'light'
  const toggle = () => setTheme(altTheme)

  return { theme, setTheme, altTheme, toggle }
}
