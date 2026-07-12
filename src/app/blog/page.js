import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Blog — AraZharr' }

async function getArticles() {
  try {
    return await prisma.blogArticle.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      select: { id: true, title: true, slug: true, excerpt: true, createdAt: true },
    })
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
        {articles.map((article) => (
          <article key={article.id}>
            <Link href={`/blog/${article.slug}`} className="block border rounded-xl p-6 hover:shadow-lg transition">
              <h2 className="text-xl font-semibold mb-2">{article.title}</h2>
              {article.excerpt && (
                <p className="text-gray-600 text-sm mb-3">{article.excerpt}</p>
              )}
              <time className="text-xs text-gray-400">
                {new Date(article.createdAt).toLocaleDateString('id-ID', {
                  year: 'numeric', month: 'long', day: 'numeric',
                })}
              </time>
            </Link>
          </article>
        ))}
      </div>
    </section>
  )
}
