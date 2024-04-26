import { cookies } from 'next/headers'
import type { NextRequest } from 'next/server'
import { validateEmailVerificationToken } from '@/api/token/utils'
import { getUser } from '@/api/user/utils'
import { eq } from 'drizzle-orm'

import { lucia } from '@/lib/auth'
import { db } from '@/lib/db'
import { userTable } from '@/lib/schema'

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
    const user = await getUser(id)

    if (!user) {
      return new Response('User not found', {
        status: 400,
      })
    }

    await lucia.invalidateUserSessions(user?.userId)
    await db.update(userTable).set({ emailVerified: true }).where(eq(userTable.id, user?.userId))

    const session = await lucia.createSession(user.userId, {})
    const sessionCookie = lucia.createSessionCookie(session.id)
    cookies().set(sessionCookie)

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
