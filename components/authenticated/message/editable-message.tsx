'use client'

import { createContext, use, useCallback, useRef, useState } from 'react'

import { cn } from '@/utils/cn'

export const EditableMessageContext = createContext<{
  ref: React.RefObject<HTMLDivElement>
  isEditing: boolean
  setEditing: React.Dispatch<React.SetStateAction<boolean>>
  edit: string
  setEdit: React.Dispatch<React.SetStateAction<string>>
  save: (t?: string) => Promise<void>
}>({
  ref: { current: null },
  isEditing: false,
  setEditing: () => {},
  edit: '',
  setEdit: () => {},
  save: async () => {},
})

export function Root({
  messageId,
  children,
  onSave,
}: {
  messageId: string
  children: React.ReactNode
  onSave?: (t?: string) => Promise<void>
}) {
  const [isEditing, setEditing] = useState(false)
  const [edit, setEdit] = useState<string>('')
  const ref = useRef<HTMLDivElement>(null)

  const save = useCallback(async () => {
    await onSave?.(edit)
    setEditing(false)
  }, [edit, onSave])

  return (
    <EditableMessageContext.Provider value={{ ref, isEditing, setEditing, edit, setEdit, save }}>
      {children}
    </EditableMessageContext.Provider>
  )
}

export function Text({
  children,
  messageId,
  className,
  style,
}: {
  children: React.ReactNode
  messageId: string
  className?: string
  style?: React.CSSProperties
} & React.HTMLAttributes<HTMLDivElement>) {
  const { isEditing, setEditing, edit, setEdit, ref } = use(EditableMessageContext)

  function onBlur(e: React.FocusEvent<HTMLDivElement>) {
    setEdit(e.currentTarget.innerHTML.trim())
    setEditing(false)
  }

  return (
    <>
      <div
        ref={ref}
        style={{ ...style, wordBreak: 'break-word' }}
        className={cn(className)}
        contentEditable={isEditing}
        onBlur={onBlur}
        suppressContentEditableWarning>
        {children}
      </div>
    </>
  )
}
