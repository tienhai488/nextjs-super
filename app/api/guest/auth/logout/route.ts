import authApiRequest from '@/apiRequests/auth'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  const cookieStore = await cookies()
  const refreshToken = cookieStore.get('refreshToken')?.value || ''
  const accessToken = cookieStore.get('accessToken')?.value || ''

  cookieStore.delete('accessToken')
  cookieStore.delete('refreshToken')

  if (!refreshToken || !accessToken) {
    return Response.json(
      {
        message: 'Không có phiên đăng nhập nào tồn tại'
      },
      { status: 200 }
    )
  }

  try {
    const res = await authApiRequest.sLogout({ refreshToken, accessToken })

    return Response.json(res.payload)
  } catch (error) {
    return Response.json(
      {
        message: 'Đã xảy ra lỗi không xác định, vui lòng thử lại sau'
      },
      { status: 200 }
    )
  }
}
