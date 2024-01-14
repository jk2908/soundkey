'use client'

import { useTheme } from '@/hooks/use-theme'

export function SettingsForm() {
  const { toggleTheme } = useTheme()

  return <button onClick={toggleTheme}>Toggle Theme</button>
}