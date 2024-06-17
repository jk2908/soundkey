'use server'

import { createTask } from '#/api/task/utils'
import { parse } from 'valibot'

import { NewTask, NewTaskSchema } from '#/lib/schema'
import { ActionResponse } from '#/lib/types'
import { error, success } from '#/utils/action-response'

export async function create(
  projectId: string,
  assigneeIds: string[],
  prevState: ActionResponse | null,
  formData: FormData
) {
  try {
    const newTask = parse(NewTaskSchema, {
      projectId,
      assigneeIds: assigneeIds.join(','),
      ...Object.fromEntries(formData),
    })

    const { taskId } = await createTask({
      ...newTask,
    })

    return success(201, 'Task created', { payload: taskId })
  } catch (err) {
    return error(500, err)
  }
}
