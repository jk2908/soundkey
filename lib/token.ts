import { eq } from 'drizzle-orm'
import { generateRandomString, isWithinExpiration } from 'lucia/utils'

import { db } from '@/lib/db'
import { emailVerificationToken, passwordResetToken } from '@/lib/schema'
import { _auth } from './auth'

const EXPIRES_IN = 1000 * 60 * 60 * 2

export async function createEmailVerificationToken(userId: string) {
  const storedTokens = await db
    .select()
    .from(emailVerificationToken)
    .where(eq(emailVerificationToken.userId, userId))

  if (storedTokens.length) {
    const reusableStoredToken = storedTokens.find(({ expires }) =>
      isWithinExpiration(Number(expires) - EXPIRES_IN / 2)
    )

    if (reusableStoredToken) return reusableStoredToken.id
  }

  const token = generateRandomString(63)

  await db.insert(emailVerificationToken).values({
    id: token,
    userId,
    expires: Date.now() + EXPIRES_IN,
  })

  return token
}

export async function validateEmailVerificationToken(token: string) {
  const [storedToken] = await db
    .select()
    .from(emailVerificationToken)
    .where(eq(emailVerificationToken.id, token))

  if (!storedToken) throw new Error('Invalid token')

  if (!isWithinExpiration(Number(storedToken.expires))) throw new Error('Expired token')

  await db.delete(emailVerificationToken).where(eq(emailVerificationToken.id, token))

  return storedToken.userId
}

export async function createPasswordResetToken(userId: string) {
  const storedTokens = await db
    .select()
    .from(passwordResetToken)
    .where(eq(passwordResetToken.userId, userId))

  if (storedTokens.length) {
    const reusableStoredToken = storedTokens.find(({ expires }) =>
      isWithinExpiration(Number(expires) - EXPIRES_IN / 2)
    )

    if (reusableStoredToken) return reusableStoredToken.id
  }

  const token = generateRandomString(63)

  await db.insert(passwordResetToken).values({
    id: token,
    userId,
    expires: Date.now() + EXPIRES_IN,
  })

  return token
}

export async function validatePasswordResetToken(token: string) {
  const [storedToken] = await db
    .select()
    .from(passwordResetToken)
    .where(eq(passwordResetToken.id, token))

  if (!storedToken) throw new Error('Invalid token')

  if (!isWithinExpiration(Number(storedToken.expires))) {
    throw new Error('Expired token')
  }

  await db.delete(passwordResetToken).where(eq(passwordResetToken.id, token))

  return storedToken.userId
}

export async function isValidPasswordResetToken(token: string) {
  const [storedToken] = await db
    .select()
    .from(passwordResetToken)
    .where(eq(passwordResetToken.id, token))

  if (!storedToken || !isWithinExpiration(Number(storedToken.expires))) {
    return false
  }

  return true
}
