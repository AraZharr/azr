import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth-cf'
import * as d1 from '@/lib/d1'

export const runtime = 'edge'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const projects = await d1.getProjects()
  return NextResponse.json(projects)
}

export async function POST(req) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { title, description, tech, link, image, sort_order, visible } = await req.json()
  const project = await d1.createProject({ title, description, tech, link, image, sort_order, visible })
  return NextResponse.json(project)
}
