import dotenv from 'dotenv'
import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'

dotenv.config({ path: '.env' })

const sql = postgres(process.env.DB_URL ?? '', { max: 1, ssl: 'require' })
const db = drizzle(sql, { logger: true })

try {
  await migrate(db, { migrationsFolder: 'migrations' })
} catch (err) {
  console.error(err)
}

await sql.end()
