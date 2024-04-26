import type { NextRequest } from 'next/server'
import { getMessages } from '@/api/message/utils'
import { getUsers } from '@/api/user/utils'

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
    const messages = await getMessages(params.id)

    if (!messages) {
      return new Response(`No messages found for thread ${params.id}`, {
        status: 400,
      })
    }

    return (
      Response.json(messages),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  } catch (err) {
    return new Response(`No messages found for thread ${params.id}`, {
      status: 400,
    })
  }
}
