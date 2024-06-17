import { redirect } from 'next/navigation'

import { auth } from '#/lib/auth'

import { CreateProjectForm } from '#/components/authenticated/project/create-project-form'
import { BodyHeading } from '#/components/global/body-heading'

export default async function Page() {
  const user = await auth()

  if (!user) redirect('/login')

  return (
    <>
      <BodyHeading level={1} className="sr-only">
        Create a new project
      </BodyHeading>

      <CreateProjectForm userId={user.userId} className="max-w-prose" />
    </>
  )
}
