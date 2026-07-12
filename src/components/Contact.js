export default function Contact() {
  return (
    <section className="max-w-2xl mx-auto px-4 py-20 text-center">
      <h2 className="text-3xl font-bold mb-4">Kontak</h2>
      <p className="text-gray-600 mb-8">
        Ingin kerja sama atau sekadar ngobrol? Hubungi saya di bawah ini.
      </p>
      <div className="flex justify-center gap-4">
        <a
          href="https://github.com/AraZharr"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block border border-black px-6 py-3 rounded-full hover:bg-black hover:text-white transition"
        >
          GitHub
        </a>
        <a
          href="mailto:hello@arazharr.dev"
          className="inline-block bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition"
        >
          Email
        </a>
      </div>
    </section>
  )
}
