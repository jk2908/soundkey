import { neon, neonConfig, Pool } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'

import * as schema from '@/lib/schema'

// @ts-expect-error
neonConfig.fetchConnectionCache = true

// @ts-expect-error
export const pool = new Pool({ connectionString: process.env.DB_URL })

// @ts-expect-error
export const sql = neon(process.env.DB_URL)
export const db = drizzle(sql, { schema })

export interface DbError extends Error {
  code: string
  constraint: string
  detail: string
  table: string
  message: 'duplicate key value violates unique constraint "users_email_index"'
}
