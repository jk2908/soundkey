import { useEffect } from 'react'

export function useEscKey(onKeyDown: (e?: KeyboardEvent) => void, state?: boolean, ) {
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key !== 'Escape' || state === false) return

      onKeyDown(e)
    }

    window.addEventListener('keydown', handler as EventListenerOrEventListenerObject)

    return () => {
      window.removeEventListener('keydown', handler as EventListenerOrEventListenerObject)
    }
  }, [onKeyDown, state])
}
