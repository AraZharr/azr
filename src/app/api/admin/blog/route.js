import { NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth-helpers'
import { prisma } from '@/lib/prisma'

async function getSession() {
  return getServerSession()
}

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const articles = await prisma.blogArticle.findMany({
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(articles)
}

export async function POST(req) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { slug, title, excerpt, content, published, image } = await req.json()

  const article = await prisma.blogArticle.create({
    data: { slug, title, excerpt, content, published: published ?? false, image },
  })

  return NextResponse.json(article)
}
