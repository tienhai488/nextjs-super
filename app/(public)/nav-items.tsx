'use client'

import { getAccessTokenFromLS } from '@/lib/utils'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { set } from 'zod'

const menuItems = [
  {
    title: 'Món ăn',
    href: '/menu'
  },
  {
    title: 'Đơn hàng',
    href: '/orders',
    authRequired: true
  },
  {
    title: 'Đăng nhập',
    href: '/login',
    authRequired: false
  },
  {
    title: 'Quản lý',
    href: '/manage/dashboard',
    authRequired: true
  }
]

export default function NavItems({ className }: { className?: string }) {
  const [isAuth, setIsAuth] = useState<boolean>(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsAuth(Boolean(getAccessTokenFromLS()))
    setMounted(true)
  }, [])

  if (!mounted) return null

  return menuItems.map((item) => {
    if (item.authRequired === undefined || item.authRequired === isAuth) {
      return (
        <Link href={item.href} key={item.href} className={className}>
          {item.title}
        </Link>
      )
    }
    return null
  })
}
