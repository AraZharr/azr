'use client'

import { useState, useEffect } from 'react'

export default function Projects() {
  const [projects, setProjects] = useState([])

  useEffect(() => {
    fetch('/api/projects')
      .then((r) => r.json())
      .then((data) => setProjects(data))
      .catch(() => {})
  }, [])

  return (
    <section id="projects" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 animate-fade-in-up">
      <h2 className="text-3xl font-bold mb-8">Projects</h2>
      {projects.length === 0 ? (
        <p className="text-gray-500">Belum ada project yang ditambahkan.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(({ id, title, description, tech, link, image }, i) => (
            <div
              key={id}
              className="border rounded-xl overflow-hidden hover:shadow-lg transition animate-fade-in-up"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {image && (
                <div className="aspect-video bg-gray-100 overflow-hidden">
                  <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              )}
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">
                  {link ? (
                    <a href={link} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {title}
                    </a>
                  ) : title}
                </h3>
                <p className="text-gray-600 mb-4">{description}</p>
                {tech && tech.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tech.map((t) => (
                      <span key={t} className="text-xs bg-gray-100 px-2 py-1 rounded">{t}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}