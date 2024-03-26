'use client'

import { AnimatePresence } from 'framer-motion'

import { useToast } from '@/hooks/use-toast'

import { Toast } from '@/components/global/toast'

export function Toaster() {
  const { toasts } = useToast()

  return (
    <div className="fixed bottom-0 flex w-[min(375px,75vw)] left-[wrapper-px] flex-col items-center justify-center space-y-2 p-4">
      <AnimatePresence>
        {toasts.map(toast => (
          <Toast key={toast.id} toast={toast} />
        ))}
      </AnimatePresence>
    </div>
  )
}
