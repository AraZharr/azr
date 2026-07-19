'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Footer() {
  const pathname = usePathname()
  const [copyright, setCopyright] = useState('')
  const [pages, setPages] = useState([])

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((s) => {
        if (s.copyright_text) {
          setCopyright(s.copyright_text.replace('{year}', String(new Date().getFullYear())))
        }
      })
      .catch(() => {})

    fetch('/api/pages')
      .then((r) => r.json())
      .then(setPages)
      .catch(() => {})
  }, [])

  if (pathname?.startsWith('/admin')) return null

  return (
    <footer className="border-t mt-auto py-8 sm:py-10 w-full overflow-x-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-3">
        {pages.length > 0 && (
          <nav className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-gray-400">
            {pages.map((p) => (
              <Link key={p.id} href={`/${p.slug}`} className="hover:text-black transition">
                {p.title}
              </Link>
            ))}
          </nav>
        )}
        <p className="text-sm text-gray-500 text-center">
          {copyright || `© ${new Date().getFullYear()} AraZhar. All rights reserved.`}
        </p>
      </div>
    </footer>
  )
}
