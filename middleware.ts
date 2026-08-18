import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_PATHS = [
  '/',
  '/_next',
  '/favicon.ico',
  '/api/paypal/verify',
  '/api/auth/check',
]

const PROTECTED_PATHS = [
  '/api/subscription',
  '/api/user',
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (PUBLIC_PATHS.some(path => pathname === path || pathname.startsWith(path))) {
    return NextResponse.next()
  }

  if (PROTECTED_PATHS.some(path => pathname.startsWith(path))) {
    const sessionCookie = request.cookies.get('docexpress_session')

    if (!sessionCookie) {
      return NextResponse.json(
        { error: 'Unauthorized - No session' },
        { status: 401 }
      )
    }

    try {
      const sessionData = JSON.parse(sessionCookie.value)
      const expiryDate = new Date(sessionData.expiresAt)
      const now = new Date()

      if (expiryDate <= now) {
        const response = NextResponse.json(
          { error: 'Unauthorized - Session expired' },
          { status: 401 }
        )
        response.cookies.delete('docexpress_session')
        return response
      }

      return NextResponse.next()
    } catch {
      const response = NextResponse.json(
        { error: 'Unauthorized - Invalid session' },
        { status: 401 }
      )
      response.cookies.delete('docexpress_session')
      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|images|favicon.ico).*)',
  ],
}