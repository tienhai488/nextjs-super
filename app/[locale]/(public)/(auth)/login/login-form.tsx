'use client'
import { Button } from '@/components/ui/button'
import { LoginBody, LoginBodyBase, LoginBodyType } from '@/schemaValidations/auth.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useLoginMutation } from '@/queries/useAuth'
import { toast } from 'sonner'
import { generateSocketInstance, handleErrorApi } from '@/lib/utils'
import { useEffect } from 'react'
import { useAppStore } from '@/components/app-provider'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'

export default function LoginForm({ clearTokens }: { clearTokens?: string }) {
  const loginMutation = useLoginMutation()
  const router = useRouter()
  // const { setRole, setSocket } = useAppContext()
  const setRole = useAppStore((state) => state.setRole)
  const setSocket = useAppStore((state) => state.setSocket)
  const t = useTranslations('Login')
  const validateMessages = useTranslations('Validation')

  const formSchema = LoginBodyBase(validateMessages as any)

  useEffect(() => {
    if (clearTokens === 'true') {
      setRole(undefined)
    }
  }, [clearTokens, setRole])

  useEffect(() => {
    if (clearTokens === 'true') {
      setRole(undefined)
    }
  }, [clearTokens, setRole])

  const form = useForm<LoginBodyType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const onSubmit = async (data: LoginBodyType) => {
    if (loginMutation.isPending) return
    try {
      const result = await loginMutation.mutateAsync(data)
      toast.success(result.payload.message)
      setRole(result.payload.data.account.role)
      setSocket(generateSocketInstance(result.payload.data.accessToken))
      router.push('/manage/dashboard')
    } catch (error) {
      handleErrorApi({
        error,
        setError: form.setError
      })
    }
  }

  return (
    <Card className='mx-auto w-[400px]'>
      <CardHeader>
        <CardTitle className='text-2xl'>{t('title')}</CardTitle>
        <CardDescription>Nhập email và mật khẩu của bạn để đăng nhập vào hệ thống</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className='space-y-2 shrink-0 w-full' noValidate onSubmit={form.handleSubmit(onSubmit)}>
            <div className='grid gap-4'>
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid gap-2'>
                      <FormLabel htmlFor='email'>Email</FormLabel>
                      <Input id='email' type='email' placeholder='m@example.com' required {...field} />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid gap-2'>
                      <div className='flex items-center'>
                        <FormLabel htmlFor='password'>Password</FormLabel>
                      </div>
                      <Input id='password' type='password' required {...field} />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <Button type='submit' className='w-full'>
                Đăng nhập
              </Button>
              <Button variant='outline' className='w-full' type='button'>
                Đăng nhập bằng Google
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
