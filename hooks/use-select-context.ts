import { use } from 'react'

import { SelectContext, type SelectProvider } from '#/components/global/select'

export function useSelectContext({
  isUnsafe = false,
}: { isUnsafe?: boolean } = {}) {
  const ctx = use(SelectContext)

  if (!ctx && !isUnsafe) {
    throw new Error('useSelectContext must be used within a SelectContext.Provider')
  }

  return ctx as SelectProvider
}
