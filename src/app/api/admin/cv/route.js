import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth-cf'
import * as d1 from '@/lib/d1'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const list = await d1.getCVList()
  return NextResponse.json(list)
}

export async function POST(req) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const cv = await d1.createCV({
    title: body.title,
    slug: body.slug,
    data: body.data ?? {},
    published: body.published ?? false,
    sort_order: body.sort_order ?? 0,
  })
  return NextResponse.json(cv)
}

export async function PATCH(req) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  if (body.reorder && Array.isArray(body.ids)) {
    await d1.reorderCV(body.ids)
    return NextResponse.json({ success: true })
  }
  return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
}
