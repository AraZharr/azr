'use client'

import { motion } from 'framer-motion'

export default function About() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6 }}
      className="max-w-2xl mx-auto px-4 py-20"
    >
      <h2 className="text-3xl font-bold mb-6">About</h2>
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
    </motion.section>
  )
}
