import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import guestApiRequest from '@/apiRequests/guest'

export async function POST(request: Request) {
  const cookieStore = await cookies()
  const refreshTokenFromCookie = cookieStore.get('refreshToken')?.value

  if (!refreshTokenFromCookie) {
    return Response.json(
      {
        message: 'Refresh token is missing'
      },
      {
        status: 401
      }
    )
  }

  try {
    const { payload } = await guestApiRequest.sRefreshToken({ refreshToken: refreshTokenFromCookie })
    const { accessToken, refreshToken } = payload.data

    const decodeAccessToken = jwt.decode(accessToken) as { exp: number }
    const decodeRefreshToken = jwt.decode(refreshToken) as { exp: number }

    cookieStore.set('accessToken', accessToken, {
      path: '/',
      httpOnly: true,
      secure: true,
      expires: new Date(decodeAccessToken.exp * 1000),
      sameSite: 'lax'
    })

    cookieStore.set('refreshToken', refreshToken, {
      path: '/',
      httpOnly: true,
      secure: true,
      expires: new Date(decodeRefreshToken.exp * 1000),
      sameSite: 'lax'
    })

    return Response.json(payload)
  } catch (error: any) {
    return Response.json(
      {
        message: error.message || 'Internal Server Error'
      },
      {
        status: 401
      }
    )
  }
}
