import { APP_NAME, APP_URL } from '@/lib/config'

export function VerifyEmailTemplate({ token }: { token: string }) {
  const url = `${APP_URL}/email-verification/${token}`

  return (
    <div className="space-y-4">
      <p>Click the link below to verify your email address for {APP_NAME}.</p>

      <a href={url}>{url}</a>
    </div>
  )
}
