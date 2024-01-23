'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

import { useClickOutside } from '@/hooks/use-click-outside'
import { useEscKey } from '@/hooks/use-esc-key'
import { useFocusTrap } from '@/hooks/use-focus-trap'
import { useMediaQuery } from '@/hooks/use-media-query'
import { breakpoints } from '@/utils/breakpoints'
import { cn } from '@/utils/cn'

import { LogoutButton } from '@/components/authenticated/logout-button'
import { HorizontalRule } from '@/components/global/horizontal-rule'
import { Icon } from '@/components/global/icon'
import { Logo } from '@/components/global/logo'
import { Section } from '@/components/global/section'

export function Sidebar({ children }: { children: React.ReactNode }) {
  const [isOpen, setOpen] = useState(false)
  const mq = useMediaQuery(`(min-width: ${breakpoints.md})`)
  const ref = useClickOutside<HTMLDivElement>(() => !mq && setOpen(false))

  useEffect(() => {
    setOpen(mq ? true : false)
  }, [mq])

  useFocusTrap(ref.current, isOpen)
  useEscKey(() => !mq && setOpen(false), isOpen)

  return (
    <>
      {!mq && (
        <button onClick={() => setOpen(!isOpen)} className="fixed bottom-8 right-8">
          Toggle
        </button>
      )}
      <Section
        ref={ref}
        size="lg"
        className={cn(
          'flex h-screen w-56 shrink-0 flex-col rounded-e-3xl border border-keyline bg-app-bg aria-current:bg-app-bg-inverted',
          !mq && 'fixed inset-0 z-50 transition-transform',
          !isOpen && '-translate-x-full'
        )}>
        <div className="mb-8 px-4">
          <Logo />
        </div>

        {children}

        <div className="mt-auto flex flex-col gap-6 px-4">
          <HorizontalRule />

          <div className="flex gap-4">
            <LogoutButton />

            <Link href="/profile">
              <Icon name="user" size={20} title="Profile" />
              <span className="sr-only">Profile</span>
            </Link>
          </div>
        </div>
      </Section>
    </>
  )
}
