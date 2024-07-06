'use client'

import { startTransition, useCallback } from 'react'
import { useRouter } from 'next/navigation'

import { NavLink, type Props as NavLinkProps } from '#/components/global/nav-link'
import { useSidebarContext } from '#/hooks/use-sidebar-context'

// https://github.com/shuding/next-view-transitions/blob/main/src/link.tsx

export function SidebarLink(props: NavLinkProps) {
  const { children, onClick: prevOnClick, ...rest } = props
  const { isOpen, setOpen } = useSidebarContext()
  const router = useRouter()

  const onClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      const { href, as, replace, scroll } = rest

      if (prevOnClick) prevOnClick(e)

      e.preventDefault()

      startTransition(() => {
        router[replace ? 'replace' : 'push'](as?.toString() || href, {
          scroll: scroll ?? true,
        })
      })

      if (isOpen) setOpen(false)
    },
    [rest, router, prevOnClick, isOpen, setOpen]
  )

  return (
    <NavLink onClick={onClick} {...rest}>
      {children}
    </NavLink>
  )
}
