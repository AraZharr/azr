import { NextResponse } from 'next/server'
import * as d1 from '@/lib/d1'

export const runtime = 'edge'

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const slug = searchParams.get('slug')
  if (!slug) return NextResponse.json({ error: 'Slug required' }, { status: 400 })

  const pages = await d1.getPages()
  const page = pages.find((p) => p.slug === slug && p.published)
  if (!page) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(page)
}
