import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function debounce<T extends Array<unknown>>(callback: (...args: T) => void, wait: number) {
  let timeoutId: ReturnType<typeof setTimeout> | number | undefined = undefined

  return (...args: T) => {
    window.clearTimeout(timeoutId)

    timeoutId = window.setTimeout(() => {
      callback.apply(null, args)
    }, wait)
  }
}

export function isValidEmail(maybeEmail: unknown): maybeEmail is string {
  if (typeof maybeEmail !== 'string') return false
  if (maybeEmail.length > 255) return false

  const emailRegexp = /^.+@.+$/

  return emailRegexp.test(maybeEmail)
}

export function copyToClipboard(str: unknown) {
  return navigator.clipboard.writeText(typeof str === 'string' ? str : JSON.stringify(str, null, 2))
}
