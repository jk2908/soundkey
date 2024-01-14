import { useEffect, useRef } from 'react'

export function useClickOutside<T extends HTMLElement>(onClick: () => void) {
  const ref = useRef<T>(null)

  useEffect(() => {
    function handler(e: Event) {
      const target = e.target as HTMLElement

      if (target !== ref.current && !ref.current?.contains(target)) {
        onClick?.()
      }
    }

    document.addEventListener('click', handler)

    return () => {
      document.removeEventListener('click', handler)
    }
  }, [onClick])

  return ref
}
