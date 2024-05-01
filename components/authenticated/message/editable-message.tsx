'use client'

import { createContext, use, useActionState, useCallback, useEffect, useRef, useState } from 'react'
import { update } from '#/api/message/actions'

import type { ServerResponse } from '#/lib/types'
import { useToast } from '#/hooks/use-toast'
import { cn } from '#/utils/cn'

type EditableProvider = {
  ref: React.RefObject<HTMLDivElement>
  isEditing: boolean
  setEditing: React.Dispatch<React.SetStateAction<boolean>>
  edit: string
  setEdit: React.Dispatch<React.SetStateAction<string>>
  save: (t?: string) => Promise<void>
  cancel: () => void
}

export const EditableMessageContext = createContext<EditableProvider>({
  ref: { current: null },
  isEditing: false,
  setEditing: () => {},
  edit: '',
  setEdit: () => {},
  save: async () => {},
  cancel: () => {},
})

const initialState: ServerResponse = {
  type: undefined,
  message: null,
  status: undefined,
}

export function Root({ messageId, children }: { messageId: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const [isEditing, setEditing] = useState(false)
  const [edit, setEdit] = useState('')
  const [originalStr, setOriginalStr] = useState('')
  const [state, dispatch] = useActionState(update.bind(null, messageId, edit), initialState)

  const { toast } = useToast()

  useEffect(() => {
    if (!ref.current) return

    setEdit(ref.current.innerText)
    setOriginalStr(ref.current.innerText)
  }, [ref])

  useEffect(() => {
    if (!state.type) return

    toast({ ...state })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state])

  const save = useCallback(async () => {
    if (originalStr === edit) {
      setEditing(false)
      return
    }

    dispatch()
    setEditing(false)
    setOriginalStr(edit)
    setEdit('')
  }, [originalStr, edit, dispatch])

  const cancel = useCallback(() => {
    if (!ref.current) return

    ref.current.innerText = originalStr
    setEditing(false)
  }, [originalStr, ref])

  return (
    <EditableMessageContext.Provider
      value={{
        ref,
        isEditing,
        setEditing,
        edit,
        setEdit,
        save,
        cancel,
      }}>
      {children}
    </EditableMessageContext.Provider>
  )
}

export function Text({
  children,
  className,
  style,
}: {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
} & React.HTMLAttributes<HTMLDivElement>) {
  const { ref, isEditing, setEdit } = use(EditableMessageContext)

  useEffect(() => {
    if (!ref.current || isEditing) return

    const r = document.createRange()
    const s = getSelection()

    r.setStart(ref.current, ref.current.childNodes.length)
    r.collapse(true)
    s?.removeAllRanges()
    s?.addRange(r)
  }, [isEditing, ref])

  return (
    <div
      ref={ref}
      style={{ ...style, wordBreak: 'break-word' }}
      className={cn(className)}
      contentEditable={isEditing}
      onInput={e => setEdit(e.currentTarget.innerText.trim())}
      suppressContentEditableWarning>
      {children}
    </div>
  )
}
