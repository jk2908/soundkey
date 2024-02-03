'use server'

import * as context from 'next/headers'
import { sendPasswordResetEmail, sendVerificationEmail } from '@/actions/email'
import { sendMessage } from '@/actions/message'
import { createEmailVerificationToken, createPasswordResetToken } from '@/actions/token'
import { getSystemUser } from '@/actions/user'
import { eq } from 'drizzle-orm'

import { _auth, getPageSession } from '@/lib/auth'
import { APP_NAME } from '@/lib/config'
import { db } from '@/lib/db'
import { NewUser, user } from '@/lib/schema'
import type { ServerResponse } from '@/lib/types'
import { capitalise } from '@/utils/capitalise'
import { isValidEmail } from '@/utils/is-valid-email'

export async function createUser({
  email,
  password,
  role = 'user',
}: NewUser & { password: string }) {
  try {
    const user = await _auth.createUser({
      key: {
        providerId: 'email',
        providerUserId: email.toLowerCase(),
        password,
      },
      attributes: {
        email: email.toLowerCase(),
        email_verified: false,
        created_at: new Date().toISOString(),
        role,
      },
    })

    return user
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
    const { userId } = await createUser({ email, password })
    const _session = await _auth.createSession({
      userId,
      attributes: {},
    })

    const _authRequest = _auth.handleRequest('POST', context)
    _authRequest.setSession(_session)

    const token = await createEmailVerificationToken(userId)
    await sendVerificationEmail(email, token)

    const { userId: systemUserId } = await getSystemUser()
    await sendMessage({
      body: `Welcome to ${APP_NAME}. Please check your email to verify your account. Certain features may be unavailable until your account is verified.`,
      createdAt: new Date().toISOString(),
      senderId: systemUserId,
      recipientIds: [userId],
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
    const { userId } = await _auth.useKey('email', email.toLowerCase(), password)
    const session = await _auth.createSession({
      userId,
      attributes: {},
    })

    const _authRequest = _auth.handleRequest('POST', context)
    _authRequest.setSession(session)

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
  const _authRequest = _auth.handleRequest('POST', context)
  const session = await _authRequest.validate()

  if (!session) {
    return { type: 'error', message: 'No session', status: 401 } satisfies ServerResponse
  }

  await _auth.invalidateSession(session.sessionId)
  _authRequest.setSession(null)

  return { type: 'success', message: 'Logged out', status: 200 } satisfies ServerResponse
}

export async function verifyEmail(prevState: ServerResponse) {
  const session = await getPageSession()

  if (!session) {
    return { type: 'error', message: 'No session', status: 401 } satisfies ServerResponse
  }

  const { user } = session

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
    const [storedUser] = await db
      .select()
      .from(user)
      .where(eq(user.email, email.toLowerCase()))
      .limit(1)

    if (!storedUser) {
      return { type: 'error', message: 'Invalid email', status: 400 } satisfies ServerResponse
    }

    // @ts-expect-error
    const { userId } = _auth.transformDatabaseUser(storedUser)
    const token = await createPasswordResetToken(userId)

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
