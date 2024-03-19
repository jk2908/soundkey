import type { NextRequest } from 'next/server'
import { getThread } from '@/actions/thread/db'
import { getUsers } from '@/actions/user/db'

export async function GET(
  _: NextRequest,
  {
    params,
  }: {
    params: {
      id: string
    }
  }
) {
  const { id } = params

  try {
    const thread = await getThread(id)

    if (!thread) {
      return new Response('Thread not found', {
        status: 400,
      })
    }

    const userIds = thread.userIds.split(',')
    const users = await getUsers(userIds)

    return new Response(
      JSON.stringify(users),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  } catch (err) {
    return new Response('Thread not found', {
      status: 400,
    })
  }
}
