import { NextResponse } from 'next/server'
import * as d1 from '@/lib/d1'

// Simple in-memory rate limiter
const rateLimit = new Map()
const WINDOW = 15_000 // 15 seconds
const MAX_ATTEMPTS = 5

function checkRateLimit(ip) {
  const now = Date.now()
  const entry = rateLimit.get(ip)
  
  if (!entry || now - entry.start > WINDOW) {
    rateLimit.set(ip, { start: now, count: 1 })
    return true
  }
  
  entry.count++
  if (entry.count > MAX_ATTEMPTS) {
    return false
  }
  return true
}

// Cleanup stale entries every minute
setInterval(() => {
  const now = Date.now()
  for (const [ip, entry] of rateLimit) {
    if (now - entry.start > WINDOW * 2) rateLimit.delete(ip)
  }
}, 60_000)

export async function POST(req) {
  try {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
    
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: 'Terlalu banyak percobaan. Coba lagi nanti.' }, { status: 429 })
    }

    const { email, password, turnstileToken } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email dan password wajib diisi' }, { status: 400 })
    }

    // Turnstile verification
    if (process.env.TURNSTILE_SECRET_KEY && process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY) {
      if (!turnstileToken) {
        return NextResponse.json({ error: 'CAPTCHA wajib diisi' }, { status: 400 })
      }
      const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `secret=${encodeURIComponent(process.env.TURNSTILE_SECRET_KEY)}&response=${encodeURIComponent(turnstileToken)}`,
      })
      const verifyData = await verifyRes.json()
      if (!verifyData.success) {
        return NextResponse.json({ error: 'Verifikasi CAPTCHA gagal' }, { status: 401 })
      }
    }

    const user = await d1.findUserByEmail(email)
    if (!user || user.password !== password) {
      return NextResponse.json({ error: 'Email atau password salah' }, { status: 401 })
    }

    const sid = crypto.randomUUID()
    await d1.createSession(sid, { userId: user.id, email: user.email, name: user.name })

    const res = NextResponse.json({ success: true })
    res.cookies.set('session', sid, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24,
    })

    return res
  } catch (err) {
    console.error('[login]', err)
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 })
  }
}
