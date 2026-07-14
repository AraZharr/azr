import * as d1 from '@/lib/d1'
import { notFound, redirect } from 'next/navigation'
import TipTapRenderer from '@/components/TipTapRenderer'

export const dynamic = 'force-dynamic'

async function getArticle(slug) {
  try {
    return await d1.getArticleBySlug(slug)
  } catch {
    return null
  }
}

export async function generateMetadata({ params }) {
  const segments = await params
  const slug = Array.isArray(segments.slug) ? segments.slug.join('/') : segments.slug
  if (slug.startsWith('http')) return { title: 'Redirecting…' }
  const article = await getArticle(slug)
  if (!article) return { title: 'Not Found' }
  return {
    title: article.title,
    description: article.excerpt || `${article.title} — Artikel oleh AraZhar.`,
    openGraph: {
      title: article.title,
      description: article.excerpt || `${article.title} — Artikel oleh AraZhar.`,
      type: 'article',
    },
  }
}

export default async function ArticlePage({ params }) {
  const segments = await params
  const slug = Array.isArray(segments.slug) ? segments.slug.join('/') : segments.slug

  // Link post — slug is a URL, redirect there
  if (slug.startsWith('http')) {
    redirect(slug)
  }

  const article = await getArticle(slug)

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
