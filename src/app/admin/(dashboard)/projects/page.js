'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, Trash2, Eye, EyeOff, GripVertical, Image as ImageIcon, Upload } from 'lucide-react'
import ImagePicker from '@/components/admin/ImagePicker'
import { toast } from 'sonner'
import { compressImage } from '@/lib/compress-image'

export default function ProjectsPage() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState(null)
  const [showImgPicker, setShowImgPicker] = useState(false)
  const uploadRef = useRef(null)
  const [form, setForm] = useState({ title: '', description: '', tech: '', link: '', image: '', sort_order: 0, visible: true })

  useEffect(() => { fetchProjects() }, [])

  async function handleUpload(file) {
    if (!file) return
    file = await compressImage(file)
    const fd = new FormData()
    fd.append('file', file)
    try {
      const res = await fetch('/api/admin/media', { method: 'POST', body: fd })
      if (!res.ok) { toast.error('Upload failed'); return }
      const data = await res.json()
      setForm((prev) => ({ ...prev, image: data.url }))
      toast.success('Uploaded')
    } catch {
      toast.error('Upload error')
    }
  }

  async function fetchProjects() {
    const res = await fetch('/api/admin/projects')
    const data = await res.json()
    setProjects(data)
    setLoading(false)
  }

  function resetForm() {
    setForm({ title: '', description: '', tech: '', link: '', image: '', sort_order: projects.length, visible: true })
    setEditId(null)
    setShowForm(false)
  }

  function startEdit(project) {
    setForm({
      title: project.title,
      description: project.description || '',
      tech: Array.isArray(project.tech) ? project.tech.join(', ') : '',
      link: project.link || '',
      image: project.image || '',
      sort_order: project.sort_order,
      visible: project.visible,
    })
    setEditId(project.id)
    setShowForm(true)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const payload = {
      ...form,
      tech: form.tech.split(',').map((t) => t.trim()).filter(Boolean),
    }

    if (editId) {
      await fetch(`/api/admin/projects/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
    } else {
      await fetch('/api/admin/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
    }
    resetForm()
    fetchProjects()
  }

  async function handleDelete(id) {
    if (!confirm('Hapus project ini?')) return
    await fetch(`/api/admin/projects/${id}`, { method: 'DELETE' })
    fetchProjects()
  }

  async function toggleVisible(id, current) {
    await fetch(`/api/admin/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ visible: !current }),
    })
    fetchProjects()
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl font-bold">Projects</h1>
        <Button onClick={() => { resetForm(); setShowForm(true) }}>
          <Plus size={16} className="mr-1" /> Add Project
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="border rounded-xl p-5 mb-6 space-y-4 bg-gray-50">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Judul Project</label>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Nama project"
                required
                className="w-full text-sm border rounded-lg px-3 py-2 outline-none focus:border-black"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Tech (koma-separated)</label>
              <input
                value={form.tech}
                onChange={(e) => setForm({ ...form, tech: e.target.value })}
                placeholder="Next.js, Tailwind, D1"
                className="w-full text-sm border rounded-lg px-3 py-2 outline-none focus:border-black"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Deskripsi</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Deskripsi singkat project"
              rows={2}
              className="w-full text-sm border rounded-lg px-3 py-2 outline-none focus:border-black resize-none"
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Link (opsional)</label>
              <input
                value={form.link}
                onChange={(e) => setForm({ ...form, link: e.target.value })}
                placeholder="https://..."
                className="w-full text-sm border rounded-lg px-3 py-2 outline-none focus:border-black"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Image (opsional)</label>
              <div className="flex gap-2">
                <input
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  placeholder="/api/admin/media/..."
                  className="flex-1 w-full text-sm border rounded-lg px-3 py-2 outline-none focus:border-black"
                />
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                  className="hidden"
                  ref={uploadRef}
                  onChange={(e) => { handleUpload(e.target.files?.[0]); if (e.target) e.target.value = '' }}
                />
                <Button type="button" variant="outline" size="sm" onClick={() => uploadRef.current?.click()}>
                  <Upload size={14} />
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => setShowImgPicker(true)}>
                  <ImageIcon size={14} />
                </Button>
              </div>
              {form.image && (
                <img src={form.image} alt="" className="mt-1 max-h-20 rounded border object-contain bg-gray-50" />
              )}
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Urutan</label>
              <input
                type="number"
                value={form.sort_order}
                onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
                className="w-full text-sm border rounded-lg px-3 py-2 outline-none focus:border-black"
              />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 text-sm cursor-pointer pb-2">
                <input
                  type="checkbox"
                  checked={form.visible}
                  onChange={(e) => setForm({ ...form, visible: e.target.checked })}
                  className="rounded"
                />
                Tampilkan di website
              </label>
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="submit" size="sm">{editId ? 'Update' : 'Tambah'}</Button>
            <Button type="button" variant="ghost" size="sm" onClick={resetForm}>Batal</Button>
          </div>
        </form>
      )}

      <ImagePicker open={showImgPicker} onClose={() => setShowImgPicker(false)} onSelect={(url) => setForm({ ...form, image: url })} />

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : projects.length === 0 ? (
        <p className="text-gray-500">Belum ada project. Klik &quot;Add Project&quot; untuk menambah.</p>
      ) : (
        <div className="space-y-2">
          {projects.map((project) => (
            <div key={project.id} className="flex items-start gap-2 border rounded-lg px-3 py-3 bg-white sm:items-center sm:gap-3 sm:px-4">
              <GripVertical size={16} className="text-gray-300 mt-0.5 shrink-0 sm:mt-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium truncate">{project.title}</span>
                  {!project.visible && (
                    <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded shrink-0">hidden</span>
                  )}
                </div>
                {project.description && (
                  <p className="text-xs text-gray-500 line-clamp-2">{project.description}</p>
                )}
                {project.tech && project.tech.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {project.tech.map((t) => (
                      <span key={t} className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded whitespace-nowrap">{t}</span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => toggleVisible(project.id, project.visible)}
                  className="p-1.5 text-gray-400 hover:text-black transition"
                  title={project.visible ? 'Sembunyikan' : 'Tampilkan'}
                >
                  {project.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
                <button
                  onClick={() => startEdit(project)}
                  className="text-xs text-gray-500 hover:text-black px-2 py-1 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="p-1.5 text-gray-400 hover:text-red-600 transition"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
