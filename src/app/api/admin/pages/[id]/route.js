import { NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth-helpers'
import { prisma } from '@/lib/prisma'

async function getSession() {
  return getServerSession()
}

export async function GET(req, { params }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const page = await prisma.page.findUnique({ where: { id: params.id } })
  if (!page) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json(page)
}

export async function PUT(req, { params }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const data = await req.json()

  const page = await prisma.page.update({
    where: { id: params.id },
    data,
  })

  return NextResponse.json(page)
}

export async function DELETE(req, { params }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await prisma.page.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
