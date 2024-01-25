'use client'

import { useMounted } from '@/hooks/use-mounted'
import { useTheme } from '@/hooks/use-theme'

import { Icon } from '@/components/global/icon'
import { LoadingSpinner } from '@/components/global/loading-spinner'

export function ThemeToggle() {
  const { theme, altTheme, toggleTheme } = useTheme()
  const isMounted = useMounted()

  return (
    <>
      {!isMounted ? (
        <LoadingSpinner />
      ) : (
        <button onClick={toggleTheme} style={{ borderRadius: '50%' }}>
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
