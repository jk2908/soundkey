import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getProject } from '#/api/project/utils'
import { resolveTaskAssignee } from '#/api/task/utils'

import { auth } from '#/lib/auth'

import { CreateTaskForm } from '#/components/authenticated/task/create-task-form'
import { BodyHeading } from '#/components/global/body-heading'
import * as Tabs from '#/components/global/tabs'

export async function generateMetadata({ params }: { params: { id: string } }) {
  const project = await getProject(params.id)

  if (!project) return { title: 'Project not found' }

  return { title: `${project.name} by ${project.artist}` }
}

export default async function Page({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams: { [key: string]: string | undefined }
}) {
  const user = await auth()
  const project = await getProject(params.id)

  if (!user) return redirect('/login')

  const assignee = searchParams.q ? await resolveTaskAssignee(searchParams.q) : null

  if (!project) {
    return (
      <>
        <BodyHeading level={1} className="sr-only">
          Project not found
        </BodyHeading>

        <div className="flex items-start gap-4">
          <p>
            The project is gone.{' '}
            <Link href="/dashboard" className="body-link">
              Return to dashboard
            </Link>{' '}
            or{' '}
            <Link href="/projects/new" className="body-link">
              start a new one.
            </Link>
            .
          </p>
        </div>
      </>
    )
  }

  const { projectId, name, artist } = project

  return (
    <>
      <BodyHeading level={1} className="sr-only">
        {name} by {artist}
      </BodyHeading>

      <section>
        <BodyHeading level={2} styleAsLevel={5}>
          Timeline
        </BodyHeading>
      </section>

      <section>
        <BodyHeading level={2} styleAsLevel={5} className="mb-4">
          Manage tasks
        </BodyHeading>

        <Tabs.Root initialValue="add" loop>
          <div className="space-y-8">
            <Tabs.List className="sk-rounded-tab-group">
              <Tabs.Button value="add">Add</Tabs.Button>
              <Tabs.Button value="update">Update</Tabs.Button>
            </Tabs.List>

            <Tabs.Panel value="add" className="sk-focus">
              <CreateTaskForm
                projectId={projectId}
                resolvedAssignees={
                  assignee
                    ? [
                        {
                          userId: assignee.userId,
                          label: assignee.username,
                        },
                      ]
                    : []
                }
                className="max-w-prose"
              />
            </Tabs.Panel>

            <Tabs.Panel value="update" className="sk-focus">
              <p>Update</p>
            </Tabs.Panel>
          </div>
        </Tabs.Root>
      </section>
    </>
  )
}
