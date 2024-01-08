import { useEffect, useRef } from 'react'

export function useClickOutside<T extends HTMLElement>(onClick: () => void) {
  const ref = useRef<T>(null)

  useEffect(() => {
    function handleClick(e: Event) {
      const target = e.target as HTMLElement

      if (target !== ref.current && !ref.current?.contains(target)) {
        onClick?.()
      }
    }

    document.addEventListener('click', handleClick)

    return () => {
      document.removeEventListener('click', handleClick)
    }
  }, [onClick])

  return ref
}
