'use client'

import { useActionState, useEffect, useId, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { create } from '#/api/project/actions'

import { useToast } from '#/hooks/use-toast'
import { cn } from '#/utils/cn'

import { BodyHeading } from '#/components/global/body-heading'
import { FormGroup } from '#/components/global/form-group'
import { HorizontalRule } from '#/components/global/horizontal-rule'
import { Input } from '#/components/global/input'
import { Label } from '#/components/global/label'
import { SubmitButton } from '#/components/global/submit-button'

export function CreateProjectForm({
  userId,
  className,
  ...rest
}: { userId: string; className?: string } & React.HTMLAttributes<HTMLFormElement>) {
  const ref = useRef<HTMLFormElement>(null)

  const nameId = useId()
  const descriptionId = useId()
  const coordinatorNameId = useId()
  const coordinatorEmailId = useId()
  const coordinatorPhoneId = useId()
  const artistId = useId()
  const labelId = useId()
  const managementId = useId()

  const { push } = useRouter()

  const [res, dispatch] = useActionState(create.bind(null, userId), null)
  const { toast } = useToast()

  useEffect(() => {
    if (!res) return

    const { ok, message = '', status, payload } = res

    if (!ok) {
      toast.error({ message, status })
      return
    }

    toast.success({ message, status })

    if (payload) {
      push(`/projects/p/${payload}`)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [res])

  return (
    <form ref={ref} action={dispatch} className={cn('flex flex-col', className)} {...rest}>
      <FormGroup withNestedChildren>
        <BodyHeading level={2} styleAsLevel={5}>
          Project details
        </BodyHeading>

        <FormGroup>
          <Label htmlFor={nameId}>Name</Label>
          <Input id={nameId} name="name" required />
        </FormGroup>

        <FormGroup>
          <Label htmlFor={descriptionId}>Description</Label>
          <Input id={descriptionId} name="description" />
        </FormGroup>
      </FormGroup>

      <FormGroup withNestedChildren>
        <HorizontalRule className="border-dashed pb-4" />

        <BodyHeading level={2} styleAsLevel={5}>
          Project coordinator
        </BodyHeading>

        <p className="mb-4">
          The project coordinator is the main point of contact for the project.
        </p>

        <FormGroup>
          <Label htmlFor={coordinatorNameId}>Name</Label>
          <Input id={coordinatorNameId} name="coordinator-name" required />
        </FormGroup>

        <FormGroup>
          <Label htmlFor={coordinatorEmailId}>Email</Label>
          <Input id={coordinatorEmailId} name="coordinator-email" type="email" required />
        </FormGroup>

        <FormGroup>
          <Label htmlFor={coordinatorPhoneId}>Phone</Label>
          <Input id={coordinatorPhoneId} name="coordinator-phone" type="tel" />
        </FormGroup>
      </FormGroup>

      <FormGroup withNestedChildren>
        <HorizontalRule className="border-dashed pb-4" />

        <BodyHeading level={2} styleAsLevel={5}>
          Artist details
        </BodyHeading>

        <FormGroup>
          <Label htmlFor={artistId}>Artist</Label>
          <Input id={artistId} name="artist" required />
        </FormGroup>

        <FormGroup>
          <Label htmlFor={managementId}>Management</Label>
          <Input id={managementId} name="management" />
        </FormGroup>

        <FormGroup>
          <Label htmlFor={labelId}>Label</Label>
          <Input id={labelId} name="label" />
        </FormGroup>
      </FormGroup>

      <FormGroup withNestedChildren>
        <HorizontalRule className="border-dashed pb-4" />

        <BodyHeading level={2} styleAsLevel={5}>
          Project plan
        </BodyHeading>

        <FormGroup>
          <div>
            <Label as="span">Tasks</Label>
          </div>

          <p>
            Not available here yet. When ready, please hit &apos;create&apos; to progress to the
            next screen where you can add project tasks.
          </p>
        </FormGroup>
      </FormGroup>

      {/*
        <div className="flex flex-col gap-x-2 gap-y-8 md:flex-row">
          {tasks.length ? (
            <ul>
              {tasks.map(t => (
                <li key={t.id}>{t.title}</li>
              ))}
            </ul>
          ) : null}

          {!isProjectTaskFormOpen ? (
            <Button
              ref={addTaskRef}
              onClick={() => {
                setProjectTaskFormOpen(true)
              }}
              variant="secondary"
              size="sm">
              Add task
              <Icon name="calendar-plus" size={16} />
            </Button>
          ) : (
            <AddProjectTask
              className="w-full"
              onSave={(task: ProjectTask) => {
                flushSync(() => {
                  setTasks([...tasks, task])
                  setProjectTaskFormOpen(false)
                })

                addTaskRef.current?.focus()
              }}
              onCancel={() => {
                flushSync(() => {
                  setProjectTaskFormOpen(false)
                })

                addTaskRef.current?.focus()
              }}
            />
          )}
        </div>
      </FormGroup>
      */}

      <FormGroup followsNestedChildren>
        <SubmitButton>{({ isPending }) => (isPending ? 'Creating...' : 'Create')}</SubmitButton>
      </FormGroup>
    </form>
  )
}
