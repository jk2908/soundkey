import { lucia } from '@/lib/auth'

declare module 'react' {
  interface CSSProperties {
    [key: `--${string}`]: string | number
  }
}

declare module 'lucia' {
  export interface Register {
    Lucia: typeof lucia
    DatabaseSessionAttributes: DatabaseSessionAttributes
    DatabaseUserAttributes: DatabaseUserAttributes
  }
}

export interface DatabaseSessionAttributes {}

export interface DatabaseUserAttributes {
  id: string
  email: string
  email_verified: boolean
  created_at: number
  updated_at: number | null
  role: 'user' | 'admin' | 'system'
}

export type StateVariant = 'success' | 'error' | 'danger' | 'warning' | 'info'

export type IntentVariant = 'primary' | 'secondary' | 'tertiary'

export type Toast = {
  id: number
  type: StateVariant
  message: string
  status?: number
  duration?: number | null
}

export type Theme = 'light' | 'dark' | undefined

export type ServerResponse =
  | {
      type: 'success' | 'error'
      message: string
      status: number
      key?: string
      payload?: unknown
    }
  | { type: undefined; message: null; status: undefined; key?: string, payload?: unknown }

export type Route = {
  label: string
  href: string
  isProtected?: boolean
}
