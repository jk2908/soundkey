import { SidebarContext } from '#/components/authenticated/sidebar'
import { use } from 'react'

export function useSidebarContext() {
  return use(SidebarContext)
}