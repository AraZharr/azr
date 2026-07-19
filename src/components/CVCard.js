'use client'

import { Share2, MapPin, Mail, Phone, Globe } from 'lucide-react'
import { toast } from 'sonner'

function ProgressBar({ name, level }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs sm:text-sm">
        <span>{name}</span>
        <span className="text-gray-400">{level}%</span>
      </div>
      <div className="h-1.5 sm:h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-black rounded-full"
          style={{ width: `${level}%`, transition: 'width 0.6s ease-out' }}
        />
      </div>
    </div>
  )
}

function ContactItem({ icon: Icon, label, value }) {
  if (!value) return null
  return (
    <div className="flex items-center gap-2 text-xs sm:text-sm">
      <Icon size={14} className="text-gray-400 shrink-0" />
      <span className="truncate">{value}</span>
    </div>
  )
}

function SectionHeader({ title }) {
  return (
    <h3 className="font-semibold text-xs sm:text-sm uppercase tracking-wider text-gray-500 mb-3">
      {title}
    </h3>
  )
}

function Timeline({ items, type }) {
  if (!items?.length) return null
  const label = type === 'exp' ? 'Pengalaman' : 'Pendidikan'
  return (
    <div>
      <SectionHeader title={label} />
      <div className="space-y-4 relative pl-4 border-l-2 border-gray-100 ml-1">
        {items.map((e, i) => (
          <div key={i} className="relative">
            <div className="absolute -left-[19px] top-1 w-3 h-3 rounded-full bg-white border-2 border-gray-300" />
            {type === 'exp' ? (
              <>
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-medium text-sm">{e.position}</span>
                  <span className="text-xs text-gray-400 shrink-0">{e.period}</span>
                </div>
                {e.company && <p className="text-xs sm:text-sm text-gray-500">{e.company}</p>}
                {e.desc && <p className="text-xs text-gray-600 mt-0.5">{e.desc}</p>}
              </>
            ) : (
              <>
                <p className="font-medium text-sm">{e.school}</p>
                <p className="text-xs sm:text-sm text-gray-500">
                  {e.degree}{e.year ? ` — ${e.year}` : ''}
                </p>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function CVCard({ cv }) {
  const d = cv?.data || {}
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://azr.is-a.dev'
  const shareUrl = `${baseUrl}/cv/${cv.slug}`

  async function handleShare() {
    try {
      await navigator.clipboard.writeText(shareUrl)
      toast.success('Link CV disalin!')
    } catch {
      // fallback
      const ta = document.createElement('textarea')
      ta.value = shareUrl
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      toast.success('Link CV disalin!')
    }
  }

  return (
    <div className="border rounded-2xl bg-white overflow-hidden">
      {/* Card inner — compact padding on mobile */}
      <div className="p-4 sm:p-6 md:p-8">
        {/* Header */}
        <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          {d.photo ? (
            <img src={d.photo} alt="" className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border" />
          ) : (
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gray-100 flex items-center justify-center text-base sm:text-xl font-bold text-gray-400">
              {cv.title?.[0]?.toUpperCase() || '?'}
            </div>
          )}
          <div className="min-w-0">
            <h3 className="text-base sm:text-xl font-bold truncate">{d.name || cv.title}</h3>
            <p className="text-xs sm:text-sm text-gray-500 truncate">{cv.title}</p>
          </div>
        </div>

        {/* 2-column layout: side-by-side on md+, stacked on mobile */}
        <div className="grid md:grid-cols-[1fr_2fr] gap-4 sm:gap-6 md:gap-8">
          {/* Left column — Contact + Skills */}
          <div className="space-y-5 sm:space-y-6">
            {/* Contact */}
            <div>
              <SectionHeader title="Kontak" />
              <div className="space-y-2 sm:space-y-2.5">
                <ContactItem icon={MapPin} value={d.location} />
                <ContactItem icon={Mail} value={d.email} />
                <ContactItem icon={Phone} value={d.phone} />
                <ContactItem icon={Globe} value={d.website} />
              </div>
            </div>

            {/* Skills */}
            {d.skills?.length > 0 && (
              <div>
                <SectionHeader title="Keahlian" />
                <div className="space-y-2.5 sm:space-y-3">
                  {d.skills.map((s, i) => (
                    <ProgressBar key={i} name={s.name} level={s.level} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right column — Bio + Experience + Education */}
          <div className="space-y-5 sm:space-y-6">
            {/* About */}
            {d.bio && (
              <div>
                <SectionHeader title="Tentang Saya" />
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{d.bio}</p>
              </div>
            )}

            {/* Experience */}
            <Timeline items={d.experience} type="exp" />

            {/* Education */}
            <Timeline items={d.education} type="edu" />
          </div>
        </div>
      </div>

      {/* Footer bar — share button */}
      <div className="border-t px-4 sm:px-6 md:px-8 py-2 sm:py-3 flex items-center justify-between">
        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-black transition"
        >
          <Share2 size={14} />
          Bagikan CV
        </button>
      </div>
    </div>
  )
}
