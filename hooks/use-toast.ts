import { use } from 'react'
import { ToastContext } from '#/ctx/toast'

import type { Toast } from '#/lib/types'

export function useToast() {
  const { toasts, setToasts } = use(ToastContext)

  function add(toast: Omit<Toast, 'id'>) {
    const id = crypto.getRandomValues(new Uint32Array(1))[0]
    const { duration = 7000 } = toast

    setToasts(prev => [...prev, { ...toast, id }])

    if (duration) {
      setTimeout(() => remove(id), duration)
    }
  }

  function remove(id: number) {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  return {
    toasts,
    toast: {
      success: (toast: Omit<Toast, 'id' | 'type'>) => add({ ...toast, type: 'success' }),
      error: (toast: Omit<Toast, 'id' | 'type'>) => add({ ...toast, type: 'error' }),
      remove,
    },
  }
}
