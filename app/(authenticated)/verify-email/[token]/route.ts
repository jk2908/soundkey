import type { NextRequest } from 'next/server'

import { _auth } from '@/lib/auth'
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
    const { userId } = await _auth.getUser(id)

    await _auth.invalidateAllUserSessions(userId)
    await _auth.updateUserAttributes(userId, {
      email_verified: true,
    })

    const session = await _auth.createSession({
      userId,
      attributes: {},
    })

    const sessionCookie = _auth.createSessionCookie(session)

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
