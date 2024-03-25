import { Suspense } from 'react'
import { revalidateTag } from 'next/cache'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getThreads } from '@/actions/thread/db'
import { eq } from 'drizzle-orm'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { threadToUserTable } from '@/lib/schema'

import { ThreadPreview } from '@/components/authenticated/thread-preview'
import { Heading } from '@/components/global/heading'
import { Icon } from '@/components/global/icon'
import { SKTableRowLoader } from '@/components/global/sk-table-row-loader'

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
        <div className="flex overflow-x-auto box-content sk-scrollbar">
        <table className="sk-table" role="treegrid" aria-label="List of threads">
          <thead>
            <tr role="row">
              <th>With</th>
              <th className="w-56">Created</th>
              <th className="w-56">Updated</th>
              <th className="w-32">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {threads.map(t => (
              <Suspense key={t.threadId} fallback={<SKTableRowLoader cells={4} />}>
                <ThreadPreview
                  userId={user.userId}
                  thread={t}
                  onDelete={async () => {
                    'use server'

                    await db
                      .delete(threadToUserTable)
                      .where(eq(threadToUserTable.threadId, t.threadId))
                    revalidateTag('threads')
                  }}
                />
              </Suspense>
            ))}
          </tbody>
        </table>
        </div>
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
