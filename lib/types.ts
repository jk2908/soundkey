export type Toast = {
  id: number
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  status?: number
  duration?: number | null
}

export type Theme = 'light' | 'dark' | undefined

export type Icon = 'moon' | 'sun' | 'spinner' | 'x'

export type ActionResponse =
  | {
      type: 'success' | 'error'
      message: string
      status: number
    }
  | { type: undefined; message: null; status: number | undefined }

export type Route = {
  label: string
  href: string
}