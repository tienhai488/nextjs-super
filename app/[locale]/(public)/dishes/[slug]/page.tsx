import dishApiRequest from '@/apiRequests/dish'
import DishDetail from '@/app/[locale]/(public)/dishes/[slug]/dish-detail'
import { extractIdFromSlugUrl, wrapServerApi } from '@/lib/utils'
import { DishResType } from '@/schemaValidations/dish.schema'

export default async function DishPage({ params }: { params: { slug: string } }) {
  const { slug } = await params
  const id = extractIdFromSlugUrl(slug)

  const data = await wrapServerApi(() => dishApiRequest.detail(Number(id)))

  const dish = data?.payload.data

  return <DishDetail dish={dish as DishResType['data']} />
}
