import { NextResponse } from 'next/server'
import * as d1 from '@/lib/d1'

export const runtime = 'edge'

export async function GET() {
  const skills = await d1.getVisibleSkills()
  return NextResponse.json(skills)
}
