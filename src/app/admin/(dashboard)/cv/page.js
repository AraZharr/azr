'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'

export default function AdminCVPage() {
  const router = useRouter()
  const [list, setList] = useState([])

  useEffect(() => { fetchList() }, [])

  async function fetchList() {
    try {
      const res = await fetch('/api/admin/cv')
      setList(await res.json())
    } catch {}
  }

  async function handleDelete(id) {
    if (!confirm('Hapus CV ini?')) return
    await fetch(`/api/admin/cv/${id}`, { method: 'DELETE' })
    toast.success('CV deleted')
    fetchList()
  }

  async function togglePublish(id, current) {
    await fetch(`/api/admin/cv/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ published: !current }),
    })
    toast.success(!current ? 'Published' : 'Unpublished')
    fetchList()
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl font-bold">Curriculum Vitae</h1>
        <Button onClick={() => router.push('/admin/cv/create')}>
          <Plus size={16} className="mr-1" /> Add CV
        </Button>
      </div>

      {/* Mobile: cards */}
      <div className="space-y-3 sm:hidden">
        {list.map((cv) => (
          <div key={cv.id} className="border rounded-lg p-4 bg-white space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="font-medium truncate">{cv.title}</p>
                <p className="text-xs text-gray-400 truncate mt-0.5">{cv.slug}</p>
              </div>
              <span className={`shrink-0 text-xs px-2 py-0.5 rounded ${cv.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                {cv.published ? 'Published' : 'Draft'}
              </span>
            </div>
            <div className="flex gap-2 pt-1">
              <Button variant="outline" size="sm" onClick={() => togglePublish(cv.id, cv.published)}>
                {cv.published ? <EyeOff size={14} /> : <Eye size={14} />}
              </Button>
              <Button variant="outline" size="sm" onClick={() => router.push(`/admin/cv/${cv.id}`)}>
                <Pencil size={14} className="mr-1" /> Edit
              </Button>
              <Button variant="outline" size="sm" className="text-red-500 border-red-200" onClick={() => handleDelete(cv.id)}>
                <Trash2 size={14} className="mr-1" /> Delete
              </Button>
            </div>
          </div>
        ))}
        {list.length === 0 && (
          <p className="text-gray-500 text-center py-8">Belum ada CV.</p>
        )}
      </div>

      {/* Desktop: table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="py-3 pr-4 font-medium">Title</th>
              <th className="py-3 pr-4 font-medium">Slug</th>
              <th className="py-3 pr-4 font-medium">Status</th>
              <th className="py-3 w-40">Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.map((cv) => (
              <tr key={cv.id} className="border-b">
                <td className="py-3 pr-4 font-medium">{cv.title}</td>
                <td className="py-3 pr-4 text-gray-500">{cv.slug}</td>
                <td className="py-3 pr-4">
                  <span className={`text-xs px-2 py-0.5 rounded ${cv.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {cv.published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="py-3">
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => togglePublish(cv.id, cv.published)}>
                      {cv.published ? <EyeOff size={16} /> : <Eye size={16} />}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => router.push(`/admin/cv/${cv.id}`)}>
                      <Pencil size={16} />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(cv.id)}>
                      <Trash2 size={16} className="text-red-500" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center text-gray-500 py-8">Belum ada CV.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
