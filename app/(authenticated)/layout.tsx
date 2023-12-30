import { redirect } from 'next/navigation'

import { useAuth } from '@/hooks/use-auth'

export default async function Layout({ children }: { children: React.ReactNode }) {
  const user = await useAuth()

  if (!user) redirect('/login')

  return <>{children}</>
}
