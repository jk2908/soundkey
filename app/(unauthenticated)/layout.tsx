import { redirect } from 'next/navigation'

import { auth } from '@/lib/auth'

import { Section } from '@/components/global/section'
import { Wrapper } from '@/components/global/wrapper'
import { Header } from '@/components/unauthenticated/header'

export default async function Layout({ children }: { children: React.ReactNode }) {
  const user = await auth()

  if (user) {
    throw redirect('/dashboard')
  }

  return (
    <div className="grow">
      <Header />

      <Wrapper>
        <Section>{children}</Section>
      </Wrapper>
    </div>
  )
}
