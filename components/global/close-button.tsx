'use client'

import { Icon, type Props } from '#/components/global/icon'

export function CloseButton({
  onClick,
  srText,
  colour = 'currentColor',
  size = 20,
}: { onClick: () => void; srText?: string } & Omit<Props, 'name'>) {
  return (
    <button onClick={onClick} style={{ borderRadius: '50%' }}>
      <span className="sr-only">{srText ? srText : 'Close'}</span>
      <Icon name="x" title="Close" colour={colour} size={size} />
    </button>
  )
}
