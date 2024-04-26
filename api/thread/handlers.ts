import { APP_URL } from '@/lib/config'

export async function resolveThreadUsers(threadId: string) {
  const res = await fetch(`${APP_URL}/api/thread/users/${threadId}`)

  if (!res.ok) {
    throw new Error('Could not get thread users')
  }

  return res.json()
}
