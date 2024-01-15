import { useEffect } from 'react'
import selectors from 'focusable-selectors'

type Config = {
  allowArrowKeys?: boolean
}

export function useFocusTrap(
  node: HTMLElement | null,
  on: boolean,
  { allowArrowKeys = false }: Config = {}
) {
  useEffect(() => {
    if (!on) return

    const focusableNodes = node?.querySelectorAll(selectors.join(','))

    if (!focusableNodes) return

    const firstNode = focusableNodes[0] as HTMLElement
    const lastNode = focusableNodes[focusableNodes.length - 1] as HTMLElement

    function handler(e: KeyboardEvent) {
      const keys = ['Tab', 'ArrowUp', 'ArrowDown']
      const activeNode = document.activeElement as HTMLElement
      const previousNode = activeNode.previousElementSibling as HTMLElement
      const nextNode = activeNode.nextElementSibling as HTMLElement

      if (!keys.includes(e.key)) return

      if ((activeNode === firstNode && e.shiftKey) || (activeNode === lastNode && !e.shiftKey)) {
        e.preventDefault()
      }

      switch (e.key) {
        case 'Tab':
          if (e.shiftKey) {
            if (document.activeElement === firstNode) {
              lastNode.focus()
            }
          } else {
            if (document.activeElement === lastNode) {
              firstNode.focus()
            }
          }
          break
        case 'ArrowUp':
          if (allowArrowKeys) {
            if (document.activeElement === firstNode) {
              lastNode.focus()
            } else {
              previousNode.focus()
            }
          }
          break
        case 'ArrowDown':
          if (allowArrowKeys) {
            if (document.activeElement === lastNode) {
              firstNode.focus()
            } else {
              nextNode.focus()
            }
          }
          break
      }
    }

    node?.addEventListener('keydown', handler)

    return () => {
      node?.removeEventListener('keydown', handler)
    }
  }, [node, on, allowArrowKeys])
}
