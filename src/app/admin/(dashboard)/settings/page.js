'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Image as ImageIcon, Upload } from 'lucide-react'
import ImagePicker from '@/components/admin/ImagePicker'
import { toast } from 'sonner'
import { compressImage } from '@/lib/compress-image'

const FIELDS = [
  { key: 'site_title', label: 'Site Title', type: 'text', section: 'brand' },
  { key: 'site_tagline', label: 'Tagline', type: 'text', section: 'brand' },
  { key: 'logo', label: 'Logo Image', type: 'image', section: 'brand' },
  { key: 'favicon', label: 'Favicon Icon', type: 'image', section: 'brand' },
  { key: 'og_image', label: 'OG Image', type: 'image', section: 'seo' },
  { key: 'og_title', label: 'OG Title (fallback: Site Title)', type: 'text', section: 'seo' },
  { key: 'meta_description', label: 'Meta Description', type: 'textarea', section: 'seo' },
  { key: 'keywords', label: 'Keywords (comma separated)', type: 'text', section: 'seo' },
  { key: 'canonical_url', label: 'Canonical URL', type: 'text', section: 'seo' },
  { key: 'copyright_text', label: 'Footer Copyright', type: 'text', section: 'footer' },
]

export default function SettingsPage() {
  const [settings, setSettings] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [imgPickerTarget, setImgPickerTarget] = useState(null)
  const uploadRef = useRef({})

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((r) => r.json())
      .then((data) => { setSettings(data); setLoading(false) })
      .catch(() => { setSettings({}); setLoading(false) })
  }, [])

  async function handleUpload(key, file) {
    if (!file) return
    file = await compressImage(file)
    const fd = new FormData()
    fd.append('file', file)

    try {
      const res = await fetch('/api/admin/media', { method: 'POST', body: fd })
      if (!res.ok) { toast.error('Upload failed'); return }
      const data = await res.json()
      set(key, data.url)
      toast.success('Uploaded')
    } catch {
      toast.error('Upload error')
    }
  }

  function set(key, value) {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })
      if (res.ok) {
        toast.success('Settings saved')
      } else {
        toast.error('Failed to save')
      }
    } catch {
      toast.error('Error saving settings')
    } finally {
      setSaving(false)
    }
  }

  function renderField(field) {
    const val = settings[field.key] ?? ''

    if (field.type === 'image') {
      return (
        <div key={field.key} className="space-y-1.5">
          <Label>{field.label}</Label>
          <div className="flex gap-2">
            <Input value={val} onChange={(e) => set(field.key, e.target.value)} placeholder={`/${field.key === 'logo' ? 'api/admin/media/...' : 'api/og'}`} className="flex-1" />
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
              className="hidden"
              ref={(el) => { uploadRef.current[field.key] = el }}
              onChange={(e) => { handleUpload(field.key, e.target.files?.[0]); if (e.target) e.target.value = '' }}
            />
            <Button type="button" variant="outline" size="sm" onClick={() => uploadRef.current[field.key]?.click()}>
              <Upload size={14} />
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => setImgPickerTarget(field.key)}>
              <ImageIcon size={14} />
            </Button>
          </div>
          {val && <img src={val} alt="" className="mt-1 max-h-20 rounded border object-contain bg-gray-50" />}
        </div>
      )
    }

    if (field.type === 'textarea') {
      return (
        <div key={field.key} className="space-y-1.5">
          <Label>{field.label}</Label>
          <textarea
            value={val}
            onChange={(e) => set(field.key, e.target.value)}
            rows={2}
            maxLength={200}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black transition-colors"
          />
        </div>
      )
    }

    return (
      <div key={field.key} className="space-y-1.5">
        <Label>{field.label}</Label>
        <Input value={val} onChange={(e) => set(field.key, e.target.value)} />
      </div>
    )
  }

  if (loading) return <p className="text-gray-400 text-sm">Loading...</p>

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">⚙️ Site Settings</h1>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Brand */}
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Brand</h2>
          {FIELDS.filter((f) => f.section === 'brand').map(renderField)}
        </div>

        {/* SEO */}
        <div className="border-t pt-4">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">SEO</h2>
          {FIELDS.filter((f) => f.section === 'seo').map(renderField)}
        </div>

        {/* Footer */}
        <div className="border-t pt-4">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Footer</h2>
          {FIELDS.filter((f) => f.section === 'footer').map(renderField)}
          <p className="text-xs text-gray-400 mt-1">Gunakan <code>{'{year}'}</code> untuk tahun otomatis</p>
        </div>

        <div className="pt-2">
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving...' : '💾 Save Settings'}
          </Button>
        </div>
      </form>

      <ImagePicker
        open={!!imgPickerTarget}
        onClose={() => setImgPickerTarget(null)}
        onSelect={(url) => {
          if (imgPickerTarget) set(imgPickerTarget, url)
          setImgPickerTarget(null)
        }}
      />
    </div>
  )
}
