import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req, { params }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const article = await prisma.blogArticle.findUnique({ where: { id: params.id } })
  if (!article) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json(article)
}

export async function PUT(req, { params }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const data = await req.json()

  const article = await prisma.blogArticle.update({
    where: { id: params.id },
    data,
  })

  return NextResponse.json(article)
}

export async function DELETE(req, { params }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await prisma.blogArticle.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
