import { NextResponse } from 'next/server'
import * as d1 from '@/lib/d1'

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const slug = searchParams.get('slug')

  if (slug) {
    // Single page by slug
    const pages = await d1.getPages()
    const page = pages.find((p) => p.slug === slug && p.published)
    if (!page) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(page)
  }

  // All published pages (for footer, etc.)
  const pages = await d1.getPages()
  const published = pages.filter((p) => p.published).map(({ id, title, slug }) => ({ id, title, slug }))
  return NextResponse.json(published)
}
