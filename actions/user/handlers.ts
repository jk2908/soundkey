'use server'

import { cache } from 'react'
import { createProfile } from '@/actions/profile/handlers'
import { createEmailVerificationToken } from '@/actions/token/handlers'
import { sendVerificationEmail } from '@/actions/email/handlers'
import { eq, inArray } from 'drizzle-orm'
import { Argon2id } from 'oslo/password'

import { db } from '@/lib/db'
import { NewUser, userTable } from '@/lib/schema'
import { generateId } from '@/utils/generate-id'

export const getUser = cache(
  async (userId: string) =>
    (await db.select().from(userTable).where(eq(userTable.id, userId)).limit(1))[0]
)

export const getUsers = cache(
  async (userIds: string[]) =>
    await db.select().from(userTable).where(inArray(userTable.id, userIds))
)

export const getSystemUser = cache(
  async () => (await db.select().from(userTable).where(eq(userTable.role, 'system')).limit(1))[0]
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