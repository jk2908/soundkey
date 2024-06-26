import { Suspense } from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getOwnedProjects } from '#/api/project/utils'
import { ErrorBoundary } from 'react-error-boundary'

import { auth } from '#/lib/auth'
import { pluralise } from '#/utils/pluralise'
import { toLocaleFromTimestamp } from '#/utils/to-locale-from-timestamp'

import { ProjectInFocus } from '#/components/authenticated/project/project-in-focus'
import { ProjectsList } from '#/components/authenticated/project/projects-list'
import { BodyHeading } from '#/components/global/body-heading'
import { Spinner } from '#/components/global/spinner'
import * as Tabs from '#/components/global/tabs'

export default async function Page() {
  const user = await auth()

  if (!user) throw redirect('/login')

  const projects = await getOwnedProjects(user.id)
  const [lastOwned] = projects

  return (
    <>
      <BodyHeading level={1} className="sr-only">
        All projects
      </BodyHeading>

      <p>
        You currently have {projects.length} ongoing{' '}
        {pluralise(projects.length, 'project', 'projects')}.
      </p>

      <Tabs.Root initialValue="owner" loop>
        <div className="space-y-8">
          <Tabs.List className="sk-rounded-tab-group max-w-prose">
            <Tabs.Button value="owner">Owner</Tabs.Button>
            <Tabs.Button value="member">Member</Tabs.Button>
          </Tabs.List>

          <Tabs.Panel value="owner" className="sk-focus space-y-6 rounded-xl">
            {projects.length ? (
              <>
                {lastOwned && (
                  <Suspense fallback={<Spinner />}>
                    <ProjectInFocus
                      project={{
                        ...lastOwned,
                        createdAt: toLocaleFromTimestamp(lastOwned.createdAt),
                        updatedAt: toLocaleFromTimestamp(lastOwned.updatedAt),
                      }}
                      className="mb-10 max-w-prose"
                    />
                  </Suspense>
                )}

                <ErrorBoundary
                  fallback={<div>Something went wrong loading your owned projects</div>}>
                  <ProjectsList projects={projects} />
                </ErrorBoundary>
              </>
            ) : (
              <p>
                You don&apos;t own any projects yet.{' '}
                <Link href="/projects/create" className="body-link">
                  Start a new one?
                </Link>
              </p>
            )}
          </Tabs.Panel>

          <Tabs.Panel value="member" className="sk-focus rounded-xl">
            I&apos;m a member of this project
          </Tabs.Panel>
        </div>
      </Tabs.Root>
    </>
  )
}
