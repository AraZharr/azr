'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Trash2, GripVertical, Upload, Image as ImageIcon } from 'lucide-react'
import ImagePicker from '@/components/admin/ImagePicker'
import { toast } from 'sonner'
import { compressImage } from '@/lib/compress-image'

function emptyCV() {
  return {
    title: '', slug: '',
    photo: '', location: '', email: '', phone: '', website: '', bio: '',
    skills: [],
    experience: [],
    education: [],
    published: false,
  }
}

export default function CreateCV() {
  const router = useRouter()
  const [form, setForm] = useState(emptyCV())
  const [loading, setLoading] = useState(false)
  const [showImgPicker, setShowImgPicker] = useState(false)
  const uploadRef = useRef(null)

  function setData(key, val) {
    setForm((prev) => ({ ...prev, [key]: val }))
  }

  function autoSlug(title) {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'cv'
  }

  // Skills
  function addSkill() {
    setData('skills', [...form.skills, { name: '', level: 80 }])
  }
  function updateSkill(i, key, val) {
    const s = [...form.skills]
    s[i] = { ...s[i], [key]: val }
    setData('skills', s)
  }
  function removeSkill(i) {
    setData('skills', form.skills.filter((_, idx) => idx !== i))
  }

  // Experience
  function addExp() {
    setData('experience', [...form.experience, { position: '', company: '', period: '', desc: '' }])
  }
  function updateExp(i, key, val) {
    const s = [...form.experience]
    s[i] = { ...s[i], [key]: val }
    setData('experience', s)
  }
  function removeExp(i) {
    setData('experience', form.experience.filter((_, idx) => idx !== i))
  }

  // Education
  function addEdu() {
    setData('education', [...form.education, { school: '', degree: '', year: '' }])
  }
  function updateEdu(i, key, val) {
    const s = [...form.education]
    s[i] = { ...s[i], [key]: val }
    setData('education', s)
  }
  function removeEdu(i) {
    setData('education', form.education.filter((_, idx) => idx !== i))
  }

  async function handleUpload(file) {
    if (!file) return
    file = await compressImage(file)
    const fd = new FormData()
    fd.append('file', file)
    try {
      const res = await fetch('/api/admin/media', { method: 'POST', body: fd })
      if (!res.ok) { toast.error('Upload failed'); return }
      const data = await res.json()
      setData('photo', data.url)
      toast.success('Uploaded')
    } catch {
      toast.error('Upload error')
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.title || !form.slug) return toast.error('Title & slug required')
    setLoading(true)
    try {
      // Build data payload
      const payload = {
        title: form.title,
        slug: form.slug,
        published: form.published,
        data: {
          photo: form.photo,
          location: form.location,
          email: form.email,
          phone: form.phone,
          website: form.website,
          bio: form.bio,
          skills: form.skills,
          experience: form.experience,
          education: form.education,
        },
      }
      await fetch('/api/admin/cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      toast.success('CV created')
      router.push('/admin/cv')
    } catch {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full min-w-0 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">New CV</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Identity */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold border-b pb-2">Identity</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">CV Title *</Label>
              <Input id="title" value={form.title} onChange={(e) => {
                const v = e.target.value
                setData('title', v)
                if (!form.slug || form.slug === autoSlug(form.title)) {
                  setData('slug', autoSlug(v))
                }
              }} placeholder="Web Developer" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input id="slug" value={form.slug} onChange={(e) => setData('slug', e.target.value)} required />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Photo</Label>
            <div className="flex items-center gap-3">
              {form.photo ? (
                <img src={form.photo} alt="" className="w-16 h-16 rounded-full object-cover border" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                  <ImageIcon size={24} className="text-gray-400" />
                </div>
              )}
              <input type="file" accept="image/*" ref={uploadRef} className="hidden" onChange={(e) => handleUpload(e.target.files?.[0])} />
              <Button type="button" variant="outline" size="sm" onClick={() => uploadRef.current?.click()}>
                <Upload size={14} className="mr-1" /> Upload
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => setShowImgPicker(true)}>
                <ImageIcon size={14} className="mr-1" /> Pick
              </Button>
              {form.photo && (
                <Button type="button" variant="ghost" size="sm" onClick={() => setData('photo', '')}>Remove</Button>
              )}
            </div>
            {showImgPicker && (
              <ImagePicker open={showImgPicker} onSelect={(url) => { setData('photo', url); setShowImgPicker(false) }} onClose={() => setShowImgPicker(false)} />
            )}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" value={form.location} onChange={(e) => setData('location', e.target.value)} placeholder="Solo, Indonesia" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={form.email} onChange={(e) => setData('email', e.target.value)} />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" value={form.phone} onChange={(e) => setData('phone', e.target.value)} placeholder="+62 856..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input id="website" value={form.website} onChange={(e) => setData('website', e.target.value)} placeholder="https://..." />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <textarea id="bio" value={form.bio} onChange={(e) => setData('bio', e.target.value)} rows={3} className="flex min-h-[80px] w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm" />
          </div>
        </section>

        {/* Skills */}
        <section className="space-y-3">
          <div className="flex items-center justify-between border-b pb-2">
            <h2 className="text-lg font-semibold">Skills</h2>
            <Button type="button" variant="outline" size="sm" onClick={addSkill}>
              <Plus size={14} className="mr-1" /> Add
            </Button>
          </div>
          {form.skills.map((s, i) => (
            <div key={i} className="flex items-center gap-2 bg-gray-50 rounded-lg p-3">
              <GripVertical size={16} className="text-gray-400 shrink-0" />
              <Input className="flex-1" placeholder="Name" value={s.name} onChange={(e) => updateSkill(i, 'name', e.target.value)} />
              <div className="flex items-center gap-1 shrink-0">
                <input type="range" min="0" max="100" className="w-20" value={s.level} onChange={(e) => updateSkill(i, 'level', Number(e.target.value))} />
                <span className="text-xs text-gray-500 w-8">{s.level}%</span>
              </div>
              <button type="button" onClick={() => removeSkill(i)} className="text-red-400 hover:text-red-600">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          {form.skills.length === 0 && <p className="text-gray-400 text-sm">Belum ada skill.</p>}
        </section>

        {/* Experience */}
        <section className="space-y-3">
          <div className="flex items-center justify-between border-b pb-2">
            <h2 className="text-lg font-semibold">Experience</h2>
            <Button type="button" variant="outline" size="sm" onClick={addExp}>
              <Plus size={14} className="mr-1" /> Add
            </Button>
          </div>
          {form.experience.map((e, i) => (
            <div key={i} className="bg-gray-50 rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GripVertical size={16} className="text-gray-400" />
                  <span className="text-xs text-gray-400 font-mono">#{i + 1}</span>
                </div>
                <button type="button" onClick={() => removeExp(i)} className="text-red-400 hover:text-red-600">
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="grid sm:grid-cols-2 gap-2">
                <Input placeholder="Position" value={e.position} onChange={(ev) => updateExp(i, 'position', ev.target.value)} />
                <Input placeholder="Company" value={e.company} onChange={(ev) => updateExp(i, 'company', ev.target.value)} />
              </div>
              <Input placeholder="Period (e.g. 2023-sekarang)" value={e.period} onChange={(ev) => updateExp(i, 'period', ev.target.value)} />
              <Input placeholder="Description" value={e.desc} onChange={(ev) => updateExp(i, 'desc', ev.target.value)} />
            </div>
          ))}
          {form.experience.length === 0 && <p className="text-gray-400 text-sm">Belum ada pengalaman.</p>}
        </section>

        {/* Education */}
        <section className="space-y-3">
          <div className="flex items-center justify-between border-b pb-2">
            <h2 className="text-lg font-semibold">Education</h2>
            <Button type="button" variant="outline" size="sm" onClick={addEdu}>
              <Plus size={14} className="mr-1" /> Add
            </Button>
          </div>
          {form.education.map((e, i) => (
            <div key={i} className="bg-gray-50 rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GripVertical size={16} className="text-gray-400" />
                  <span className="text-xs text-gray-400 font-mono">#{i + 1}</span>
                </div>
                <button type="button" onClick={() => removeEdu(i)} className="text-red-400 hover:text-red-600">
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="grid sm:grid-cols-2 gap-2">
                <Input placeholder="School / University" value={e.school} onChange={(ev) => updateEdu(i, 'school', ev.target.value)} />
                <Input placeholder="Degree / Major" value={e.degree} onChange={(ev) => updateEdu(i, 'degree', ev.target.value)} />
              </div>
              <Input placeholder="Year (e.g. 2023)" value={e.year} onChange={(ev) => updateEdu(i, 'year', ev.target.value)} />
            </div>
          ))}
          {form.education.length === 0 && <p className="text-gray-400 text-sm">Belum ada pendidikan.</p>}
        </section>

        {/* Published toggle */}
        <div className="flex items-center gap-2">
          <input type="checkbox" id="published" checked={form.published} onChange={(e) => setData('published', e.target.checked)} className="rounded" />
          <Label htmlFor="published" className="mb-0">Published</Label>
        </div>

        {/* Submit */}
        <div className="flex gap-3">
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Create CV'}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
        </div>
      </form>
    </div>
  )
}
