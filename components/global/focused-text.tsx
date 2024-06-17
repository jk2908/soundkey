import { cn } from '#/utils/cn'

// https://www.benmvp.com/blog/forwarding-refs-polymorphic-react-component-typescript/

const DEFAULT_ELEMENT = 'span'

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

export type Props<C> = {
  children: React.ReactNode
} & React.HTMLAttributes<C>

export type FocusedTextProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  Props<C>
>

export function FocusedText<C extends React.ElementType = typeof DEFAULT_ELEMENT>({
  children,
  ref,
  className,
  as,
  ...rest
}: FocusedTextProps<C> & { ref?: PolymorphicRef<C> }) {
  const Cmp = as ?? DEFAULT_ELEMENT

  return (
    <Cmp
      ref={ref}
      className={cn('focused-text', className)}
      {...rest}>
      {children}
    </Cmp>
  )
}
