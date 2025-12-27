import http from '@/lib/http'
import { UploadImageResType } from '@/schemaValidations/media.schema'

const mediaApiRequest = {
  upload: (formData: FormData) => {
    return http.post<UploadImageResType>('/media/upload', formData)
  }
}

export default mediaApiRequest
