import { useEffect } from 'react'
import selectors from 'focusable-selectors'

type Config = {
  allowArrowKeys?: boolean
}

export function useFocusTrap(
  onState: boolean,
  node: HTMLElement | null,
  { allowArrowKeys = false }: Config = {}
) {
  useEffect(() => {
    if (!onState) return

    const focusableNodes = node?.querySelectorAll(selectors.join(','))

    if (!focusableNodes) return

    const first = focusableNodes[0] as HTMLElement
    const last = focusableNodes[focusableNodes.length - 1] as HTMLElement

    function handler(e: KeyboardEvent) {
      const keys = ['Tab', 'ArrowUp', 'ArrowDown']
      const active = document.activeElement as HTMLElement
      const previous = active.previousElementSibling as HTMLElement
      const next = active.nextElementSibling as HTMLElement

      if (!keys.includes(e.key)) return

      if ((active === first && e.shiftKey) || (active === last && !e.shiftKey)) {
        e.preventDefault()
      }

      switch (e.key) {
        case 'Tab':
          if (e.shiftKey) {
            if (document.activeElement === first) {
              last.focus()
            }
          } else {
            if (document.activeElement === last) {
              first.focus()
            }
          }
          break
        case 'ArrowUp':
          if (allowArrowKeys) {
            if (document.activeElement === first) {
              last.focus()
            } else {
              previous.focus()
            }
          }
          break
        case 'ArrowDown':
          if (allowArrowKeys) {
            if (document.activeElement === last) {
              first.focus()
            } else {
              next.focus()
            }
          }
          break
      }
    }

    node?.addEventListener('keydown', handler)

    return () => {
      node?.removeEventListener('keydown', handler)
    }
  }, [node, onState, allowArrowKeys])
}
