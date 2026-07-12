'use client'

import { use, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import TipTapEditor from '@/components/admin/TipTapEditor'
import { toast } from 'sonner'

export default function EditArticle({ params }) {
  const { id } = use(params)
  const router = useRouter()

  const [form, setForm] = useState({ title: '', slug: '', excerpt: '', published: false })
  const [content, setContent] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch(`/api/admin/blog/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setForm({ title: data.title, slug: data.slug, excerpt: data.excerpt ?? '', published: data.published })
        setContent(data.content)
      })
  }, [id])

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)

    try {
      await fetch(`/api/admin/blog/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, content }),
      })

      toast.success('Article updated')
      router.push('/admin/blog')
    } catch {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Edit Article</h1>

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
          <Label htmlFor="excerpt">Excerpt</Label>
          <Input id="excerpt" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
        </div>

        <div className="space-y-2">
          <Label>Content</Label>
          <TipTapEditor content={content} onChange={setContent} />
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
          Published
        </label>

        <div className="flex gap-3">
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </Button>
          <Button variant="outline" type="button" onClick={() => router.push('/admin/blog')}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
