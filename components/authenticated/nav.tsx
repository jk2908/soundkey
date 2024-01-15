import { auth } from '@/lib/auth'
import { authRoutes, protectedRoutes } from '@/lib/routes'
import type { Route } from '@/lib/types'

import { NavLink } from '@/components/authenticated/nav-link'

export async function Nav() {
  const user = await auth()

  const routes: Route[] = [
    ...authRoutes,
    ...protectedRoutes.map(route => ({ ...route, isProtected: user?.role !== 'admin' })),
  ]

  return (
    <nav>
      <ul className="flex flex-col gap-1">
        {routes.map(({ href, label, isProtected = false }) => (
          <li key={href}>
            {!isProtected && (
              <NavLink
                href={href}
                className="hover:bg-keyline/40 transition-bg block w-full rounded-e-full px-4 py-3 font-mono lowercase">
                {label}
              </NavLink>
            )}
          </li>
        ))}
      </ul>
    </nav>
  )
}
