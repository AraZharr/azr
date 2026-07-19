export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://azr.is-a.dev'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
