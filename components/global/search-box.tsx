'use client'

import { useEffect, useRef, useTransition } from 'react'
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
  onConfirm?: (value: string) => void
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
    <div className="group relative">
      <div className="flex w-full items-center gap-1 overflow-x-auto rounded-full border border-keyline has-[input:focus]:outline-1 has-[input:focus]:outline-highlight">
        {results?.map(r => (
          <Chip key={r} ref={chipRef} onClick={onConfirm} className="ml-1">
            {r}?
          </Chip>
        ))}

        <Input
          ref={ref}
          type="search"
          onChange={onChange}
          value={value}
          className="grow border-none pr-8 focus-visible:outline-none [&::-webkit-search-cancel-button]:hidden"
          {...rest}
        />
      </div>

      <span className="absolute right-4 top-1/2 flex -translate-y-1/2 transform gap-4">
        {isPending ? (
          <Spinner size={16} />
        ) : (
          <Icon name="search" size={16} className="opacity-50 group-focus-within:opacity-100" />
        )}
      </span>
    </div>
  )
}
