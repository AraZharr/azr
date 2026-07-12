import { NextResponse } from 'next/server'
import * as d1 from '@/lib/d1'

export const runtime = 'edge'

export async function GET() {
  const projects = await d1.getVisibleProjects()
  return NextResponse.json(projects)
}
