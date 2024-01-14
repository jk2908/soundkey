import { useEffect } from 'react'

export function useEscKey(fn: (e: KeyboardEvent) => void) {
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key !== 'Escape') return

      fn(e)
    }

    window.addEventListener('keydown', handler as EventListenerOrEventListenerObject)

    return () => {
      window.removeEventListener('keydown', handler as EventListenerOrEventListenerObject)
    }
  }, [fn])
}
