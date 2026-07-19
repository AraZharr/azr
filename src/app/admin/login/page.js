'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Check } from 'lucide-react'
import Link from 'next/link'

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [turnstileToken, setTurnstileToken] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!TURNSTILE_SITE_KEY) return
    window.onTurnstileCallback = (token) => {
      setTurnstileToken(token)
      setError('')
    }
    if (!document.querySelector('script[src*="turnstile"]')) {
      const s = document.createElement('script')
      s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
      s.async = true
      s.defer = true
      document.head.appendChild(s)
    }
    return () => {
      window.onTurnstileCallback = undefined
    }
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (TURNSTILE_SITE_KEY && !turnstileToken) {
      setError('Silakan verifikasi CAPTCHA terlebih dahulu')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, turnstileToken }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Email atau password salah')
        setTurnstileToken('')
        if (window.turnstile) window.turnstile.reset()
      } else {
        router.push('/admin/dashboard')
      }
    } catch {
      setError('Gagal terhubung ke server. Coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  const emailValid = email.includes('@') && email.includes('.')
  const passStrong = password.length >= 8

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-10">
      {/* Card fixed width — tidak memanjang di desktop */}
      <div className="w-full max-w-[380px]">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-gray-200 shadow-lg px-6 py-8 sm:px-8 sm:py-9 space-y-6"
        >
          {/* Brand row */}
          <div className="flex items-start gap-3">
            <div className="relative w-11 h-11 shrink-0">
              <div className="absolute inset-0 rounded-xl bg-black rotate-6 opacity-90" />
              <div className="absolute inset-1 rounded-lg bg-gray-800 -rotate-3" />
              <span className="absolute inset-0 flex items-center justify-center text-white text-sm font-bold z-10">
                A
              </span>
            </div>
            <div className="pt-0.5">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-black text-[11px] font-bold text-white">
                  A
                </span>
                <span className="text-gray-900 font-semibold text-lg tracking-tight">AraZhar</span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">Admin Panel Access</p>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-[28px] font-bold text-gray-900 tracking-tight">
            Welcome Back!
          </h1>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}

          {/* Fields */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm text-gray-600">
                Email
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@example.com"
                  className="h-11 w-full rounded-lg border border-gray-200 bg-gray-50 px-3.5 pr-10 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-900 focus:bg-white focus:ring-2 focus:ring-gray-900/10 transition"
                />
                {emailValid && (
                  <Check size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500" />
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="text-sm text-gray-600">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="h-11 w-full rounded-lg border border-gray-200 bg-gray-50 px-3.5 pr-10 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-900 focus:bg-white focus:ring-2 focus:ring-gray-900/10 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {passStrong && (
                <p className="text-xs text-emerald-600 flex items-center gap-1">
                  <Check size={12} /> The password is strong
                </p>
              )}
            </div>
          </div>

          {TURNSTILE_SITE_KEY && (
            <div
              className="cf-turnstile flex justify-center"
              data-sitekey={TURNSTILE_SITE_KEY}
              data-callback="onTurnstileCallback"
            />
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-lg bg-black hover:bg-gray-800 text-white font-semibold text-sm transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <div className="flex items-center justify-center gap-3 text-[11px] text-gray-400 pt-1">
            <Link href="/" className="hover:text-gray-600 transition">
              Home
            </Link>
            <span className="text-gray-300">|</span>
            <span>© {new Date().getFullYear()} AraZhar</span>
          </div>
        </form>
      </div>
    </div>
  )
}