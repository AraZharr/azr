import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth-cf'
import * as d1 from '@/lib/d1'


export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const articles = await d1.getBlogArticles()
  return NextResponse.json(articles)
}

export async function POST(req) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { slug, title, excerpt, content, published, image, meta_title, meta_description, og_image, keywords, noindex } = await req.json()
  const article = await d1.createArticle({ slug, title, excerpt, content, published, image, meta_title, meta_description, og_image, keywords, noindex })
  return NextResponse.json(article)
}
