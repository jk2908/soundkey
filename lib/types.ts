import { lucia } from '@/lib/auth'

declare module 'lucia' {
  export interface Register {
    Lucia: typeof lucia
    DatabaseSessionAttributes: DatabaseSessionAttributes
    DatabaseUserAttributes: DatabaseUserAttributes
  }
}

export interface DatabaseSessionAttributes {}

export interface DatabaseUserAttributes {
  user_id: string
  email: string
  email_verified: boolean
  created_at: string
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

export type Icon = 'moon' | 'sun' | 'spinner' | 'x' | 'logout' | 'user'

export type ServerResponse =
  | {
      type: 'success' | 'error'
      message: string
      status: number
    }
  | { type: undefined; message: null; status: undefined }

export type ServerResponseWithPayload<T> = ServerResponse & { payload: T }

export type Route = {
  label: string
  href: string
  isProtected?: boolean
}
