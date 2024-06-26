'use client'

import React, { createContext, Suspense, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { flushSync } from 'react-dom'

import { useClickOutside } from '#/hooks/use-click-outside'
import { useFocusScope } from '#/hooks/use-focus-scope'
import { useKey } from '#/hooks/use-key'
import { useMediaQuery } from '#/hooks/use-media-query'
import { breakpoints } from '#/utils/breakpoints'
import { cn } from '#/utils/cn'

import { LogoutButton } from '#/components/authenticated/logout-button'
import { Button } from '#/components/global/button'
import { HorizontalRule } from '#/components/global/horizontal-rule'
import { Icon } from '#/components/global/icon'
import { Logo } from '#/components/global/logo'
import { Overlay } from '#/components/global/overlay'
import { Section } from '#/components/global/section'
import { Spinner } from '#/components/global/spinner'
import { YSpace } from '#/components/global/y-space'

export const SidebarContext = createContext<{
  isOpen: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}>({
  isOpen: false,
  setOpen: () => {},
})

export function Sidebar({ children }: { children: React.ReactNode }) {
  const [isOpen, setOpen] = useState(false)
  const mq = useMediaQuery(`(min-width: ${breakpoints.lg})`)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const sidebarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setOpen(mq ? true : false)
  }, [mq])

  const close = (e: React.MouseEvent | KeyboardEvent) => {
    e.stopPropagation()
    e.preventDefault()

    if (e instanceof KeyboardEvent || e.type === 'keydown') {
      flushSync(() => {
        setOpen(false)
      })

      toggleRef.current?.focus()
      return
    }

    setOpen(false)
  }

  useClickOutside([sidebarRef, toggleRef], () => setOpen(false), { when: isOpen && !mq })
  useFocusScope(sidebarRef, { when: isOpen && !mq })

  useKey('Escape', e => close(e), {
    when: isOpen && !mq,
  })

  return (
    <>
      {!mq && (
        <Button
          ref={toggleRef}
          onClick={(e: React.SyntheticEvent) => {
            e.stopPropagation()
            setOpen(prev => !prev)
          }}
          className="fixed bottom-8 right-8 z-50 px-6 lg:hidden">
          Menu
          <Icon
            name="chevron-right"
            size={16}
            colour="#fff"
            className="transition-transform"
            style={{ transform: `rotate(${isOpen ? 180 : 0}deg)` }}
          />
        </Button>
      )}

      <SidebarContext.Provider value={{ isOpen, setOpen }}>
        <Section
          ref={sidebarRef}
          size="lg"
          className={cn(
            'h-screen w-[min(280px,_100vw)] shrink-0 rounded-e-3xl border border-keyline bg-app-bg aria-current:bg-app-bg-inverted',
            'fixed inset-0 z-40 transition-transform',
            !isOpen && '-translate-x-full',
            'lg:sticky lg:top-0 lg:translate-x-0'
          )}>
          <YSpace className="flex h-full flex-col">
            <div className="flex items-center justify-between">
              <span className="pl-4">
                <Logo />
              </span>

              {!mq && (
                <button
                  onClick={close}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    marginRight: 'calc(var(--wrapper-px) - 6px)',
                  }}
                  className="flex flex-col items-center justify-center md:hidden">
                  <Icon name="x" size={20} />
                  <span className="sr-only">Close</span>
                </button>
              )}
            </div>

            <div className="flex grow flex-col">
              {children}

              <div className="mt-auto flex flex-col gap-6 px-4">
                <HorizontalRule />

                <Suspense fallback={<Spinner />}>
                  <div className="flex gap-4">
                    <LogoutButton iconOnly>
                      <Icon name="logout" size={18} title="Logout" />
                      <span className="sr-only">Log out</span>
                    </LogoutButton>

                    <Button as={Link} href="/profile" iconOnly>
                      <Icon name="user" size={18} title="Profile" />
                      <span className="sr-only">Profile</span>
                    </Button>
                  </div>
                </Suspense>
              </div>
            </div>
          </YSpace>
        </Section>
      </SidebarContext.Provider>
    </>
  )
}
