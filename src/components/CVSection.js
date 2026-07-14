'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function ProgressBar({ name, level }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span>{name}</span>
        <span className="text-gray-400">{level}%</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-black rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${level}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}

function SkillBadge({ skills }) {
  if (!skills?.length) return null
  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-500">Keahlian</h3>
      <div className="space-y-3">
        {skills.map((s, i) => (
          <ProgressBar key={i} name={s.name} level={s.level} />
        ))}
      </div>
    </div>
  )
}

function ExperienceSection({ items }) {
  if (!items?.length) return null
  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-500">Pengalaman</h3>
      <div className="space-y-4">
        {items.map((e, i) => (
          <div key={i}>
            <div className="flex items-baseline justify-between gap-2">
              <span className="font-medium">{e.position}</span>
              <span className="text-xs text-gray-400 shrink-0">{e.period}</span>
            </div>
            {e.company && <p className="text-sm text-gray-500">{e.company}</p>}
            {e.desc && <p className="text-sm text-gray-600 mt-1">{e.desc}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}

function EducationSection({ items }) {
  if (!items?.length) return null
  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-500">Pendidikan</h3>
      <div className="space-y-3">
        {items.map((e, i) => (
          <div key={i}>
            <p className="font-medium">{e.school}</p>
            <p className="text-sm text-gray-500">{e.degree}{e.year ? ` — ${e.year}` : ''}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function CVSection() {
  const [list, setList] = useState([])
  const [active, setActive] = useState(0)
  const [loading, setLoading] = useState(true)
  const cardRef = useRef(null)
  const touchStart = useRef(null)

  useEffect(() => {
    fetch('/api/cv')
      .then((r) => r.json())
      .then((data) => { setList(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const cv = list[active]
  const d = cv?.data || {}

  function next() { setActive((prev) => Math.min(prev + 1, list.length - 1)) }
  function prev() { setActive((prev) => Math.max(prev - 1, 0)) }

  function handleTouchStart(e) { touchStart.current = e.touches[0].clientX }
  function handleTouchEnd(e) {
    if (!touchStart.current) return
    const dx = e.changedTouches[0].clientX - touchStart.current
    if (Math.abs(dx) > 60) {
      dx > 0 ? prev() : next()
    }
    touchStart.current = null
  }

  if (loading) return null
  if (list.length === 0) return null

  return (
    <section className="max-w-2xl mx-auto px-4 py-20">
      {/* Tab pills */}
      {list.length > 1 && (
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-none">
          {list.map((item, i) => (
            <button
              key={item.id}
              onClick={() => setActive(i)}
              className={`shrink-0 px-4 py-1.5 text-sm rounded-full border transition ${
                i === active
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
              }`}
            >
              {item.title}
            </button>
          ))}
        </div>
      )}

      {/* CV Card */}
      <div
        ref={cardRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative overflow-hidden"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={cv.id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.25 }}
            className="border rounded-2xl p-6 sm:p-8 bg-white space-y-6"
          >
            {/* Header — photo + name + role */}
            <div className="flex items-center gap-4">
              {d.photo ? (
                <img src={d.photo} alt="" className="w-16 h-16 rounded-full object-cover border" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-xl font-bold text-gray-400">
                  {cv.title?.[0]?.toUpperCase() || '?'}
                </div>
              )}
              <div>
                <h3 className="text-xl font-bold">{d.name || cv.title}</h3>
                <p className="text-sm text-gray-500">{cv.title}</p>
                {(d.location || d.email) && (
                  <p className="text-xs text-gray-400 mt-0.5">
                    {[d.location, d.email].filter(Boolean).join(' · ')}
                  </p>
                )}
              </div>
            </div>

            {/* Bio */}
            {d.bio && (
              <p className="text-gray-600 text-sm leading-relaxed">{d.bio}</p>
            )}

            {/* Skills */}
            <SkillBadge skills={d.skills} />

            {/* Experience */}
            <ExperienceSection items={d.experience} />

            {/* Education */}
            <EducationSection items={d.education} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dots indicator */}
      {list.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {list.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`w-2 h-2 rounded-full transition ${
                i === active ? 'bg-black' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  )
}
