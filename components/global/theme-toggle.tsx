'use client'

import { useContext } from 'react'
import { ThemeContext } from '@/context/theme'

import { Button } from '@/components/global/button'
import { Icon } from '@/components/global/icon'

export function ThemeToggle() {
  const { theme, setTheme } = useContext(ThemeContext)
  const altTheme = theme === 'light' ? 'dark' : 'light'

  return (
    <button onClick={() => setTheme(altTheme)}>
      <span className="sr-only">Switch to {altTheme} theme</span>
      <Icon
        name={theme === 'light' ? 'moon' : 'sun'}
        width={20}
        height={20}
        title={`Switch to ${altTheme} theme`}
      />
    </button>
  )
}
