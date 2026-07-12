'use client'

import { motion } from 'framer-motion'

const projects = [
  {
    title: 'Clover Bot',
    desc: 'Bot Telegram multi-provider AI dengan memori dan command routing.',
    tech: ['Node.js', 'Gemini', 'Supabase'],
  },
  {
    title: 'Project Lainnya',
    desc: 'Berbagai project eksperimen yang sedang dikembangkan.',
    tech: ['Next.js', 'Tailwind'],
  },
]

export default function Projects() {
  return (
    <section id="projects" className="max-w-4xl mx-auto px-4 py-20">
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold mb-8"
      >
        Projects
      </motion.h2>
      <div className="grid sm:grid-cols-2 gap-6">
        {projects.map(({ title, desc, tech }, i) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.15 }}
            className="border rounded-xl p-6 hover:shadow-lg transition"
          >
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-gray-600 mb-4">{desc}</p>
            <div className="flex flex-wrap gap-2">
              {tech.map((t) => (
                <span key={t} className="text-xs bg-gray-100 px-2 py-1 rounded">{t}</span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
