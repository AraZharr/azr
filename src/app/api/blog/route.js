import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const articles = await prisma.blogArticle.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      select: { id: true, title: true, slug: true, excerpt: true, createdAt: true, image: true },
    })
    return NextResponse.json(articles)
  } catch {
    return NextResponse.json([])
  }
}
