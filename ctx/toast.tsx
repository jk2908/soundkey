import { createContext, useState } from 'react'

import type { Toast } from '#/lib/types'

export const ToastContext = createContext<{
  toasts: Toast[]
  setToasts: React.Dispatch<React.SetStateAction<Toast[]>>
}>({
  toasts: [],
  setToasts: () => {},
})

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  return <ToastContext.Provider value={{ toasts, setToasts }}>{children}</ToastContext.Provider>
}
