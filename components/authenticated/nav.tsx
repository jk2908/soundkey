import { authRoutes } from '@/lib/routes'

import { SidebarLink } from '@/components/authenticated/sidebar-link'

export function Nav() {
  return (
    <nav>
      <ul className="flex flex-col gap-1">
        {authRoutes.map(({ href, label }) => (
          <li key={href}>
            <SidebarLink
              href={href}
              className="block w-full rounded-e-full text-sm tracking-wider px-4 py-3 font-mono lowercase hover:bg-keyline/40 [&.active]:bg-keyline/30"
              visualOnly>
              {label}
            </SidebarLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
