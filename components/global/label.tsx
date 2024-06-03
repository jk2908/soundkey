import { cn } from '#/utils/cn'

// https://www.benmvp.com/blog/forwarding-refs-polymorphic-react-component-typescript/

const DEFAULT_ELEMENT = 'label'

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
  description?: string
  className?: string
}

export type LabelProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<C, Props>

export function Label<C extends React.ElementType = typeof DEFAULT_ELEMENT>({
  children,
  ref,
  className,
  as,
  ...rest
}: LabelProps<C> & { ref?: PolymorphicRef<C> }) {
  const Cmp = as ?? DEFAULT_ELEMENT

  return (
    <Cmp
      ref={ref}
      className={cn('label block select-none text-sm font-medium', className)}
      {...rest}>
      {children}
    </Cmp>
  )
}
