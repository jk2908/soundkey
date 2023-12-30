import { useContext } from 'react'
import { ToastContext } from '@/context/toast'

import type { Toast } from '@/lib/types'

export function useToast() {
  const { toasts, setToasts } = useContext(ToastContext)

  function toast(toast: Omit<Toast, 'id'>) {
    const id = crypto.getRandomValues(new Uint32Array(1))[0]
    const { duration } = toast

    setToasts(prev => [...prev, { ...toast, id }])

    if (duration) {
      setTimeout(() => removeToast(id), duration)
    }
  }

  function removeToast(id: number) {
    const toast = toasts.find(toast => toast.id === id)

    if (!toast) return

    const { onClose } = toast

    setToasts(prev => prev.filter(toast => toast.id !== id))
    onClose?.()
  }

  return { toasts, toast, removeToast }
}
