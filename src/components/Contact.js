import SocialLinks from '@/components/SocialLinks'

export default function Contact() {
  return (
    <section className="max-w-2xl mx-auto px-4 py-20 text-center">
      <h2 className="text-3xl font-bold mb-4">Kontak</h2>
      <p className="text-gray-600 mb-8">
        Ingin kerja sama atau sekadar ngobrol? Hubungi saya di bawah ini.
      </p>
      <SocialLinks className="justify-center" />
    </section>
  )
}
