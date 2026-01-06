import tableApiRequest from '@/apiRequests/table'
import { UpdateTableBodyType } from '@/schemaValidations/table.schema'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useGetTableList = () => {
  return useQuery({
    queryKey: ['tables'],
    queryFn: tableApiRequest.list
  })
}

export const useGetTable = ({ id, enabled }: { id: number; enabled: boolean }) => {
  return useQuery({
    queryKey: ['tables', id],
    queryFn: () => tableApiRequest.detail(id),
    enabled
  })
}

export const useCreateTableMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: tableApiRequest.create,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['tables'],
        exact: true
      })
    }
  })
}

export const useUpdateTableMutation = (id: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: UpdateTableBodyType) => tableApiRequest.update(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['tables'],
        exact: true
      })
    }
  })
}

export const useDeleteTableMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => tableApiRequest.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['tables'],
        exact: true
      })
    }
  })
}
