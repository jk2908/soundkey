import { Suspense } from 'react'

import { auth } from '@/lib/auth'
import { authRoutes } from '@/lib/routes'
import type { Route } from '@/lib/types'

import { LoadingSpinner } from '@/components/global/loading-spinner'
import { NavLink } from '@/components/global/nav-link'

export async function Nav() {
  return (
    <nav>
      <ul className="flex flex-col gap-1">
        {authRoutes.map(({ href, label }) => (
          <Suspense key={href} fallback={<LoadingSpinner />}>
            <li>
              <NavLink
                href={href}
                className="block w-full rounded-e-full px-4 py-3 font-mono lowercase transition-bg hover:bg-keyline/40 [&.active]:bg-keyline/25"
                visualOnly>
                {label}
              </NavLink>
            </li>
          </Suspense>
        ))}
      </ul>
    </nav>
  )
}
