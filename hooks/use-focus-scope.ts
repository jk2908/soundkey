import { on } from 'events'
import { useEffect } from 'react'
import focusableSelectors from 'focusable-selectors'

import { isVisible } from '@/utils/is-visible'

type FocusScopeConfig = {
  state?: boolean
  roving?: boolean
  orientation?: 'horizontal' | 'vertical'
  loop?: boolean
  onTabFocusOut?: () => void
}

export function useFocusScope(ref: React.RefObject<HTMLElement>, config?: FocusScopeConfig) {
  const {
    state,
    roving = false,
    orientation = 'vertical',
    loop = true,
    onTabFocusOut,
  } = config || {}
  let nodes: HTMLElement[] = []

  useEffect(() => {
    const node = ref.current

    if (!node) return

    const getNodes = () =>
      (Array.from(node.querySelectorAll(focusableSelectors.join(', '))) as HTMLElement[]).filter(
        isVisible
      )

    // eslint-disable-next-line react-hooks/exhaustive-deps
    if (!nodes.length) nodes = getNodes()

    const reset = (exclude?: HTMLElement) => {
      nodes.forEach(node => {
        if (node !== exclude) {
          node.setAttribute('tabindex', '-1')
        }
      })
    }

    const first = nodes[0]
    const last = nodes[nodes.length - 1]

    if (roving) {
      first?.setAttribute('tabindex', '0')
      reset(first)
    }

    if (state === false) return
    if (state) first?.focus()

    function handler(e: KeyboardEvent) {
      const rovingKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End']
      const allKeys = ['Tab', ...rovingKeys]

      if (!allKeys.includes(e.key)) return

      e.stopPropagation()

      const active = document.activeElement as HTMLElement
      const prev =
        nodes.indexOf(active) - 1 >= 0
          ? nodes[nodes.indexOf(active as HTMLElement) - 1]
          : loop
            ? last
            : active
      const next =
        nodes.indexOf(active) + 1 < nodes.length
          ? nodes[nodes.indexOf(active as HTMLElement) + 1]
          : loop
            ? first
            : active

      switch (true) {
        case orientation === 'vertical' && roving:
          if (e.key === 'ArrowUp') {
            prev?.setAttribute('tabindex', '0')
            prev?.focus()
            reset(prev)
          } else if (e.key === 'ArrowDown') {
            next?.setAttribute('tabindex', '0')
            next?.focus()
            reset(next)
          } else if (e.key === 'Tab') {
            onTabFocusOut?.()
          }
          break
        case orientation === 'horizontal' && roving:
          if (e.key === 'ArrowLeft') {
            prev?.setAttribute('tabindex', '0')
            prev?.focus()
            reset(prev)
          } else if (e.key === 'ArrowRight') {
            next?.setAttribute('tabindex', '0')
            next?.focus()
            reset(next)
          } else if (e.key === 'Tab') {
            onTabFocusOut?.()
          }
          break
        case e.key === 'Tab' && roving !== true:
          e.preventDefault()
          e.shiftKey ? prev?.focus() : next?.focus()
          break
        default:
          return
      }
    }

    node.addEventListener('keydown', handler)

    return () => {
      node.removeEventListener('keydown', handler)
    }
  }, [state, ref, roving, orientation, loop])
}
