'use client'

import { useAppStore } from '@/components/app-provider'
import { Role } from '@/constants/type'
import { cn, handleErrorApi } from '@/lib/utils'
import { useLogoutMutation } from '@/queries/useAuth'
import { RoleType } from '@/types/jwt.types'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Link, useRouter } from '@/i18n/navigation'

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
    title: 'Đơn hàng',
    href: '/guest/orders',
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
  // const { role, setRole, disconnectSocket } = useAppContext()
  const role = useAppStore((state) => state.role)
  const setRole = useAppStore((state) => state.setRole)
  const disconnectSocket = useAppStore((state) => state.disconnectSocket)
  const logoutMutation = useLogoutMutation()
  const router = useRouter()

  const logout = async () => {
    try {
      if (logoutMutation.isPending) return

      await logoutMutation.mutateAsync()
      setRole(undefined)
      disconnectSocket()
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
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <div className={cn(className, 'cursor-pointer')}>Đăng xuất</div>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Bạn có chắc chắn muốn đăng xuất không?</AlertDialogTitle>
              <AlertDialogDescription>Đăng xuất sẽ mất hết tiến trình hiện tại.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
              <AlertDialogAction onClick={logout}>Tiếp tục</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  )
}
