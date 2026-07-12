import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth-cf'
import * as d1 from '@/lib/d1'

export const runtime = 'edge'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const skills = await d1.getSkills()
  return NextResponse.json(skills)
}

export async function POST(req) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { name, level, sort_order, visible } = await req.json()
  const skill = await d1.createSkill({ name, level, sort_order, visible })
  return NextResponse.json(skill)
}
