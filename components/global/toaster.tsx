'use client'

import { useToast } from '@/hooks/use-toast'

import { Toast } from '@/components/global/toast'

export function Toaster() {
  const { toasts } = useToast()

  if (!toasts.length) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 space-y-2 p-4">
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} />
      ))}
    </div>
  )
}
