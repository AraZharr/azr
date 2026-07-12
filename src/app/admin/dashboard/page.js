import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Newspaper } from 'lucide-react'

export const dynamic = 'force-dynamic'

async function getStats() {
  try {
    const [pageCount, articleCount] = await Promise.all([
      prisma.page.count(),
      prisma.blogArticle.count(),
    ])
    return { pageCount, articleCount, error: null }
  } catch {
    return { pageCount: 0, articleCount: 0, error: 'Database not configured' }
  }
}

export default async function DashboardPage() {
  const { pageCount, articleCount, error } = await getStats()

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {error && (
        <p className="text-sm text-amber-700 bg-amber-50 px-4 py-2 rounded mb-6">
          ⚠️ {error}. Set DATABASE_URL di .env.local untuk mengaktifkan fitur database.
        </p>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center gap-3">
            <FileText className="text-gray-500" size={24} />
            <CardTitle className="text-sm font-medium">Total Pages</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{pageCount}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-3">
            <Newspaper className="text-gray-500" size={24} />
            <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{articleCount}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
