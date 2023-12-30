export function Form({
  children,
}: { children: React.ReactNode } & React.FormHTMLAttributes<HTMLFormElement>) {
  return <form>{children}</form>
}
