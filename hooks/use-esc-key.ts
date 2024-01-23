import { useEffect } from 'react'

export function useEscKey(onKeyDown: (e: KeyboardEvent) => void, on: boolean) {
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key !== 'Escape' || !on) return

      onKeyDown(e)
    }

    window.addEventListener('keydown', handler as EventListenerOrEventListenerObject)

    return () => {
      window.removeEventListener('keydown', handler as EventListenerOrEventListenerObject)
    }
  }, [onKeyDown, on])
}
