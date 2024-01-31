import { eq } from 'drizzle-orm'
import { generateRandomString, isWithinExpiration } from 'lucia/utils'

import { db } from '@/lib/db'
import { emailVerificationToken, passwordResetToken } from '@/lib/schema'
import { _auth } from '../lib/auth'

const EXPIRES_IN = 1000 * 60 * 60 * 2

export async function createEmailVerificationToken(userId: string) {
  const tokens = await db
    .select()
    .from(emailVerificationToken)
    .where(eq(emailVerificationToken.userId, userId))

  if (tokens.length) {
    const reusabletokens = tokens.find(({ expires }) =>
      isWithinExpiration(Number(expires) - EXPIRES_IN / 2)
    )

    if (reusabletokens) return reusabletokens.id
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
  const [tokens] = await db
    .select()
    .from(emailVerificationToken)
    .where(eq(emailVerificationToken.id, token))

  if (!tokens) throw new Error('Invalid token')

  if (!isWithinExpiration(Number(tokens.expires))) throw new Error('Expired token')

  await db.delete(emailVerificationToken).where(eq(emailVerificationToken.id, token))

  return tokens.userId
}

export async function createPasswordResetToken(userId: string) {
  const tokenss = await db
    .select()
    .from(passwordResetToken)
    .where(eq(passwordResetToken.userId, userId))

  if (tokenss.length) {
    const reusabletokens = tokenss.find(({ expires }) =>
      isWithinExpiration(Number(expires) - EXPIRES_IN / 2)
    )

    if (reusabletokens) return reusabletokens.id
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
  const [tokens] = await db
    .select()
    .from(passwordResetToken)
    .where(eq(passwordResetToken.id, token))

  if (!tokens) throw new Error('Invalid token')

  if (!isWithinExpiration(Number(tokens.expires))) {
    throw new Error('Expired token')
  }

  await db.delete(passwordResetToken).where(eq(passwordResetToken.id, token))

  return tokens.userId
}

export async function isValidPasswordResetToken(token: string) {
  const [tokens] = await db
    .select()
    .from(passwordResetToken)
    .where(eq(passwordResetToken.id, token))

  if (!tokens || !isWithinExpiration(Number(tokens.expires))) {
    return false
  }

  return true
}
