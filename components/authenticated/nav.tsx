'use client'

import { usePathname } from 'next/navigation'

import { authRoutes } from '#/lib/routes'

import { NavLink } from '#/components/global/nav-link'
import { AnimateHeight } from '#/components/global/animate-height'
import { Icon } from '#/components/global/icon'

export function Nav() {
  const pathname = usePathname()

  return (
    <nav className="mb-12">
      <ul className="flex flex-col gap-1">
        {authRoutes.map(({ href, label, subRoutes }) => {
          const isWithinRouteGroup = pathname.startsWith(href)

          return (
            <li key={href}>
              <NavLink
                href={href}
                className="flex w-full items-center justify-between rounded-e-full px-4 py-3 font-mono text-sm lowercase tracking-wider hover:bg-keyline/40 border border-transparent hover:border-keyline [&.active]:border [&.active]:border-keyline [&.active]:bg-keyline/30"
                visualOnly>
                {label}

                {subRoutes && <Icon name={isWithinRouteGroup ? 'minus' : 'plus'} size={12} />}
              </NavLink>

              <AnimateHeight className="pointer-events-auto">
                {subRoutes && isWithinRouteGroup && (
                  <ul className="flex flex-col">
                    {subRoutes.map(({ href, label, match, icon }) => (
                      <li key={href}>
                        <NavLink
                          href={href}
                          className="group my-[-1px] block w-full rounded-e-full px-4 py-3 text-sm font-medium tracking-wider [&.active]:bg-keyline/15 [&.active]:border [&.active]:border-keyline/75"
                          match={match}
                          visualOnly
                          exact>
                          <span className="flex items-center gap-3 transition-transform group-[:not(.active)]:hover:translate-x-1">
                            {icon && <Icon name={icon} size={16} />}

                            {label}
                          </span>
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                )}
              </AnimateHeight>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
