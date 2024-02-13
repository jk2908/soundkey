import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'

import * as schema from '@/lib/schema'

export const db = new Database(process.env.DB_URL)