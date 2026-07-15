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
    // Blog articles
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

    // Published pages
    const pages = await d1.getPages()
    for (const page of pages) {
      if (!page.published || page.slug === 'home') continue
      routes.push({
        url: `${baseUrl}/${page.slug}`,
        lastModified: new Date(page.updatedAt || page.createdAt),
        changeFrequency: 'monthly',
        priority: 0.6,
      })
    }

    // Published CVs
    const cvs = await d1.getVisibleCV()
    for (const cv of cvs) {
      routes.push({
        url: `${baseUrl}/cv/${cv.slug}`,
        lastModified: new Date(cv.updatedAt || cv.createdAt),
        changeFrequency: 'monthly',
        priority: 0.6,
      })
    }
  } catch {
    // D1 not available
  }

  return routes
}
