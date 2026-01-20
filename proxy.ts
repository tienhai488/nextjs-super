import { Role } from '@/constants/type'
import { decodeToken } from '@/lib/utils'
import type { NextRequest } from 'next/server'
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'
import { defaultLocale as defaultLocaleConfig, locales } from '@/config'

export default createMiddleware(routing)

const managePaths = ['/manage']
const guestPath = ['/guest']
const privatePaths = [...managePaths, ...guestPath]
const unauthPaths = ['/login']
const onlyOwnerPaths: string[] = ['/manage/accounts']

export function proxy(request: NextRequest) {
  const defaultLocale = request.headers.get('x-your-custom-locale') || defaultLocaleConfig

  const handleI18nRouting = createMiddleware({
    locales: locales,
    defaultLocale: defaultLocale as any
  })
  const response = handleI18nRouting(request)

  response.headers.set('x-your-custom-locale', defaultLocale)

  const { pathname } = request.nextUrl
  const accessToken = request.cookies.get('accessToken')?.value
  const refreshToken = request.cookies.get('refreshToken')?.value

  if (privatePaths.some((path) => pathname.startsWith(path)) && !refreshToken) {
    const url = new URL('/login', request.url)
    url.searchParams.set('clearTokens', 'true')
    response.headers.set('x-middleware-rewrite', url.toString())
    return response
  }

  if (refreshToken) {
    if (unauthPaths.some((path) => pathname.startsWith(path))) {
      // return NextResponse.redirect(new URL('/', request.url))
      const url = new URL('/', request.url)
      response.headers.set('x-middleware-rewrite', url.toString())
      return response
    }

    if (privatePaths.some((path) => pathname.startsWith(path)) && !accessToken) {
      const url = new URL('/guest/auth/refresh-token', request.url)
      url.searchParams.set('redirect', pathname)
      // return NextResponse.redirect(url)
      response.headers.set('x-middleware-rewrite', url.toString())
      return response
    }

    const role = decodeToken(accessToken!).role

    console.log('role', role)
    console.log('path', pathname)

    if (onlyOwnerPaths.some((path) => pathname.startsWith(path)) && role !== Role.Owner) {
      // return NextResponse.redirect(new URL('/', request.url))
      const url = new URL('/', request.url)
      response.headers.set('x-middleware-rewrite', url.toString())
      return response
    }

    if (managePaths.some((path) => pathname.startsWith(path)) && role === Role.Guest) {
      // return NextResponse.redirect(new URL('/', request.url))
      const url = new URL('/', request.url)
      response.headers.set('x-middleware-rewrite', url.toString())
      return response
    }

    if (guestPath.some((path) => pathname.startsWith(path)) && role !== Role.Guest) {
      // return NextResponse.redirect(new URL('/', request.url))
      const url = new URL('/', request.url)
      response.headers.set('x-middleware-rewrite', url.toString())
      return response
    }
  }

  return response
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
}
