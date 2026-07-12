'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

export default function AdminBlogPage() {
  const router = useRouter()
  const [articles, setArticles] = useState([])

  useEffect(() => {
    fetch('/api/admin/blog')
      .then((r) => r.json())
      .then(setArticles)
  }, [])

  async function handleDelete(id) {
    if (!confirm('Hapus artikel ini?')) return

    await fetch(`/api/admin/blog/${id}`, { method: 'DELETE' })
    setArticles(articles.filter((a) => a.id !== id))
    toast.success('Article deleted')
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Blog Articles</h1>
        <Button asChild>
          <Link href="/admin/blog/create">
            <Plus size={16} className="mr-1" /> New Article
          </Link>
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-32">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {articles.map((article) => (
            <TableRow key={article.id}>
              <TableCell className="font-medium">{article.title}</TableCell>
              <TableCell className="text-gray-500">/blog/{article.slug}</TableCell>
              <TableCell>
                <span className={`text-xs px-2 py-0.5 rounded ${article.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {article.published ? 'Published' : 'Draft'}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/admin/blog/${article.id}`}>
                      <Pencil size={16} />
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(article.id)}>
                    <Trash2 size={16} className="text-red-500" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
