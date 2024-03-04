'use client'

import { createContext, use, useCallback, useEffect, useId, useState } from 'react'

import { cn } from '@/utils/cn'

export const ListBoxContext = createContext<{
  selectedOptions: string[]
  selectOption: (value: string) => void
  isOpen: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  onChange?: (value: string) => void
  initialValue?: string
  persist?: boolean
}>({ selectedOptions: [], selectOption: () => {}, isOpen: false, setOpen: () => {} })

export function Root({
  children,
  onChange,
  initialValue,
  persist = false,
  className,
}: {
  children: React.ReactNode
  onChange?: (value: string) => void
  initialValue?: string
  persist?: boolean
  className?: string
}) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>(
    initialValue ? [initialValue] : []
  )
  const [isOpen, setOpen] = useState(persist)
  const id = useId()


  const selectOption = useCallback(
    (value: string) => {
      setSelectedOptions(prev => [...prev, value])
      onChange?.(value)
    },
    [onChange]
  )

  return (
    <ListBoxContext.Provider
      value={{ selectedOptions, selectOption, isOpen, setOpen, onChange, initialValue, persist }}>
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

export function Option({
  children,
  value,
  className,
}: {
  children: React.ReactNode
  value: string
  className?: string
}) {
  const { selectedOptions, selectOption } = use(ListBoxContext)
  const isSelected = selectedOptions.includes(value)

  return (
    <div
      role="option"
      aria-selected={isSelected}
      onClick={() => selectOption(value)}
      className={cn(className)}>
      {children}
    </div>
  )
}
