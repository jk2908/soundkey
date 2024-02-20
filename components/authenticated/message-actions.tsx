'use client'

import { useEffect, useId, useRef } from 'react'
import Link from 'next/link'

import { NavLink } from '@/components/global/nav-link'

export function MessageActions() {
  const items = [
    { href: '/messages', label: 'Threads' },
    { href: '/messages/new', label: 'New' },
  ]

  return (
    <div role="menubar" className="rounded-tab-group flex text-sm">
      {items.map(({ href, label }) => (
        <NavLink
          key={href}
          href={href}
          className="text-center hover:bg-keyline/40 [&.active]:bg-keyline/25"
          exact
          visualOnly>
          {label}
        </NavLink>
      ))}
    </div>
  )
}
