import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getProject } from '#/api/project/utils'

import { auth } from '#/lib/auth'

export async function generateMetadata({ params }: { params: { id: string } }) {
  const project = await getProject(params.id)

  if (!project) return { title: 'Project not found' }

  const { name, artist } = project

  return { title: `${name} by ${artist}` }
}

export default async function Page({ params }: { params: { id: string } }) {
  const user = await auth()
  const project = await getProject(params.id)

  if (!user) redirect('/login')

  if (!project) {
    return (
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
    )
  }

  return (
    <div>
      <h1>{project.name}</h1>
      <p>{project.description}</p>
    </div>
  )
}
