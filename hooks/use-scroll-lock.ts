import { useEffect } from 'react'

export function useScrollLock(
  when: boolean,
  el?: string | React.RefObject<HTMLElement> | HTMLElement
) {
  useEffect(() => {
    const target =
      (el &&
        (el instanceof HTMLElement
          ? el
          : typeof el === 'string'
            ? (document.querySelector(el) as HTMLElement)
            : el.current)) ||
      document.body
    const originalStyle = getComputedStyle(target).overflow

    if (when) {
      target.style.overflow = 'hidden'
    }

    return () => {
      target.style.overflow = originalStyle
    }
  }, [when, el])
}
