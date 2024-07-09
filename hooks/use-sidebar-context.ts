import { use } from 'react'

import { SidebarContext } from '#/components/authenticated/sidebar'

export function useSidebarContext() {
  return use(SidebarContext)
}
