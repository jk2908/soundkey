import type { Icon as IconType } from '@/lib/types'

import { Icon } from '@/components/global/icon'
import { NavLink } from '@/components/global/nav-link'

type MessageAction = {
  href: string
  label: string
  icon?: IconType
}

export function MessageActions() {
  const items: MessageAction[] = [
    { href: '/messages', label: 'Threads', icon: 'mails' },
    { href: '/messages/new', label: 'New', icon: 'mail+' },
  ]

  return (
    <div role="menubar" className="rounded-tab-group flex max-w-128 text-sm">
      {items.map(({ href, label, icon }) => (
        <NavLink
          key={href}
          href={href}
          className="text-center hover:bg-keyline/40 [&.active]:bg-keyline/25 items-center justify-center gap-4 flex"
          exact
          visualOnly>
          {icon && <Icon name={icon} size={16} />}

          {label}
        </NavLink>
      ))}
    </div>
  )
}
