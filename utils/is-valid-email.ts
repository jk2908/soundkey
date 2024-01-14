export function isValidEmail(maybeEmail: unknown): maybeEmail is string {
  if (typeof maybeEmail !== 'string') return false
  if (maybeEmail.length > 255) return false

  const emailRegexp = /^.+@.+$/

  return emailRegexp.test(maybeEmail)
}