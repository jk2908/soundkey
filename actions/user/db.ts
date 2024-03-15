import { cache } from 'react'
import { sendVerificationEmail } from '@/actions/email/db'
import { createProfile } from '@/actions/profile/db'
import { createEmailVerificationToken } from '@/actions/token/db'
import { eq, inArray } from 'drizzle-orm'
import { Argon2id } from 'oslo/password'

import { toSafeUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { NewUser, userTable } from '@/lib/schema'
import { generateId } from '@/utils/generate-id'

export const getUserWithId = cache(async (userId: string) =>
  toSafeUser((await db.select().from(userTable).where(eq(userTable.id, userId)).limit(1))[0])
)

export const getUserWithEmail = cache(async (email: string) =>
  toSafeUser(
    (await db.select().from(userTable).where(eq(userTable.email, email.toLowerCase())).limit(1))[0]
  )
)

export const getUsersWithId = cache(async (userIds: string[]) =>
  (await db.select().from(userTable).where(inArray(userTable.id, userIds))).map(toSafeUser)
)

export const getUsersWithEmail = cache(
  async (emails: string[]) =>
    (
      await db
        .select()
        .from(userTable)
        .where(
          inArray(
            userTable.email,
            emails.map(e => e.toLowerCase())
          )
        )
    )
      .filter(u => u !== null)
      .map(toSafeUser) as NonNullable<ReturnType<typeof toSafeUser>>[]
)

export const getSystemUser = cache(async () =>
  toSafeUser((await db.select().from(userTable).where(eq(userTable.role, 'system')).limit(1))[0])
)

export async function createUser({
  email,
  password,
  emailVerified = false,
  role = 'user',
  token = true,
}: NewUser & { token?: boolean }) {
  try {
    const id = generateId()
    const [existingUser] = await db
      .select()
      .from(userTable)
      .where(eq(userTable.email, email.toLowerCase()))

    if (existingUser) throw new Error('Email already in use')

    const hashedPassword = await new Argon2id().hash(password)

    const [user] = await db
      .insert(userTable)
      .values({
        id,
        email: email.toLowerCase(),
        hashedPassword,
        emailVerified,
        role,
        createdAt: Date.now(),
      })
      .returning({ userId: userTable.id })

    await createProfile(user.userId)

    if (!emailVerified && token) {
      const t = await createEmailVerificationToken(user.userId)
      await sendVerificationEmail(email, t)
    }

    return user
  } catch (err) {
    console.error(err)
    throw err
  }
}
