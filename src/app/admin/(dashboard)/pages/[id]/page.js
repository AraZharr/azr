'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Image as ImageIcon } from 'lucide-react'
import { toast } from 'sonner'
import ImagePicker from '@/components/admin/ImagePicker'

export default function EditPage({ params }) {
  const { id } = use(params)
  const router = useRouter()
  const isNew = id === 'new'

  const [form, setForm] = useState({
    title: '', slug: '', content: '{}', published: true,
    meta_title: '', meta_description: '', og_image: '', keywords: '', noindex: false,
  })
  const [loading, setLoading] = useState(false)
  const [showImgPicker, setShowImgPicker] = useState(false)

  useEffect(() => {
    if (!isNew) {
      fetch(`/api/admin/pages/${id}`)
        .then((r) => r.json())
        .then((data) => {
          setForm({
            title: data.title,
            slug: data.slug,
            content: JSON.stringify(data.content, null, 2),
            published: data.published,
            meta_title: data.meta_title || '',
            meta_description: data.meta_description || '',
            og_image: data.og_image || '',
            keywords: data.keywords || '',
            noindex: !!data.noindex,
          })
        })
    }
  }, [id, isNew])

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)

    try {
      let parsedContent
      try { parsedContent = JSON.parse(form.content) } catch { parsedContent = {} }

      const payload = { ...form, content: parsedContent }
      delete payload.content

      if (isNew) {
        await fetch('/api/admin/pages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, content: parsedContent }),
        })
        toast.success('Page created')
      } else {
        await fetch(`/api/admin/pages/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, content: parsedContent }),
        })
        toast.success('Page updated')
      }

      router.push('/admin/pages')
    } catch {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">{isNew ? 'New Page' : 'Edit Page'}</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Content (JSON)</Label>
          <textarea
            id="content"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            rows={10}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono outline-none focus:border-black transition-colors"
          />
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
          Published
        </label>

        {/* === SEO Section === */}
        <div className="border-t pt-4 mt-4">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">SEO</h2>

          <div className="space-y-2">
            <Label htmlFor="meta_title">Meta Title</Label>
            <Input id="meta_title" value={form.meta_title} onChange={(e) => setForm({ ...form, meta_title: e.target.value })} placeholder="Biarkan kosong untuk fallback ke title" />
          </div>

          <div className="space-y-2 mt-3">
            <Label htmlFor="meta_description">Meta Description</Label>
            <textarea
              id="meta_description"
              value={form.meta_description}
              onChange={(e) => setForm({ ...form, meta_description: e.target.value })}
              rows={2}
              maxLength={160}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black transition-colors"
              placeholder="160 karakter max"
            />
            <p className="text-xs text-gray-400">{form.meta_description.length}/160</p>
          </div>

          <div className="space-y-2 mt-3">
            <Label>OG Image</Label>
            <div className="flex gap-2">
              <Input value={form.og_image} onChange={(e) => setForm({ ...form, og_image: e.target.value })} placeholder="/api/admin/media/..." className="flex-1" />
              <Button type="button" variant="outline" onClick={() => setShowImgPicker(true)}>
                <ImageIcon size={16} />
              </Button>
            </div>
            {form.og_image && (
              <img src={form.og_image} alt="" className="mt-2 max-h-32 rounded border object-contain bg-gray-50" />
            )}
          </div>

          <div className="space-y-2 mt-3">
            <Label htmlFor="keywords">Keywords (comma separated)</Label>
            <Input id="keywords" value={form.keywords} onChange={(e) => setForm({ ...form, keywords: e.target.value })} placeholder="next.js, portfolio, web developer" />
          </div>

          <label className="flex items-center gap-2 text-sm mt-3">
            <input type="checkbox" checked={form.noindex} onChange={(e) => setForm({ ...form, noindex: e.target.checked })} />
            Noindex (sembunyikan dari Google)
          </label>
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </Button>
          <Button variant="outline" type="button" onClick={() => router.push('/admin/pages')}>
            Cancel
          </Button>
        </div>
      </form>

      <ImagePicker open={showImgPicker} onClose={() => setShowImgPicker(false)} onSelect={(url) => setForm({ ...form, og_image: url })} />
    </div>
  )
}
