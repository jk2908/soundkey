import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'

import type { ServerResponse } from '@/lib/types'
import { capitalise } from '@/utils/capitalise'

const sqlite = new Database(process.env.DB_URL)
export const db = drizzle(sqlite)

export const success = ({
  message,
  status = 200,
  key,
}: {
  message: string
  status?: number
  key?: string
}): ServerResponse => ({
  type: 'success',
  message: capitalise(message),
  status,
  key,
})

export const error = (err: Error | { message?: string; status?: number }): ServerResponse => ({
  type: 'error',
  message: err.message ? capitalise(err.message) : 'An unknown error occurred',
  status: err instanceof Error ? 500 : err.status || 500,
})
