import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth-cf'
import * as d1 from '@/lib/d1'

export const runtime = 'edge'

export async function GET() {
  const links = await d1.getSocialLinks()
  return NextResponse.json(links)
}

export async function POST(req) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { platform, url, label, icon, visible, sort_order } = await req.json()
  const link = await d1.createSocialLink({ platform, url, label, icon, visible, sort_order })
  return NextResponse.json(link)
}
