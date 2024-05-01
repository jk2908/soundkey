import dotenv from 'dotenv'
import { migrate } from 'drizzle-orm/better-sqlite3/migrator'

import { db } from '#/lib/db'

dotenv.config({ path: '.env' })
;(async () => {
  try {
    migrate(db, { migrationsFolder: 'migrations' })
    process.exit(0)
  } catch (err) {
    console.error('Migration failed', err)
    process.exit(1)
  }
})()
