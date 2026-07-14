import * as d1 from '@/lib/d1'

export const dynamic = 'force-dynamic'
export const metadata = {
  title: 'Blog',
  description:
    'Blog AraZhar — Artikel tentang development, automation, AI, dan teknologi.',
  openGraph: { title: 'Blog — AraZhar', description: 'Artikel tentang development, automation, AI, dan teknologi.' },
}

async function getArticles() {
  try {
    return await d1.getPublishedArticles()
  } catch {
    return []
  }
}

export default async function BlogPage() {
  const articles = await getArticles()

  if (articles.length === 0) {
    return (
      <section className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Blog</h1>
        <p className="text-gray-500">Belum ada artikel.</p>
      </section>
    )
  }

  return (
    <section className="max-w-2xl mx-auto px-4 py-20">
      <h1 className="text-3xl font-bold mb-8">Blog</h1>
      <div className="space-y-6">
        {articles.map((article) => {
          const isExternal = article.slug?.startsWith('http')
          const href = isExternal ? article.slug : `/blog/${article.slug}`
          const target = isExternal ? '_blank' : undefined
          const rel = isExternal ? 'noopener noreferrer' : undefined
          return (
            <article key={article.id}>
              <a
                href={href}
                target={target}
                rel={rel}
                className="block border rounded-xl p-6 hover:shadow-lg transition"
              >
                <h2 className="text-xl font-semibold mb-2">{article.title}</h2>
                {article.excerpt && (
                  <p className="text-gray-600 text-sm mb-3">{article.excerpt}</p>
                )}
                <time className="text-xs text-gray-400">
                  {new Date(article.createdAt).toLocaleDateString('id-ID', {
                    year: 'numeric', month: 'long', day: 'numeric',
                  })}
                </time>
              </a>
            </article>
          )
        })}
      </div>
    </section>
  )
}
