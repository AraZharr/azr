'use client'

export default function Hero() {
  return (
    <section className="min-h-[80vh] flex flex-col justify-center items-center text-center px-4 animate-fade-in-up">
      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 animate-fade-in-up delay-200">
        AraZhar
      </h1>
      <p className="text-xl text-gray-600 mb-8 max-w-md animate-fade-in-up delay-400">
        Developer & kreator. Membangun solusi digital yang berdampak.
      </p>
      <a
        href="#projects"
        className="inline-block bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition animate-fade-in-up delay-600"
      >
        Lihat Project
      </a>
    </section>
  )
}