'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    let result
    try {
      result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })
    } catch (err) {
      setError('Gagal terhubung ke server. Coba lagi.')
      setLoading(false)
      return
    }

    setLoading(false)

    if (result?.error) {
      if (result.url?.includes('csrf=true')) {
        setError('Sesi kadaluarsa. Refresh halaman dan coba lagi.')
      } else if (result.error === 'CredentialsSignin') {
        setError('Email atau password salah')
      } else {
        setError('Terjadi kesalahan. Coba lagi nanti.')
      }
    } else {
      router.push('/admin/dashboard')
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

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Memproses...' : 'Login'}
        </Button>
      </form>
    </div>
  )
}
