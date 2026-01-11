import orderApiRequest from '@/apiRequests/order'
import { GetOrdersQueryParamsType, UpdateOrderBodyType } from '@/schemaValidations/order.schema'
import { useMutation, useQuery } from '@tanstack/react-query'

export const useOrderListQuery = (queryParams: GetOrdersQueryParamsType) => {
  return useQuery({
    queryFn: () => orderApiRequest.list(queryParams),
    queryKey: ['orders', queryParams]
  })
}

export const useUpdateOrderMutation = () => {
  return useMutation({
    mutationFn: ({ orderId, body }: { orderId: number; body: UpdateOrderBodyType }) =>
      orderApiRequest.update(orderId, body)
  })
}

export const useGetOrderDetailQuery = ({ id, enabled }: { id: number; enabled: boolean }) => {
  return useQuery({
    queryFn: () => orderApiRequest.getOrderDetail(id),
    queryKey: ['orders', id],
    enabled
  })
}

export const usePayGuestOrdersMutation = () => {
  return useMutation({
    mutationFn: orderApiRequest.pay
  })
}
