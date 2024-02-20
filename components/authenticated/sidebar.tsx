'use client'

import { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'

import { useClickOutside } from '@/hooks/use-click-outside'
import { useEscKey } from '@/hooks/use-esc-key'
import { useFocusTrap } from '@/hooks/use-focus-trap'
import { useMediaQuery } from '@/hooks/use-media-query'
import { breakpoints } from '@/utils/breakpoints'
import { cn } from '@/utils/cn'

import { LogoutButton } from '@/components/authenticated/logout-button'
import { Button } from '@/components/global/button'
import { HorizontalRule } from '@/components/global/horizontal-rule'
import { Icon } from '@/components/global/icon'
import { LoadingSpinner } from '@/components/global/loading-spinner'
import { Logo } from '@/components/global/logo'
import { Section } from '@/components/global/section'
import { YSpace } from '@/components/global/y-space'

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
        <button
          onClick={() => setOpen(prev => !prev)}
          className="fixed bottom-8 right-8 z-50 md:hidden">
          Toggle
        </button>
      )}

      <Section
        ref={ref}
        size="lg"
        className={cn(
          'h-screen w-56 shrink-0 rounded-e-3xl border border-keyline bg-app-bg aria-current:bg-app-bg-inverted',
          'fixed inset-0 z-40 transition-transform',
          !isOpen && '-translate-x-full',
          'md:static md:translate-x-0'
        )}>
        <YSpace className="flex h-full flex-col">
          <div className="px-4">
            <Logo />
          </div>

          <div className="grow flex flex-col">
            {children}

            <div className="mt-auto flex flex-col gap-6 px-4">
              <HorizontalRule />

              <div className="flex gap-4">
                <Suspense fallback={<LoadingSpinner />}>
                  <LogoutButton iconOnly>
                    <Icon name="logout" size={18} title="Logout" />
                    <span className="sr-only">Log out</span>
                  </LogoutButton>
                </Suspense>

                <Suspense fallback={<LoadingSpinner />}>
                  <Button as={Link} href="/profile" iconOnly>
                    <Icon name="user" size={18} title="Profile" />
                    <span className="sr-only">Profile</span>
                  </Button>
                </Suspense>
              </div>
            </div>
          </div>
        </YSpace>
      </Section>
    </>
  )
}
