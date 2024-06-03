import type { Icon as IconType } from '#/components/global/icon'
import { Icon } from '#/components/global/icon'
import { NavLink } from '#/components/global/nav-link'

type ProjectNavItem = {
  href: string
  label: string
  icon?: IconType
}

export function ProjectNav() {
  const items: ProjectNavItem[] = [
    { href: '/projects', label: 'Ongoing', icon: 'folder-heart' },
    { href: '/projects/create', label: 'Create', icon: 'folder-+' },
    { href: '/projects/search', label: 'Search', icon: 'search' },
    { href: '/projects/archive', label: 'Archive', icon: 'folder-x' },
  ]

  return (
    <div role="menubar" className="rounded-tab-group">
      {items.map(({ href, label, icon }) => (
        <NavLink
          key={href}
          href={href}
          role="menuitem"
          className="flex items-center justify-center gap-4 text-center"
          exact
          visualOnly>
          {icon && <Icon name={icon} size={16} />}
          {label}
        </NavLink>
      ))}
    </div>
  )
}
