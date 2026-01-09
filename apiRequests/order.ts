import http from '@/lib/http'
import { GetOrdersResType, UpdateOrderBodyType, UpdateOrderResType } from '@/schemaValidations/order.schema'

const orderApiRequest = {
  list: () => http.get<GetOrdersResType>('/orders'),
  update: (orderId: number, body: UpdateOrderBodyType) => http.put<UpdateOrderResType>(`/orders/${orderId}`, body)
}

export default orderApiRequest
