'use client'

export type Props = {
  children: React.ReactNode
  className?: string
  type?: 'button' | 'submit' | 'reset'
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLButtonElement>, HTMLButtonElement>

export function Button({ children, className, type = 'button', ...rest }: Props) {
  return (
    <button type={type} className={className} {...rest}>
      {children}
    </button>
  )
}
