import authApiRequest from '@/apiRequests/auth'
import { EntityError, HttpError } from '@/lib/http'
import { clsx, type ClassValue } from 'clsx'
import { UseFormSetError } from 'react-hook-form'
import { toast } from 'sonner'
import { twMerge } from 'tailwind-merge'
import jwt from 'jsonwebtoken'
import { DishStatus, OrderStatus, Role, TableStatus } from '@/constants/type'
import envConfig from '@/config'
import { TokenPayload } from '@/types/jwt.types'
import guestApiRequest from '@/apiRequests/guest'
import { format } from 'date-fns'
import { BookX, CookingPot, HandCoins, Loader, Truck } from 'lucide-react'
import { io } from 'socket.io-client'

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
    const backendMessage = error instanceof HttpError ? error.payload?.message : error?.payload?.message

    toast.error(backendMessage || error?.message || 'Đã có lỗi xảy ra', {
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

export const checkAndRefreshToken = async (params?: {
  onSuccess?: () => void
  onError?: () => void
  isForce?: boolean
}) => {
  const accessToken = getAccessTokenFromLS()
  const refreshToken = getRefreshTokenFromLocalStorage()

  if (!accessToken || !refreshToken) {
    return
  }

  const decodeAccessToken = decodeToken(accessToken)
  const decodeRefreshToken = decodeToken(refreshToken)

  const now = Math.round(new Date().getTime() / 1000)

  if (decodeRefreshToken.exp <= now) {
    removeTokensFromLocalStorage()
    if (params?.onError) {
      params.onError()
    }
    return
  }

  if (params?.isForce || decodeAccessToken.exp - now < (decodeAccessToken.exp - decodeAccessToken.iat) / 3) {
    try {
      const role = decodeRefreshToken.role
      const res = role === Role.Guest ? await guestApiRequest.refreshToken() : await authApiRequest.refreshToken()

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

export const getVietnameseOrderStatus = (status: (typeof OrderStatus)[keyof typeof OrderStatus]) => {
  switch (status) {
    case OrderStatus.Pending:
      return 'Đang chờ'
    case OrderStatus.Processing:
      return 'Đang xử lý'
    case OrderStatus.Delivered:
      return 'Đã giao'
    case OrderStatus.Rejected:
      return 'Đã từ chối'
    case OrderStatus.Paid:
      return 'Đã thanh toán'
    default:
      return 'Không xác định'
  }
}

export const getTableLink = ({ token, tableNumber }: { token: string; tableNumber: number }) => {
  return envConfig.NEXT_PUBLIC_URL + '/tables/' + tableNumber + '?token=' + token
}

export const decodeToken = (token: string) => {
  return jwt.decode(token) as TokenPayload
}

export function removeAccents(str: string) {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
}

export const simpleMatchText = (fullText: string, matchText: string) => {
  return removeAccents(fullText.toLowerCase()).includes(removeAccents(matchText.trim().toLowerCase()))
}

export const formatDateTimeToLocaleString = (date: string | Date) => {
  return format(date instanceof Date ? date : new Date(date), 'HH:mm:ss dd/MM/yyyy')
}

export const formatDateTimeToTimeString = (date: string | Date) => {
  return format(date instanceof Date ? date : new Date(date), 'HH:mm:ss')
}

export const OrderStatusIcon = {
  [OrderStatus.Pending]: Loader,
  [OrderStatus.Processing]: CookingPot,
  [OrderStatus.Rejected]: BookX,
  [OrderStatus.Delivered]: Truck,
  [OrderStatus.Paid]: HandCoins
}

export const generateSocketInstance = (accessToken: string) => {
  return io(envConfig.NEXT_PUBLIC_API_ENDPOINT, {
    auth: {
      Authorization: `Bearer ${accessToken}`
    }
  })
}

export const wrapServerApi = async <T>(fn: () => Promise<T>) => {
  let result = null

  try {
    result = await fn()
  } catch (error: any) {
    if (error.digest?.includes('NEXT_REDIRECT')) {
      throw error
    }
  }

  return result
}
