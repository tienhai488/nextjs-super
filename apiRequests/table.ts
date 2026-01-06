import http from '@/lib/http'
import {
  CreateTableBodyType,
  TableListResType,
  TableResType,
  UpdateTableBodyType
} from '@/schemaValidations/table.schema'

const tableApiRequest = {
  list: () => http.get<TableListResType>('/tables'),
  detail: (id: number) => http.get<TableResType>(`/tables/${id}`),
  create: (body: CreateTableBodyType) => http.post<TableResType>('/tables', body),
  update: (id: number, body: UpdateTableBodyType) => http.put<TableResType>(`/tables/${id}`, body),
  delete: (id: number) => http.delete<TableResType>(`/tables/${id}`)
}

export default tableApiRequest
