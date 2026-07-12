'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

export default function EditPage({ params }) {
  const { id } = use(params)
  const router = useRouter()
  const isNew = id === 'new'

  const [form, setForm] = useState({ title: '', slug: '', content: '{}', published: true })
  const [loading, setLoading] = useState(false)

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

      if (isNew) {
        await fetch('/api/admin/pages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        toast.success('Page created')
      } else {
        await fetch(`/api/admin/pages/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
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
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold mb-6">{isNew ? 'New Page' : 'Edit Page'}</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Content (JSON)</Label>
          <textarea
            id="content"
            className="w-full min-h-[200px] border rounded-md p-3 text-sm font-mono"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
          />
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => setForm({ ...form, published: e.target.checked })}
          />
          Published
        </label>

        <div className="flex gap-3">
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </Button>
          <Button variant="outline" type="button" onClick={() => router.push('/admin/pages')}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
