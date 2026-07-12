const projects = [
  {
    title: 'Clover Bot',
    desc: 'Bot Telegram multi-provider AI dengan memori dan command routing.',
    tech: ['Node.js', 'Gemini', 'Supabase'],
  },
  {
    title: 'Project Lainnya',
    desc: 'Berbagai project eksperimen dan工具的 yang sedang dikembangkan.',
    tech: ['Next.js', 'Tailwind'],
  },
]

export default function Projects() {
  return (
    <section id="projects" className="max-w-4xl mx-auto px-4 py-20">
      <h2 className="text-3xl font-bold mb-8">Projects</h2>
      <div className="grid sm:grid-cols-2 gap-6">
        {projects.map(({ title, desc, tech }) => (
          <div key={title} className="border rounded-xl p-6 hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-gray-600 mb-4">{desc}</p>
            <div className="flex flex-wrap gap-2">
              {tech.map((t) => (
                <span key={t} className="text-xs bg-gray-100 px-2 py-1 rounded">{t}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
