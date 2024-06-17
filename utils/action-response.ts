import type { ActionResponse } from '#/lib/types'
import { capitalise } from '#/utils/capitalise'

export const success = (
  status?: number,
  message?: string,
  config?: { key?: string; payload?: unknown }
): ActionResponse => ({
  ok: true,
  message: message ? capitalise(message) : 'Success',
  status: status || 200,
  key: config?.key,
  payload: config?.payload,
})

export const error = (
  status?: number,
  err?: string | Error | unknown,
  config?: { key?: string; payload?: unknown }
): ActionResponse => ({
  ok: false,
  message: err instanceof Error ? err.message : err?.toString() || 'An unknown error occurred',
  status: status || 500,
  key: config?.key,
  payload: config?.payload,
})
