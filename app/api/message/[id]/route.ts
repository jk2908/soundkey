import type { NextRequest } from 'next/server'
import { getMessages } from '@/actions/message/db'
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
