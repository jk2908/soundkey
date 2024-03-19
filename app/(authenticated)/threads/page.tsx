import { Suspense } from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getThreads } from '@/actions/thread/db'

import { auth } from '@/lib/auth'

import { ThreadPreview } from '@/components/authenticated/thread-preview'
import { SKTableRowLoader } from '@/components/global/sk-table-row-loader'
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

      {threads.length ? (
        <table className="sk-table">
          <thead>
            <tr>
              <th>With</th>
              <th>Created</th>
              <th>Updated</th>
              <th>
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {threads.map(thread => (
              <Suspense key={thread.threadId} fallback={<SKTableRowLoader cells={4} />}>
                <ThreadPreview thread={thread} />
              </Suspense>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="flex items-center gap-4">
          <Icon name="inbox" size={20} />
          <p className="font-mono">
            No threads found.{' '}
            <Link href="/threads/new" className="body-link">
              Send a message
            </Link>
            ?
          </p>
        </div>
      )}
    </>
  )
}
