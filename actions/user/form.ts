'use server'

import { cookies } from 'next/headers'
import { sendPasswordResetEmail, sendVerificationEmail } from '@/actions/email/db'
import { createMessage } from '@/actions/message/db'
import { createEmailVerificationToken, createPasswordResetToken } from '@/actions/token/db'
import { createUser, getSystemUser } from '@/actions/user/db'
import { eq } from 'drizzle-orm'
import { Argon2id } from 'oslo/password'

import { lucia } from '@/lib/auth'
import { APP_NAME } from '@/lib/config'
import { db, error, success } from '@/lib/db'
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

  if (!isValidEmail(email)) return error({ message: 'Invalid email', status: 400 })

  if (typeof password !== 'string' || password.length < 8 || password.length > 255) {
    return error({ message: 'Invalid password', status: 400 })
  }

  try {
    const user = await createUser({ email, password })
    const session = await lucia.createSession(user.userId, {})

    const sessionCookie = lucia.createSessionCookie(session.id)
    cookies().set(sessionCookie)

    const sysUser = await getSystemUser()

    if (!sysUser) {
      return error({ message: 'System user not found', status: 500 })
    }

    await createMessage({
      body: `Welcome to ${APP_NAME}. Please check your email to verify your account. Certain features may be unavailable until your account is verified.`,
      createdAt: Date.now(),
      senderId: sysUser.userId,
      recipientIds: [user.userId],
      type: 'system_message',
    })

    return success({ message: 'Account created', status: 201 })
  } catch (err) {
    return error(err as Error)
  }
}

export async function login(
  prevState: ServerResponse,
  formData: FormData
): Promise<ServerResponse> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!isValidEmail(email)) return error({ message: 'Invalid email', status: 400 })

  if (typeof password !== 'string' || password.length < 8 || password.length > 255) {
    return error({ message: 'Invalid password', status: 400 })
  }

  try {
    const [user] = await db
      .select({ userId: userTable.id, hashedPassword: userTable.hashedPassword })
      .from(userTable)
      .where(eq(userTable.email, email.toLowerCase()))

    if (!user) return error({ message: 'Invalid email', status: 400 })

    const validPassword = await new Argon2id().verify(user.hashedPassword, password)

    if (!validPassword) return error({ message: 'Invalid password', status: 400 })

    const session = await lucia.createSession(user.userId, {})
    const sessionCookie = lucia.createSessionCookie(session.id)
    cookies().set(sessionCookie)

    return success({ message: 'Logged in', status: 200 })
  } catch (err) {
    return error(err as Error)
  }
}

export async function logout() {
  const sessionId = cookies().get(lucia.sessionCookieName)?.value

  if (!sessionId) return error({ message: 'No session', status: 401 })

  await lucia.invalidateSession(sessionId)

  const sessionCookie = lucia.createBlankSessionCookie()
  cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)

  return success({ message: 'Logged out', status: 200 })
}

export async function verify(prevState: ServerResponse): Promise<ServerResponse> {
  const sessionId = lucia.readSessionCookie('auth_session=abc')

  if (!sessionId) return error({ message: 'Session not found', status: 401 })

  const { user } = await lucia.validateSession(sessionId)

  if (!user) return error({ message: 'User not found', status: 401 })

  if (user.emailVerified) error({ message: 'Email already verified', status: 400 })

  try {
    const token = await createEmailVerificationToken(user.userId)
    await sendVerificationEmail(user.email, token)

    return success({ message: 'Verification email sent', status: 200 })
  } catch (err) {
    return error(err as Error)
  }
}

export async function reset(
  prevState: ServerResponse,
  formData: FormData
): Promise<ServerResponse> {
  const email = formData.get('email') as string

  if (!isValidEmail(email)) {
    return error({ message: 'Invalid email', status: 400 })
  }

  try {
    const [user] = await db
      .select()
      .from(userTable)
      .where(eq(userTable.email, email.toLowerCase()))
      .limit(1)

    if (!user) error({ message: 'User not found', status: 400 })

    const token = await createPasswordResetToken(user?.id)
    await sendPasswordResetEmail(email, token)

    return success({ message: 'Password reset email sent', status: 200 })
  } catch (err) {
    return error(err as Error)
  }
}
