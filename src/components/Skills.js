'use client'

import { useState, useEffect } from 'react'

export default function Skills() {
  const [skills, setSkills] = useState([])

  useEffect(() => {
    fetch('/api/skills')
      .then((r) => r.json())
      .then((data) => setSkills(data))
      .catch(() => {})
  }, [])

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 animate-fade-in-up">
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
                <div
                  className="h-full bg-black rounded-full w-0"
                  style={{
                    transitionProperty: 'width',
                    transitionDuration: '0.8s',
                    transitionDelay: `${i * 0.1}s`,
                    width: `${level}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}