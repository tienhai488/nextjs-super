import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const privatePaths = ['/manage']
const publicPaths = ['/login']

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const accessToken = request.cookies.get('accessToken')?.value
  const refreshToken = request.cookies.get('refreshToken')?.value

  if (privatePaths.some((path) => pathname.startsWith(path)) && !refreshToken) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (privatePaths.some((path) => pathname.startsWith(path)) && refreshToken && !accessToken) {
    const url = new URL('/logout', request.url)
    url.searchParams.set('refreshToken', refreshToken)
    return NextResponse.redirect(url)
  }

  if (publicPaths.some((path) => pathname.startsWith(path)) && refreshToken) {
    return NextResponse.redirect(new URL('/manage/dashboard', request.url))
  }

  return NextResponse.next()
}

// Alternatively, you can use a default export:
// export default function proxy(request: NextRequest) { ... }

export const config = {
  matcher: ['/manage/:path*', '/login']
}
