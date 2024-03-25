'use client'

import { useMounted } from '@/hooks/use-mounted'

export function ClientOnly({ children }: { children: React.ReactNode }) {
  const mounted = useMounted()

  return mounted ? <>{children}</> : null
}
