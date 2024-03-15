'use client'

import { forwardRef, useEffect, useRef, useTransition } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import { Chip } from '@/components/global/chip'
import { Icon } from '@/components/global/icon'
import { Input, Props as InputProps } from '@/components/global/input'
import { LoadingSpinner } from '@/components/global/loading-spinner'

export type Props = {
  value?: string
  setValue?: React.Dispatch<React.SetStateAction<string>>
  param?: string
  results?: string[]
  onConfirm?: (value: string) => void
} & Omit<InputProps, 'results'>

export const SearchBox = forwardRef<HTMLInputElement, Props>(
  ({ value, setValue, param = 'q', results, onConfirm, ...rest }, ref) => {
    const { replace } = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [isPending, startTransition] = useTransition()
    const chipRef = useRef<HTMLButtonElement>(null)

    const shouldSyncUrl = !!param

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
      const t = e.target.value
      const params = new URLSearchParams(searchParams)

      setValue?.(t)

      if (shouldSyncUrl) {
        t ? params.set(param, t) : params.delete(param)

        startTransition(() => {
          replace(`${pathname}?${params.toString()}`)
        })
      }
    }

    useEffect(() => {
      if (!results?.length || !chipRef.current) return
      chipRef.current.focus()
    }, [results])

    return (
      <div className="group relative">
        <div className="flex w-full items-center gap-1 overflow-x-auto rounded-full border border-keyline bg-white has-[input:focus]:outline-1 has-[input:focus]:outline-highlight">
          {results?.map(r => (
            <Chip key={r} ref={chipRef} onClick={onConfirm} className="ml-1">
              {r}?
            </Chip>
          ))}

          <Input
            ref={ref}
            type="search"
            onChange={handleChange}
            value={value}
            className="grow border-none pr-8 focus-visible:outline-none [&::-webkit-search-cancel-button]:hidden"
            {...rest}
          />
        </div>

        <span className="absolute right-4 top-1/2 flex -translate-y-1/2 transform gap-4">
          {isPending ? (
            <LoadingSpinner size={16} />
          ) : (
            <Icon name="search" size={16} className="opacity-50 group-focus-within:opacity-100" />
          )}
        </span>
      </div>
    )
  }
)

SearchBox.displayName = 'SearchBox'
