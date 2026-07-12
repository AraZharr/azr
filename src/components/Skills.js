const skills = [
  { name: 'JavaScript / TypeScript', level: 85 },
  { name: 'React / Next.js', level: 80 },
  { name: 'Tailwind CSS', level: 85 },
  { name: 'Node.js', level: 75 },
  { name: 'Python', level: 60 },
  { name: 'Supabase / Firebase', level: 65 },
]

export default function Skills() {
  return (
    <section className="max-w-2xl mx-auto px-4 py-20">
      <h2 className="text-3xl font-bold mb-8">Skills</h2>
      <div className="space-y-5">
        {skills.map(({ name, level }) => (
          <div key={name}>
            <div className="flex justify-between mb-1 text-sm">
              <span className="font-medium">{name}</span>
              <span className="text-gray-500">{level}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-black rounded-full transition-all"
                style={{ width: `${level}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
