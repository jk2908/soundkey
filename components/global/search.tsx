'use client'

import { createContext, use, useState } from 'react'

import { cn } from '@/utils/cn'

import { SearchBox, Props as SearchBoxProps } from '@/components/global/search-box'

type SearchCtx = {
  value: string | string[]
  setValue: React.Dispatch<React.SetStateAction<string | string[]>>
}

const SearchContext = createContext<SearchCtx>({ value: '', setValue: () => {} })

export function Root({
  children,
  className,
}: {
  children: React.ReactNode | (({ value, setValue }: SearchCtx) => React.ReactNode)
  className?: string
}) {
  const [value, setValue] = useState<string | string[]>('')

  return (
    <SearchContext.Provider value={{ value, setValue }}>
      <section className={cn(className)} role="search">
        {typeof children === 'function' ? children({ value, setValue }) : children}
      </section>
    </SearchContext.Provider>
  )
}

export function Box({ onChange, ...rest }: SearchBoxProps) {
  const { setValue } = use(SearchContext)

  return (
    <SearchBox
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
      {...rest}
    />
  )
}

export function Results({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
