import { cn } from '@/utils/cn'

import { SkeletonText } from '@/components/global/skeleton-text'
import { SpeechBubble, type Props } from '@/components/global/speech-bubble'

export function SpeechBubbleSkeletonLoader({ className, ...rest }: Omit<Props, 'children'>) {
  return (
    <SpeechBubble className={cn('bg-keyline/30 text-gr33n-100', className)} {...rest}>
      <SkeletonText lines={5} />
    </SpeechBubble>
  )
}
