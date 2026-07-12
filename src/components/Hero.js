export default function Hero() {
  return (
    <section className="min-h-[80vh] flex flex-col justify-center items-center text-center px-4">
      <h1 className="text-5xl sm:text-6xl font-bold mb-4">AraZharr</h1>
      <p className="text-xl text-gray-600 mb-8 max-w-md">
        Developer &amp; kreator. Membangun solusi digital yang berdampak.
      </p>
      <a
        href="#projects"
        className="inline-block bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition"
      >
        Lihat Project
      </a>
    </section>
  )
}
