'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'

const TabsContext = createContext<{
  isSelected: string
  setSelected: React.Dispatch<React.SetStateAction<string>>
  tabs: React.MutableRefObject<string[]>
  defaultisSelected?: string
}>({
  isSelected: '',
  setSelected: () => {},
  tabs: { current: [] },
  defaultisSelected: '',
})

export function TabsProvider({
  children,
  defaultisSelected,
}: {
  children: React.ReactNode
  defaultisSelected?: string
}) {
  const [isSelected, setSelected] = useState<string>('')
  const tabs = useRef<string[]>([])

  return (
    <TabsContext.Provider value={{ isSelected, setSelected, tabs, defaultisSelected }}>
      {children}
    </TabsContext.Provider>
  )
}

export function TabList({ children }: { children: React.ReactNode }) {
  return <div role="tablist">{children}</div>
}

export function Tab({ children, id }: { children: React.ReactNode; id: string }) {
  const { isSelected, setSelected } = useContext(TabsContext)

  return (
    <button
      type="button"
      onClick={() => setSelected(id)}
      aria-selected={isSelected === id}
      role="tab">
      {children}
    </button>
  )
}

export function TabPanel({ children, id }: { children: React.ReactNode; id: string }) {
  const { isSelected } = useContext(TabsContext)

  return <div hidden={isSelected !== id} role="tabpanel">{children}</div>
}
