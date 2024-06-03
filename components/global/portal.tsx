'use client'

import { createPortal } from 'react-dom'

import { useMounted } from '#/hooks/use-mounted'

export function Portal({
  children,
  when = true,
  target,
}: {
  children: React.ReactNode
  when?: boolean
  target?: Element | DocumentFragment | null
}) {  
  const isMounted = useMounted()

  if (!when) return children
  if (!isMounted) return null

  return createPortal(children, target || document.getElementById('portal')!)
}
