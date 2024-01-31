'use client'

import { ThemeProvider } from '@/ctx/theme'
import { ToastProvider } from '@/ctx/toast'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ToastProvider>{children}</ToastProvider>
    </ThemeProvider>
  )
}
