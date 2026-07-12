'use client'

import { motion } from 'framer-motion'

export default function Hero() {
  return (
    <section className="min-h-[80vh] flex flex-col justify-center items-center text-center px-4">
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-5xl sm:text-6xl font-bold mb-4"
      >
        AraZhar
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-xl text-gray-600 mb-8 max-w-md"
      >
        Developer &amp; kreator. Membangun solusi digital yang berdampak.
      </motion.p>
      <motion.a
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        href="#projects"
        className="inline-block bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition"
      >
        Lihat Project
      </motion.a>
    </section>
  )
}
