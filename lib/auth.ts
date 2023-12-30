import { cache } from 'react'
import * as context from 'next/headers'
import { prisma } from '@lucia-auth/adapter-prisma'
import { lucia } from 'lucia'
import { nextjs_future } from 'lucia/middleware'

import { db } from '@/lib/db'

export const auth = lucia({
  adapter: prisma(db, {
    user: 'user',
    session: 'session',
    key: 'key',
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