'use client'

import { useMounted } from '@/hooks/use-mounted'

import { Icon } from '@/components/global/icon'
import { LoadingSpinner } from '@/components/global/loading-spinner'
import { useTheme } from '@/hooks/use-theme'

export function ThemeToggle() {
  const { theme, altTheme, toggleTheme } = useTheme()
  const mounted = useMounted()

  return (
    <>
      {!mounted ? (
        <LoadingSpinner />
      ) : (
        <button onClick={toggleTheme}>
          <span className="sr-only">Switch to {altTheme} theme</span>
          <Icon
            name={theme === 'light' ? 'moon' : 'sun'}
            width={20}
            height={20}
            title={`Switch to ${altTheme} theme`}
          />
        </button>
      )}
    </>
  )
}
