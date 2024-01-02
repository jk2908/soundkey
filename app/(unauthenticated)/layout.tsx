import { redirect } from 'next/navigation'

import { useAuth } from '@/hooks/use-auth'

import { Section } from '@/components/global/section'
import { Wrapper } from '@/components/global/wrapper'
import { Header } from '@/components/unauthenticated/header'

export default async function Layout({ children }: { children: React.ReactNode }) {
  const user = await useAuth()

  if (user) {
    return redirect('/dashboard')
  }

  return (
    <>
      <Header />

      <Wrapper>
        <Section>{children}</Section>
      </Wrapper>
    </>
  )
}
