import { Suspense } from 'react'
import { redirect } from 'next/navigation'

import { auth } from '@/lib/auth'

import { Nav } from '@/components/authenticated/nav'
import { Sidebar } from '@/components/authenticated/sidebar'
import { FullscreenLoadingSpinner } from '@/components/global/fullscreen-loading-spinner'
import { LoadingSpinner } from '@/components/global/loading-spinner'
import { Section } from '@/components/global/section'
import { Wrapper } from '@/components/global/wrapper'
import { NavSkeletonLoader } from '@/components/authenticated/nav-skeleton-loader'

export default async function Layout({ children }: { children: React.ReactNode }) {
  const user = await auth()

  if (!user) throw redirect('/login')

  return (
    <Suspense fallback={<FullscreenLoadingSpinner />}>
      <div className="flex grow flex-col bg-app-bg-inverted bg-[url('/assets/dashboard-bg.jpg')] bg-cover">
        <Wrapper size="xxl" className="flex grow bg-app-bg sm:px-0 md:px-0">
          <Sidebar>
            <Suspense fallback={<NavSkeletonLoader />}>
              <Nav />
            </Suspense>
          </Sidebar>

          <Wrapper size={0} className="grow">
            <Section size="lg" className="h-full">
              {children}
            </Section>
          </Wrapper>
        </Wrapper>
      </div>
    </Suspense>
  )
}
