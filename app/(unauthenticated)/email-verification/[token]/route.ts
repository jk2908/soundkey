import type { NextRequest } from 'next/server'

import { auth } from '@/lib/auth'
import { validateEmailVerificationToken } from '@/lib/token'

export async function GET(
  _: NextRequest,
  {
    params,
  }: {
    params: {
      token: string
    }
  }
) {
  const { token } = params

  try {
    const id = await validateEmailVerificationToken(token)
    const { userId } = await auth.getUser(id)

    await auth.invalidateAllUserSessions(userId)
    await auth.updateUserAttributes(userId, {
      email_verified: true,
    })

    const session = await auth.createSession({
      userId,
      attributes: {},
    })

    const sessionCookie = auth.createSessionCookie(session)

    return new Response(null, {
      status: 302,
      headers: {
        Location: '/',
        'Set-Cookie': sessionCookie.serialize(),
      },
    })
  } catch {
    return new Response('Invalid email verification link', {
      status: 400,
    })
  }
}
