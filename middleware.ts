import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyRequestOrigin } from 'lucia'
import { RateLimiterMemory } from 'rate-limiter-flexible'

const rateLimiter = new RateLimiterMemory({
  points: 10,
  duration: 1,
})

export async function middleware(request: NextRequest) {
  switch (request.method) {
    case 'GET':
      return NextResponse.next()
    case 'POST':
      if (process.env.NODE_ENV === 'development') return NextResponse.next()

      let res: any

      try {
        res = await rateLimiter.consume(2)
      } catch (err) {
        res = err
      }

      if (res._remainingPoints > 0) return NextResponse.next()

      return NextResponse.json(
        {
          error: 'Rate limit exceeded. Please try again later.',
        },
        {
          status: 429,
        }
      )
  }

  return NextResponse.next()
}

export const config = {
  //matcher: ['/signup', '/login', '/verify-email', '/reset-password'],
}
