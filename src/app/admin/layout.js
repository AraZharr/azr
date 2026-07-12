import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/admin/Sidebar'

export const dynamic = 'force-dynamic'

export default async function AdminLayout({ children }) {
  const session = await auth()

  if (!session) {
    redirect('/admin/login')
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8">{children}</main>
    </div>
  )
}
