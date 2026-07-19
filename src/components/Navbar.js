'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

const links = [
  { href: '/', label: 'Home' },
  { href: '/#cv', label: 'CV' },
  { href: '/about', label: 'About' },
  { href: '/skills', label: 'Skills' },
  { href: '/blog', label: 'Blog' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [siteTitle, setSiteTitle] = useState('AraZhar')
  const [logo, setLogo] = useState('')

  // Close mobile menu on route change
  useEffect(() => { setOpen(false) }, [pathname])

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((s) => {
        if (s.site_title) setSiteTitle(s.site_title)
        if (s.logo) setLogo(s.logo)
      })
      .catch(() => {})
  }, [])

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg shrink-0">
          {logo ? (
            <img src={logo} alt={siteTitle} className="h-8 w-auto" />
          ) : (
            siteTitle
          )}
        </Link>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden p-2 -mr-2"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          <span className="text-2xl leading-none">{open ? '✕' : '☰'}</span>
        </button>

        {/* Desktop nav */}
        <ul className="hidden lg:flex items-center gap-8">
          {links.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={`text-sm font-medium transition-colors ${
                  pathname === href || (href !== '/' && pathname.startsWith(href) && !href.startsWith('/#'))
                    ? 'text-black'
                    : 'text-gray-500 hover:text-black'
                }`}
                onClick={(e) => {
                  if (href.startsWith('/#')) {
                    e.preventDefault()
                    const id = href.replace('/#', '')
                    const el = document.getElementById(id)
                    if (el) el.scrollIntoView({ behavior: 'smooth' })
                  }
                }}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile menu overlay */}
        {open && (
          <div
            className="fixed inset-0 top-16 bg-black/20 lg:hidden z-40"
            onClick={() => setOpen(false)}
          />
        )}

        {/* Mobile menu panel */}
        <div
          className={`fixed top-16 left-0 w-full bg-white border-b shadow-lg lg:hidden z-50 transition-all duration-200 ${
            open ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0 pointer-events-none'
          }`}
        >
          <ul className="flex flex-col p-4 space-y-1">
            {links.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    pathname === href || (href !== '/' && pathname.startsWith(href) && !href.startsWith('/#'))
                      ? 'text-black bg-gray-100'
                      : 'text-gray-600 hover:text-black hover:bg-gray-50'
                  }`}
                  onClick={(e) => {
                    setOpen(false)
                    if (href.startsWith('/#')) {
                      e.preventDefault()
                      const id = href.replace('/#', '')
                      const el = document.getElementById(id)
                      if (el) el.scrollIntoView({ behavior: 'smooth' })
                    }
                  }}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  )
}