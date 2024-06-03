import { Suspense } from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getOwnedProjects } from '#/api/project/utils'
import { ErrorBoundary } from 'react-error-boundary'

import { auth } from '#/lib/auth'
import { toLocaleFromTimestamp } from '#/utils/to-locale-from-timestamp'

import { ProjectInFocus } from '#/components/authenticated/project/project-in-focus'
import { ProjectPreview } from '#/components/authenticated/project/project-preview'
import { Spinner } from '#/components/global/spinner'
import * as Tabs from '#/components/global/tabs'

export default async function Page() {
  const user = await auth()

  if (!user) throw redirect('/login')

  const projects = await getOwnedProjects(user.id)
  const [lastOwned, ...restOwned] = projects

  return (
    <>
      <p className="text-sm">Ongoing projects: {projects.length}</p>

      <Tabs.Root initialValue="owner" loop>
        <div className="space-y-8">
          <Tabs.List className="rounded-tab-group max-w-prose">
            <Tabs.Button value="owner">Owner</Tabs.Button>
            <Tabs.Button value="member">Member</Tabs.Button>
          </Tabs.List>

          <Tabs.Panel value="owner" className="sk-focus space-y-6 rounded-xl">
            <Suspense fallback={<Spinner />}>
              {projects.length ? (
                <>
                  {lastOwned && (
                    <ProjectInFocus
                      project={{
                        ...lastOwned,
                        createdAt: toLocaleFromTimestamp(lastOwned.createdAt),
                        updatedAt: toLocaleFromTimestamp(lastOwned.updatedAt),
                      }}
                      className="max-w-prose"
                    />
                  )}
                  {restOwned.length ? (
                    <ErrorBoundary
                      fallback={<div>Something went wrong loading your owned projects</div>}>
                      <div className="sk-scrollbar flex overflow-x-auto">
                        <table
                          className="sk-table"
                          role="treegrid"
                          aria-label="List of owned projects">
                          <thead>
                            <tr>
                              <th>Name</th>
                              <th className="w-44">Artist</th>
                              <th className="w-56">Created</th>
                              <th className="w-56">Updated</th>
                              <th className="w-32">
                                <span className="sr-only">Actions</span>
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {restOwned.map(p => (
                              <ProjectPreview
                                key={p.projectId}
                                project={{
                                  ...p,
                                  createdAt: toLocaleFromTimestamp(p.createdAt),
                                  updatedAt: toLocaleFromTimestamp(p.updatedAt),
                                }}
                              />
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </ErrorBoundary>
                  ) : null}
                </>
              ) : (
                <p>
                  You don&apos;t own any projects yet.{' '}
                  <Link href="/projects/create" className="body-link">
                    Start a new one?
                  </Link>
                </p>
              )}
            </Suspense>
          </Tabs.Panel>

          <Tabs.Panel value="member" className="sk-focus rounded-xl">
            I&apos;m a member of this project
          </Tabs.Panel>
        </div>
      </Tabs.Root>
    </>
  )
}
