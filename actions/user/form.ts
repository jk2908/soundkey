'use server'

import { cookies } from 'next/headers'
import { sendPasswordResetEmail, sendVerificationEmail } from '@/actions/email/handlers'
import { createMessage } from '@/actions/message/handlers'
import { createEmailVerificationToken, createPasswordResetToken } from '@/actions/token'
import { createUser, getSystemUser } from '@/actions/user/handlers'
import { eq } from 'drizzle-orm'
import { Argon2id } from 'oslo/password'

import { lucia, transformDbUser } from '@/lib/auth'
import { APP_NAME } from '@/lib/config'
import { db } from '@/lib/db'
import { userTable } from '@/lib/schema'
import type { ServerResponse } from '@/lib/types'
import { capitalise } from '@/utils/capitalise'
import { isValidEmail } from '@/utils/is-valid-email'

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
    const user = await createUser({ email, password })
    const session = await lucia.createSession(user.userId, {})

    const sessionCookie = lucia.createSessionCookie(session.id)
    cookies().set(sessionCookie)

    const { id: systemUserId } = await getSystemUser()
    await createMessage({
      body: `Welcome to ${APP_NAME}. Please check your email to verify your account. Certain features may be unavailable until your account is verified.`,
      createdAt: Date.now(),
      senderId: systemUserId,
      recipientIds: [user.userId],
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
    const [user] = await db
      .select({ userId: userTable.id, hashedPassword: userTable.hashedPassword })
      .from(userTable)
      .where(eq(userTable.email, email.toLowerCase()))

    if (!user) return { type: 'error', message: 'Invalid email', status: 400 }

    const validPassword = await new Argon2id().verify(user.hashedPassword, password)

    if (!validPassword) return { type: 'error', message: 'Invalid password', status: 400 }

    const session = await lucia.createSession(user.userId, {})
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
  const sessionId = cookies().get(lucia.sessionCookieName)?.value

  if (!sessionId) return { type: 'error', message: 'No session', status: 401 }

  await lucia.invalidateSession(sessionId)

  const sessionCookie = lucia.createBlankSessionCookie()
  cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)

  return { type: 'success', message: 'Logged out', status: 200 }
}

export async function verify(prevState: ServerResponse): Promise<ServerResponse> {
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

export async function reset(
  prevState: ServerResponse,
  formData: FormData
): Promise<ServerResponse> {
  const email = formData.get('email') as string

  if (!isValidEmail(email)) {
    return { type: 'error', message: 'Invalid email', status: 400 }
  }

  try {
    const [user] = await db
      .select()
      .from(userTable)
      .where(eq(userTable.email, email.toLowerCase()))
      .limit(1)

    if (!user) {
      return { type: 'error', message: 'Invalid email', status: 400 }
    }

    const { userId } = await transformDbUser(user)
    const token = await createPasswordResetToken(userId)
    await sendPasswordResetEmail(email, token)

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
