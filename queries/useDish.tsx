import dishApiRequest from '@/apiRequests/dish'
import { UpdateDishBodyType } from '@/schemaValidations/dish.schema'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useGetDishList = () => {
  return useQuery({
    queryKey: ['dishes'],
    queryFn: dishApiRequest.list
  })
}

export const useGetDish = ({ id, enabled }: { id: number; enabled: boolean }) => {
  return useQuery({
    queryKey: ['dishes', id],
    queryFn: () => dishApiRequest.detail(id),
    enabled
  })
}

export const useCreateDishMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: dishApiRequest.create,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['dishes'],
        exact: true
      })
    }
  })
}

export const useUpdateDishMutation = (id: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: UpdateDishBodyType) => dishApiRequest.update(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['dishes'],
        exact: true
      })
    }
  })
}

export const useDeleteDishMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => dishApiRequest.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['dishes'],
        exact: true
      })
    }
  })
}
