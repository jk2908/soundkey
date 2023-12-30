export type Toast = {
  id: number
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  onClose?: () => void
  duration?: number
}

export type Theme = 'light' | 'dark' | undefined

export type Icon = 'moon' | 'sun' | 'spinner'

export type ActionResponse =
  | {
      type: 'success' | 'error'
      message: string
      status: number
    }
  | { type: undefined; message: null; status: number | undefined }
