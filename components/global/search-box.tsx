'use client'

import React, { useEffect, useRef, useTransition } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import { Chip } from '#/components/global/chip'
import { Icon } from '#/components/global/icon'
import { Input, Props as InputProps } from '#/components/global/input'
import { Spinner } from '#/components/global/spinner'

export type Props = {
  ref?: React.Ref<HTMLInputElement>
  value?: string
  setValue?: React.Dispatch<React.SetStateAction<string>>
  param?: string
  results?: string[]
  onConfirm?: (value: string, e: React.MouseEvent) => void
  onClear?: () => void
} & Omit<InputProps, 'results'>

export function SearchBox({
  ref,
  value,
  setValue,
  param = 'q',
  results,
  onConfirm,
  onClear,
  ...rest
}: Props) {
  const { replace } = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const chipRef = useRef<HTMLButtonElement>(null)

  const shouldSyncUrl = !!param

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const t = e.target.value
    const params = new URLSearchParams(searchParams)

    setValue?.(t)

    if (shouldSyncUrl) {
      t ? params.set(param, t) : params.delete(param)

      startTransition(() => {
        replace(`${pathname}?${params.toString()}`)
      })
    }

    if (!t) onClear?.()
  }

  useEffect(() => {
    if (!results?.length || !chipRef.current) return

    chipRef.current.focus()
  }, [results])

  return (
    <div className="sk-search-box group">
      <div className="sk-search-box__results">
        {results?.map(r => (
          <Chip
            key={r}
            ref={chipRef}
            onClick={e => {
              onConfirm?.(value ? value : '', e)
            }}
            className="sk-search-box__chip">
            {r}?
          </Chip>
        ))}

        <Input
          ref={ref}
          type="search"
          onChange={onChange}
          value={value}
          className="sk-search-box__input"
          {...rest}
        />
      </div>

      <span className="sk-search-box__icon">
        {isPending ? (
          <Spinner size={16} />
        ) : (
          <Icon name="search" size={16} className="opacity-50 group-focus-within:opacity-100" />
        )}
      </span>
    </div>
  )
}
