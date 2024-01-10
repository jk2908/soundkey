import { redirect } from 'next/navigation'

import { useAuth } from '@/hooks/use-auth'

import { LogoutButton } from '@/components/forms/logout-button'

export default async function Layout({ children }: { children: React.ReactNode }) {
  const user = await useAuth()

  if (!user) {
    return redirect('/login')
  }

  return (
    <>
      {children} <LogoutButton />
    </>
  )
}
