'use client'

import { useMounted } from '@/hooks/use-mounted'
import { useTheme } from '@/hooks/use-theme'

import { Icon } from '@/components/global/icon'
import { Spinner } from '@/components/global/spinner'

export function ThemeToggle() {
  const { theme, altTheme, toggle } = useTheme()
  const isMounted = useMounted()

  return (
    <>
      {!isMounted ? (
        <Spinner />
      ) : (
        <button onClick={toggle} style={{ borderRadius: '50%' }}>
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
