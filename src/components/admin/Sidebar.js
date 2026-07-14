'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import {
  LayoutDashboard,
  FileText,
  Newspaper,
  Share2,
  BarChart3,
  FolderKanban,
  User,
  Image,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react'

const links = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/pages', label: 'Pages', icon: FileText },
  { href: '/admin/blog', label: 'Blog', icon: Newspaper },
  { href: '/admin/skills', label: 'Skills', icon: BarChart3 },
  { href: '/admin/projects', label: 'Projects', icon: FolderKanban },
  { href: '/admin/cv', label: 'CV', icon: User },
  { href: '/admin/social', label: 'Social Links', icon: Share2 },
  { href: '/admin/media', label: 'Media', icon: Image },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  return (
    <>
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-14 bg-white border-b flex items-center justify-between px-4">
        <h1 className="text-lg font-bold">Admin Panel</h1>
        <button onClick={() => setOpen(!open)} className="p-2 text-gray-600">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile overlay */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/20"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 lg:top-0 z-40 lg:z-auto w-64 h-screen border-r bg-white p-4 flex flex-col transition-transform duration-200 ${
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <h1 className="text-lg font-bold mb-6 px-2 hidden lg:block">Admin Panel</h1>
        <nav className="flex-1 space-y-1 mt-14 lg:mt-0">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm ${
                pathname.startsWith(href)
                  ? 'bg-black text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </nav>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
        >
          <LogOut size={18} />
          Logout
        </button>
      </aside>
    </>
  )
}
