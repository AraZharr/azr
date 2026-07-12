import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import TipTapRenderer from '@/components/TipTapRenderer'

export const dynamic = 'force-dynamic'

async function getArticle(slug) {
  try {
    return await prisma.blogArticle.findUnique({
      where: { slug, published: true },
    })
  } catch {
    return null
  }
}

export async function generateMetadata({ params }) {
  const article = await getArticle(params.slug)
  if (!article) return { title: 'Not Found' }
  return { title: `${article.title} — AraZharr` }
}

export default async function ArticlePage({ params }) {
  const article = await getArticle(params.slug)

  if (!article) notFound()

  return (
    <article className="max-w-2xl mx-auto px-4 py-20">
      <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
      <time className="text-sm text-gray-400 block mb-8">
        {new Date(article.createdAt).toLocaleDateString('id-ID', {
          year: 'numeric', month: 'long', day: 'numeric',
        })}
      </time>
      <div className="prose prose-gray max-w-none">
        <TipTapRenderer content={article.content} />
      </div>
    </article>
  )
}
