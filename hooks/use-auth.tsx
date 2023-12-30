import { getPageSession } from '@/lib/auth'

export async function useAuth() {
  const { user } = await getPageSession() ?? {}

  if (!user) return null

  return user
}
