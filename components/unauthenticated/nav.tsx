import { NavLink } from '#/components/global/nav-link'
import { unauthRoutes } from '#/lib/routes'

export function Nav() {

  return (
    <nav>
      <ul className="flex items-center gap-8">
        {unauthRoutes.map(({ label, href }) => (
          <NavLink key={href} href={href} className="rounded-full font-medium px-4 py-1 tracking-wide">
            {label}
          </NavLink>
        ))}
      </ul>
    </nav>
  )
}
