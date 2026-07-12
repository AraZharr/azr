'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const links = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/skills', label: 'Skills' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg">AraZharr</Link>

        <button className="sm:hidden" onClick={() => setOpen(!open)}>
          <span className="text-2xl">{open ? '✕' : '☰'}</span>
        </button>

        <ul className={`sm:flex gap-6 ${open ? 'block absolute top-16 left-0 w-full bg-white border-b p-4' : 'hidden'}`}>
          {links.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={`block py-1 ${
                  pathname === href ? 'text-black font-semibold' : 'text-gray-500 hover:text-black'
                }`}
                onClick={() => setOpen(false)}
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
