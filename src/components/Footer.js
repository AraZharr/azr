import SocialLinks from '@/components/SocialLinks'

export default function Footer() {
  return (
    <footer className="border-t py-6">
      <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-500">
          &copy; {new Date().getFullYear()} AraZhar. All rights reserved.
        </p>
        <SocialLinks />
      </div>
    </footer>
  )
}
