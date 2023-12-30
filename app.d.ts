/// <reference types="lucia" />
declare namespace Lucia {
  type Auth = import('@/lib/auth').Auth
  type DatabaseUserAttributes = {
    email: string
    email_verified: boolean
  }
  type DatabaseSessionAttributes = {}
}
