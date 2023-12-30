import { useToast } from '@/hooks/use-toast'
import type { Toast } from '@/lib/types'
import { cn } from '@/lib/utils'

export function Toast({ toast, className, ...rest }: { toast: Toast; className?: string }) {
  const { id, variant, message } = toast
  const { removeToast } = useToast()

  const styleMap: Record<Toast['variant'], string> = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    warning: 'bg-yellow-500',
  }

  return (
    <div className={cn(styleMap[variant], className)}>
      {message}
      <button onClick={() => removeToast(id)}>X</button>
    </div>
  )
}