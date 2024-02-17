import { LoadingSpinner } from '@/components/global/loading-spinner'

export function FullscreenLoadingSpinner() {
  return (
    <div className="fixed inset-0 z-50 bg-app-bg grid place-content-center">
      <LoadingSpinner />
    </div>
  )
}