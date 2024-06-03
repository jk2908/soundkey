'use client'

import { useId, useState, useTransition } from 'react'

import { type ProjectTask } from '#/lib/types'
import { cn } from '#/utils/cn'
import { generateId } from '#/utils/generate-id'

import { Button } from '#/components/global/button'
import { FormGroup } from '#/components/global/form-group'
import { HighlightBox } from '#/components/global/highlight-box'
import { Input } from '#/components/global/input'
import { Label } from '#/components/global/label'

type Props = {
  onSave: (task: ProjectTask) => void
  onCancel: () => void
  ref?: React.Ref<HTMLDivElement>
  className?: string
} & React.HTMLAttributes<HTMLDivElement>

export function AddProjectTask({ onSave, onCancel, ref, className, ...rest }: Props) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const [isPending, startTransition] = useTransition()

  const titleId = useId()
  const descriptionId = useId()

  return (
    <HighlightBox ref={ref} className={cn(className)} {...rest}>
      <FormGroup>
        <Label htmlFor={titleId}>Title</Label>
        <Input
          id={titleId}
          name="title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="border-highlight/30 bg-white"
          autoFocus
        />
      </FormGroup>

      <FormGroup>
        <Label htmlFor={descriptionId}>Description</Label>
        <Input
          id={descriptionId}
          name="description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="border-highlight/30 bg-white"
        />
      </FormGroup>

      <FormGroup className="flex items-center justify-center gap-4 space-y-0">
        <Button
          onClick={(e: React.SyntheticEvent) => {
            e.preventDefault()

            startTransition(() => {
              onSave({ id: generateId(), title, description, isCompleted: false })
            })

            setTitle('')
            setDescription('')
          }}>
          {isPending ? 'Saving...' : 'Save'}
        </Button>

        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
      </FormGroup>
    </HighlightBox>
  )
}
