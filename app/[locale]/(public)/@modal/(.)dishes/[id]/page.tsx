import dishApiRequest from '@/apiRequests/dish'
import Modal from '@/app/[locale]/(public)/@modal/(.)dishes/[id]/modal'
import DishDetail from '@/app/[locale]/(public)/dishes/[id]/dish-detail'
import { wrapServerApi } from '@/lib/utils'
import { DishResType } from '@/schemaValidations/dish.schema'

export default async function DishPage({ params }: { params: { id: string } }) {
  const { id } = await params

  const data = await wrapServerApi(() => dishApiRequest.detail(Number(id)))

  const dish = data?.payload.data

  return (
    <Modal>
      <DishDetail dish={dish as DishResType['data']} />
    </Modal>
  )
}
