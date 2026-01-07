import http from '@/lib/http'

const revalidateApiRequest = (tag: string) =>
  http.get(`/api/revalidate?tag=${tag}`, {
    baseUrl: '',
    cache: 'no-store'
  })

export default revalidateApiRequest
