import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Plus, Pencil } from 'lucide-react'

export const dynamic = 'force-dynamic'

async function getPages() {
  try {
    return await prisma.page.findMany({ orderBy: { updatedAt: 'desc' } })
  } catch {
    return []
  }
}

export default async function AdminPagesPage() {
  const pages = await getPages()

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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-20">Edit</TableHead>
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
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/admin/pages/${page.id}`}>
                      <Pencil size={16} />
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
