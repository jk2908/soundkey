import { Suspense } from 'react'
import { redirect } from 'next/navigation'

import { auth } from '@/lib/auth'

import { Nav } from '@/components/authenticated/nav'
import { Sidebar } from '@/components/authenticated/sidebar'
import { Section } from '@/components/global/section'
import { Wrapper } from '@/components/global/wrapper'

export default async function Layout({ children }: { children: React.ReactNode }) {
  const user = await auth()

  if (!user) {
    throw redirect('/login')
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex grow">
        <Sidebar>
          <Nav />
        </Sidebar>

        <Wrapper>
          <Section size="lg">{children}</Section>
        </Wrapper>
      </div>
    </Suspense>
  )
}
