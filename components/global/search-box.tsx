'use client'

import { useTransition } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import { debounce } from '@/utils/debounce'

import { Icon } from '@/components/global/icon'
import { Input, Props as InputProps } from '@/components/global/input'
import { LoadingSpinner } from '@/components/global/loading-spinner'

export type Props = {
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  param?: string
  ms?: number
} & InputProps

export function SearchBox({ onChange, param = 'q', ms = 150, ...rest }: Props) {
  const { replace } = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [isPending, startTransition] = useTransition()

  const shouldSyncUrl = !!param

  const handleChange = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    const t = e.target.value
    const params = new URLSearchParams(searchParams)

    if (shouldSyncUrl) {
      t ? params.set(param, t) : params.delete(param)
    }

    startTransition(() => {
      onChange?.(e)

      if (shouldSyncUrl) {
        replace(`${pathname}?${params.toString()}`)
      }
    })
  }, ms)

  return (
    <div className="group relative">
      <Input
        type="search"
        onChange={handleChange}
        className="w-full overflow-x-auto pr-8 [&::-webkit-search-cancel-button]:hidden"
        {...rest}
      />

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
