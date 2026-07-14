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
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          {logo ? (
            <img src={logo} alt={siteTitle} className="h-8 w-auto" />
          ) : (
            siteTitle
          )}
        </Link>

        <button className="sm:hidden" onClick={() => setOpen(!open)}>
          <span className="text-2xl">{open ? '✕' : '☰'}</span>
        </button>

        <ul className={`sm:flex gap-6 ${open ? 'block absolute top-16 left-0 w-full bg-white border-b p-4' : 'hidden'}`}>
          {links.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={`block py-1 ${
                  pathname === href || (href !== '/' && pathname.startsWith(href) && !href.startsWith('/#'))
                    ? 'text-black font-semibold'
                    : 'text-gray-500 hover:text-black'
                }`}
                onClick={(e) => {
                  setOpen(false)
                  // Smooth scroll for same-page hash links
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
    </nav>
  )
}
