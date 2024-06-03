import { unauthRoutes } from '#/lib/routes'

import { NavLink } from '#/components/global/nav-link'

export function Nav() {
  return (
    <nav>
      <ul className="flex items-center gap-8">
        {unauthRoutes.map(({ label, href }) => (
          <NavLink
            key={href}
            href={href}
            className="rounded-full px-4 py-1 font-medium tracking-wide">
            {label}
          </NavLink>
        ))}
      </ul>
    </nav>
  )
}
