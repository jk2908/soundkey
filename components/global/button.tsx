import { forwardRef } from 'react'

import type { IntentVariant, StateVariant } from '@/lib/types'
import { cn } from '@/utils/cn'

const DEFAULT_ELEMENT = 'button'

// TODO: This isn't finished, Button is typed as any rn
// Maybe just wait for React 19 to be released to get rid of forwardRef
// See for reference:
// https://www.benmvp.com/blog/forwarding-refs-polymorphic-react-component-typescript/

export type PropsOf<C extends keyof JSX.IntrinsicElements | React.JSXElementConstructor<any>> =
  JSX.LibraryManagedAttributes<C, React.ComponentPropsWithoutRef<C>>

type AsProp<C extends React.ElementType> = {
  as?: C
}

export type ExtendableProps<ExtendedProps = {}, OverrideProps = {}> = OverrideProps &
  Omit<ExtendedProps, keyof OverrideProps>

export type InheritableElementProps<C extends React.ElementType, Props = {}> = ExtendableProps<
  PropsOf<C>,
  Props
>
export type PolymorphicComponentProps<
  C extends React.ElementType,
  Props = {},
> = InheritableElementProps<C, Props & AsProp<C>>

export type PolymorphicRef<C extends React.ElementType> = React.ComponentPropsWithRef<C>['ref']

export type PolymorphicComponentPropsWithRef<
  C extends React.ElementType,
  Props = {},
> = PolymorphicComponentProps<C, Props> & { ref?: PolymorphicRef<C> }

export type Props = {
  children: React.ReactNode
  variant?: IntentVariant | StateVariant
  className?: string
  iconOnly?: boolean
}

export type ButtonProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<C, Props>

export const Button = forwardRef(
  <C extends React.ElementType = typeof DEFAULT_ELEMENT>(
    { children, variant = 'primary', className, iconOnly, as, ...rest }: ButtonProps<C>,
    ref?: PolymorphicRef<C>
  ) => {
    const Cmp = as ?? DEFAULT_ELEMENT

    const styleMap: Record<StateVariant | IntentVariant, string> = {
      primary: 'bg-app-bg-inverted hover:bg-app-bg-inverted/75 text-app-fg-inverted',
      secondary: 'bg-keyline hover:bg-keyline/75 text-app-fg',
      tertiary: 'bg-transparent hover:bg-keyline/25 text-app-fg',
      danger: 'bg-danger hover:bg-danger-dark text-white',
      success: 'bg-success hover:bg-success-dark text-white',
      warning: 'bg-warning hover:bg-warning-dark text-white',
      info: 'bg-info hover:bg-info-dark text-white',
      error: 'bg-error hover:bg-error-dark text-white',
    }

    return (
      <Cmp
        ref={ref}
        className={cn(
          'flex items-center gap-3 rounded-full px-8 py-2',
          styleMap[variant],
          iconOnly && 'p-2',
          className
        )}
        {...rest}>
        {children}
      </Cmp>
    )
  }
)

Button.displayName = 'Button'
