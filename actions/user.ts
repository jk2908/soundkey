'use server'

import { cache } from 'react'
import { cookies } from 'next/headers'
import { sendPasswordResetEmail, sendVerificationEmail } from '@/actions/email'
import { sendMessage } from '@/actions/message'
import { createEmailVerificationToken, createPasswordResetToken } from '@/actions/token'
import { eq, inArray } from 'drizzle-orm'
import { Argon2id } from 'oslo/password'

import { lucia } from '@/lib/auth'
import { APP_EMAIL, APP_NAME } from '@/lib/config'
import { db } from '@/lib/db'
import { NewUser, user } from '@/lib/schema'
import type { ServerResponse } from '@/lib/types'
import { capitalise } from '@/utils/capitalise'
import { generateId } from '@/utils/generate-id'
import { isValidEmail } from '@/utils/is-valid-email'

export async function createUser({ email, password, role = 'user' }: NewUser) {
  try {
    const userId = generateId()
    const [existingUser] = await db.select().from(user).where(eq(user.email, email.toLowerCase()))

    if (existingUser) throw new Error('Email already in use')

    const hashedPassword = await new Argon2id().hash(password)

    const [u] = await db
      .insert(user)
      .values({
        userId,
        email: email.toLowerCase(),
        password: hashedPassword,
        role,
        emailVerified: false,
        createdAt: new Date().toISOString(),
      })
      .returning({ userId: user.userId })

    return u
  } catch (err) {
    console.error(err)
    throw err
  }
}

export async function signup(prevState: ServerResponse, formData: FormData) {
  const email = formData.get('email')
  const password = formData.get('password')

  if (!isValidEmail(email)) {
    return {
      type: 'error',
      message: 'Invalid email',
      status: 400,
    } satisfies ServerResponse
  }

  if (typeof password !== 'string' || password.length < 8 || password.length > 255) {
    return {
      type: 'error',
      message: 'Invalid password',
      status: 400,
    } satisfies ServerResponse
  }

  try {
    const u = await createUser({ email, password })
    const session = await lucia.createSession(u.userId, {})

    const sessionCookie = lucia.createSessionCookie(session.id)
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)

    const token = await createEmailVerificationToken(u.userId)
    await sendVerificationEmail(email, token)

    const { userId: systemUserId } = await getSystemUser()
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
    } satisfies ServerResponse
  } catch (err) {
    return {
      type: 'error',
      message: err instanceof Error ? capitalise(err?.message) : 'An unknown error occurred',
      status: 500,
    } satisfies ServerResponse
  }
}

export async function login(prevState: ServerResponse, formData: FormData) {
  const email = formData.get('email')
  const password = formData.get('password')

  if (!isValidEmail(email)) {
    return { type: 'error', message: 'Invalid email', status: 400 } satisfies ServerResponse
  }

  if (typeof password !== 'string' || password.length < 8 || password.length > 255) {
    return { type: 'error', message: 'Invalid password', status: 400 } satisfies ServerResponse
  }

  try {
    const [u] = await db
      .select({ userId: user.userId })
      .from(user)
      .where(eq(user.email, email.toLowerCase()))

    if (!u) throw new Error('User not found')

    const session = await lucia.createSession(u.userId, {})
    const sessionCookie = lucia.createSessionCookie(session.id)

    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)

    return { type: 'success', message: 'Logged in', status: 200 } satisfies ServerResponse
  } catch (err) {
    return {
      type: 'error',
      message: err instanceof Error ? capitalise(err?.message) : 'An unknown error occurred',
      status: 500,
    } satisfies ServerResponse
  }
}

export async function logout() {
  const sessionId = lucia.readSessionCookie('auth_session=abc')

  if (!sessionId) {
    return { type: 'error', message: 'No session', status: 401 } satisfies ServerResponse
  }

  const { session } = await lucia.validateSession(sessionId)

  if (!session) {
    return { type: 'error', message: 'No session', status: 401 } satisfies ServerResponse
  }

  await lucia.invalidateSession(sessionId)

  return { type: 'success', message: 'Logged out', status: 200 } satisfies ServerResponse
}

export async function verifyEmail(prevState: ServerResponse) {
  const sessionId = lucia.readSessionCookie('auth_session=abc')

  if (!sessionId) {
    return { type: 'error', message: 'No session', status: 401 } satisfies ServerResponse
  }

  const { user } = await lucia.validateSession(sessionId)

  if (!user) {
    return { type: 'error', message: 'No user', status: 401 } satisfies ServerResponse
  }

  if (user.emailVerified) {
    return {
      type: 'error',
      message: 'Email already verified',
      status: 400,
    } satisfies ServerResponse
  }

  try {
    const token = await createEmailVerificationToken(user.userId)
    await sendVerificationEmail(user.email, token)

    return {
      type: 'success',
      message: 'Verification email sent',
      status: 200,
    } satisfies ServerResponse
  } catch (err) {
    return {
      type: 'error',
      message: err instanceof Error ? capitalise(err?.message) : 'An unknown error occurred',
      status: 500,
    } satisfies ServerResponse
  }
}

export async function resetPassword(prevState: ServerResponse, formData: FormData) {
  const email = formData.get('email')

  if (!isValidEmail(email)) {
    return { type: 'error', message: 'Invalid email', status: 400 } satisfies ServerResponse
  }

  try {
    const [u] = await db.select().from(user).where(eq(user.email, email.toLowerCase())).limit(1)

    if (!u) {
      return { type: 'error', message: 'Invalid email', status: 400 } satisfies ServerResponse
    }

    const token = await createPasswordResetToken(u.userId)

    await sendPasswordResetEmail(email, token)

    return {
      type: 'success',
      message: 'Password reset email sent',
      status: 200,
    } satisfies ServerResponse
  } catch (err) {
    return {
      type: 'error',
      message: err instanceof Error ? capitalise(err?.message) : 'An unknown error occurred',
      status: 500,
    } satisfies ServerResponse
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
