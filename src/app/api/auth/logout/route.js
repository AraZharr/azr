import { NextResponse } from 'next/server'
import { destroySession } from '@/lib/auth-cf'

export async function POST() {
  await destroySession()

  const res = NextResponse.json({ success: true })
  res.cookies.set('session', '', {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  })
  return res
}
