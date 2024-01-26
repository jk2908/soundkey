import { cache } from 'react'
import * as context from 'next/headers'
import { pg } from '@lucia-auth/adapter-postgresql'
import { lucia } from 'lucia'
import { nextjs_future } from 'lucia/middleware'

import { pool } from '@/lib/db'

export const _auth = lucia({
  adapter: pg(pool, {
    user: 'user',
    session: 'session',
    key: 'key',
  }),
  env: process.env.NODE_ENV === 'development' ? 'DEV' : 'PROD',
  middleware: nextjs_future(),
  sessionCookie: {
    expires: false,
  },
  getUserAttributes: ({ email, email_verified, created_at, role }) => {
    return {
      email,
      emailVerified: Boolean(email_verified),
      createdAt: created_at,
      role,
    }
  },
})

export type Auth = typeof _auth

export const getPageSession = cache(() => _auth.handleRequest('GET', context).validate())

export async function auth() {
  const { user } = (await getPageSession()) ?? {}

  if (!user) return null

  return user
}
