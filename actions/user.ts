'use server'

import { cache } from 'react'
import { eq, inArray } from 'drizzle-orm'

import { APP_EMAIL } from '@/lib/config'
import { db } from '@/lib/db'
import { user } from '@/lib/schema'

export const getUsers = cache(async (userIds: string[]) => {
  const users = await db.select().from(user).where(inArray(user.id, userIds))

  // @ts-expect-error
  return users.map(_auth.transformDatabaseUser)
})

export const getSystemUser = cache(async () => {
  const [systemUser] = await db.select().from(user).where(eq(user.email, APP_EMAIL)).limit(1)

  // @ts-expect-error
  return _auth.transformDatabaseUser(systemUser)
})
