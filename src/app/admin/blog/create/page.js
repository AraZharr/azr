'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import TipTapEditor from '@/components/admin/TipTapEditor'
import { toast } from 'sonner'

export default function CreateArticle() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState(null)
  const [published, setPublished] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!content) return toast.error('Content cannot be empty')

    setLoading(true)

    try {
      await fetch('/api/admin/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, slug, excerpt, content, published }),
      })

      toast.success('Article created')
      router.push('/admin/blog')
    } catch {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">New Article</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug" value={slug} onChange={(e) => setSlug(e.target.value)} required />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="excerpt">Excerpt</Label>
          <Input id="excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label>Content</Label>
          <TipTapEditor content={content} onChange={setContent} />
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
          Published
        </label>

        <div className="flex gap-3">
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Create'}
          </Button>
          <Button variant="outline" type="button" onClick={() => router.push('/admin/blog')}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
