import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const pages = await prisma.page.findMany({ orderBy: { updatedAt: 'desc' } })
  return NextResponse.json(pages)
}

export async function POST(req) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { slug, title, content } = await req.json()

  const page = await prisma.page.create({
    data: { slug, title, content: content ?? {} },
  })

  return NextResponse.json(page)
}

export async function PUT(req) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id, slug, title, content, published } = await req.json()

  const page = await prisma.page.update({
    where: { id },
    data: { slug, title, content, published },
  })

  return NextResponse.json(page)
}
