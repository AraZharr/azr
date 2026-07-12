'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Newspaper, Share2, BarChart3, FolderKanban } from 'lucide-react'

export default function DashboardPage() {
  const [stats, setStats] = useState({ pageCount: 0, articleCount: 0, socialCount: 0, skillCount: 0, projectCount: 0 })
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('/api/admin/dashboard/stats')
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error)
        else setStats(data)
      })
      .catch(() => setError('Database not configured'))
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {error && (
        <p className="text-sm text-amber-700 bg-amber-50 px-4 py-2 rounded mb-6">
          ⚠️ {error}. Configure D1 database untuk mengaktifkan fitur database.
        </p>
      )}

      <div className="grid sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center gap-3">
            <FileText className="text-gray-500" size={24} />
            <CardTitle className="text-sm font-medium">Pages</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.pageCount}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-3">
            <Newspaper className="text-gray-500" size={24} />
            <CardTitle className="text-sm font-medium">Articles</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.articleCount}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-3">
            <BarChart3 className="text-gray-500" size={24} />
            <CardTitle className="text-sm font-medium">Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.skillCount}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-3">
            <FolderKanban className="text-gray-500" size={24} />
            <CardTitle className="text-sm font-medium">Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.projectCount}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-3">
            <Share2 className="text-gray-500" size={24} />
            <CardTitle className="text-sm font-medium">Social Links</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.socialCount}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
