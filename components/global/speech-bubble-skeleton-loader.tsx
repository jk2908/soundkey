import { SpeechBubble } from '@/components/global/speech-bubble'

export function SpeechBubbleSkeletonLoader({ avatar }: { avatar?: React.ReactNode }) {
  return (
    <SpeechBubble className="bg-keyline/70 text-gr33n-100" avatar={avatar}>
      Loading...
    </SpeechBubble>
  )
}
