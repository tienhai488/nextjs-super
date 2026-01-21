import LoginForm from '@/app/[locale]/(public)/(auth)/login/login-form'

type Props = {
  searchParams?: { clearTokens?: string }
}

export default function Login({ searchParams }: Props) {
  return (
    <div className='min-h-screen flex items-center justify-center'>
      <LoginForm clearTokens={searchParams?.clearTokens} />
    </div>
  )
}
