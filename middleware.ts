import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Get the user_id from cookies
  const userId = request.cookies.get('user_id')

  // If no user_id exists, create a new one
  if (!userId) {
    const response = NextResponse.next()
    const newUserId = uuidv4()
    
    // Set the user_id cookie
    // HttpOnly for security, 1 year expiry
    response.cookies.set({
      name: 'user_id',
      value: newUserId,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365, // 1 year
    })

    return response
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
} 