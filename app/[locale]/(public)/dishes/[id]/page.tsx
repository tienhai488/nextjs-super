import dishApiRequest from '@/apiRequests/dish'
import DishDetail from '@/app/[locale]/(public)/dishes/[id]/dish-detail'
import { wrapServerApi } from '@/lib/utils'
import { DishResType } from '@/schemaValidations/dish.schema'

export default async function DishPage({ params }: { params: { id: string } }) {
  const { id } = await params

  const data = await wrapServerApi(() => dishApiRequest.detail(Number(id)))

  const dish = data?.payload.data

  return <DishDetail dish={dish as DishResType['data']} />
}
