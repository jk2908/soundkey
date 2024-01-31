import { cn } from '@/utils/cn'

export function HorizontalRule({ className }: { className?: string }) {
  return <hr className={cn('border-t border-keyline', className)} aria-hidden="true" />
}
