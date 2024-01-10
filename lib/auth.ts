import { cache } from 'react'
import * as context from 'next/headers'
import { pg } from '@lucia-auth/adapter-postgresql'
import { lucia } from 'lucia'
import { nextjs_future } from 'lucia/middleware'

import { pool } from '@/lib/db'

export const auth = lucia({
  adapter: pg(pool, {
    user: 'auth_user',
    session: 'auth_session',
    key: 'auth_key',
  }),
  env: process.env.NODE_ENV === 'development' ? 'DEV' : 'PROD',
  middleware: nextjs_future(),
  sessionCookie: {
    expires: false,
  },
  getUserAttributes: ({ email, email_verified }) => {
    return {
      email,
      emailVerified: Boolean(email_verified),
    }
  },
})

export type Auth = typeof auth

export const getPageSession = cache(() => auth.handleRequest('GET', context).validate())
