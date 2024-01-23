'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { cn } from '@/utils/cn'

export function NavLink({
  children,
  href,
  className,
}: {
  children: React.ReactNode
  href: string
  isNew?: boolean
  className?: string
}) {
  const pathname = usePathname()

  return (
    <Link
      href={href}
      aria-current={pathname === href ? 'page' : false}
      className={cn('relative', className)}>
      {children}
    </Link>
  )
}
