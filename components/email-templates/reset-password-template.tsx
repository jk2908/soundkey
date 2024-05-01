import { APP_NAME, APP_URL } from '#/lib/config'

export function ResetPasswordTemplate({ token }: { token: string }) {
  const url = `${APP_URL}/reset-password/${token}`

  return (
    <div className="space-y-4">
      <p>Click the link below to reset your {APP_NAME} password.</p>

      <a href={url}>{url}</a>
    </div>
  )
}
