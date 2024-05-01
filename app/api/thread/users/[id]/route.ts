import type { NextRequest } from 'next/server'
import { getThread } from '#/api/thread/utils'
import { getUsers } from '#/api/user/utils'

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
  try {
    const thread = await getThread(params.id)

    if (!thread) {
      return new Response(`Thread ${params.id} not found`, {
        status: 400,
      })
    }

    const userIds = thread.userIds.split(',')
    const users = await getUsers(userIds)

    return Response.json(
      users,
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  } catch (err) {
    return new Response(`Thread ${params.id} not found`, {
      status: 400,
    })
  }
}
