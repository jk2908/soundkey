'use server'

import * as context from 'next/headers'
import { eq } from 'drizzle-orm'

import { _auth, getPageSession } from '@/lib/auth'
import { APP_NAME } from '@/lib/config'
import { db, type DbError } from '@/lib/db'
import { sendPasswordResetEmail, sendVerificationEmail } from '@/lib/email'
import { message, thread, user, type NewMessage } from '@/lib/schema'
import { createEmailVerificationToken, createPasswordResetToken } from '@/lib/token'
import type { ServerResponse } from '@/lib/types'
import { capitalise } from '@/utils/capitalise'
import { isValidEmail } from '@/utils/is-valid-email'

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
    const { userId } = await _auth.createUser({
      key: {
        providerId: 'email',
        providerUserId: email.toLowerCase(),
        password,
      },
      attributes: {
        email: email.toLowerCase(),
        email_verified: false,
        created_at: new Date().toISOString(),
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
    await sendMessage({
      content: `Welcome to ${APP_NAME}. Please check your email to verify your account. Certain features may be unavailable until your account is verified.`,
      created_at: new Date().toISOString(),
      from_user_id: 'system',
      to_user_id: [userId],
    })

    return {
      type: 'success',
      message: 'Account created',
      status: 201,
    } satisfies ServerResponse
  } catch (err) {
    return {
      type: 'error',
      message: capitalise((err as DbError)?.message) ?? 'An unknown error occurred',
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
      message: capitalise((err as DbError)?.message) ?? 'An unknown error occurred',
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
      message: capitalise((err as DbError)?.message) ?? 'An unknown error occurred',
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
      message: capitalise((err as DbError)?.message) ?? 'An unknown error occurred',
      status: 500,
    } satisfies ServerResponse
  }
}

export async function sendMessage(newMessage: NewMessage) {
  try {
    const [existingThread] = await db.select().from(thread).where(eq(thread.id, message.thread_id))

    if (!existingThread) {
      const [newThread] = await db
        .insert(thread)
        .values({
          created_at: new Date().toISOString(),
        })
        .returning({ id: thread.id })

      newMessage.thread_id = newThread.id
    }

    await db.insert(message).values({
      ...newMessage,
    })

    return {
      type: 'success',
      message: 'Message sent',
      status: 201,
    } satisfies ServerResponse
  } catch (err) {
    return {
      type: 'error',
      message: capitalise((err as DbError)?.message) ?? 'An unknown error occurred',
      status: 500,
    } satisfies ServerResponse
  }
}
