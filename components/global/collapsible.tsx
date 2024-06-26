'use client'

import {
  Children,
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { mergeRefs } from 'react-merge-refs'

import { cn } from '#/utils/cn'

type Props = {
  children: React.ReactNode
  ref?: React.Ref<HTMLDivElement>
} & React.HTMLAttributes<HTMLDivElement>

export function Collapsible(props: Props) {
  const { children, ref, className, ...rest } = props

  const localRef = useRef<HTMLDivElement>(null)
  const childRefs = useRef<HTMLElement[]>([])

  const [isCollapsed, setCollapsed] = useState(false)

  useEffect(() => {
    const el = localRef.current

    if (!el) return

    console.log(childRefs.current)

    const measure = (t: HTMLElement) => {
      const r = [...t.querySelectorAll(':scope > *')].map(el => el.getBoundingClientRect().right)
      const m = Math.max(...r)

      return [r, m]
    }

    measure(el)

    let ob: ResizeObserver | null = new ResizeObserver(([{ target }]) => {
      measure(target as HTMLElement)
    })

    ob.observe(el)

    return () => {
      ob?.unobserve(el)
      ob?.disconnect()
      ob = null
    }
  }, [])

  const cloned = useMemo(
    () =>
      Children.map(children, child => {
        if (!isValidElement(child)) {
          return child
        }

        return cloneElement(child as React.ReactElement, {
          ref: mergeRefs([
            (child as any).ref, // todo: fix this
            (el: HTMLElement) => {
              el && childRefs.current.push(el)

              return () => {
                childRefs.current = childRefs.current.filter(c => c !== el)
              }
            },
          ]),
        })
      }),
    [children]
  )

  return (
    <div ref={mergeRefs([ref, localRef])} className={cn('sk-collapsible', className)} {...rest}>
      {cloned}
    </div>
  )
}
