'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { cn } from '@/utils/cn'

export function NavLink({
  children,
  href,
  className,
  exact,
  visualOnly,
}: {
  children: React.ReactNode
  href: string
  className?: string
  exact?: boolean
  visualOnly?: boolean
} & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const pathname = usePathname()
  const isMatching = pathname === href || (!exact && (pathname.startsWith(href) && href !== '/'))

  return (
    <Link
      href={href}
      aria-current={!visualOnly ? (isMatching ? 'page' : false) : undefined}
      className={cn(
        'relative',
        visualOnly ? (isMatching ? 'active' : 'inactive') : undefined,
        className
      )}>
      {children}
    </Link>
  )
}
