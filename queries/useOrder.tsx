import orderApiRequest from '@/apiRequests/order'
import { UpdateOrderBodyType } from '@/schemaValidations/order.schema'
import { useMutation, useQuery } from '@tanstack/react-query'

export const useOrderListQuery = () => {
  return useQuery({
    queryFn: orderApiRequest.list,
    queryKey: ['orders']
  })
}

export const useUpdateOrderMutation = () => {
  return useMutation({
    mutationFn: ({ orderId, body }: { orderId: number; body: UpdateOrderBodyType }) =>
      orderApiRequest.update(orderId, body)
  })
}
