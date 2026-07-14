import * as d1 from '@/lib/d1'

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://clover.azhr.workers.dev'

  const routes = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/skills`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
  ]

  try {
    const articles = await d1.getPublishedArticles()
    for (const article of articles) {
      if (article.slug?.startsWith('http')) continue
      routes.push({
        url: `${baseUrl}/blog/${article.slug}`,
        lastModified: new Date(article.updatedAt || article.createdAt),
        changeFrequency: 'monthly',
        priority: 0.7,
      })
    }
  } catch {
    // D1 not available, skip blog slugs
  }

  return routes
}
