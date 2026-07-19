'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'

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

  return (
    <div className="min-h-[calc(100dvh-8rem)] flex items-center justify-center px-4 py-8">
      <form
        onSubmit={handleSubmit}
        className="w-[min(100%,360px)] bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-5"
      >
        <h1 className="text-xl font-bold text-center text-gray-900">Admin Login</h1>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded-lg">
            {error}
          </p>
        )}

        <div className="space-y-1.5">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="block w-full h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none focus:border-black focus:ring-1 focus:ring-black"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="block w-full h-10 rounded-lg border border-gray-300 bg-white px-3 pr-10 text-sm text-gray-900 outline-none focus:border-black focus:ring-1 focus:ring-black"
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
        </div>

        {TURNSTILE_SITE_KEY && (
          <div
            className="cf-turnstile flex justify-center overflow-hidden"
            data-sitekey={TURNSTILE_SITE_KEY}
            data-callback="onTurnstileCallback"
          />
        )}

        <button
          type="submit"
          disabled={loading}
          className="block w-full h-10 rounded-lg bg-black text-white text-sm font-medium hover:bg-gray-800 transition disabled:opacity-60"
        >
          {loading ? 'Memproses...' : 'Login'}
        </button>
      </form>
    </div>
  )
}