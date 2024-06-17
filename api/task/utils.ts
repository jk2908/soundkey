import { revalidateTag } from 'next/cache'
import { eq, or } from 'drizzle-orm'

import { db } from '#/lib/db'
import { taskTable, userTable, type NewTask } from '#/lib/schema'
import { generateId } from '#/utils/generate-id'

export async function createTask(task: NewTask) {
  const { projectId, assigneeIds, title, description, priority, status, due } = task

  try {
    const id = generateId()

    const [task] = await db
      .insert(taskTable)
      .values({
        id,
        projectId,
        assigneeIds,
        title,
        description,
        priority,
        status,
        due,
      })
      .returning({
        taskId: taskTable.id,
      })

    revalidateTag('project')

    return task
  } catch (err) {
    console.error(err)
    throw err
  }
}

export async function resolveTaskAssignee(str: string) {
  try {
    const [recipient] = await db
      .select({ userId: userTable.id, email: userTable.email, username: userTable.username })
      .from(userTable)
      .where(or(eq(userTable.email, str.toLowerCase()), eq(userTable.username, str)))

    return recipient
  } catch (err) {
    return null
  }
}
