import type { Icon as $Icon } from '@/lib/types'

export type Props = {
  name: $Icon
  size?: number
  width?: number
  height?: number
  title?: string
  className?: string
  colour?: string
} & React.SVGProps<SVGSVGElement>

export function Icon({
  name,
  size = 24,
  width = 24,
  height = 24,
  title,
  className,
  colour = 'currentColor',
  ...rest
}: Props) {
  return (
    <svg
      width={size ?? width}
      height={size ?? height}
      className={className}
      style={{ '--c': colour } as React.CSSProperties}
      {...rest}
      viewBox="0 0 24 24">
      {title && <title>{title}</title>}
      <use href={`/assets/icons.svg#icon-${name}`}></use>
    </svg>
  )
}
