'use client'

import { useTransition } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import { Icon } from '@/components/global/icon'
import { Input, Props as InputProps } from '@/components/global/input'
import { LoadingSpinner } from '@/components/global/loading-spinner'

export type Props = {
  value?: string
  setValue?: React.Dispatch<React.SetStateAction<string>>
  param?: string
} & InputProps

export function SearchBox({ value, setValue, param = 'q', ...rest }: Props) {
  const { replace } = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

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

  return (
    <div className="group relative">
      <Input
        type="search"
        onChange={handleChange}
        value={value}
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
