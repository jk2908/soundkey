import { Suspense } from 'react'
import { redirect } from 'next/navigation'

import { auth } from '@/lib/auth'

import { FullscreenSpinner } from '@/components/global/fullscreen-spinner'
import { Section } from '@/components/global/section'
import { Wrapper } from '@/components/global/wrapper'
import { Header } from '@/components/unauthenticated/header'

export default async function Layout({ children }: { children: React.ReactNode }) {
  const user = await auth()

  if (user) throw redirect('/dashboard')

  return (
    <Suspense fallback={<FullscreenSpinner />}>
      <div className="grow">
        <Header />

        <Wrapper>
          <Section size="xl">{children}</Section>
        </Wrapper>
      </div>
    </Suspense>
  )
}
