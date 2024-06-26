'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { cn } from '#/utils/cn'

import { GradientMask } from '#/components/global/gradient-mask'

export function Scrollable({
  children,
  auto,
  speed = 1500 / 60,
  wait,
  scrollClassName,
  className,
}: {
  children: React.ReactNode
  auto?: boolean
  speed?: number
  wait?: number
  scrollClassName?: string
  className?: string
}) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const resizeRef = useRef<ResizeObserver | null>()
  const vRef = useRef(0)
  const dRef = useRef(1)

  const [isLeftEdgeVisible, setLeftEdgeVisible] = useState(false)
  const [isRightEdgeVisible, setRightEdgeVisible] = useState(false)
  const [isPaused, setPaused] = useState<boolean>()

  const onScroll = useCallback(() => {
    const el = scrollRef.current

    if (!el) return

    const { scrollLeft, scrollWidth, clientWidth } = el

    setLeftEdgeVisible(scrollLeft > 0)
    setRightEdgeVisible(Math.ceil(scrollLeft) < scrollWidth - clientWidth)
  }, [])

  useEffect(() => {
    const el = scrollRef.current

    if (!el) return

    resizeRef.current = new ResizeObserver(onScroll)
    resizeRef.current.observe(el)

    onScroll()

    return () => {
      resizeRef.current?.unobserve(el)
      resizeRef.current?.disconnect()
      resizeRef.current = null
    }
  }, [onScroll])

  useEffect(() => {
    if (!auto) return

    const interval = setInterval(() => {
      const el = scrollRef.current
      const v = vRef.current
      const d = dRef.current

      if (!el || isPaused) return

      const { scrollWidth, clientWidth, scrollLeft } = el
      const isStart = scrollLeft === 0
      const isEnd = Math.ceil(scrollLeft + clientWidth) === scrollWidth

      if (scrollWidth <= clientWidth) return

      const move = () => {
        el.scrollLeft = v
        vRef.current = v + d
        dRef.current = scrollLeft === 0 ? 1 : isEnd ? -1 : d
      }

      if (wait && !isPaused && (isStart || isEnd)) {
        setPaused(true)

        setTimeout(() => {
          setPaused(false)
          move()
        }, wait)

        return
      }

      move()
    }, speed)

    return () => clearInterval(interval)
  }, [auto, wait, isPaused, speed])

  const play = () => setPaused(false)
  const pause = () => setPaused(true)

  return (
    <div ref={wrapperRef} className={cn('hide-scrollbar relative whitespace-nowrap overflow-x-auto', className)}>
      <GradientMask isVisible={isLeftEdgeVisible} />
      <div
        ref={scrollRef}
        onScroll={onScroll}
        onMouseEnter={pause}
        onMouseLeave={play}
        className={cn('hide-scrollbar flex overflow-x-auto whitespace-nowrap', scrollClassName)}>
        {children}
      </div>
      <GradientMask isVisible={isRightEdgeVisible} mirror />
    </div>
  )
}
