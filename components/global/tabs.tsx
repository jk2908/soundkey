'use client'

import { createContext, useContext, useEffect, useId, useMemo, useRef, useState } from 'react'
import selectors from 'focusable-selectors'

import { isVisible } from '@/utils/is-visible'

type Activation = 'manual' | 'auto'
type Orientation = 'horizontal' | 'vertical'

const loopInitial = false

const TabsContext = createContext<{
  isSelected: string
  setSelected: React.Dispatch<React.SetStateAction<string>>
  tabNodes: React.MutableRefObject<HTMLElement[]>
  initialValue?: string
  activation?: Activation
  orientation?: Orientation
  loop?: boolean
  id: string
}>({
  isSelected: '',
  setSelected: () => {},
  tabNodes: { current: [] },
  initialValue: '',
  activation: 'auto',
  orientation: 'horizontal',
  loop: loopInitial,
  id: '',
})

export function Root({
  children,
  initialValue,
  activation = 'auto',
  orientation = 'horizontal',
  loop = loopInitial,
}: {
  children: React.ReactNode
  initialValue?: string
  activation?: Activation
  orientation?: Orientation
  loop?: boolean
}) {
  const [isSelected, setSelected] = useState<string>(initialValue ?? '')
  const tabNodes = useRef<HTMLElement[]>([])
  const id = useId()

  const value = useMemo(
    () => ({
      isSelected,
      setSelected,
      tabNodes,
      initialValue,
      activation,
      orientation,
      loop,
      id,
    }),
    [isSelected, setSelected, tabNodes, initialValue, activation, orientation, loop, id]
  )

  return <TabsContext.Provider value={value}>{children}</TabsContext.Provider>
}

export function List({
  children,
  className,
}: { children: React.ReactNode } & React.HTMLProps<HTMLDivElement>) {
  const { orientation } = useContext(TabsContext)

  return (
    <div role="tablist" aria-orientation={orientation} className={className}>
      {children}
    </div>
  )
}

export function Button({
  children,
  value,
  className,
}: {
  children: React.ReactNode
  value: string
} & React.HTMLProps<HTMLButtonElement>) {
  const { isSelected, setSelected, tabNodes, activation, orientation, loop, id } =
    useContext(TabsContext)
  const ref = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const node = ref.current

    if (!node) return

    tabNodes.current.push(node)

    return () => {
      tabNodes.current = tabNodes.current.filter(n => n !== node)
    }
  }, [tabNodes])

  function handleKeyDown(e: React.KeyboardEvent<HTMLButtonElement>) {
    const pos = tabNodes.current.indexOf(e.currentTarget)

    const handlePrev = () => {
      if (loop && pos === 0) {
        tabNodes.current[tabNodes.current.length - 1].focus()
      } else {
        tabNodes.current[pos - 1]?.focus()
      }
    }

    const handleNext = () => {
      if (loop && pos === tabNodes.current.length - 1) {
        tabNodes.current[0].focus()
      } else {
        tabNodes.current[pos + 1]?.focus()
      }
    }

    switch (e.key) {
      case 'ArrowLeft':
        if (orientation === 'vertical') return
        e.preventDefault()
        handlePrev()
        break
      case 'ArrowRight':
        if (orientation === 'vertical') return
        e.preventDefault()
        handleNext()
        break
      case 'ArrowUp':
        if (orientation === 'horizontal') return
        e.preventDefault()
        handlePrev()
        break
      case 'ArrowDown':
        if (orientation === 'horizontal') return
        e.preventDefault()
        handleNext()
        break
      case 'Home':
        e.preventDefault()
        tabNodes.current[0]?.focus()
        break
      case 'End':
        e.preventDefault()
        tabNodes.current[tabNodes.current.length - 1]?.focus()
        break
    }
  }

  return (
    <button
      ref={ref}
      id={`${id}-${value}-t`}
      aria-selected={isSelected === value}
      aria-controls={`${id}-${value}-p`}
      role="tab"
      type="button"
      tabIndex={isSelected === value ? 0 : -1}
      className={className}
      onClick={() => setSelected(value)}
      onFocus={() => (activation === 'auto' ? setSelected(value) : null)}
      onKeyDown={handleKeyDown}>
      {children}
    </button>
  )
}

export function Panel({
  children,
  value,
  className,
}: {
  children: React.ReactNode
  value: string
} & React.HTMLProps<HTMLDivElement>) {
  const { isSelected, id } = useContext(TabsContext)

  const ref = useRef<HTMLDivElement>(null)
  const [isFocusable, setFocusable] = useState(false)

  useEffect(() => {
    const node = ref.current

    if (!node) return

    const focusableElements = (
      Array.from(node.querySelectorAll(selectors.join(','))) as HTMLElement[]
    ).filter(isVisible)

    setFocusable(!focusableElements.length && isSelected === value)
  }, [isSelected, value])

  return (
    <div
      ref={ref}
      id={`${id}-${value}-p`}
      hidden={isSelected !== value}
      role="tabpanel"
      aria-labelledby={`${id}-${value}-t`}
      tabIndex={isFocusable ? 0 : undefined}
      className={className}>
      {children}
    </div>
  )
}
