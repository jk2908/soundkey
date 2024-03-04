'use server'

import { eq } from 'drizzle-orm'
import { createDate, isWithinExpirationDate, TimeSpan } from 'oslo'

import { db } from '@/lib/db'
import { emailVerificationTokenTable, passwordResetTokenTable } from '@/lib/schema'
import { generateId } from '@/utils/generate-id'

const EXPIRES_IN = 1000 * 60 * 60 * 2

export async function createEmailVerificationToken(userId: string) {
  const tokens = await db
    .select()
    .from(emailVerificationTokenTable)
    .where(eq(emailVerificationTokenTable.userId, userId))

  if (tokens.length) {
    const reusabletokens = tokens.find(({ expiresAt }) => {
      const d = createDate(new TimeSpan(Number(expiresAt), 'ms'))

      return isWithinExpirationDate(d)
    })

    if (reusabletokens) return reusabletokens.id
  }

  const token = generateId(63)

  await db.insert(emailVerificationTokenTable).values({
    id: token,
    userId,
    expiresAt: Date.now() + EXPIRES_IN,
  })

  return token
}

export async function validateEmailVerificationToken(token: string) {
  const [tokens] = await db
    .select()
    .from(emailVerificationTokenTable)
    .where(eq(emailVerificationTokenTable.id, token))

  if (!tokens) throw new Error('Invalid token')

  const d = createDate(new TimeSpan(Number(tokens.expiresAt), 'ms'))

  if (!isWithinExpirationDate(d)) {
    throw new Error('Expired token')
  }

  await db.delete(emailVerificationTokenTable).where(eq(emailVerificationTokenTable.id, token))

  return tokens.userId
}

export async function createPasswordResetToken(userId: string) {
  const tokens = await db
    .select()
    .from(passwordResetTokenTable)
    .where(eq(passwordResetTokenTable.userId, userId))

  if (tokens.length) {
    const reusabletokens = tokens.find(({ expiresAt }) => {
      const d = createDate(new TimeSpan(Number(expiresAt), 'ms'))

      return isWithinExpirationDate(d)
    })

    if (reusabletokens) return reusabletokens.id
  }

  const token = generateId(63)

  await db.insert(passwordResetTokenTable).values({
    id: token,
    userId,
    expiresAt: Date.now() + EXPIRES_IN,
  })

  return token
}

export async function validatePasswordResetToken(token: string) {
  const [tokens] = await db
    .select()
    .from(passwordResetTokenTable)
    .where(eq(passwordResetTokenTable.id, token))

  if (!tokens) throw new Error('Invalid token')

  const d = createDate(new TimeSpan(Number(tokens.expiresAt), 'ms'))

  if (!isWithinExpirationDate(d)) {
    throw new Error('Expired token')
  }

  await db.delete(passwordResetTokenTable).where(eq(passwordResetTokenTable.id, token))

  return tokens.userId
}

export async function isValidPasswordResetToken(token: string) {
  const [tokens] = await db
    .select()
    .from(passwordResetTokenTable)
    .where(eq(passwordResetTokenTable.id, token))

  const d = createDate(new TimeSpan(Number(tokens.expiresAt), 'ms'))

  if (!tokens || !isWithinExpirationDate(d)) {
    return false
  }

  return true
}
