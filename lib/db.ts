import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'

const sqlite = new Database(process.env.DB_URL)
export const db = drizzle(sqlite)
