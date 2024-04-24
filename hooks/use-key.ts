import { useEffect } from 'react'

type KeyConfig = {
  when?: boolean
}

export function useKey(key: string, onKeyDown: (e: KeyboardEvent) => void, config?: KeyConfig, ) {
  const { when } = config || {}

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key !== key || when === false) return

      onKeyDown(e)
    }

    addEventListener('keydown', handler as EventListenerOrEventListenerObject)

    return () => {
      removeEventListener('keydown', handler as EventListenerOrEventListenerObject)
    }
  }, [key, onKeyDown, when])
}
