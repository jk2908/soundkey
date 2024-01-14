'use server'

import * as context from 'next/headers'
import { eq } from 'drizzle-orm'

import { _auth, getPageSession } from '@/lib/auth'
import { db, type DbError } from '@/lib/db'
import { sendPasswordResetEmail, sendVerificationEmail } from '@/lib/email'
import { user } from '@/lib/schema'
import { createEmailVerificationToken, createPasswordResetToken } from '@/lib/token'
import type { ActionResponse } from '@/lib/types'
import { isValidEmail } from '@/utils/is-valid-email'

export async function signup(prevState: ActionResponse, formData: FormData) {
  const email = formData.get('email')
  const password = formData.get('password')

  if (!isValidEmail(email)) {
    return {
      type: 'error',
      message: 'Invalid email',
      status: 400,
    } satisfies ActionResponse
  }

  if (typeof password !== 'string' || password.length < 8 || password.length > 255) {
    return {
      type: 'error',
      message: 'Invalid password',
      status: 400,
    } satisfies ActionResponse
  }

  try {
    const { userId } = await _auth.createUser({
      key: {
        providerId: 'email',
        providerUserId: email.toLowerCase(),
        password,
      },
      attributes: {
        email: email.toLowerCase(),
        email_verified: false,
        role: 'user',
      },
    })

    const session = await _auth.createSession({
      userId,
      attributes: {},
    })

    const _authRequest = _auth.handleRequest('POST', context)
    _authRequest.setSession(session)

    const token = await createEmailVerificationToken(userId)
    await sendVerificationEmail(email, token)

    return {
      type: 'success',
      message: 'Account created',
      status: 201,
    } satisfies ActionResponse
  } catch (err) {
    return {
      type: 'error',
      message: (err as DbError)?.message ?? 'An unknown error occurred',
      status: 500,
    } satisfies ActionResponse
  }
}

export async function login(prevState: ActionResponse, formData: FormData) {
  const email = formData.get('email')
  const password = formData.get('password')

  if (!isValidEmail(email)) {
    return { type: 'error', message: 'Invalid email', status: 400 } satisfies ActionResponse
  }

  if (typeof password !== 'string' || password.length < 8 || password.length > 255) {
    return { type: 'error', message: 'Invalid password', status: 400 } satisfies ActionResponse
  }

  try {
    const { userId } = await _auth.useKey('email', email.toLowerCase(), password)
    const session = await _auth.createSession({
      userId,
      attributes: {},
    })

    const _authRequest = _auth.handleRequest('POST', context)
    _authRequest.setSession(session)

    return { type: 'success', message: 'Logged in', status: 200 } satisfies ActionResponse
  } catch (err) {
    return {
      type: 'error',
      message: (err as DbError)?.message ?? 'An unknown error occurred',
      status: 500,
    } satisfies ActionResponse
  }
}

export async function logout() {
  const _authRequest = _auth.handleRequest('POST', context)
  const session = await _authRequest.validate()

  if (!session) {
    return { type: 'error', message: 'No session', status: 401 } satisfies ActionResponse
  }

  await _auth.invalidateSession(session.sessionId)
  _authRequest.setSession(null)

  return { type: 'success', message: 'Logged out', status: 200 } satisfies ActionResponse
}

export async function verifyEmail(prevState: ActionResponse) {
  const session = await getPageSession()

  if (!session) {
    return { type: 'error', message: 'No session', status: 401 } satisfies ActionResponse
  }

  const { user } = session

  if (user.emailVerified) {
    return {
      type: 'error',
      message: 'Email already verified',
      status: 400,
    } satisfies ActionResponse
  }

  try {
    const token = await createEmailVerificationToken(user.userId)
    await sendVerificationEmail(user.email, token)

    return {
      type: 'success',
      message: 'Verification email sent',
      status: 200,
    } satisfies ActionResponse
  } catch (err) {
    return {
      type: 'error',
      message: 'An unknown error occurred',
      status: 500,
    } satisfies ActionResponse
  }
}

export async function resetPassword(prevState: ActionResponse, formData: FormData) {
  const email = formData.get('email')

  if (!isValidEmail(email)) {
    return { type: 'error', message: 'Invalid email', status: 400 } satisfies ActionResponse
  }

  try {
    const [storedUser] = await db
      .select()
      .from(user)
      .where(eq(user.email, email.toLowerCase()))
      .limit(1)

    if (!storedUser) {
      return { type: 'error', message: 'Invalid email', status: 400 } satisfies ActionResponse
    }

    const { userId } = _auth.transformDatabaseUser(storedUser)
    const token = await createPasswordResetToken(userId)

    await sendPasswordResetEmail(email, token)

    return {
      type: 'success',
      message: 'Password reset email sent',
      status: 200,
    } satisfies ActionResponse
  } catch (err) {
    return {
      type: 'error',
      message: 'An unknown error occurred',
      status: 500,
    } satisfies ActionResponse
  }
}
