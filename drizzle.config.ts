import * as dotenv from 'dotenv'
import { defineConfig, type Config } from 'drizzle-kit'

dotenv.config({ path: '.env' })

export default defineConfig({
  schema: './lib/schema.ts',
  out: './migrations',
  driver: 'better-sqlite',
  dbCredentials: {
    url: process.env.DB_URL ?? '',
  },
}) satisfies Config
