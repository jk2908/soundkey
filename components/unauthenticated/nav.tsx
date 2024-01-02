import Link from 'next/link'

import type { Route } from '@/lib/types'

export function Nav() {
  const routes: Route[] = [
    {
      label: 'Home',
      href: '/',
    },
    {
      label: 'Login',
      href: '/login',
    },
    {
      label: 'Signup',
      href: '/signup',
    },
  ]

  return (
    <nav>
      <ul className="flex items-center gap-12">
        {routes.map(({ label, href }) => (
          <Link key={href} href={href}>
            {label}
          </Link>
        ))}
      </ul>
    </nav>
  )
}
