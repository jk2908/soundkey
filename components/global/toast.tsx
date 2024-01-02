'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

import type { Toast } from '@/lib/types'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

import { CloseButton } from '@/components/global/close-button'

export function Toast({ toast, className, ...rest }: { toast: Toast; className?: string }) {
  const { id, type, message, status } = toast
  const { removeToast } = useToast()

  const [copied, setCopied] = useState(false)

  const styleMap: Record<Toast['type'], string> = {
    success: 'bg-success',
    error: 'bg-error text-white',
    info: 'bg-info',
    warning: 'bg-warning',
  }

  return (
    <motion.div
      initial={{ y: 300, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      transition={{ duration: 0.5, type: 'spring' }}
      aria-live="polite"
      role="alert"
      className={cn(
        'shadow-on-app-bg flex w-full max-w-prose items-center justify-between gap-4 text-pretty rounded-md px-4 py-3 shadow-md',
        styleMap[type],
        className
      )}
      {...rest}>
      <div className="flex items-center justify-between gap-4 grow">
        <p className="grow">{message}</p>

        {type === 'error' && <button className="text-xs">Copy</button>}
      </div>
      <CloseButton onClick={() => removeToast(id)} colour="#fff" />
    </motion.div>
  )
}
