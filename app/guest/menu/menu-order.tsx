'use client'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { useGetDishList } from '@/queries/useDish'
import { cn, formatCurrency, handleErrorApi } from '@/lib/utils'
import { useState } from 'react'
import { GuestCreateOrdersBodyType } from '@/schemaValidations/guest.schema'
import Quantity from '@/app/guest/menu/quantity'
import { useGuestOrderMutation } from '@/queries/useGuest'
import { useRouter } from 'next/navigation'
import { DishStatus } from '@/constants/type'

export default function MenuOrder() {
  const dishListQuery = useGetDishList()
  const dishes = dishListQuery.data?.payload.data || []
  const [orders, setOrders] = useState<GuestCreateOrdersBodyType>([])
  const guestOrderMutation = useGuestOrderMutation()
  const router = useRouter()

  const totalPrice = orders.reduce((total, order) => {
    const dish = dishes.find((d) => d.id === order.dishId)
    return total + (dish?.price || 0) * order.quantity
  }, 0)

  const handleQuantityChange = (dishId: number, quantity: number) => {
    setOrders((prevOrders) => {
      if (quantity <= 0) {
        return prevOrders.filter((order) => order.dishId !== dishId)
      }

      const existingOrderIndex = prevOrders.findIndex((order) => order.dishId === dishId)

      if (existingOrderIndex >= 0) {
        const updatedOrders = [...prevOrders]
        updatedOrders[existingOrderIndex].quantity = quantity
        return updatedOrders
      } else {
        return [...prevOrders, { dishId, quantity }]
      }
    })
  }

  const handleOrder = async () => {
    try {
      await guestOrderMutation.mutateAsync(orders)
      router.push('/guest/orders')
    } catch (error) {
      handleErrorApi({
        error
      })
    }
  }

  return (
    <>
      {dishes
        .filter((dish) => dish.status !== DishStatus.Hidden)
        .map((dish) => (
          <div
            key={dish.id}
            className={cn('flex gap-4', {
              'pointer-events-none': dish.status === DishStatus.Unavailable
            })}
          >
            <div className='shrink-0 relative'>
              {dish.status === DishStatus.Unavailable && (
                <span className='absolute inset-0 flex items-center justify-center text-sm'>Hết hàng</span>
              )}
              <Image
                src={dish.image}
                alt={dish.name}
                height={100}
                width={100}
                quality={100}
                className='object-cover w-[80px] h-[80px] rounded-md'
              />
            </div>
            <div className='space-y-1'>
              <h3 className='text-sm'>{dish.name}</h3>
              <p className='text-xs'>{dish.description}</p>
              <p className='text-xs font-semibold'>{formatCurrency(dish.price)}</p>
            </div>
            <div className='shrink-0 ml-auto flex justify-center items-center'>
              <Quantity
                value={orders.find((order) => order.dishId === dish.id)?.quantity || 0}
                onChange={(value) => handleQuantityChange(dish.id, value)}
              />
            </div>
          </div>
        ))}
      <div className='sticky bottom-0'>
        <Button className='w-full justify-between' onClick={handleOrder} disabled={orders.length === 0}>
          <span>Giỏ hàng · {orders.length} món</span>
          <span>{formatCurrency(totalPrice)}</span>
        </Button>
      </div>
    </>
  )
}
