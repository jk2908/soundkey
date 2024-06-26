'use server'

import { cookies } from 'next/headers'
import { sendPasswordResetEmail, sendVerificationEmail } from '#/api/email/utils'
import { createMessage } from '#/api/message/utils'
import { createEmailVerificationToken, createPasswordResetToken } from '#/api/token/utils'
import { createUser, getSystemUser } from '#/api/user/utils'
import { eq } from 'drizzle-orm'
import { Argon2id } from 'oslo/password'

import { lucia } from '#/lib/auth'
import { APP_NAME } from '#/lib/config'
import { db } from '#/lib/db'
import { error, success } from '#/utils/action-response'
import { userTable } from '#/lib/schema'
import type { ActionResponse } from '#/lib/types'
import { isValidEmail } from '#/utils/is-valid-email'

export async function signup(
  prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  try {
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const username = formData.get('username') as string

    if (!isValidEmail(email)) return error(400, 'Invalid email')

    if (typeof password !== 'string' || password.length < 8 || password.length > 255) {
      return error(400, 'Invalid password')
    }

    if (typeof username !== 'string' || username.length < 3 || username.length > 255) {
      return error(400, 'Invalid username')
    }

    const user = await createUser({ email, password, username })
    const session = await lucia.createSession(user.userId, {})

    const sessionCookie = lucia.createSessionCookie(session.id)
    cookies().set(sessionCookie)

    const sysUser = await getSystemUser()

    if (!sysUser) return error(500, 'System user not found')

    await createMessage({
      body: `Welcome to ${APP_NAME}. Please check your email to verify your account. Certain features may be unavailable until your account is verified.`,
      createdAt: Date.now(),
      senderId: sysUser.userId,
      recipientIds: [user.userId],
      type: 'system_message',
    })

    return success(201, 'Account created')
  } catch (err) {
    return error(500, err instanceof Error ? err.message : 'An unknown error occurred')
  }
}

export async function login(
  prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  try {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!isValidEmail(email)) return error(400, 'Invalid email')

    if (typeof password !== 'string' || password.length < 8 || password.length > 255) {
      return error(400, 'Invalid password')
    }

    const [user] = await db
      .select({ userId: userTable.id, hashedPassword: userTable.hashedPassword })
      .from(userTable)
      .where(eq(userTable.email, email.toLowerCase()))

    if (!user) return error(400, 'Invalid email')

    const validPassword = await new Argon2id().verify(user.hashedPassword, password)

    if (!validPassword) return error(400, 'Invalid password')

    const session = await lucia.createSession(user.userId, {})
    const sessionCookie = lucia.createSessionCookie(session.id)
    cookies().set(sessionCookie)

    return success(200, 'Logged in')
  } catch (err) {
    return error(500, err instanceof Error ? err.message : 'An unknown error occurred')
  }
}

export async function logout() {
  try {
    const sessionId = cookies().get(lucia.sessionCookieName)?.value

    if (!sessionId) return error(401, 'No session')

    await lucia.invalidateSession(sessionId)

    const sessionCookie = lucia.createBlankSessionCookie()
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)

    return success(200, 'Logged out')
  } catch (err) {
    return error(500, err instanceof Error ? err.message : 'An unknown error occurred')
  }
}

export async function verify(prevState: ActionResponse | null): Promise<ActionResponse> {
  try {
    const sessionId = lucia.readSessionCookie('auth_session=abc')

    if (!sessionId) return error(401, 'Session not found')

    const { user } = await lucia.validateSession(sessionId)

    if (!user) return error(401, 'User not found')

    if (user.emailVerified) error(400, 'Email already verified')

    const token = await createEmailVerificationToken(user.userId)
    await sendVerificationEmail(user.email, token)

    return success(200, 'Verification email sent')
  } catch (err) {
    return error(500, err instanceof Error ? err.message : 'An unknown error occurred')
  }
}

export async function reset(
  prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  try {
    const email = formData.get('email') as string

    if (!isValidEmail(email)) {
      return error(400, 'Invalid email')
    }

    const [user] = await db
      .select()
      .from(userTable)
      .where(eq(userTable.email, email.toLowerCase()))
      .limit(1)

    if (!user) error(400, 'User not found')

    const token = await createPasswordResetToken(user?.id)
    await sendPasswordResetEmail(email, token)

    return success(200, 'Password reset email sent')
  } catch (err) {
    return error(500, err instanceof Error ? err.message : 'An unknown error occurred')
  }
}
