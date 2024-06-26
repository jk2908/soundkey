import { Suspense } from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { deleteThread, getThreads } from '#/api/thread/utils'
import { ErrorBoundary } from 'react-error-boundary'

import { auth } from '#/lib/auth'
import { toLocaleFromTimestamp } from '#/utils/to-locale-from-timestamp'

import { ThreadPreview } from '#/components/authenticated/thread/thread-preview'
import { BodyHeading } from '#/components/global/body-heading'
import { Icon } from '#/components/global/icon'
import { SKTableRowLoader } from '#/components/global/sk-table-row-loader'
import { resolveThreadUsers } from '#/api/thread/handlers'

export default async function Page() {
  const user = await auth()

  if (!user) throw redirect('/login')

  const threads = await getThreads(user.userId)

  return (
    <>
      <BodyHeading level={1} className="sr-only">
        All threads
      </BodyHeading>

      {threads.length ? (
        <ErrorBoundary fallback={<div>Something went wrong loading your threads</div>}>
          <div className="sk-scrollbar flex overflow-x-auto">
            <table className="sk-table" role="treegrid" aria-label="List of threads">
              <thead>
                <tr>
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
                      thread={{
                        ...t,
                        createdAt: toLocaleFromTimestamp(t.createdAt),
                        updatedAt: toLocaleFromTimestamp(t.updatedAt),
                      }}
                      usersPromise={resolveThreadUsers(t.threadId)}
                      onDelete={async () => {
                        'use server'
                        await deleteThread(t.threadId)
                      }}
                    />
                  </Suspense>
                ))}
              </tbody>
            </table>
          </div>
        </ErrorBoundary>
      ) : (
        <div className="flex items-center gap-4">
          <Icon name="inbox" size={20} />
          <p>
            No threads found.{' '}
            <Link href="/threads/send" className="body-link">
              Send a message
            </Link>
            ?
          </p>
        </div>
      )}
    </>
  )
}
