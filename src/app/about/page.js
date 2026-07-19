import About from '@/components/About'

export const metadata = {
  title: 'About',
  description:
    'Tentang AraZhar — Developer & creator digital. Pengalaman, latar belakang, dan visi dalam membangun solusi teknologi.',
  openGraph: { title: 'About — AraZhar', description: 'Tentang AraZhar — Developer & creator digital.' },
}

export default function AboutPage() {
  return <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20"><About /></div>
}
