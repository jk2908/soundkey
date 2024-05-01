import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'

import type { ServerResponse } from '#/lib/types'
import { capitalise } from '#/utils/capitalise'

const sqlite = new Database(process.env.DB_URL)
export const db = drizzle(sqlite)

export const success = (
  status?: number,
  message?: string,
  config?: { key?: string; payload?: unknown }
): ServerResponse => ({
  ok: true,
  type: 'success',
  message: message ? capitalise(message) : 'Success',
  status: status || 200,
  key: config?.key,
  payload: config?.payload,
})

export const error = (
  status?: number,
  message?: string,
  config?: { key?: string; payload?: unknown }
): ServerResponse => ({
  ok: false,
  type: 'error',
  message: message ? capitalise(message) : 'An unknown error occurred',
  status: status || 500,
  key: config?.key,
  payload: config?.payload,
})
