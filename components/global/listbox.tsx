'use client'

import { createContext, forwardRef, use, useId, useState } from 'react'

import { cn } from '#/utils/cn'

export const ListBoxContext = createContext<{
  selected: string[]
  isOpen: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  onSelect?: (value: string) => void
  persist?: boolean
}>({ selected: [], isOpen: false, setOpen: () => {} })

export function Root({
  children,
  selected,
  onSelect,
  persist = false,
  className,
}: {
  children: React.ReactNode
  selected: string[]
  onSelect?: (value: string) => void
  persist?: boolean
  className?: string
}) {
  const [isOpen, setOpen] = useState(persist)
  const id = useId()

  return (
    <ListBoxContext.Provider value={{ selected, isOpen, setOpen, onSelect, persist }}>
      <div id={id} role="listbox" className={cn(className)}>
        {children}
      </div>
    </ListBoxContext.Provider>
  )
}

export function Toggle({ children, className }: { children: React.ReactNode; className?: string }) {
  const { isOpen, setOpen, persist } = use(ListBoxContext)

  if (persist) return null

  return (
    <div
      role="button"
      aria-expanded={isOpen}
      onClick={() => setOpen(prev => !prev)}
      className={cn(className)}>
      {children}
    </div>
  )
}

export function Options({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const { isOpen } = use(ListBoxContext)

  return (
    <div role="listbox" className={cn(className)} hidden={!isOpen}>
      {children}
    </div>
  )
}

export const Option = forwardRef<
  HTMLButtonElement,
  { children: React.ReactNode; value: string; className?: string }
>(({ children, value, className }, ref) => {
  const { selected, onSelect } = use(ListBoxContext)
  const isSelected = selected.some(o => o === value)

  return (
    <button
      ref={ref}
      role="option"
      aria-selected={isSelected}
      onClick={() => onSelect?.(value)}
      className={cn(className)}>
      {children}
    </button>
  )
})

Option.displayName = 'Option'
