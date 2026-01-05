import accountApiRequest from '@/apiRequests/account'
import { UpdateEmployeeAccountBodyType } from '@/schemaValidations/account.schema'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useAccountMe = () => {
  return useQuery({
    queryKey: ['account-me'],
    queryFn: accountApiRequest.me
  })
}

export const useUpdateMeMutation = () => {
  return useMutation({
    mutationFn: accountApiRequest.updateMe
  })
}

export const useChangePasswordMutation = () => {
  return useMutation({
    mutationFn: accountApiRequest.changePassword
  })
}

export const useGetAccountList = () => {
  return useQuery({
    queryKey: ['accounts'],
    queryFn: accountApiRequest.list
  })
}

export const useGetAccount = ({ id, enabled }: { id: number; enabled: boolean }) => {
  return useQuery({
    queryKey: ['accounts', id],
    queryFn: () => accountApiRequest.detail(id),
    enabled
  })
}

export const useCreateAccountMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: accountApiRequest.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
    }
  })
}

export const useUpdateAccountMutation = (id: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: UpdateEmployeeAccountBodyType) => accountApiRequest.update(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['accounts'],
        exact: true
      })
    }
  })
}

export const useDeleteAccountMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => accountApiRequest.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['accounts'],
        exact: true
      })
    }
  })
}
