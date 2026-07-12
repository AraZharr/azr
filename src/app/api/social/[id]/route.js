import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth-cf'
import * as d1 from '@/lib/d1'

export const runtime = 'edge'

export async function PUT(req, { params }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const data = await req.json()
  const link = await d1.updateSocialLink(id, data)
  return NextResponse.json(link)
}

export async function DELETE(req, { params }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  await d1.deleteSocialLink(id)
  return NextResponse.json({ success: true })
}
