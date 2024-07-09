'use client'

import { startTransition, useActionState, useEffect, useId, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { create } from '#/api/task/actions'
import { flushSync } from 'react-dom'

import { taskPriorities, type TaskPriority, type TaskStatus } from '#/lib/schema'
import { useToast } from '#/hooks/use-toast'
import { capitalise } from '#/utils/capitalise'

import { FormGroup } from '#/components/global/form-group'
import { Icon } from '#/components/global/icon'
import { Input } from '#/components/global/input'
import { Label } from '#/components/global/label'
import * as Listbox from '#/components/global/listbox'
import * as Search from '#/components/global/search'
import * as Select from '#/components/global/select'
import { Spinner } from '#/components/global/spinner'
import { SubmitButton } from '#/components/global/submit-button'

type ResolvedAssignee = {
  userId: string
  label: string
}

type Props = {
  projectId: string
  resolvedAssignees: ResolvedAssignee[]
  className?: string
} & React.HTMLAttributes<HTMLFormElement>

export function CreateTaskForm({ projectId, resolvedAssignees, className, ...rest }: Props) {
  const ref = useRef<HTMLFormElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  const [assignees, setAssignees] = useState<ResolvedAssignee[] | []>(resolvedAssignees)
  const [priority, setPriority] = useState<TaskPriority>('medium')
  const [status, setStatus] = useState<TaskStatus>('open')

  const titleId = useId()
  const descriptionId = useId()
  const assigneesId = useId()
  const priorityId = useId()
  const statusId = useId()
  const dueId = useId()

  const [res, dispatch] = useActionState(
    create.bind(
      null,
      projectId,
      assignees.map(u => u.userId)
    ),
    null
  )
  const { replace } = useRouter()
  const { toast } = useToast()
  const pathname = usePathname()

  useEffect(() => {
    if (!res) return

    const { ok, message = '', status } = res

    if (!ok) {
      toast.error({ message, status })
      return
    }

    toast.success({ message, status })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [res])

  return (
    <form ref={ref} action={dispatch} className={className} {...rest}>
      <FormGroup>
        <Label htmlFor={titleId}>Title</Label>
        <Input id={titleId} name="title" />
      </FormGroup>

      <FormGroup>
        <Label htmlFor={descriptionId}>Description</Label>
        <Input id={descriptionId} name="description" />
      </FormGroup>

      <FormGroup>
        <Label htmlFor={assigneesId}>Assignees</Label>

        <Search.Root className="flex flex-col gap-2">
          {({ setValue }) => (
            <>
              <Search.Box
                ref={searchRef}
                placeholder="To"
                name="to"
                id={assigneesId}
                results={resolvedAssignees?.map(a => a.label)}
                onConfirm={(value, e) => {
                  e.stopPropagation()

                  if (!resolvedAssignees?.length) return

                  startTransition(() => {
                    setValue('')
                    replace(pathname)
                  })

                  flushSync(() => {
                    setAssignees(prev => [
                      ...prev.filter(u => u.label !== value),
                      ...resolvedAssignees,
                    ])
                  })

                  searchRef.current?.focus()
                }}
                onClear={() => {
                  searchRef.current?.focus()
                }}
              />

              <Search.Results>
                <Listbox.Root
                  selected={assignees.map(a => a.label)}
                  onSelect={(value, _, e) => {
                    e.preventDefault()

                    flushSync(() => {
                      setAssignees(prev => prev.filter(u => u.label !== value))
                    })

                    searchRef.current?.focus()
                  }}
                  className="flex-row items-center gap-2">
                  <>
                    {assignees.map(u => (
                      <Listbox.Option
                        key={u.label}
                        value={u.label}
                        className="flex gap-1 rounded-full bg-app-bg-inverted text-app-fg-inverted px-2.5 py-1.5 text-sm">
                        {u.label}
                        <Icon name="x" size={10} />
                      </Listbox.Option>
                    ))}
                  </>
                </Listbox.Root>
              </Search.Results>
            </>
          )}
        </Search.Root>
      </FormGroup>

      <FormGroup>
        <Label htmlFor={priorityId}>Priority</Label>

        <Select.Root className="sk-select">
          <Select.Toggle className="flex items-center justify-between gap-2">
            {({ isOpen }) => (
              <>
                {capitalise(priority)}
                <Icon
                  name="chevron-down"
                  size={16}
                  className="transition-transform"
                  style={{ transform: `rotate(${isOpen ? '180deg' : '0deg'})` }}
                />
              </>
            )}
          </Select.Toggle>

          <Select.Options duration={0.2}>
            <Listbox.Root
              selected={[priority]}
              onSelect={(value, close) => {
                setPriority(value as TaskPriority)
                close()
              }}>
              {taskPriorities.map(p => (
                <Listbox.Option key={p} value={p}>
                  {capitalise(p)}
                </Listbox.Option>
              ))}
            </Listbox.Root>
          </Select.Options>
        </Select.Root>

        <input type="hidden" id={priorityId} name="priority" value={priority} />
      </FormGroup>

      <FormGroup>
        <SubmitButton>
          {({ isPending }) => (
            <>
              Add task
              {isPending && <Spinner />}
            </>
          )}
        </SubmitButton>
      </FormGroup>
    </form>
  )
}
