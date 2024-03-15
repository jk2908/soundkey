import { auth } from '@/lib/auth'
import { ServerResponse } from 'http'

export async function createAuthAction(fn: () => Promise<ServerResponse>) {
  const user = await auth()

  
}