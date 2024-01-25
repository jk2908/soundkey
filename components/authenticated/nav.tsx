import { Suspense } from 'react'

import { auth } from '@/lib/auth'
import { authRoutes, protectedRoutes } from '@/lib/routes'
import type { Route } from '@/lib/types'

import { LoadingSpinner } from '@/components/global/loading-spinner'
import { NavLink } from '@/components/global/nav-link'

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
          <Suspense key={href} fallback={<LoadingSpinner />}>
            <li>
              {!isProtected && (
                <NavLink
                  href={href}
                  className="block w-full rounded-e-full px-4 py-3 font-mono lowercase transition-bg hover:bg-keyline/40">
                  {label}
                </NavLink>
              )}
            </li>
          </Suspense>
        ))}
      </ul>
    </nav>
  )
}
