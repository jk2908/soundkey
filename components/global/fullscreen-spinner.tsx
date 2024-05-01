import { Spinner } from '#/components/global/spinner'

export function FullscreenSpinner() {
  return (
    <div className="fixed inset-0 z-50 bg-app-bg grid place-content-center">
      <Spinner />
    </div>
  )
}