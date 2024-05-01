import { cache } from 'react'
import { sendVerificationEmail } from '#/api/email/utils'
import { createProfile } from '#/api/profile/utils'
import { createEmailVerificationToken } from '#/api/token/utils'
import { eq, inArray, or } from 'drizzle-orm'
import { Argon2id } from 'oslo/password'

import { toSafeUser } from '#/lib/auth'
import { db } from '#/lib/db'
import { NewUser, userTable } from '#/lib/schema'
import { generateId } from '#/utils/generate-id'

export const getUser = cache(async (str: string) =>
  toSafeUser(
    (
      await db
        .select()
        .from(userTable)
        .where(or(eq(userTable.id, str), eq(userTable.email, str), eq(userTable.username, str)))
        .limit(1)
    )[0]
  )
)

export const getUsers = cache(
  async (arr: string[]) =>
    (
      await db
        .select()
        .from(userTable)
        .where(
          or(
            inArray(userTable.id, arr),
            inArray(
              userTable.email,
              arr.map(e => e.toLowerCase())
            ),
            inArray(userTable.username, arr)
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
  username,
  token = true,
}: NewUser & { token?: boolean }) {
  try {
    const id = generateId()
    const [existingUser] = await db
      .select()
      .from(userTable)
      .where(or(eq(userTable.email, email.toLowerCase()), eq(userTable.username, username)))

    if (existingUser) throw new Error('Email or username already in use')

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
        username,
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
