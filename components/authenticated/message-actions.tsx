'use client'

import { useEffect, useId, useRef } from 'react'
import Link from 'next/link'

export function MessageActions() {
  const items = [
    { href: '/messages', label: 'Inbox' },
    { href: '/messages/new', label: 'New' },
    { href: '/messages/sent', label: 'Sent' },
  ]

  return (
    <div role="menubar" className="rounded-tab-group flex text-sm">
      {items.map(({ href, label }) => (
        <Link key={href} href={href} className="text-center hover:bg-keyline/20">
          {label}
        </Link>
      ))}
    </div>
  )
}
