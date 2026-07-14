import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth-cf'
import * as d1 from '@/lib/d1'

export async function GET(req, { params }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const cv = await d1.getCVById(id)
  if (!cv) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(cv)
}

export async function PUT(req, { params }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await req.json()
  const cv = await d1.updateCV(id, body)
  return NextResponse.json(cv)
}

export async function DELETE(req, { params }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  await d1.deleteCV(id)
  return NextResponse.json({ success: true })
}
