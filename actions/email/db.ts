'use server'

import { APP_EMAIL, APP_NAME } from '@/lib/config'
import { resend } from '@/lib/resend'

import { ResetPasswordTemplate } from '@/components/email-templates/reset-password-template'
import { VerifyAccountTemplate } from '@/components/email-templates/verify-account-template'

export async function sendVerificationEmail(email: string, token: string) {
  try {
    const data = await resend.emails.send({
      from: `${APP_NAME} <${APP_EMAIL}>`,
      to: [email],
      subject: `Verify your ${APP_NAME} email address`,
      react: VerifyAccountTemplate({ token }),
    })

    return Response.json(data)
  } catch (err) {
    return Response.json({ err })
  }
}

export async function sendPasswordResetEmail(email: string, token: string) {
  try {
    const data = await resend.emails.send({
      from: `${APP_NAME} <${APP_EMAIL}>`,
      to: [email],
      subject: `Reset your ${APP_NAME} password`,
      react: ResetPasswordTemplate({ token }),
    })

    return Response.json(data)
  } catch (err) {
    return Response.json({ err })
  }
}
