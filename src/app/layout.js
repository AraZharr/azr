import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Toaster } from '@/components/ui/sonner'

export const metadata = {
  title: 'AraZharr — Portfolio',
  description: 'Portfolio pribadi AraZharr',
}

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="text-black bg-white antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
        <Toaster />
      </body>
    </html>
  )
}
