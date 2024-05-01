'use client'

import { createContext, use } from 'react'

import { cn } from '#/utils/cn'

import { Label as LabelPrimitive, type Props as LabelProps } from '#/components/global/label'

type SwitchProvider = {
  id: string
  isSelected: boolean
  onChange: () => void
  defaultSelected?: boolean
}

type Props = {
  children: React.ReactNode
  className?: string
} & SwitchProvider &
  React.HTMLAttributes<HTMLDivElement>

const SwitchContext = createContext<SwitchProvider>({
  id: '',
  isSelected: false,
  onChange: () => {},
})

export function Root(props: Props) {
  const { children, id, isSelected, onChange, defaultSelected, className } = props

  return (
    <SwitchContext.Provider value={{ id, isSelected, onChange, defaultSelected }}>
      <div className={cn(className)}>{children}</div>
    </SwitchContext.Provider>
  )
}

export function Label({ children, ...rest }: LabelProps) {
  const { id } = use(SwitchContext)

  return (
    <LabelPrimitive htmlFor={id} {...rest}>
      {children}
    </LabelPrimitive>
  )
}

export function Toggle() {
  const { id, isSelected, onChange } = use(SwitchContext)

  return (
    <button
      id={id}
      role="switch"
      aria-checked={isSelected}
      onClick={onChange}
      type="button"
      className={cn(
        'relative h-6 w-12 rounded-full bg-keyline',
        isSelected ? 'bg-app-bg-inverted' : 'bg-keyline'
      )}>
      <span
        style={{
          borderRadius: '50%',
        }}
        className={cn(
          'absolute left-1 top-1 h-4 w-4 transform bg-highlight shadow-sm transition-transform',
          isSelected ? 'translate-x-[calc(100%_+_.5rem)]' : 'translate-x-0'
        )}
      />
    </button>
  )
}
