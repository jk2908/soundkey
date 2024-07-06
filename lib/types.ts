import { lucia } from '#/lib/auth'
import { type Icon } from '#/components/global/icon'

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
  username: string
}

export type StateVariant = 'success' | 'error' | 'danger' | 'warning' | 'info'

export type IntentVariant = 'primary' | 'secondary' | 'tertiary' | 'highlight'

export type Toast = {
  id: number
  type: StateVariant
  message: string
  status?: number
  duration?: number | null
}

export type Theme = 'light' | 'dark' | undefined

export type ActionResponse = {
  ok?: boolean
  message?: string
  status?: number
  key?: string
  payload?: unknown
}

export type Route = {
  label: string
  href: string
  isProtected?: boolean
  icon?: Icon
  match?: string[]
  subRoutes?: Route[]
}

export type ThreadAction = {
  label: string
  onClick: () => Promise<void>
}

export type ProjectTask = {
  id: string
  title: string
  description: string
  isCompleted: boolean
}

export type WithFormattedTimestamps<T extends {}, K extends keyof T> = {
  [P in Exclude<keyof T, K>]: T[P]
} & { [P in K]: string | null }
