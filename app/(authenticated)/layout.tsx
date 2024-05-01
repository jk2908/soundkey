import { Suspense } from 'react'
import { redirect } from 'next/navigation'

import { auth } from '#/lib/auth'

import { Nav } from '#/components/authenticated/nav'
import { NavSkeletonLoader } from '#/components/authenticated/nav-skeleton-loader'
import { Sidebar } from '#/components/authenticated/sidebar'
import { FullscreenSpinner } from '#/components/global/fullscreen-spinner'
import { Section } from '#/components/global/section'
import { Wrapper } from '#/components/global/wrapper'

export default async function Layout({ children }: { children: React.ReactNode }) {
  const user = await auth()

  if (!user) throw redirect('/login')

  return (
    <Suspense fallback={<FullscreenSpinner />}>
      <Wrapper size="xxl" className="ml-0 flex grow bg-app-bg md:px-0">
        <Sidebar>
          <Suspense fallback={<NavSkeletonLoader />}>
            <Nav />
          </Suspense>
        </Sidebar>

        <Wrapper size={0} className="flex grow flex-col px-0 md:px-[--wrapper-px]">
          <Section size="lg" className="flex grow flex-col">
            {children}
          </Section>
        </Wrapper>
      </Wrapper>
    </Suspense>
  )
}
