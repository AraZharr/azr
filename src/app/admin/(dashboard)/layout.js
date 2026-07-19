import { getSession } from '@/lib/auth-cf'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/admin/Sidebar'

export const dynamic = 'force-dynamic'

export default async function AdminLayout({ children }) {
  const session = await getSession()

  if (!session) {
    redirect('/admin/login')
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-4 lg:p-8 pt-14 lg:pt-8 w-full max-w-full overflow-x-hidden">
        <div className="max-w-6xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  )
}
