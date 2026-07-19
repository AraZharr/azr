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
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl font-bold">Blog Articles</h1>
        <Button asChild>
          <Link href="/admin/blog/create">
            <Plus size={16} className="mr-1" /> New Article
          </Link>
        </Button>
      </div>

      {/* Mobile: card list */}
      <div className="space-y-3 sm:hidden">
        {articles.map((article) => (
          <div key={article.id} className="border rounded-lg p-4 bg-white space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="font-medium truncate">{article.title}</p>
                <p className="text-xs text-gray-400 truncate mt-0.5">{article.slug}</p>
              </div>
              <span className={`shrink-0 text-xs px-2 py-0.5 rounded ${article.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                {article.published ? 'Published' : 'Draft'}
              </span>
            </div>
            <div className="flex gap-2 pt-1">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/admin/blog/${article.id}`}>
                  <Pencil size={14} className="mr-1" /> Edit
                </Link>
              </Button>
              <Button variant="outline" size="sm" className="text-red-500 border-red-200" onClick={() => handleDelete(article.id)}>
                <Trash2 size={14} className="mr-1" /> Delete
              </Button>
            </div>
          </div>
        ))}
        {articles.length === 0 && (
          <p className="text-gray-500 text-center py-8">Belum ada artikel.</p>
        )}
      </div>

      {/* Desktop: table */}
      <div className="hidden sm:block overflow-x-auto">
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
                <TableCell className="text-gray-500 max-w-[200px] truncate">{article.slug}</TableCell>
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
            {articles.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-gray-500 py-8">Belum ada artikel.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
