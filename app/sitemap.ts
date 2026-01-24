import dishApiRequest from '@/apiRequests/dish'
import { locales } from '@/config'
import { generateSlugUrl } from '@/lib/utils'
import type { MetadataRoute } from 'next'

const staticRoutes: MetadataRoute.Sitemap = [
  {
    url: '',
    changeFrequency: 'daily',
    priority: 1
  },
  {
    url: '/login',
    changeFrequency: 'yearly',
    priority: 0.5
  }
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const dishListQuery = await dishApiRequest.list()
  const data = dishListQuery.payload.data || []

  const routes: MetadataRoute.Sitemap = []

  staticRoutes.forEach((route) => {
    locales.forEach((locale) => {
      routes.push({
        url: `${process.env.NEXT_PUBLIC_URL}/${locale}${route.url}`,
        changeFrequency: route.changeFrequency,
        priority: route.priority,
        lastModified: new Date()
      })
    })
  })

  data.forEach((dish) => {
    locales.forEach((locale) => {
      routes.push({
        url: `${process.env.NEXT_PUBLIC_URL}/${locale}/dishes/${generateSlugUrl({
          name: dish.name,
          id: dish.id
        })}`,
        changeFrequency: 'daily',
        priority: 0.8,
        lastModified: new Date(dish.updatedAt)
      })
    })
  })

  return [...routes]
}
