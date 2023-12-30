'use client'

import { ThemeProvider } from '@/context/theme'
import { ToastProvider } from '@/context/toast'

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ToastProvider>{children}</ToastProvider>
    </ThemeProvider>
  )
}
