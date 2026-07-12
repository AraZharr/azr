import { NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth-helpers'
import { prisma } from '@/lib/prisma'

async function getSession() {
  return getServerSession()
}

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const pages = await prisma.page.findMany({ orderBy: { updatedAt: 'desc' } })
  return NextResponse.json(pages)
}

export async function POST(req) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { slug, title, content } = await req.json()

  const page = await prisma.page.create({
    data: { slug, title, content: content ?? {} },
  })

  return NextResponse.json(page)
}

export async function PUT(req) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id, slug, title, content, published } = await req.json()

  const page = await prisma.page.update({
    where: { id },
    data: { slug, title, content, published },
  })

  return NextResponse.json(page)
}
