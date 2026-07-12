import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(req, { params }) {
  try {
    const article = await prisma.blogArticle.findUnique({
      where: { slug: params.slug, published: true },
    })
    if (!article) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(article)
  } catch {
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}
