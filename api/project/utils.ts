import { cache } from 'react'
import { revalidateTag } from 'next/cache'
import { desc, eq } from 'drizzle-orm'

import { db } from '#/lib/db'
import { projectTable, type NewProject } from '#/lib/schema'
import { generateId } from '#/utils/generate-id'

export async function createProject(project: NewProject) {
  const {
    userId,
    name,
    description,
    coordinatorName,
    coordinatorEmail,
    coordinatorPhone,
    artist,
    management,
    label,
  } = project

  try {
    const id = generateId()

    const [project] = await db
      .insert(projectTable)
      .values({
        id,
        userId,
        name,
        description,
        coordinatorName,
        coordinatorEmail,
        coordinatorPhone,
        artist,
        management,
        label,
      })
      .returning({
        projectId: projectTable.id,
      })

    revalidateTag('project')

    return project
  } catch (err) {
    console.error(err)
    throw err
  }
}

export const getProject = cache(async (projectId: string) => {
  try {
    const [project] = await db.select().from(projectTable).where(eq(projectTable.id, projectId))

    if (!project) return null

    return { ...project, projectId: project.id }
  } catch (err) {
    console.error(err)
    return null
  }
})

export const getOwnedProjects = cache(async (userId: string) => {
  try {
    return await db
      .select({
        projectId: projectTable.id,
        userId: projectTable.userId,
        name: projectTable.name,
        description: projectTable.description,
        coordinatorName: projectTable.coordinatorName,
        coordinatorEmail: projectTable.coordinatorEmail,
        coordinatorPhone: projectTable.coordinatorPhone,
        artist: projectTable.artist,
        management: projectTable.management,
        label: projectTable.label,
        createdAt: projectTable.createdAt,
        updatedAt: projectTable.updatedAt,
      })
      .from(projectTable)
      .where(eq(projectTable.userId, userId))
      .orderBy(desc(projectTable.createdAt))
  } catch (err) {
    console.error(err)
    return []
  }
})