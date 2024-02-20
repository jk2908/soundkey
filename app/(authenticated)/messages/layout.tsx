import { MessageActions } from '@/components/authenticated/message-actions'
import { ProseBox } from '@/components/global/prose-box'
import { YSpace } from '@/components/global/y-space'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ProseBox>
      <YSpace>
        <MessageActions />

        <div>{children}</div>
      </YSpace>
    </ProseBox>
  )
}
