import { Suspense } from 'react'
import { redirect } from 'next/navigation'

import { auth } from '@/lib/auth'

import { Nav } from '@/components/authenticated/nav'
import { Sidebar } from '@/components/authenticated/sidebar'
import { FullscreenLoadingSpinner } from '@/components/global/fullscreen-loading-spinner'
import { LoadingSpinner } from '@/components/global/loading-spinner'
import { Section } from '@/components/global/section'
import { Wrapper } from '@/components/global/wrapper'

export default async function Layout({ children }: { children: React.ReactNode }) {
  const user = await auth()

  if (!user) throw redirect('/login')

  return (
    <Suspense fallback={<FullscreenLoadingSpinner />}>
      <div className="flex grow">
        <Sidebar>
          <Suspense fallback={<LoadingSpinner />}>
            <Nav />
          </Suspense>
        </Sidebar>

        <Wrapper className="mx-0">
          <Section size="lg" className="h-full">{children}</Section>
        </Wrapper>
      </div>
    </Suspense>
  )
}
