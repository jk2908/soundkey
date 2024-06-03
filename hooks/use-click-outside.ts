import { useEffect } from 'react'

type ClickOutsideProps = {
  when?: boolean
}

export function useClickOutside(
  ref: React.RefObject<HTMLElement> | React.RefObject<HTMLElement>[],
  onClick: () => void,
  config?: ClickOutsideProps
) {
  const { when } = config || {}

  useEffect(() => {
    if (when === false) return

    function handler(e: Event) {
      const target = e.target as HTMLElement
      const refs = Array.isArray(ref) ? ref : [ref]

      if (!refs.some(r => r.current?.contains(target) || target === r.current)) {
        onClick?.()
      }
    }

    document.addEventListener('click', handler)

    return () => {
      document.removeEventListener('click', handler)
    }
  }, [ref, onClick, when])
}
