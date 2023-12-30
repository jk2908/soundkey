'use server'

import * as context from 'next/headers'
import { Prisma } from '@prisma/client'

import { auth, getPageSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { sendPasswordResetEmail, sendVerificationEmail } from '@/lib/email'
import { createEmailVerificationToken, createPasswordResetToken } from '@/lib/token'
import type { ActionResponse } from '@/lib/types'
import { isValidEmail } from '@/lib/utils'

export async function signup(prevState: ActionResponse, formData: FormData) {
  const { email, password } = Object.fromEntries(formData)

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
    const { userId } = await auth.createUser({
      key: {
        providerId: 'email',
        providerUserId: email.toLowerCase(),
        password,
      },
      attributes: {
        email: email.toLowerCase(),
        email_verified: false,
      },
    })

    const session = await auth.createSession({
      userId,
      attributes: {},
    })

    const authRequest = auth.handleRequest('POST', context)
    authRequest.setSession(session)

    const token = await createEmailVerificationToken(userId)
    await sendVerificationEmail(email, token)

    return {
      type: 'success',
      message: 'Account created',
      status: 201,
    } satisfies ActionResponse
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2002') {
        return {
          type: 'error',
          message: 'Email already exists',
          status: 400,
        } satisfies ActionResponse
      }
    }

    return {
      type: 'error',
      message: 'An unknown error occured',
      status: 500,
    } satisfies ActionResponse
  }
}

export async function login(prevState: ActionResponse, formData: FormData) {
  const { email, password } = Object.fromEntries(formData)

  if (!isValidEmail(email)) {
    return { type: 'error', message: 'Invalid email', status: 400 } satisfies ActionResponse
  }

  if (typeof password !== 'string' || password.length < 8 || password.length > 255) {
    return { type: 'error', message: 'Invalid password', status: 400 } satisfies ActionResponse
  }

  try {
    const { userId } = await auth.useKey('email', email.toLowerCase(), password)
    const session = await auth.createSession({
      userId,
      attributes: {},
    })

    const authRequest = auth.handleRequest('POST', context)
    authRequest.setSession(session)

    return { type: 'success', message: 'Logged in', status: 200 } satisfies ActionResponse
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2003') {
        return {
          type: 'error',
          message: 'Invalid email or password',
          status: 400,
        } satisfies ActionResponse
      }
    }

    return {
      type: 'error',
      message: 'An unknown error occurred',
      status: 500,
    } satisfies ActionResponse
  }
}

export async function logout(prevState: ActionResponse) {
  const authRequest = auth.handleRequest('POST', context)
  const session = await authRequest.validate()

  if (!session) {
    return { type: 'error', message: 'No session', status: 401 } satisfies ActionResponse
  }

  await auth.invalidateSession(session.sessionId)
  authRequest.setSession(null)

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
    const storedUser = db.user.findFirst({
      where: {
        email: email.toLowerCase(),
      },
    })

    if (!storedUser) {
      return { type: 'error', message: 'Invalid email', status: 400 } satisfies ActionResponse
    }

    // @ts-expect-error
    const { userId } = auth.transformDatabaseUser(storedUser)
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
