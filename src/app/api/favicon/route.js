import * as d1 from '@/lib/d1'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(req) {
  // Try to fetch settings from Turso
  let faviconUrl = '/favicon.svg'
  try {
    const settings = await d1.getSettings()
    if (settings?.favicon) faviconUrl = settings.favicon
  } catch {
    // ignore — fallback to default
  }

  // If it's an R2 path, redirect to the media API
  if (faviconUrl.startsWith('/api/admin/media/')) {
    return NextResponse.redirect(new URL(faviconUrl, req.url))
  }

  return NextResponse.redirect(new URL(faviconUrl, req.url))
}
