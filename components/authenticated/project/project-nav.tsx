import type { Icon as IconType } from '@/components/global/icon'
import { Icon } from '@/components/global/icon'
import { NavLink } from '@/components/global/nav-link'

type ProjectNavItem = {
  href: string
  label: string
  icon?: IconType
}

export function ProjectNav() {
  const items: ProjectNavItem[] = [
    { href: '/projects', label: 'Projects', icon: 'folder-heart' },
    { href: '/projects/new', label: 'New', icon: 'folder-+' },
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
