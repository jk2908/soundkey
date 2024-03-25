'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

import type { Toast } from '@/lib/types'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/utils/cn'
import { copy } from '@/utils/copy'

import { CloseButton } from '@/components/global/close-button'
import * as Popover from '@/components/global/popover'

export function Toast({ toast, className, ...rest }: { toast: Toast; className?: string }) {
  const { id, type, message, status } = toast
  const { removeToast } = useToast()

  const [isCopied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      copy(`Error message: ${message} \nStatus code: ${status}`)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  const styleMap: Record<Toast['type'], string> = {
    success: 'bg-success text-white',
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
          <Popover.Root onBeforeOpen={handleCopy} duration={2000}>
            <Popover.Toggle>Copy</Popover.Toggle>

            <Popover.Content>
              {isCopied ? 'Copied to clipboard' : 'Could not be copied'}
            </Popover.Content>
          </Popover.Root>
        )}
      </div>
      <CloseButton onClick={() => removeToast(id)} colour="#fff" />
    </motion.div>
  )
}
