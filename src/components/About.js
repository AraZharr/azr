'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import TipTapRenderer from '@/components/TipTapRenderer'

export default function About() {
  const [page, setPage] = useState(null)

  useEffect(() => {
    fetch('/api/pages?slug=about')
      .then((r) => r.json())
      .then((data) => {
        if (data && !data.error) setPage(data)
      })
      .catch(() => {})
  }, [])

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6 }}
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
    >
      <h2 className="text-3xl font-bold mb-6">About</h2>
      {page && page.content ? (
        <div className="text-gray-700 leading-relaxed">
          <TipTapRenderer content={page.content} />
        </div>
      ) : (
        <div className="space-y-4 text-gray-700 leading-relaxed">
          <p>
            Saya seorang developer yang tertarik dengan pengembangan web, bot telegram,
            dan berbagai project digital lainnya.
          </p>
          <p>
            Fokus pada solusi yang fungsional, efisien, dan user-friendly.
            Terbiasa bekerja dengan JavaScript, Next.js, dan ekosistem open source.
          </p>
        </div>
      )}
    </motion.section>
  )
}
