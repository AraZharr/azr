import { notFound } from 'next/navigation'
import * as d1 from '@/lib/d1'
import HtmlRenderer from '@/components/HtmlRenderer'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const dynamic = 'force-dynamic'

const RESERVED_SLUGS = ['admin', 'api', 'blog', 'cv', 'skills', 'about']

export default async function PublicPage({ params }) {
  const { slug } = await params

  // Skip reserved routes
  if (RESERVED_SLUGS.includes(slug)) notFound()

  const pages = await d1.getPages()
  const page = pages.find((p) => p.slug === slug && p.published)
  if (!page) notFound()

  return (
    <article className="max-w-2xl mx-auto px-4 py-20">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-black mb-6 transition"
      >
        <ArrowLeft size={14} />
        Kembali ke beranda
      </Link>

      <h1 className="text-3xl font-bold mb-8">{page.title}</h1>

      <div className="prose prose-gray max-w-none">
        <HtmlRenderer content={page.content} />
      </div>
    </article>
  )
}
