import { NextResponse } from 'next/server'
import * as d1 from '@/lib/d1'

export const dynamic = 'force-dynamic'

export async function GET() {
  const list = await d1.getVisibleCV()
  return NextResponse.json(list)
}
