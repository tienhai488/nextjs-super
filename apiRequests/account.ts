import http from '@/lib/http'
import {
  AccountListResType,
  AccountResType,
  ChangePasswordBodyType,
  CreateEmployeeAccountBodyType,
  UpdateEmployeeAccountBodyType,
  UpdateMeBodyType
} from '@/schemaValidations/account.schema'

const accountApiRequest = {
  me: () => http.get<AccountResType>('/accounts/me'),
  sMe: (accessToken: string) =>
    http.get<AccountResType>('/accounts/me', {
      headers: { Authorization: `Bearer ${accessToken}` }
    }),
  updateMe: (body: UpdateMeBodyType) => http.put<AccountResType>('/accounts/me', body),
  changePassword: (body: ChangePasswordBodyType) => http.put<AccountResType>('/accounts/change-password', body),
  list: () => http.get<AccountListResType>('/accounts'),
  create: (body: CreateEmployeeAccountBodyType) => http.post<AccountResType>('/accounts', body),
  detail: (id: number) => http.get<AccountResType>(`/accounts/detail/${id}`),
  update: (id: number, body: UpdateEmployeeAccountBodyType) => http.put<AccountResType>(`/accounts/detail/${id}`, body),
  delete: (id: number) => http.delete<AccountResType>(`/accounts/detail/${id}`)
}

export default accountApiRequest
