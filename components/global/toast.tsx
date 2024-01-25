'use client'

import { useState } from 'react'
import { cn } from '@/utils/cn'
import { copyToClipboard } from '@/utils/copy-to-clipboard'
import { motion } from 'framer-motion'

import type { Toast } from '@/lib/types'
import { useToast } from '@/hooks/use-toast'

import { CloseButton } from '@/components/global/close-button'
import { Popover } from '@/components/global/popover'

export function Toast({ toast, className, ...rest }: { toast: Toast; className?: string }) {
  const { id, type, message, status } = toast
  const { removeToast } = useToast()

  const [isCopied, setCopied] = useState(false)

  function handleCopy() {
    copyToClipboard(`Error message: ${message} \nStatus code: ${status}`)
    setCopied(true)

    setTimeout(() => {
      setCopied(false)
    }, 3000)
  }

  const styleMap: Record<Toast['type'], string> = {
    success: 'bg-success',
    error: 'bg-error text-white',
    info: 'bg-info',
    warning: 'bg-warning',
    danger: 'bg-danger text-white',
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
      <div className="flex grow items-center justify-between gap-4">
        <p className="grow">{message}</p>

        {type === 'error' && (
          <Popover
            isOpen={isCopied}
            content="Copied to clipboard"
            onClickOutside={() => setCopied(false)}>
            <button onClick={handleCopy} className="text-xs">
              Copy
            </button>
          </Popover>
        )}
      </div>
      <CloseButton onClick={() => removeToast(id)} colour="#fff" />
    </motion.div>
  )
}
