import { redirect } from 'next/navigation'

import { auth } from '#/lib/auth'

import { CreateProjectForm } from '#/components/authenticated/project/create-project-form'

export default async function Page() {
  const user = await auth()

  if (!user) redirect('/login')

  return <CreateProjectForm userId={user.userId} className="max-w-prose" />
}
