import authApiRequest from '@/apiRequests/auth'
import { LoginBodyType } from '@/schemaValidations/auth.schema'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

export async function POST(request: Request) {
  const body = (await request.json()) as LoginBodyType
  const cookieStore = await cookies()

  try {
    const { payload } = await authApiRequest.sLogin(body)
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
  } catch (error) {
    Response.json(
      {
        message: 'Login failed'
      },
      {
        status: 500
      }
    )
  }
}
