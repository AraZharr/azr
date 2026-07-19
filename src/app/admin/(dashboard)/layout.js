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
    <div className="flex min-h-screen w-full max-w-[100vw] overflow-x-hidden">
      <Sidebar />
      <main className="flex-1 min-w-0 w-full max-w-full overflow-x-hidden p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8">
        <div className="w-full max-w-5xl mx-auto min-w-0">
          {children}
        </div>
      </main>
    </div>
  )
}
