import { cache } from 'react'
import { cookies } from 'next/headers'
import { NodePostgresAdapter } from '@lucia-auth/adapter-postgresql'
import { Lucia, TimeSpan } from 'lucia'

import { pool } from '@/lib/db'
import type { UserRole } from '@/lib/schema'

const adapter = new NodePostgresAdapter(pool, {
  user: 'user',
  session: 'session',
})

export const lucia = new Lucia(adapter, {
  getUserAttributes: ({ user_id, email, email_verified, created_at, role }) => {
    return {
      userId: user_id,
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

    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)
  } catch {}

  return user
})

export const is$User = (role: UserRole) => ['admin', 'system'].includes(role)
