'use client'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useLogoutMutation } from '@/queries/useAuth'
import { toast } from 'sonner'
import { handleErrorApi } from '@/lib/utils'
import { useAccountMe } from '@/queries/useAccount'
import { useAppStore } from '@/components/app-provider'
import { Link, useRouter } from '@/i18n/navigation'

export default function DropdownAvatar() {
  const logoutMutaion = useLogoutMutation()
  const router = useRouter()
  const { data } = useAccountMe()
  const account = data?.payload.data
  // const { setRole, disconnectSocket } = useAppContext()
  const setRole = useAppStore((state) => state.setRole)
  const disconnectSocket = useAppStore((state) => state.disconnectSocket)

  const handleLogout = async () => {
    if (logoutMutaion.isPending) return
    try {
      await logoutMutaion.mutateAsync()
      toast.success('Đăng xuất thành công')
      setRole(undefined)
      disconnectSocket()
      router.push('/login')
    } catch (error) {
      handleErrorApi({ error })
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' size='icon' className='overflow-hidden rounded-full'>
          <Avatar>
            <AvatarImage src={account?.avatar ?? undefined} alt={account?.name} />
            <AvatarFallback>{account?.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuLabel>{account?.name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={'/manage/setting'} className='cursor-pointer'>
            Cài đặt
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>Hỗ trợ</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>Đăng xuất</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
