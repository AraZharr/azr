'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [turnstileToken, setTurnstileToken] = useState('')
  const [loading, setLoading] = useState(false)
  const containerRef = useRef(null)
  const renderReadyRef = useRef(false)

  const renderWidget = () => {
    if (renderReadyRef.current || !containerRef.current) return
    renderReadyRef.current = true

    const script = document.createElement('script')
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
    script.async = true
    script.onload = () => {
      if (window.turnstile) {
        window.turnstile.render(containerRef.current, {
          sitekey: TURNSTILE_SITE_KEY,
          callback: (token) => {
            setTurnstileToken(token)
            setError('')
          },
          'expired-callback': () => setTurnstileToken(''),
          'error-callback': () => setTurnstileToken(''),
        })
      }
    }
    document.head.appendChild(script)
  }

  useEffect(() => {
    if (!TURNSTILE_SITE_KEY || !containerRef.current) return
    renderWidget()
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
        if (containerRef.current && window.turnstile) {
          window.turnstile.reset()
          renderReadyRef.current = false
          containerRef.current.innerHTML = ''
          renderWidget()
        }
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white p-8 rounded-xl border shadow-sm space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">Admin Login</h1>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded">{error}</p>
        )}

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-8 w-full rounded-lg border border-gray-300 bg-transparent px-2.5 py-1 text-base outline-none focus:border-black transition-colors md:text-sm"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">Password</label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-8 w-full rounded-lg border border-gray-300 bg-transparent px-2.5 py-1 text-base outline-none focus:border-black transition-colors md:text-sm pr-9"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {TURNSTILE_SITE_KEY && (
          <div ref={containerRef} className="cf-turnstile"></div>
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Memproses...' : 'Login'}
        </Button>
      </form>
    </div>
  )
}