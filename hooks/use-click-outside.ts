import React, { useEffect } from 'react'

type ClickOutsideProps = {
  when?: boolean
  dblClick?: boolean
}

export function useClickOutside(
  ref: React.RefObject<HTMLElement> | React.RefObject<HTMLElement>[],
  onClick: (e: MouseEvent) => void,
  config?: ClickOutsideProps
) {
  const { when, dblClick } = config || {}
  const eType = dblClick ? 'dblclick' : 'click'

  useEffect(() => {
    if (when === false) return

    function handler(e: MouseEvent) {
      const target = e.target as HTMLElement
      const refs = Array.isArray(ref) ? ref : [ref]

      if (!refs.some(r => r.current?.contains(target) || target === r.current)) {
        onClick?.(e)
      }
    }

    document.addEventListener(eType, handler)

    return () => {
      document.removeEventListener(eType, handler)
    }
  }, [ref, onClick, when, eType])
}
