import { useContext } from 'react'
import { ToastContext } from '@/context/toast'

import type { Toast } from '@/lib/types'

export function useToast() {
  const { toasts, setToasts } = useContext(ToastContext)

  function toast(toast: Omit<Toast, 'id'>) {
    const id = crypto.getRandomValues(new Uint32Array(1))[0]
    const { duration = 7000 } = toast

    setToasts(prev => [...prev, { ...toast, id }])

    if (duration) {
      setTimeout(() => removeToast(id), duration)
    }
  }

  function removeToast(id: number) {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  return { toasts, toast, removeToast }
}
