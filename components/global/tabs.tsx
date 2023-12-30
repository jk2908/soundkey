'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'

const TabsContext = createContext<{
  selected: string
  setSelected: React.Dispatch<React.SetStateAction<string>>
  tabs: React.MutableRefObject<string[]>
  defaultSelected?: string
}>({
  selected: '',
  setSelected: () => {},
  tabs: { current: [] },
  defaultSelected: '',
})

export function TabsProvider({
  children,
  defaultSelected,
}: {
  children: React.ReactNode
  defaultSelected?: string
}) {
  const [selected, setSelected] = useState<string>('')
  const tabs = useRef<string[]>([])

  return (
    <TabsContext.Provider value={{ selected, setSelected, tabs, defaultSelected }}>
      {children}
    </TabsContext.Provider>
  )
}

export function TabList({ children }: { children: React.ReactNode }) {
  return <div role="tablist">{children}</div>
}

export function Tab({ children, id }: { children: React.ReactNode; id: string }) {
  const { selected, setSelected } = useContext(TabsContext)

  return (
    <button
      type="button"
      onClick={() => setSelected(id)}
      aria-selected={selected === id}
      role="tab">
      {children}
    </button>
  )
}

export function TabPanel({ children, id }: { children: React.ReactNode; id: string }) {
  const { selected } = useContext(TabsContext)

  return <div hidden={selected !== id} role="tabpanel">{children}</div>
}
