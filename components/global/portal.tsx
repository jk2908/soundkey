'use client'

import { createPortal } from 'react-dom'

import { useMounted } from '@/hooks/use-mounted'

export function Portal({
  children,
  target,
}: {
  children: React.ReactNode
  target?: Element | DocumentFragment | null
}) {
  const mounted = useMounted()

  if (!mounted) return null

  return createPortal(children, target || document.getElementById('portal')!)
}
