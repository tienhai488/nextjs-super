'use client'

import { useAppStore } from '@/components/app-provider'
import { Badge } from '@/components/ui/badge'
import { OrderStatus } from '@/constants/type'
import { formatCurrency, getVietnameseOrderStatus } from '@/lib/utils'
import { useGuestOrderListQuery } from '@/queries/useGuest'
import { PayGuestOrdersResType, UpdateOrderResType } from '@/schemaValidations/order.schema'
import Image from 'next/image'
import { useEffect } from 'react'
import { toast } from 'sonner'

export default function OrdersCart() {
  const guestOrderListQuery = useGuestOrderListQuery()
  const orders = guestOrderListQuery.data?.payload.data || []
  // const { socket } = useAppContext()
  const socket = useAppStore((state) => state.socket)

  const { waitingForPayment, paid } = orders.reduce(
    (result, order) => {
      if (
        order.status === OrderStatus.Pending ||
        order.status === OrderStatus.Processing ||
        order.status === OrderStatus.Delivered
      ) {
        return {
          ...result,
          waitingForPayment: {
            price: result.waitingForPayment.price + order.dishSnapshot.price * order.quantity,
            quantity: result.waitingForPayment.quantity + order.quantity
          }
        }
      }

      if (order.status === OrderStatus.Paid) {
        return {
          ...result,
          paid: {
            price: result.paid.price + order.dishSnapshot.price * order.quantity,
            quantity: result.paid.quantity + order.quantity
          }
        }
      }

      return result
    },
    {
      waitingForPayment: {
        price: 0,
        quantity: 0
      },
      paid: {
        price: 0,
        quantity: 0
      }
    }
  )

  useEffect(() => {
    if (socket?.connected) {
      onConnect()
    }

    function onConnect() {
      console.log('Socket connected with id:', socket?.id)
    }

    function onDisconnect() {
      console.log('Socket disconnected')
    }

    function onUpdateOrder(data: UpdateOrderResType['data']) {
      const {
        quantity,
        dishSnapshot: { name: dishName },
        status
      } = data
      toast.success(
        `Cập nhật đơn hàng: ${dishName} - Số lượng: ${quantity} - Trạng thái: ${getVietnameseOrderStatus(status)}`
      )
      guestOrderListQuery.refetch()
    }

    function onPayment(data: PayGuestOrdersResType['data']) {
      const { guest } = data[0]

      toast.success(`Thanh toán thành công cho khách: ${guest?.name}`)
      guestOrderListQuery.refetch()
    }

    socket?.on('update-order', onUpdateOrder)
    socket?.on('payment', onPayment)
    socket?.on('connect', onConnect)
    socket?.on('disconnect', onDisconnect)

    return () => {
      socket?.off('connect', onConnect)
      socket?.off('disconnect', onDisconnect)
      socket?.off('update-order', onUpdateOrder)
      socket?.off('payment', onPayment)
    }
  }, [guestOrderListQuery, socket])

  return (
    <>
      {orders.map((order, index) => (
        <div key={order.id} className='flex gap-4'>
          <div className='text-sm font-semibold'>{index + 1}</div>
          <div className='shrink-0 relative'>
            <Image
              src={order.dishSnapshot.image}
              alt={order.dishSnapshot.name}
              height={100}
              width={100}
              quality={100}
              className='object-cover w-[80px] h-[80px] rounded-md'
            />
          </div>
          <div className='space-y-1'>
            <h3 className='text-sm'>{order.dishSnapshot.name}</h3>
            <div className='text-xs font-semibold'>
              {formatCurrency(order.dishSnapshot.price)} x <Badge className='px-1'>{order.quantity}</Badge>
            </div>
          </div>
          <div className='shrink-0 ml-auto flex justify-center items-center'>
            <Badge variant={'outline'}>{getVietnameseOrderStatus(order.status)}</Badge>
          </div>
        </div>
      ))}
      {paid.quantity !== 0 && (
        <div className='sticky bottom-0 '>
          <div className='w-full flex space-x-4 text-xl font-semibold'>
            <span>Đơn đã thanh toán · {paid.quantity} món</span>
            <span>{formatCurrency(paid.price)}</span>
          </div>
        </div>
      )}
      <div className='sticky bottom-0 '>
        <div className='w-full flex space-x-4 text-xl font-semibold'>
          <span>Đơn chưa thanh toán · {waitingForPayment.quantity} món</span>
          <span>{formatCurrency(waitingForPayment.price)}</span>
        </div>
      </div>
    </>
  )
}
