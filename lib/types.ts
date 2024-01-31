import { NewMessage, NewSystemMessage } from '@/lib/schema'

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

export type NewMessageConfig = { system?: boolean }

export type NewMessageSource<C extends NewMessageConfig> = C extends { system: true }
  ? NewSystemMessage
  : NewMessage
