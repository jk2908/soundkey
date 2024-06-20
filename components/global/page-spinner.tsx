import { Spinner } from '#/components/global/spinner'

export function PageSpinner() {
  return (
    <div className="grid h-full w-full place-content-center">
      <Spinner size={32} />
    </div>
  )
}
