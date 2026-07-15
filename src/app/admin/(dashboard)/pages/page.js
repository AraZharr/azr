'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
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

export default function AdminPagesPage() {
  const [pages, setPages] = useState([])

  useEffect(() => {
    fetch('/api/admin/pages')
      .then((r) => r.json())
      .then(setPages)
      .catch(() => setPages([]))
  }, [])

  async function handleDelete(id) {
    if (!confirm('Hapus page ini?')) return
    await fetch(`/api/admin/pages/${id}`, { method: 'DELETE' })
    setPages(pages.filter((p) => p.id !== id))
    toast.success('Page deleted')
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Pages</h1>
        <Button asChild>
          <Link href="/admin/pages/new">
            <Plus size={16} className="mr-1" /> New Page
          </Link>
        </Button>
      </div>

      {pages.length === 0 ? (
        <p className="text-gray-500">Belum ada page. Klik &quot;New Page&quot; untuk membuat.</p>
      ) : (
        <>
          {/* Mobile: card list */}
          <div className="space-y-3 sm:hidden">
            {pages.map((page) => (
              <div key={page.id} className="border rounded-lg p-4 bg-white space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{page.title}</p>
                    <p className="text-xs text-gray-400 truncate mt-0.5">/{page.slug}</p>
                  </div>
                  <span className={`shrink-0 text-xs px-2 py-0.5 rounded ${page.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {page.published ? 'Published' : 'Draft'}
                  </span>
                </div>
                <div className="flex gap-2 pt-1">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/pages/${page.id}`}>
                      <Pencil size={14} className="mr-1" /> Edit
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-500 border-red-200" onClick={() => handleDelete(page.id)}>
                    <Trash2 size={14} className="mr-1" /> Delete
                  </Button>
                </div>
              </div>
            ))}
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
                {pages.map((page) => (
                  <TableRow key={page.id}>
                    <TableCell className="font-medium">{page.title}</TableCell>
                    <TableCell className="text-gray-500">/{page.slug}</TableCell>
                    <TableCell>
                      <span className={`text-xs px-2 py-0.5 rounded ${page.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {page.published ? 'Published' : 'Draft'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/admin/pages/${page.id}`}>
                            <Pencil size={16} />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(page.id)}>
                          <Trash2 size={16} className="text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </div>
  )
}
