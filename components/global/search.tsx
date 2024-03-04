'use client'

import { createContext, startTransition, use, useMemo, useState } from 'react'

import { cn } from '@/utils/cn'

import { SearchBox, Props as SearchBoxProps } from '@/components/global/search-box'

type SearchContextProps = {
  value: string
  setValue: React.Dispatch<React.SetStateAction<string>>
}

const SearchContext = createContext<SearchContextProps>({ value: '', setValue: () => {} })

export function Root({
  children,
  className,
}: {
  children: React.ReactNode | (({ value, setValue }: SearchContextProps) => React.ReactNode)
  className?: string
}) {
  const [value, setValue] = useState<string>('')

  return (
    <SearchContext.Provider value={{ value, setValue }}>
      <section className={cn(className)} role="search">
        {typeof children === 'function' ? children({ value, setValue }) : children}
      </section>
    </SearchContext.Provider>
  )
}

export function Box(props: SearchBoxProps) {
  const { value, setValue } = use(SearchContext)

  return <SearchBox value={value} setValue={setValue} {...props} />
}

export function Results({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
