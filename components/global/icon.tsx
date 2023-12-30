import type { Icon as $Icon } from '@/lib/types'

export type Props = {
  name: $Icon
  width?: number
  height?: number
  title?: string
  className?: string
  colour?: string
} & React.SVGProps<SVGSVGElement>

export function Icon({ name, width = 24, height = 24, title, className, colour, ...rest }: Props) {
  return (
    <svg
      width={width}
      height={height}
      className={className}
      style={{ '--c': colour ?? 'currentColor' } as React.CSSProperties}
      {...rest}>
      {title && <title>{title}</title>}
      <use href={`/assets/icons.svg/#${name}`} />
    </svg>
  )
}
