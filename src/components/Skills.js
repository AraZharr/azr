'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import TipTapRenderer from '@/components/TipTapRenderer'

export default function Skills() {
  const [skills, setSkills] = useState([])

  useEffect(() => {
    fetch('/api/skills')
      .then((r) => r.json())
      .then((data) => setSkills(data))
      .catch(() => {})
  }, [])

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6 }}
      className="max-w-2xl mx-auto px-4 py-20"
    >
      <h2 className="text-3xl font-bold mb-8">Skills</h2>
      {skills.length === 0 ? (
        <p className="text-gray-500">Belum ada skill yang ditambahkan.</p>
      ) : (
        <div className="space-y-5">
          {skills.map(({ id, name, level }, i) => (
            <div key={id}>
              <div className="flex justify-between mb-1 text-sm">
                <span className="font-medium">{name}</span>
                <span className="text-gray-500">{level}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-black rounded-full"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${level}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: i * 0.1 }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.section>
  )
}
