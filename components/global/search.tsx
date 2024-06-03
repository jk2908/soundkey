'use client'

import { createContext, forwardRef, use, useState } from 'react'

import { cn } from '#/utils/cn'

import { SearchBox, Props as SearchBoxProps } from '#/components/global/search-box'

type SearchProvider = {
  value: string
  setValue: React.Dispatch<React.SetStateAction<string>>
}

const SearchContext = createContext<SearchProvider>({ value: '', setValue: () => {} })

export function Root({
  children,
  role = 'search',
  className,
}: {
  children: React.ReactNode | (({ value, setValue }: SearchProvider) => React.ReactNode)
  role?: string
  className?: string
}) {
  const [value, setValue] = useState<string>('')

  return (
    <SearchContext.Provider value={{ value, setValue }}>
      <section className={cn(className)} role={role}>
        {typeof children === 'function' ? children({ value, setValue }) : children}
      </section>
    </SearchContext.Provider>
  )
}

export function Box({ ref, ...rest }: SearchBoxProps) {
  const { value, setValue } = use(SearchContext)
  
  return <SearchBox ref={ref} value={value} setValue={setValue} {...rest} />
}

export function Results({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
