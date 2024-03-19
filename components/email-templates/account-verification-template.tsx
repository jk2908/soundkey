import { APP_NAME, APP_URL } from '@/lib/config'

export function AccountVerificationTemplate({ token }: { token: string }) {
  const url = `${APP_URL}/api/account-verification/${token}`

  return (
    <div className="space-y-4">
      <p>Click the link below to verify your {APP_NAME} account.</p>

      <a href={url}>{url}</a>
    </div>
  )
}
