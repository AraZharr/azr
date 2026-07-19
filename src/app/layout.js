import dynamic from 'next/dynamic'
import './globals.css'
import { Inter } from 'next/font/google'
import Navbar from '@/components/Navbar'
import { Toaster } from '@/components/ui/sonner'

const Footer = dynamic(() => import('@/components/Footer'), { ssr: true })
const ChatWidget = dynamic(() => import('@/components/ChatWidget'), { ssr: false })

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export async function generateMetadata() {
  const siteUrl = process.env.NEXT_PUBLIC_URL || 'https://azr.is-a.dev'
  let settings = {}
  try {
    const d1 = await import('@/lib/d1')
    settings = await d1.getSettings()
  } catch {
    // fallback — settings not available at build time
  }

  const siteTitle = settings.site_title || 'AraZhar'
  const tagline = settings.site_tagline || 'Developer & Creator'
  const defaultTitle = `${siteTitle} — ${tagline}`
  const desc = settings.meta_description || 'Portfolio pribadi AraZhar — Developer, kreator digital.'
  const ogImage = settings.og_image || '/api/og'
  const canonical = settings.canonical_url || siteUrl
  const keywords = settings.keywords || 'AraZhar,developer,portfolio'

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: defaultTitle,
      template: `%s — ${siteTitle}`,
    },
    description: desc,
    keywords: keywords.split(',').map((k) => k.trim()),
    authors: [{ name: siteTitle }],
    creator: siteTitle,
    openGraph: {
      type: 'website',
      locale: 'id_ID',
      url: siteUrl,
      siteName: `${siteTitle} Portfolio`,
      title: settings.og_title || defaultTitle,
      description: desc,
      images: [{ url: ogImage, width: 1200, height: 630, alt: `${siteTitle} Portfolio` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: settings.og_title || defaultTitle,
      description: desc,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: { canonical },
  }
}

export default async function RootLayout({ children }) {
  const siteUrl = process.env.NEXT_PUBLIC_URL || 'https://azr.is-a.dev'
  let settings = {}
  try {
    const d1 = await import('@/lib/d1')
    settings = await d1.getSettings()
  } catch {}

  const siteTitle = settings.site_title || 'AraZhar'
  const tagline = settings.site_tagline || 'Developer & Creator'
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: siteTitle,
    url: siteUrl,
    jobTitle: tagline,
    description: settings.meta_description || 'Portfolio pribadi AraZhar — Developer, kreator digital.',
    sameAs: ['https://github.com/AraZhar'],
  }

  return (
    <html lang="id">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`text-black bg-white antialiased ${inter.variable} min-h-screen flex flex-col`} style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
        {/* Font preload */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
        <ChatWidget />
        <Toaster />
      </body>
    </html>
  )
}
