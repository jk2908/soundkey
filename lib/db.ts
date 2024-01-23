import { neon, neonConfig, Pool } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'

import * as schema from '@/lib/schema'

neonConfig.fetchConnectionCache = true

export const pool = new Pool({ connectionString: process.env.DB_URL })
export const sql = neon(process.env.DB_URL ?? '')
export const db = drizzle(sql, { schema })

export interface DbError extends Error {
  code: string
  constraint: string
  detail: string
  table: string
  message: 'Duplicate key value violates unique constraint'
}
