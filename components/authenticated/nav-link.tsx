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
  className?: string
}) {
  const pathname = usePathname()

  return (
    <Link href={href} aria-current={pathname === href ? 'page' : false} className={cn(className)}>
      {children}
    </Link>
  )
}
