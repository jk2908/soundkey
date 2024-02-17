import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyRequestOrigin } from 'lucia'
import { RateLimiterMemory } from 'rate-limiter-flexible'

const rateLimiter = new RateLimiterMemory({
  points: 10,
  duration: 1,
})

export async function middleware(request: NextRequest) {
  if (process.env.NODE_ENV === 'development') return NextResponse.next()

  const originHeader = request.headers.get('Origin')
  const hostHeader = request.headers.get('Host')

  if (!originHeader || !hostHeader || !verifyRequestOrigin(originHeader, [hostHeader])) {
    return new NextResponse(null, {
      status: 403,
    })
  }

  switch (request.method) {
    case 'GET':
      return NextResponse.next()
    case 'POST':
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
