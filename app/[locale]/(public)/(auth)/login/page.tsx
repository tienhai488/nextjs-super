import LoginForm from '@/app/[locale]/(public)/(auth)/login/login-form'
import { getTranslations } from 'next-intl/server'

type Props = {
  searchParams?: { clearTokens?: string }
}

export async function generateMetadata({ params }: { params: any }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Login' })

  return {
    title: t('title'),
    description: t('description')
  }
}

export default function Login({ searchParams }: Props) {
  return (
    <div className='min-h-screen flex items-center justify-center'>
      <LoginForm clearTokens={searchParams?.clearTokens} />
    </div>
  )
}
