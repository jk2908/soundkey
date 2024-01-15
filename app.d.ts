/// <reference types="lucia" />
declare namespace Lucia {
  type Auth = import('@/lib/auth').Auth
  type DatabaseUserAttributes = {
    email: string
    email_verified: boolean
    role: 'user' | 'admin'
  }
  type DatabaseSessionAttributes = {}
}
