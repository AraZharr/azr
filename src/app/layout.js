import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

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
      </body>
    </html>
  )
}
