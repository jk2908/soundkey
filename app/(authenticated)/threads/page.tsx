import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getThreads } from '@/actions/message/db'

import { auth } from '@/lib/auth'

import { Heading } from '@/components/global/heading'
import { Icon } from '@/components/global/icon'

export default async function Page() {
  const user = await auth()

  if (!user) throw redirect('/login')

  const threads = await getThreads(user.userId)

  return (
    <>
      <Heading level={1} className="sr-only">
        Threads
      </Heading>
      <ul>
        {threads.length ? (
          threads.map(({ threadId }) => (
            <li key={threadId}>
              {threadId} <Link href={`/threads/${threadId}`}>View</Link>
            </li>
          ))
        ) : (
          <div className="flex h-64 flex-col items-center justify-center">
            <Icon name="inbox" size={32} />
            <p className="text-lg font-medium">No threads found</p>
          </div>
        )}
      </ul>
    </>
  )
}
