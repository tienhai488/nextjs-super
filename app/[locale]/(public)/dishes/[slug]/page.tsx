import dishApiRequest from '@/apiRequests/dish'
import DishDetail from '@/app/[locale]/(public)/dishes/[slug]/dish-detail'
import envConfig from '@/config'
import { extractIdFromSlugUrl, generateSlugUrl, htmlToTextWithLimit, wrapServerApi } from '@/lib/utils'
import { DishResType } from '@/schemaValidations/dish.schema'
import { baseOpenGraph } from '@/shared-metadata'
import { Metadata } from 'next'
import { Locale } from 'next-intl'
import { getTranslations } from 'next-intl/server'

export async function generateStaticParams() {
  const result = await wrapServerApi(() => dishApiRequest.list())
  const dishes = result?.payload?.data || []

  return dishes.map((post) => ({
    slug: generateSlugUrl({ name: post.name, id: post.id })
  }))
}

type Props = {
  params: { slug: string; locale: Locale }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const t = await getTranslations({
    locale: params.locale,
    namespace: 'DishDetail'
  })
  const { slug } = await params
  const id = extractIdFromSlugUrl(slug)
  const data = await dishApiRequest.detail(id!)
  const dish = data?.payload.data
  if (!dish) {
    return {
      title: t('notFound'),
      description: t('notFound')
    }
  }
  const url =
    envConfig.NEXT_PUBLIC_URL +
    `/${params.locale}/dishes/${generateSlugUrl({
      name: dish.name,
      id: dish.id
    })}`

  return {
    title: dish.name,
    description: htmlToTextWithLimit(dish.description),
    openGraph: {
      ...baseOpenGraph,
      title: dish.name,
      description: dish.description,
      url,
      images: [
        {
          url: dish.image
        }
      ]
    },
    alternates: {
      canonical: url
    }
  }
}

export default async function DishPage({ params }: { params: { slug: string } }) {
  const { slug } = await params
  const id = extractIdFromSlugUrl(slug)

  const data = await wrapServerApi(() => dishApiRequest.detail(Number(id)))

  const dish = data?.payload.data

  return <DishDetail dish={dish as DishResType['data']} />
}
