import { Role } from '@/constants/type'
import { decodeToken } from '@/lib/utils'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const managePaths = ['/manage']
const guestPath = ['/guest']
const privatePaths = [...managePaths, ...guestPath]
const unauthPaths = ['/login']
const onlyOwnerPaths: string[] = ['/manage/accounts']

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const accessToken = request.cookies.get('accessToken')?.value
  const refreshToken = request.cookies.get('refreshToken')?.value

  if (privatePaths.some((path) => pathname.startsWith(path)) && !refreshToken) {
    const url = new URL('/login', request.url)
    url.searchParams.set('clearTokens', 'true')
    return NextResponse.redirect(url)
  }

  if (refreshToken) {
    if (unauthPaths.some((path) => pathname.startsWith(path))) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    if (privatePaths.some((path) => pathname.startsWith(path)) && !accessToken) {
      const url = new URL('/guest/auth/refresh-token', request.url)
      url.searchParams.set('redirect', pathname)
      return NextResponse.redirect(url)
    }

    const role = decodeToken(accessToken!).role

    console.log('role', role)
    console.log('path', pathname)

    if (onlyOwnerPaths.some((path) => pathname.startsWith(path)) && role !== Role.Owner) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    if (managePaths.some((path) => pathname.startsWith(path)) && role === Role.Guest) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    if (guestPath.some((path) => pathname.startsWith(path)) && role !== Role.Guest) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return NextResponse.next()
}

// Alternatively, you can use a default export:
// export default function proxy(request: NextRequest) { ... }

export const config = {
  matcher: ['/manage/:path*', '/guest/:path*', '/login']
}
