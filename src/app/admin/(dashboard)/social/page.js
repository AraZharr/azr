'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, Trash2, GripVertical, Eye, EyeOff } from 'lucide-react'

const PLATFORMS = [
  { value: 'email', label: 'Email', placeholder: 'hello@example.com' },
  { value: 'whatsapp', label: 'WhatsApp', placeholder: '6281234567890' },
  { value: 'instagram', label: 'Instagram', placeholder: 'username' },
  { value: 'tiktok', label: 'TikTok', placeholder: 'username' },
  { value: 'telegram', label: 'Telegram', placeholder: 'username' },
  { value: 'discord', label: 'Discord', placeholder: 'username#0000' },
  { value: 'github', label: 'GitHub', placeholder: 'username' },
  { value: 'twitter', label: 'Twitter / X', placeholder: 'username' },
  { value: 'linkedin', label: 'LinkedIn', placeholder: 'profile-url' },
  { value: 'youtube', label: 'YouTube', placeholder: 'channel-url' },
  { value: 'custom', label: 'Custom', placeholder: '' },
]

function buildUrl(platform, value) {
  if (!value) return ''
  if (platform === 'email') return `mailto:${value}`
  if (platform === 'whatsapp') return `https://wa.me/${value.replace(/[^0-9]/g, '')}`
  if (platform === 'instagram') return `https://instagram.com/${value.replace('@', '')}`
  if (platform === 'tiktok') return `https://tiktok.com/@${value.replace('@', '')}`
  if (platform === 'telegram') return `https://t.me/${value.replace('@', '')}`
  if (platform === 'github') return `https://github.com/${value}`
  if (platform === 'twitter') return `https://x.com/${value.replace('@', '')}`
  if (platform === 'linkedin') return value.startsWith('http') ? value : `https://linkedin.com/in/${value}`
  if (platform === 'youtube') return value.startsWith('http') ? value : `https://youtube.com/@${value}`
  if (platform === 'discord') return value.startsWith('http') ? value : `https://discord.gg/${value}`
  return value
}

export default function SocialLinksPage() {
  const [links, setLinks] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState({ platform: 'instagram', url: '', label: '', visible: true, sort_order: 0 })

  useEffect(() => {
    fetchLinks()
  }, [])

  async function fetchLinks() {
    const res = await fetch('/api/social')
    const data = await res.json()
    setLinks(data)
    setLoading(false)
  }

  function resetForm() {
    setForm({ platform: 'instagram', url: '', label: '', visible: true, sort_order: links.length })
    setEditId(null)
    setShowForm(false)
  }

  function startEdit(link) {
    setForm({
      platform: link.platform,
      url: link.url,
      label: link.label || '',
      visible: link.visible,
      sort_order: link.sort_order,
    })
    setEditId(link.id)
    setShowForm(true)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const platform = PLATFORMS.find((p) => p.value === form.platform)
    const payload = {
      platform: form.platform,
      url: form.url.startsWith('http') ? form.url : buildUrl(form.platform, form.url),
      label: form.label || platform?.label || form.platform,
      visible: form.visible,
      sort_order: form.sort_order,
    }

    if (editId) {
      await fetch(`/api/social/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
    } else {
      await fetch('/api/social', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
    }

    resetForm()
    fetchLinks()
  }

  async function handleDelete(id) {
    if (!confirm('Hapus social link ini?')) return
    await fetch(`/api/social/${id}`, { method: 'DELETE' })
    fetchLinks()
  }

  async function toggleVisible(id, current) {
    await fetch(`/api/social/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ visible: !current }),
    })
    fetchLinks()
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl font-bold">Social Links</h1>
        <Button onClick={() => { resetForm(); setShowForm(true) }}>
          <Plus size={16} className="mr-1" /> Add Link
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="border rounded-xl p-5 mb-6 space-y-4 bg-gray-50">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Platform</label>
              <select
                value={form.platform}
                onChange={(e) => setForm({ ...form, platform: e.target.value })}
                className="w-full text-sm border rounded-lg px-3 py-2 outline-none focus:border-black"
              >
                {PLATFORMS.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">
                {form.platform === 'custom' ? 'URL Lengkap' : 'Username / Nilai'}
              </label>
              <input
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
                placeholder={PLATFORMS.find((p) => p.value === form.platform)?.placeholder}
                required
                className="w-full text-sm border rounded-lg px-3 py-2 outline-none focus:border-black"
              />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Label (opsional)</label>
              <input
                value={form.label}
                onChange={(e) => setForm({ ...form, label: e.target.value })}
                placeholder={PLATFORMS.find((p) => p.value === form.platform)?.label}
                className="w-full text-sm border rounded-lg px-3 py-2 outline-none focus:border-black"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Urutan</label>
              <input
                type="number"
                value={form.sort_order}
                onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
                className="w-full text-sm border rounded-lg px-3 py-2 outline-none focus:border-black"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={form.visible}
                onChange={(e) => setForm({ ...form, visible: e.target.checked })}
                className="rounded"
              />
              Tampilkan di website
            </label>
          </div>
          <div className="flex gap-2">
            <Button type="submit" size="sm">{editId ? 'Update' : 'Tambah'}</Button>
            <Button type="button" variant="ghost" size="sm" onClick={resetForm}>Batal</Button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : links.length === 0 ? (
        <p className="text-gray-500">Belum ada social link. Klik &quot;Add Link&quot; untuk menambah.</p>
      ) : (
        <div className="space-y-2">
          {links.map((link) => (
            <div key={link.id} className="flex items-start gap-2 border rounded-lg px-3 py-3 bg-white sm:items-center sm:gap-3 sm:px-4">
              <GripVertical size={16} className="text-gray-300 mt-0.5 shrink-0 sm:mt-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium capitalize truncate">{link.platform}</span>
                  {!link.visible && (
                    <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded shrink-0">hidden</span>
                  )}
                </div>
                <p className="text-xs text-gray-500 truncate">{link.url}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => toggleVisible(link.id, link.visible)}
                  className="p-1.5 text-gray-400 hover:text-black transition"
                  title={link.visible ? 'Sembunyikan' : 'Tampilkan'}
                >
                  {link.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
                <button
                  onClick={() => startEdit(link)}
                  className="text-xs text-gray-500 hover:text-black px-2 py-1 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(link.id)}
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
