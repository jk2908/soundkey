import { useEffect, useRef } from 'react'

export function useMutationObserver(
  ref: React.RefObject<HTMLElement>,
  onMutation: MutationCallback,
  config?: MutationObserverInit
) {
  const ob = useRef<MutationObserver | null>(null)

  useEffect(() => {
    const el = ref.current

    if (!el) return

    ob.current = new MutationObserver(onMutation)
    ob.current.observe(el, config)

    return () => {
      ob.current?.disconnect()
      ob.current = null
    }
  }, [ref, onMutation, config])
}
