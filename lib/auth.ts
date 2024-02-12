import { cache } from 'react'
import { cookies } from 'next/headers'
import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle'
import { Lucia, TimeSpan } from 'lucia'

import { db} from '@/lib/db'
import { type User } from '@/lib/schema'
import type { UserRole } from '@/lib/schema'
import { user, session } from '@/lib/schema'

const adapter = new DrizzlePostgreSQLAdapter(db, user, session)

export const lucia = new Lucia(adapter, {
  getUserAttributes: ({ id, email, email_verified, created_at, role }) => {
    return {
      userId: id,
      email,
      emailVerified: Boolean(email_verified),
      createdAt: created_at,
      role,
    }
  },
  sessionExpiresIn: new TimeSpan(30, 'd'),
  sessionCookie: {
    name: 'session',
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === 'production',
    },
  },
})

export const auth = cache(async () => {
  const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null

  if (!sessionId) return null

  const { user, session } = await lucia.validateSession(sessionId)

  try {
    const sessionCookie =
      session && session.fresh
        ? lucia.createSessionCookie(session.id)
        : lucia.createBlankSessionCookie()

    cookies().set(sessionCookie)
  } catch {}

  return user
})

export async function transformDbUser(user: User) {
  const { id, ...rest } = user

  return { userId: id, ...rest }
}

export const is$User = (role: UserRole) => ['admin', 'system'].includes(role)
