'use client'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Locale, locales } from '@/config'
import { usePathname, useRouter } from '@/i18n/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { useParams, useSearchParams } from 'next/navigation'

export function SwitchLanguage() {
  const t = useTranslations('SwitchLanguage')
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()

  return (
    <Select
      value={locale}
      onValueChange={(value) => {
        const locale = value as Locale
        const newPathname = pathname.replace(`/${params.locale}`, `/${locale}`)
        const fullUrl = `${newPathname}?${searchParams.toString()}`
        router.replace(fullUrl)
        router.refresh()
      }}
    >
      <SelectTrigger className='w-[140px]'>
        <SelectValue placeholder={t('title')} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {locales.map((locale) => (
            <SelectItem value={locale} key={locale}>
              {t(locale)}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
