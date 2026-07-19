import dynamic from 'next/dynamic'
import Hero from '@/components/Hero'

const Projects = dynamic(() => import('@/components/Projects'), {
  loading: () => <div className="h-40" />,
})
const CVSection = dynamic(() => import('@/components/CVSection'), {
  loading: () => <div className="h-40" />,
})
const Contact = dynamic(() => import('@/components/Contact'), {
  loading: () => <div className="h-20" />,
})

export default function Home() {
  return (
    <div className="w-full min-w-0 overflow-x-hidden">
      <Hero />
      <Projects />
      <CVSection />
      <Contact />
    </div>
  )
}