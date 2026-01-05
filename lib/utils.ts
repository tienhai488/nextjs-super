import authApiRequest from '@/apiRequests/auth'
import { EntityError } from '@/lib/http'
import { clsx, type ClassValue } from 'clsx'
import { UseFormSetError } from 'react-hook-form'
import { toast } from 'sonner'
import { twMerge } from 'tailwind-merge'
import jwt from 'jsonwebtoken'
import { DishStatus, TableStatus } from '@/constants/type'
import envConfig from '@/config'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPath(path: string): string {
  return path.startsWith('/') ? path.slice(1) : path
}

export const handleErrorApi = ({
  error,
  setError,
  duration
}: {
  error: any
  setError?: UseFormSetError<any>
  duration?: number
}) => {
  if (error instanceof EntityError && setError) {
    error.payload.errors.forEach((item) => {
      setError(item.field, {
        type: 'server',
        message: item.message
      })
    })
  } else {
    toast.error(error?.message || 'Đã có lỗi xảy ra', {
      duration: duration || 5000
    })
  }
}

const isBrowser = typeof window !== 'undefined'

export const getAccessTokenFromLS = (): string | null => {
  if (!isBrowser) return null
  return localStorage.getItem('accessToken')
}

export const setAccessTokenToLS = (token: string): void => {
  if (!isBrowser) return
  localStorage.setItem('accessToken', token)
}

export const getRefreshTokenFromLocalStorage = (): string | null => {
  if (!isBrowser) return null
  return localStorage.getItem('refreshToken')
}

export const setRefreshTokenToLocalStorage = (token: string): void => {
  if (!isBrowser) return
  localStorage.setItem('refreshToken', token)
}

export const removeTokensFromLocalStorage = (): void => {
  if (!isBrowser) return
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
}

export const checkAndRefreshToken = async (params?: { onSuccess?: () => void; onError?: () => void }) => {
  const accessToken = getAccessTokenFromLS()
  const refreshToken = getRefreshTokenFromLocalStorage()

  if (!accessToken || !refreshToken) {
    return
  }

  const decodeAccessToken = jwt.decode(accessToken) as { exp: number; iat: number }
  const decodeRefreshToken = jwt.decode(refreshToken) as { exp: number; iat: number }

  const now = Math.round(new Date().getTime() / 1000)

  if (decodeRefreshToken.exp <= now) {
    removeTokensFromLocalStorage()
    if (params?.onError) {
      params.onError()
    }
    return
  }

  if (decodeAccessToken.exp - now < (decodeAccessToken.exp - decodeAccessToken.iat) / 3) {
    try {
      const res = await authApiRequest.refreshToken()

      setAccessTokenToLS(res.payload.data.accessToken)
      setRefreshTokenToLocalStorage(res.payload.data.refreshToken)
      if (params?.onSuccess) {
        params.onSuccess()
      }
    } catch (error) {
      removeTokensFromLocalStorage()
      if (params?.onError) {
        params.onError()
      }
    }
  }
}

export const formatCurrency = (number: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(number)
}

export const getVietnameseDishStatus = (status: (typeof DishStatus)[keyof typeof DishStatus]) => {
  switch (status) {
    case DishStatus.Available:
      return 'Có sẵn'
    case DishStatus.Unavailable:
      return 'Không có sẵn'
    default:
      return 'Ẩn'
  }
}

export const getVietnameseTableStatus = (status: (typeof TableStatus)[keyof typeof TableStatus]) => {
  switch (status) {
    case TableStatus.Available:
      return 'Có sẵn'
    case TableStatus.Reserved:
      return 'Đã đặt'
    default:
      return 'Ẩn'
  }
}

export const getTableLink = ({ token, tableNumber }: { token: string; tableNumber: number }) => {
  return envConfig.NEXT_PUBLIC_URL + '/tables/' + tableNumber + '?token=' + token
}
