'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { cn } from '#/utils/cn'

export type Props = {
  children: React.ReactNode
  href: string
  className?: string
  exact?: boolean
  visualOnly?: boolean
  match?: string[]
} & React.ComponentProps<typeof Link>

export function NavLink({ children, href, className, exact, visualOnly, match, ...rest }: Props) {
  const pathname = usePathname()
  const isMatching =
    pathname === href ||
    (!exact && pathname.startsWith(href) && href !== '/') ||
    match?.some(m =>
      m.includes('*') ? pathname.startsWith(m.slice(0, m.indexOf('*'))) : m === pathname
    )

  return (
    <Link
      href={href}
      aria-current={!visualOnly ? (isMatching ? 'page' : false) : undefined}
      className={cn('relative', isMatching ? 'active' : 'inactive', className)}
      {...rest}>
      {children}
    </Link>
  )
}
