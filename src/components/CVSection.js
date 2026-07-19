'use client'

import { useState, useEffect, useRef } from 'react'
import CVCard from '@/components/CVCard'

export default function CVSection({ initialSlug }) {
  const [list, setList] = useState([])
  const [active, setActive] = useState(0)
  const [loading, setLoading] = useState(true)
  const cardRef = useRef(null)
  const touchStart = useRef(null)
  const initialized = useRef(false)

  useEffect(() => {
    fetch('/api/cv')
      .then((r) => r.json())
      .then((data) => {
        setList(data)
        setLoading(false)
        // If initialSlug provided, find and select that CV
        if (initialSlug && !initialized.current) {
          const idx = data.findIndex((item) => item.slug === initialSlug)
          if (idx >= 0) setActive(idx)
          initialized.current = true
        }
      })
      .catch(() => setLoading(false))
  }, [initialSlug])

  const cv = list[active]

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
    <section id="cv" className="max-w-2xl mx-auto px-4 py-20">
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

      {/* CV Card with swipe */}
      <div
        ref={cardRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative overflow-hidden"
      >
        <div key={cv.id} className="transition-opacity duration-200">
          <CVCard cv={cv} />
        </div>
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
