import { Collapsible } from '#/components/global/collapsible'
import type { Icon as IconType } from '#/components/global/icon'
import { Icon } from '#/components/global/icon'
import { NavLink } from '#/components/global/nav-link'

type ProjectNavItem = {
  href: string
  label: string
  icon?: IconType
  match?: string[]
}

export function ProjectNav() {
  const items: ProjectNavItem[] = [
    { href: '/projects', label: 'Ongoing', icon: 'folder-heart', match: ['/projects/p/*'] },
    { href: '/projects/create', label: 'Create', icon: 'folder-+' },
    { href: '/projects/search', label: 'Search', icon: 'search' },
    { href: '/projects/archive', label: 'Archive', icon: 'folder-x' },
  ]

  return (
    <Collapsible role="menubar" className="sk-collapsible-rounded-tab-group">
      {items.map(({ href, label, icon, match }) => (
        <NavLink
          key={href}
          href={href}
          role="menuitem"
          className="flex items-center justify-center gap-4 text-center"
          match={match}
          visualOnly
          exact>
          {icon && <Icon name={icon} size={16} />}
          {label}
        </NavLink>
      ))}
    </Collapsible>
  )
}
