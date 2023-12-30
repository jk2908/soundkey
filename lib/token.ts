import { generateRandomString, isWithinExpiration } from 'lucia/utils'

import { db } from '@/lib/db'

const EXPIRES_IN = 1000 * 60 * 60 * 2

export async function createEmailVerificationToken(userId: string) {
  const storedTokens = await db.emailVerificationToken.findMany({
    where: {
      user_id: userId,
    },
  })

  if (storedTokens.length) {
    const reusableStoredToken = storedTokens.find(({ expires }) =>
      isWithinExpiration(Number(expires) - EXPIRES_IN / 2)
    )

    if (reusableStoredToken) return reusableStoredToken.id
  }

  const token = generateRandomString(63)

  await db.emailVerificationToken.create({
    data: {
      id: token,
      user_id: userId,
      expires: Date.now() + EXPIRES_IN,
    },
  })

  return token
}

export async function validateEmailVerificationToken(token: string) {
  const storedToken = await db.emailVerificationToken.findUnique({
    where: {
      id: token,
    },
  })

  if (!storedToken) throw new Error('Invalid token')

  if (!isWithinExpiration(Number(storedToken.expires))) throw new Error('Expired token')

  await db.emailVerificationToken.delete({
    where: {
      id: token,
    },
  })

  return storedToken.user_id
}

export async function createPasswordResetToken(userId: string) {
  const storedTokens = await db.passwordResetToken.findMany({
    where: {
      user_id: userId,
    },
  })

  if (storedTokens.length) {
    const reusableStoredToken = storedTokens.find(({ expires }) =>
      isWithinExpiration(Number(expires) - EXPIRES_IN / 2)
    )

    if (reusableStoredToken) return reusableStoredToken.id
  }

  const token = generateRandomString(63)

  await db.passwordResetToken.create({
    data: {
      id: token,
      user_id: userId,
      expires: Date.now() + EXPIRES_IN,
    },
  })

  return token
}

export async function validatePasswordResetToken(token: string) {
  const storedToken = await db.passwordResetToken.findUnique({
    where: {
      id: token,
    },
  })

  if (!storedToken) throw new Error('Invalid token')

  if (!isWithinExpiration(Number(storedToken.expires))) {
    throw new Error('Expired token')
  }

  await db.passwordResetToken.delete({
    where: {
      id: token,
    },
  })

  return storedToken.user_id
}

export async function isValidPasswordResetToken(token: string) {
  const storedToken = await db.passwordResetToken.findUnique({
    where: {
      id: token,
    },
  })

  if (!storedToken || !isWithinExpiration(Number(storedToken.expires))) {
    return false
  }

  return true
}
