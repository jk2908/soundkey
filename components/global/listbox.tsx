'use client'

import React, { createContext, use, useMemo } from 'react'

import { useSelectContext } from '#/hooks/use-select-context'
import { cn } from '#/utils/cn'

export const ListBoxContext = createContext<{
  selected: string[]
  onSelect?: (value: string, close: () => void, e: React.SyntheticEvent) => void
}>({
  selected: [],
})

export function Root({
  children,
  selected,
  onSelect,
  className,
}: {
  children: React.ReactNode
  selected: string[]
  onSelect?: (value: string, close: () => void, e: React.SyntheticEvent) => void
  className?: string
}) {
  return (
    <ListBoxContext.Provider value={{ selected, onSelect }}>
      <div role="listbox" className={cn('flex flex-col', className)}>
        {children}
      </div>
    </ListBoxContext.Provider>
  )
}

export function Option({
  value,
  children,
  ref,
  className,
}: {
  value: string
  children: React.ReactNode
  ref?: React.Ref<HTMLDivElement>
  className?: string
}) {
  const ctx = useSelectContext({ isUnsafe: true })
  const { selected, onSelect } = use(ListBoxContext)
  const isSelected = useMemo(() => selected.some(o => o === value), [selected, value])

  return (
    <div
      ref={ref}
      role="option"
      aria-selected={isSelected}
      tabIndex={0}
      onKeyDown={e => {
        if (['Enter', ' '].includes(e.key)) {
          onSelect?.(value, () => ctx?.close(e), e)
        }
      }}
      onClick={e => {
        onSelect?.(value, () => ctx?.close(e), e)
      }}
      className={cn('sk-focus cursor-pointer', className)}>
      {children}
    </div>
  )
}
