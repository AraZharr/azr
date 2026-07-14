import './globals.css'
import { Inter } from 'next/font/google'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ChatWidget from '@/components/ChatWidget'
import { Toaster } from '@/components/ui/sonner'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

const siteUrl = process.env.NEXT_PUBLIC_URL || 'https://arazhar.dev'

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'AraZhar — Developer & Creator',
    template: '%s — AraZhar',
  },
  description:
    'Portfolio pribadi AraZhar — Developer, kreator digital. Membangun solusi web, bot, dan automation yang berdampak.',
  keywords: [
    'AraZhar',
    'developer',
    'portfolio',
    'web developer',
    'fullstack',
    'Next.js',
    'Telegram bot',
    'automation',
    'Indonesia',
  ],
  authors: [{ name: 'AraZhar' }],
  creator: 'AraZhar',
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: siteUrl,
    siteName: 'AraZhar Portfolio',
    title: 'AraZhar — Developer & Creator',
    description:
      'Portfolio pribadi AraZhar — Developer, kreator digital. Membangun solusi web, bot, dan automation yang berdampak.',
    images: [
      {
        url: '/api/og',
        width: 1200,
        height: 630,
        alt: 'AraZhar Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AraZhar — Developer & Creator',
    description:
      'Portfolio pribadi AraZhar — Developer, kreator digital.',
    images: ['/api/og'],
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
  alternates: {
    canonical: siteUrl,
  },
}

export default function RootLayout({ children }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'AraZhar',
    url: siteUrl,
    jobTitle: 'Developer & Creator',
    description:
      'Portfolio pribadi AraZhar — Developer, kreator digital. Membangun solusi web, bot, dan automation.',
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
      <body className={`text-black bg-white antialiased ${inter.variable}`} style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <ChatWidget />
        <Toaster />
      </body>
    </html>
  )
}
