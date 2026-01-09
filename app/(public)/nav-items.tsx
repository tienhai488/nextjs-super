'use client'

import { useAppContext } from '@/components/app-provider'
import { Role } from '@/constants/type'
import { cn, handleErrorApi } from '@/lib/utils'
import { useLogoutMutation } from '@/queries/useAuth'
import { RoleType } from '@/types/jwt.types'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const menuItems: {
  title: string
  href: string
  roles?: RoleType[]
  hideWhenLoggedIn?: boolean
}[] = [
  {
    title: 'Trang chủ',
    href: '/'
  },
  {
    title: 'Menu',
    href: '/guest/menu',
    roles: [Role.Guest]
  },
  {
    title: 'Đăng nhập',
    href: '/login',
    hideWhenLoggedIn: true
  },
  {
    title: 'Quản lý',
    href: '/manage/dashboard',
    roles: [Role.Owner, Role.Guest]
  }
]

export default function NavItems({ className }: { className?: string }) {
  const { role, setRole } = useAppContext()
  const logoutMutation = useLogoutMutation()
  const router = useRouter()

  const logout = async () => {
    try {
      if (logoutMutation.isPending) return

      await logoutMutation.mutateAsync()
      setRole(undefined)
      router.push('/login')
    } catch (error) {
      handleErrorApi({
        error
      })
    }
  }

  return (
    <>
      {menuItems.map((item) => {
        const isAuth = item.roles !== undefined && item.roles.length > 0 && role && item.roles?.includes(role)
        const cantShow = item.hideWhenLoggedIn && role !== undefined

        if (cantShow) {
          return null
        }

        if (item.roles === undefined || isAuth) {
          return (
            <Link href={item.href} key={item.href} className={cn(className, 'cursor-pointer')}>
              {item.title}
            </Link>
          )
        }

        return null
      })}
      {role && (
        <div className={cn(className, 'cursor-pointer')} onClick={logout}>
          Đăng xuất
        </div>
      )}
    </>
  )
}
