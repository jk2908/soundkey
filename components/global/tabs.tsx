'use client'

import {
  createContext,
  startTransition,
  use,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import selectors from 'focusable-selectors'

import { useFocusScope } from '@/hooks/use-focus-scope'
import { isVisible } from '@/utils/is-visible'

type Activation = 'manual' | 'auto'
type Orientation = 'horizontal' | 'vertical'

const TabsContext = createContext<{
  isSelected: string
  selectTab: (value: string) => void
  tabEls: React.MutableRefObject<HTMLElement[]>
  values: React.MutableRefObject<string[]>
  initialValue?: string
  activation?: Activation
  orientation?: Orientation
  loop?: boolean
  id: string
  params?: boolean
}>({
  isSelected: '',
  selectTab: () => null,
  tabEls: { current: [] },
  values: { current: [] },
  activation: 'auto',
  orientation: 'horizontal',
  id: '',
})

export function Root({
  children,
  initialValue,
  activation = 'auto',
  orientation = 'horizontal',
  loop = false,
  params = false,
}: {
  children: React.ReactNode
  initialValue?: string
  activation?: Activation
  orientation?: Orientation
  loop?: boolean
  params?: boolean
}) {
  const searchParams = useSearchParams()
  const router = useRouter()

  const tabEls = useRef<HTMLElement[]>([])
  const values = useRef<string[]>([])
  const id = useId()

  const defaultValue = initialValue ?? ''
  const paramsPrefix = `tab${id}`

  const [isSelected, setSelected] = useState<string>(
    params ? searchParams.get(paramsPrefix) ?? defaultValue : defaultValue
  )

  const selectTab = useCallback((value: string) => {
    startTransition(() => setSelected(value))
  }, [])

  const value = useMemo(
    () => ({
      isSelected,
      selectTab,
      tabEls,
      values,
      initialValue,
      activation,
      orientation,
      loop,
      id,
      params,
    }),
    [
      isSelected,
      selectTab,
      tabEls,
      values,
      initialValue,
      activation,
      orientation,
      loop,
      id,
      params,
    ]
  )

  useEffect(() => {
    if (!params) return

    router.push(`?${paramsPrefix}=${isSelected}`)
  }, [isSelected, params, paramsPrefix, router])

  return <TabsContext.Provider value={value}>{children}</TabsContext.Provider>
}

export function List({
  children,
  className,
}: { children: React.ReactNode } & React.HTMLProps<HTMLDivElement>) {
  const { orientation } = use(TabsContext)
  const ref = useRef<HTMLDivElement>(null)

  useFocusScope(ref, { roving: true, orientation: 'horizontal' })

  return (
    <div ref={ref} role="tablist" aria-orientation={orientation} className={className}>
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
  const { isSelected, selectTab, tabEls, values, activation, orientation, loop, id } =
    use(TabsContext)
  const ref = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const el = ref.current

    if (!el) return

    tabEls.current.push(el)

    return () => {
      tabEls.current = tabEls.current.filter(e => e !== el)
    }
  }, [tabEls])

  useEffect(() => {
    values.current.push(value)

    return () => {
      values.current = values.current.filter(v => v !== value)
    }
  }, [values, value])

  return (
    <button
      ref={ref}
      id={`${id}-${value}-t`}
      aria-selected={isSelected === value}
      aria-controls={`${id}-${value}-p`}
      role="tab"
      type="button"
      className={className}
      onClick={() => selectTab(value)}
      onFocus={() => (activation === 'auto' ? selectTab(value) : null)}>
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
  const { isSelected, id } = use(TabsContext)

  const ref = useRef<HTMLDivElement>(null)
  const [isFocusable, setFocusable] = useState(false)

  useEffect(() => {
    const el = ref.current

    if (!el) return

    const focusableEls = (
      Array.from(el.querySelectorAll(selectors.join(','))) as HTMLElement[]
    ).filter(isVisible)

    setFocusable(!focusableEls.length && isSelected === value)
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
