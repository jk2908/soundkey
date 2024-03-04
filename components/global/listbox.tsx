'use client'

import { createContext, use, useCallback, useId, useState } from 'react'

import { cn } from '@/utils/cn'

export const ListBoxContext = createContext<{
  selectedOptions: string[]
  selectOption: (value: string) => void
  onChange?: (value: string) => void
  initialValue?: string
}>({ selectedOptions: [], selectOption: () => {} })

export function Root({
  children,
  onChange,
  initialValue,
  className,
}: {
  children: React.ReactNode
  onChange?: (value: string) => void
  initialValue?: string
  className?: string
}) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>(
    initialValue ? [initialValue] : []
  )
  const id = useId()

  const selectOption = useCallback(
    (value: string) => {
      setSelectedOptions(prev => [...prev, value])
      onChange?.(value)
    },
    [onChange]
  )

  return (
    <ListBoxContext.Provider value={{ selectedOptions, selectOption, onChange, initialValue }}>
      <div id={id} role="listbox" className={cn(className)}>
        {children}
      </div>
    </ListBoxContext.Provider>
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
