'use server'

import { cache } from 'react'
import { cookies } from 'next/headers'
import { sendPasswordResetEmail, sendVerificationEmail } from '@/actions/email'
import { sendMessage } from '@/actions/message'
import { createEmailVerificationToken, createPasswordResetToken } from '@/actions/token'
import { eq, inArray } from 'drizzle-orm'
import { Argon2id } from 'oslo/password'

import { lucia, transformDbUser } from '@/lib/auth'
import { APP_EMAIL, APP_NAME } from '@/lib/config'
import { db } from '@/lib/db'
import { NewUser, user } from '@/lib/schema'
import type { ServerResponse } from '@/lib/types'
import { capitalise } from '@/utils/capitalise'
import { generateId } from '@/utils/generate-id'
import { isValidEmail } from '@/utils/is-valid-email'

export async function createUser({
  email,
  password,
  emailVerified = false,
  role = 'user',
  token = true,
}: NewUser & { token?: boolean }) {
  try {
    const id = generateId()
    const [existingUser] = await db.select().from(user).where(eq(user.email, email.toLowerCase()))

    if (existingUser) throw new Error('Email already in use')

    const hashedPassword = await new Argon2id().hash(password)

    const [u] = await db
      .insert(user)
      .values({
        id,
        email: email.toLowerCase(),
        hashedPassword,
        emailVerified,
        role,
        createdAt: new Date().toISOString(),
      })
      .returning({ userId: user.id })

    if (!emailVerified && token) {
      await sendVerificationEmail(email, await createEmailVerificationToken(u.userId))
    }

    return u
  } catch (err) {
    console.error(err)
    throw err
  }
}

export async function signup(
  prevState: ServerResponse,
  formData: FormData
): Promise<ServerResponse> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!isValidEmail(email)) return { type: 'error', message: 'Invalid email', status: 400 }

  if (typeof password !== 'string' || password.length < 8 || password.length > 255) {
    return {
      type: 'error',
      message: 'Invalid password',
      status: 400,
    }
  }

  try {
    const u = await createUser({ email, password })
    const session = await lucia.createSession(u.userId, {})

    const sessionCookie = lucia.createSessionCookie(session.id)
    cookies().set(sessionCookie)

    const { id: systemUserId } = await getSystemUser()
    await sendMessage({
      body: `Welcome to ${APP_NAME}. Please check your email to verify your account. Certain features may be unavailable until your account is verified.`,
      createdAt: new Date().toISOString(),
      senderId: systemUserId,
      recipientIds: [u.userId],
      type: 'system_message',
    })

    return {
      type: 'success',
      message: 'Account created',
      status: 201,
    }
  } catch (err) {
    return {
      type: 'error',
      message: err instanceof Error ? capitalise(err?.message) : 'An unknown error occurred',
      status: 500,
    }
  }
}

export async function login(
  prevState: ServerResponse,
  formData: FormData
): Promise<ServerResponse> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!isValidEmail(email)) return { type: 'error', message: 'Invalid email', status: 400 }

  if (typeof password !== 'string' || password.length < 8 || password.length > 255) {
    return { type: 'error', message: 'Invalid password', status: 400 }
  }

  try {
    const [u] = await db
      .select({ userId: user.id, hashedPassword: user.hashedPassword })
      .from(user)
      .where(eq(user.email, email.toLowerCase()))

    if (!u) return { type: 'error', message: 'Invalid email', status: 400 }

    const validPassword = await new Argon2id().verify(u.hashedPassword, password)

    if (!validPassword) return { type: 'error', message: 'Invalid password', status: 400 }

    const session = await lucia.createSession(u.userId, {})
    const sessionCookie = lucia.createSessionCookie(session.id)
    cookies().set(sessionCookie)

    return { type: 'success', message: 'Logged in', status: 200 }
  } catch (err) {
    return {
      type: 'error',
      message: err instanceof Error ? capitalise(err?.message) : 'An unknown error occurred',
      status: 500,
    }
  }
}

export async function logout() {
  const sessionId = lucia.readSessionCookie('auth_session=abc')

  if (!sessionId) return { type: 'error', message: 'No session', status: 401 }

  const { session } = await lucia.validateSession(sessionId)

  if (!session) return { type: 'error', message: 'No session', status: 401 }

  await lucia.invalidateSession(sessionId)

  return { type: 'success', message: 'Logged out', status: 200 }
}

export async function verifyEmail(prevState: ServerResponse) {
  const sessionId = lucia.readSessionCookie('auth_session=abc')

  if (!sessionId) return { type: 'error', message: 'No session', status: 401 }

  const { user } = await lucia.validateSession(sessionId)

  if (!user) {
    return { type: 'error', message: 'No user', status: 401 }
  }

  if (user.emailVerified) {
    return {
      type: 'error',
      message: 'Email already verified',
      status: 400,
    }
  }

  try {
    const token = await createEmailVerificationToken(user.userId)
    await sendVerificationEmail(user.email, token)

    return {
      type: 'success',
      message: 'Verification email sent',
      status: 200,
    }
  } catch (err) {
    return {
      type: 'error',
      message: err instanceof Error ? capitalise(err?.message) : 'An unknown error occurred',
      status: 500,
    }
  }
}

export async function resetPassword(
  prevState: ServerResponse,
  formData: FormData
): Promise<ServerResponse> {
  const email = formData.get('email') as string

  if (!isValidEmail(email)) {
    return { type: 'error', message: 'Invalid email', status: 400 }
  }

  try {
    const [u] = await db.select().from(user).where(eq(user.email, email.toLowerCase())).limit(1)

    if (!u) {
      return { type: 'error', message: 'Invalid email', status: 400 }
    }

    const { userId } = await transformDbUser(u)
    await sendPasswordResetEmail(email, await createPasswordResetToken(userId))

    return {
      type: 'success',
      message: 'Password reset email sent',
      status: 200,
    }
  } catch (err) {
    return {
      type: 'error',
      message: err instanceof Error ? capitalise(err?.message) : 'An unknown error occurred',
      status: 500,
    }
  }
}

export const getUser = cache(async (userId: string) => {
  const [u] = await db.select().from(user).where(eq(user.id, userId)).limit(1)
  return u
})

export const getUsers = cache(
  async (userIds: string[]) => await db.select().from(user).where(inArray(user.id, userIds))
)

export const getSystemUser = cache(async () => {
  const [u] = await db.select().from(user).where(eq(user.email, APP_EMAIL)).limit(1)
  return u
})
